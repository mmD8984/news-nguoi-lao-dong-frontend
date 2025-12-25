import type {RegisterOptions} from 'react-hook-form';
import type {LoginFormData, RegisterFormData} from '@/types/user/user.types';

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
export const fullNameRegex = /^[\p{L}][\p{L}\s'.-]{1,}$/u;

export const loginEmailRules: RegisterOptions<LoginFormData, 'email'> = {
    required: 'Vui lòng nhập email.',
    pattern: {
        value: emailRegex,
        message: 'Email không hợp lệ.',
    },
};

export const loginPasswordRules: RegisterOptions<LoginFormData, 'password'> = {
    required: 'Vui lòng nhập mật khẩu.',
};

export const registerFullNameRules: RegisterOptions<RegisterFormData, 'fullName'> = {
    required: 'Vui lòng nhập họ và tên.',
    pattern: {
        value: fullNameRegex,
        message: 'Họ và tên không hợp lệ.',
    },
};

export const registerEmailRules: RegisterOptions<RegisterFormData, 'email'> = {
    required: 'Vui lòng nhập email.',
    pattern: {
        value: emailRegex,
        message: 'Email không hợp lệ.',
    },
};

export const registerPasswordRules: RegisterOptions<RegisterFormData, 'password'> = {
    required: 'Vui lòng nhập mật khẩu.',
    pattern: {
        value: passwordRegex,
        message: 'Mật khẩu tối thiểu 6 ký tự và có ít nhất 1 số.',
    },
};

export const confirmPasswordRequiredMessage = 'Vui lòng nhập xác nhận mật khẩu.';

export const validateConfirmPassword = (value: string, password: string) =>
    value === password || 'Mật khẩu xác nhận không khớp.';

