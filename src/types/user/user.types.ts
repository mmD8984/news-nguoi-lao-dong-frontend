export interface User {
    id: string;
    displayName: string;
    avatar: string;
    emailOrPhone: string;
    gender: 'male' | 'female' | 'other' | null;
    savedArticleIds: string[];
}

export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ResetPasswordFormData {
    email: string;
    newPassword: string;
    confirmPassword: string;
}

export interface SendResetPasswordRequest {
    email: string;
    redirectUrl?: string;
}

export interface VerifyResetPasswordCodeRequest {
    oobCode: string;
}

export interface ConfirmResetPasswordRequest {
    oobCode: string;
    newPassword: string;
}
