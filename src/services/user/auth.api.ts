import {
    type ActionCodeSettings,
    confirmPasswordReset,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
    type User as FirebaseUser,
    verifyPasswordResetCode,
} from "firebase/auth";
import {get, ref, serverTimestamp, set} from "firebase/database";

import {auth, db} from "../firebase.ts";
import type {
    ConfirmResetPasswordRequest,
    LoginRequest,
    RegisterRequest,
    SendResetPasswordRequest,
    User,
    VerifyResetPasswordCodeRequest,
} from "@/types/user/user.types";

/**
 * Đăng ký tài khoản với email và password
 *
 * @param email
 * @param password
 * @param fullName
 */
export async function register(
    {email, password, fullName}: RegisterRequest
): Promise<User> {
    try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const fbUser = credential.user;

        // Cập nhật displayName
        await updateProfile(fbUser, {displayName: fullName.trim()});

        await set(ref(db, `users/${fbUser.uid}`), {
            uid: fbUser.uid,
            email,
            fullName: fullName.trim(),
            createdAt: serverTimestamp(),
        });

        return toUser(fbUser, fullName.trim());
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
        const fbUser = credential.user;

        return toUser(fbUser);
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

    try {
        const credential = await signInWithPopup(auth, provider);
        const fbUser = credential.user;

        // Tạo bản ghi nếu chưa có trong Realtime Database
        const userRef = ref(db, `users/${fbUser.uid}`);
        const snapshot = await get(userRef);
        if (!snapshot.exists()) {
            await set(userRef, {
                uid: fbUser.uid,
                email: fbUser.email ?? "",
                fullName: fbUser.displayName ?? "",
                avatar: fbUser.photoURL ?? "",
                createdAt: serverTimestamp(),
            });
        }

        return toUser(fbUser);
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
    };
}