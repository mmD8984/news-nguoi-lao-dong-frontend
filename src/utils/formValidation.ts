import type {FieldPath, FieldValues, RegisterOptions} from "react-hook-form";
import type {LoginFormData, RegisterFormData, ResetPasswordFormData,} from "@/types/user.types.ts";

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
export const fullNameRegex = /^[\p{L}][\p{L}\s'.-]{1,}$/u;

const baseEmailRules: RegisterOptions<FieldValues, string> = {
    required: "Vui lòng nhập email.",
    pattern: {
        value: emailRegex,
        message: "Email không hợp lệ.",
    },
};

const baseLoginPasswordRules: RegisterOptions<FieldValues, string> = {
    required: "Vui lòng nhập mật khẩu.",
};

const baseRegisterPasswordRules: RegisterOptions<FieldValues, string> = {
    required: "Vui lòng nhập mật khẩu.",
    pattern: {
        value: passwordRegex,
        message: "Mật khẩu tối thiểu 6 ký tự và có ít nhất 1 số.",
    },
};

const baseDisplayNameRules: RegisterOptions<FieldValues, string> = {
    required: "Vui lòng nhập họ và tên.",
    pattern: {
        value: fullNameRegex,
        message: "Họ và tên không hợp lệ.",
    },
};

const makeRules = <T extends FieldValues, K extends FieldPath<T>>(
    rules: RegisterOptions<FieldValues, string>
) => rules as RegisterOptions<T, K>;

export const loginEmailRules = makeRules<LoginFormData, "email">(
    baseEmailRules
);
export const loginPasswordRules = makeRules<LoginFormData, "password">(
    baseLoginPasswordRules
);

export const registerDisplayNameRules = makeRules<RegisterFormData, "displayName">(
    baseDisplayNameRules
);
export const registerEmailRules = makeRules<RegisterFormData, "email">(
    baseEmailRules
);
export const registerPasswordRules = makeRules<RegisterFormData, "password">(
    baseRegisterPasswordRules
);

export const resetPasswordEmailRules = makeRules<
    ResetPasswordFormData,
    "email"
>(baseEmailRules);

export const resetNewPasswordRules = makeRules<
    ResetPasswordFormData,
    "newPassword"
>(baseRegisterPasswordRules);

export const confirmPasswordRequiredMessage =
    "Vui lòng nhập xác nhận mật khẩu.";

export const validateConfirmPassword = (value: string, password: string) =>
    value === password || "Mật khẩu xác nhận không khớp.";
