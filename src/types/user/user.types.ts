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
