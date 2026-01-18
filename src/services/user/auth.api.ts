import {
    type ActionCodeSettings,
    confirmPasswordReset,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    linkWithPopup,
    unlink,
    signOut,
    updateProfile,
    type User as FirebaseUser,
    verifyPasswordResetCode,
} from "firebase/auth";
import {get, ref, serverTimestamp, set, update, push} from "firebase/database";

import {auth, db} from "../firebase.ts";
import type {
    ConfirmResetPasswordRequest,
    LoginRequest,
    RegisterRequest,
    SendResetPasswordRequest,
    UpdateUserRequest,
    User,
    VerifyResetPasswordCodeRequest,
    TransactionRequest,
} from "@/types/user/user.types";

/**
 * Đăng ký tài khoản với email và password
 *
 * @param email
 * @param password
 * @param fullName
 */
export async function register(
    {email, password, displayName}: RegisterRequest
): Promise<User> {
    try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const fbUser = credential.user;

        await updateProfile(fbUser, {displayName: displayName.trim()});

        await set(ref(db, `users/${fbUser.uid}`), {
            uid: fbUser.uid,
            email,
            displayName: displayName.trim(),
            createdAt: serverTimestamp(),
        });

        return await fetchUserProfile(fbUser);
    } catch (e) {
        throw new Error(mapFirebaseError(e));
    }
}

/**
 * Đăng nhập bằng email và password
 *
 * @param email
 * @param password
 */
export async function login(
    {email, password}: LoginRequest
): Promise<User> {
    try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        return await fetchUserProfile(credential.user);
    } catch (e) {
        throw new Error(mapFirebaseError(e));
    }
}

/**
 * Đăng nhập tài khoản bằng google account
 * - Tạo mới nếu chưa có (không tự động liên kết với tài khoản email hiện có)
 */
export async function loginWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');

    try {
        const credential = await signInWithPopup(auth, provider);
        const fbUser = credential.user;
        const email = fbUser.email || fbUser.providerData.find(p => p.email)?.email || "";

        // Tạo bản ghi nếu chưa có trong Realtime Database
        const userRef = ref(db, `users/${fbUser.uid}`);
        const snapshot = await get(userRef);
        if (!snapshot.exists()) {
            await set(userRef, {
                uid: fbUser.uid,
                email: email,
                displayName: fbUser.displayName ?? "",
                avatar: fbUser.photoURL ?? "",
                createdAt: serverTimestamp(),
            });
        }

        return await fetchUserProfile(fbUser);
    } catch (e) {
        throw new Error(mapFirebaseError(e));
    }
}

/**
 * Liên kết tài khoản hiện tại với Google
 */
export async function linkAccountWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const currentUser = auth.currentUser;

    if (!currentUser) {
        throw new Error("Người dùng chưa đăng nhập");
    }

    try {
        const credential = await linkWithPopup(currentUser, provider);
        return await fetchUserProfile(credential.user);
    } catch (e) {
        throw new Error(mapFirebaseError(e));
    }
}



/**
 * Hủy liên kết tài khoản
 * @param providerId "google.com" | "facebook.com"
 */
export async function unlinkAccount(providerId: string): Promise<User> {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        throw new Error("Người dùng chưa đăng nhập");
    }

    try {
        await unlink(currentUser, providerId);
        return await fetchUserProfile(currentUser);
    } catch (e) {
        throw new Error(mapFirebaseError(e));
    }
}

/**
 * Đăng xuất tài khoản (clear firebase session)
 */
export async function logout(): Promise<void> {
    try {
        await signOut(auth);
    } catch (e) {
        throw new Error(mapFirebaseError(e));
    }
}

/**
 * Gửi email đặt lại mật khẩu
 */
export async function sendResetPassword(
    {email, redirectUrl,}: SendResetPasswordRequest
): Promise<void> {
    const actionCodeSettings: ActionCodeSettings = {
        url: redirectUrl ?? `${window.location.origin}/reset-password`,
        handleCodeInApp: true,
    };

    try {
        await sendPasswordResetEmail(auth, email, actionCodeSettings);
    } catch (e) {
        throw new Error(mapFirebaseError(e));
    }
}

/**
 * Kiểm tra oobCode và lấy email từ Firebase
 */
export async function verifyResetCode(
    {oobCode}: VerifyResetPasswordCodeRequest
): Promise<string> {
    try {
        return await verifyPasswordResetCode(auth, oobCode);
    } catch (e) {
        throw new Error(mapFirebaseError(e));
    }
}

/**
 * Cập nhật mật khẩu mới bằng oobCode
 */
export async function confirmResetPasswordApi(
    {oobCode, newPassword}: ConfirmResetPasswordRequest
): Promise<void> {
    try {
        await confirmPasswordReset(auth, oobCode, newPassword);
    } catch (e) {
        throw new Error(mapFirebaseError(e));
    }
}

/**
 * Cập nhật thông tin profile (displayName, gender, avatar)
 */
export async function updateUserProfile(data: UpdateUserRequest): Promise<User> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        throw new Error("Người dùng chưa đăng nhập");
    }

    try {
        const updates: Record<string, any> = {};

        if (data.displayName !== undefined) updates['displayName'] = data.displayName;
        if (data.gender !== undefined) updates['gender'] = data.gender;
        if (data.avatar !== undefined) updates['avatar'] = data.avatar;

        if (Object.keys(updates).length > 0) {
            await update(ref(db, `users/${currentUser.uid}`), updates);
        }

        return await fetchUserProfile(currentUser);
    } catch (e) {
        throw new Error(mapFirebaseError(e));
    }
}


/**
 * Tạo giao dịch mới
 */
export async function createTransaction(data: TransactionRequest): Promise<void> {
    try {
        const transactionsRef = ref(db, 'transactions');
        await push(transactionsRef, {
            ...data,
            createdAt: serverTimestamp(),
        });
    } catch (e) {
        throw new Error(mapFirebaseError(e));
    }
}

/**
 * Lấy lịch sử giao dịch của user
 */
export async function getUserTransactions(userId: string): Promise<any[]> {
    try {
        const transactionsRef = ref(db, 'transactions');
        
        try {
            // Thử dùng query trước
            const { query, orderByChild, equalTo, get } = await import("firebase/database");
             const q = query(transactionsRef, orderByChild('userId'), equalTo(userId));
             const snapshot = await get(q);
             
             if (snapshot.exists()) {
                 const data = snapshot.val();
                 return Object.keys(data).map(key => ({
                     id: key,
                     ...data[key]
                 }));
             }
             return [];

        } catch (queryError) {
             // Fallback nếu lỗi index
             console.warn("Query failed, fallback to fetch all and filter", queryError);
             const snapshot = await get(transactionsRef);
             if (snapshot.exists()) {
                 const data = snapshot.val();
                 const allTransactions = Object.keys(data).map(key => ({
                     id: key,
                     ...data[key]
                 }));
                 return allTransactions.filter((t: any) => t.userId === userId);
             }
             return [];
        }

    } catch (e) {
        throw new Error(mapFirebaseError(e));
    }
}

/**
 * Cập nhật thông tin gói VIP cho user
 */
export async function updateUserSubscription(userId: string, durationDays: number): Promise<void> {
    try {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + durationDays);

        const updates: Record<string, any> = {
            isVip: true,
            vipExpirationDate: expirationDate.toISOString(),
            updatedAt: serverTimestamp(),
        };

        await update(ref(db, `users/${userId}`), updates);
    } catch (e) {
        throw new Error(mapFirebaseError(e));
    }
}


/**
 * ===== Utils ====
 */
const AUTH_ERROR_MESSAGE: Record<string, string> = {
    "auth/email-already-in-use": "Email đã được sử dụng",
    "auth/invalid-email": "Email không hợp lệ",
    "auth/weak-password": "Mật khẩu quá yếu",
    "auth/user-not-found": "Tài khoản không tồn tại",
    "auth/wrong-password": "Sai mật khẩu",
    "auth/too-many-requests": "Thử lại sau (quá nhiều lần)",
    "auth/invalid-credential": "Email hoặc mật khẩu không đúng",
    "auth/popup-closed-by-user": "Bạn đã đóng cửa sổ đăng nhập",
    "auth/cancelled-popup-request": "Yêu cầu đăng nhập đã bị hủy",
    "auth/popup-blocked": "Trình duyệt chặn cửa sổ đăng nhập",
    "auth/credential-already-in-use": "Tài khoản Google này đã được liên kết với người dùng khác",
    "auth/expired-action-code": "Mã xác thực đã hết hạn",
    "auth/invalid-action-code": "Mã xác thực không hợp lệ",
};

function getAuthCode(e: unknown): string {
    return typeof e === 'object' && e !== null && 'code' in e
        ? String((e as { code: unknown }).code)
        : '';
}

function mapFirebaseError(e: unknown): string {
    return AUTH_ERROR_MESSAGE[getAuthCode(e)] ?? 'Có lỗi xảy ra, vui lòng thử lại';
}

function toUser(user: FirebaseUser, fallbackName?: string): User {
    return {
        id: user.uid,
        displayName: user.displayName ?? fallbackName ?? "",
        avatar: user.photoURL ?? "",
        emailOrPhone: user.email ?? "",
        gender: null,
        savedArticleIds: [],
        providers: user.providerData.map(p => ({providerId: p.providerId, uid: p.uid})),
    };
}

/**
 * Lấy thông tin user từ Realtime Database
 * Nếu không có trong DB, fallback về Auth profile
 * @param fbUser - Firebase User after success auth
 * @returns User
 */
async function fetchUserProfile(fbUser: FirebaseUser): Promise<User> {
    try {
        const snapshot = await get(ref(db, `users/${fbUser.uid}`));
        if (snapshot.exists()) {
            const data = snapshot.val();
            return {
                id: fbUser.uid,
                emailOrPhone: data.email || fbUser.email || "",
                displayName: data.displayName || fbUser.displayName || "",
                avatar: data.avatar || fbUser.photoURL || "",
                gender: data.gender || null,
                savedArticleIds: data.savedArticleIds || [],
                providers: fbUser.providerData.map(p => ({ providerId: p.providerId, uid: p.uid })),
                isVip: data.isVip || false,
                vipExpirationDate: data.vipExpirationDate || null,
            };
        }
    } catch (e) {
        console.warn("fetchUserProfile error, falling back to auth profile", e);
    }
    return toUser(fbUser);
}