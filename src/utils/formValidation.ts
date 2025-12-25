import type {RegisterOptions} from 'react-hook-form';
import type {LoginFormData, RegisterFormData} from '@/types/user/user.types';

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
export const fullNameRegex = /^[\p{L}][\p{L}\s'.-]{1,}$/u;

export const loginEmailRules: RegisterOptions<LoginFormData, 'email'> = {
    required: 'Email is required.',
    pattern: {
        value: emailRegex,
        message: 'Please enter a valid email.',
    },
};

export const loginPasswordRules: RegisterOptions<LoginFormData, 'password'> = {
    required: 'Password is required.',
};

export const registerFullNameRules: RegisterOptions<RegisterFormData, 'fullName'> = {
    required: 'Full name is required.',
    pattern: {
        value: fullNameRegex,
        message: 'Please enter a valid full name.',
    },
};

export const registerEmailRules: RegisterOptions<RegisterFormData, 'email'> = {
    required: 'Email is required.',
    pattern: {
        value: emailRegex,
        message: 'Please enter a valid email.',
    },
};

export const registerPasswordRules: RegisterOptions<RegisterFormData, 'password'> = {
    required: 'Password is required.',
    pattern: {
        value: passwordRegex,
        message: 'Password must be at least 6 characters and include a number.',
    },
};

