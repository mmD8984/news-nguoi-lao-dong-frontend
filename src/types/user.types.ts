export interface User {
    id: string;
    displayName: string;
    avatar: string;
    emailOrPhone: string;
    gender: 'male' | 'female' | 'other' | null;
    savedArticleIds: string[];
    providers: { providerId: string; uid: string }[];
    isVip?: boolean;
    vipExpirationDate?: string | null;
}

export interface RegisterRequest {
    email: string;
    password: string;
    displayName: string;
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
    displayName: string;
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

export interface UpdateUserRequest {
    displayName?: string;
    gender?: 'male' | 'female' | 'other' | null;
    avatar?: string;
}

export type UpdateUserProfilePayload = Partial<Pick<User, "displayName" | "gender" | "avatar">>;

export type UserSubscriptionUpdate = {
    isVip: boolean;
    vipExpirationDate: string;
    updatedAt: number | object;
};

export interface TransactionRequest {
    date: string;
    productName: string;
    amount: number;
    paymentMethod: string;
    status: string;
    userId?: string;
    userEmail?: string;
}

export interface Transaction extends TransactionRequest {
    id: string;
    createdAt?: number | object;
}
