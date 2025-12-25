import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    type User as FirebaseUser,
} from 'firebase/auth';
import {ref, serverTimestamp, set} from 'firebase/database';

import {auth, db} from './firebase';
import type {LoginRequest, RegisterRequest, User} from '@/types/user/user.types';

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

        await set(ref(db, `users/${fbUser.uid}`), {
            uid: fbUser.uid,
            email,
            fullName: fullName.trim(),
            dateOfBirth: null,
            gender: null,
            createdAt: serverTimestamp(),
        });

        return toUser(fbUser);
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

        return toUser(fbUser);
    } catch (e) {
        throw new Error(mapFirebaseError(e));
    }
}

export async function logout(): Promise<void> {
    try {
        await signOut(auth);
    } catch (e) {
        throw new Error(mapFirebaseError(e));
    }
}

/**
 * ===== Utils ====
 */
const AUTH_ERROR_MESSAGE: Record<string, string> = {
    'auth/email-already-in-use': 'Email đã được sử dụng',
    'auth/invalid-email': 'Email không hợp lệ',
    'auth/weak-password': 'Mật khẩu quá yếu',
    'auth/user-not-found': 'Tài khoản không tồn tại',
    'auth/wrong-password': 'Sai mật khẩu',
    'auth/too-many-requests': 'Thử lại sau (quá nhiều lần)',
    'auth/invalid-credential': 'Email hoặc mật khẩu không đúng',
    'auth/popup-closed-by-user': 'Bạn đã đóng cửa sổ đăng nhập',
    'auth/cancelled-popup-request': 'Yêu cầu đăng nhập đã bị hủy',
    'auth/popup-blocked': 'Trình duyệt đang chặn cửa sổ đăng nhập',
};

function getAuthCode(e: unknown): string {
    return typeof e === 'object' && e !== null && 'code' in e
        ? String((e as { code: unknown }).code)
        : '';
}

function mapFirebaseError(e: unknown): string {
    return AUTH_ERROR_MESSAGE[getAuthCode(e)] ?? 'Có lỗi xảy ra, vui lòng thử lại';
}

function toUser(user: FirebaseUser): User {
    return {
        id: user.uid,
        displayName: user.displayName ?? '',
        avatar: user.photoURL ?? '',
        emailOrPhone: user.email ?? '',
        gender: null,
        savedArticleIds: [],
    };
}