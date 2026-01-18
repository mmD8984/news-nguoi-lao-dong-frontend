import {createAsyncThunk} from "@reduxjs/toolkit";
import type {
    ConfirmResetPasswordRequest,
    LoginRequest,
    RegisterRequest,
    SendResetPasswordRequest,
    TransactionRequest,
    UpdateUserRequest,
    User,
    VerifyResetPasswordCodeRequest,
} from "@/types/user.types.ts";
import {
    confirmResetPasswordApi,
    linkAccountWithGoogle,
    login,
    loginWithGoogle,
    logout,
    register,
    sendResetPassword,
    unlinkAccount,
    updateUserProfile,
    verifyResetCode,
} from "@/services/user";

export const registerUser = createAsyncThunk<
    User, RegisterRequest,
    { rejectValue: string }
>('user/register', async (payload, thunkApi) => {
    try {
        return await register(payload);
    } catch (e) {
        return thunkApi.rejectWithValue(mapError(e));
    }
});

export const loginUser = createAsyncThunk<
    User, LoginRequest,
    { rejectValue: string }
>('user/login', async (payload, thunkApi) => {
    try {
        return await login(payload);
    } catch (e) {
        return thunkApi.rejectWithValue(mapError(e));
    }
});

export const googleLoginUser = createAsyncThunk<
    User, void,
    { rejectValue: string }
>('user/google-login', async (_, thunkApi) => {
    try {
        return await loginWithGoogle();
    } catch (e) {
        return thunkApi.rejectWithValue(mapError(e));
    }
});

export const logoutUser = createAsyncThunk<
    void, void,
    { rejectValue: string }
>("user/logout", async (_, thunkApi) => {
        try {
            await logout();
        } catch (e) {
            return thunkApi.rejectWithValue(mapError(e));
        }
    }
);

export const sendResetPasswordEmail = createAsyncThunk<
    void, SendResetPasswordRequest,
    { rejectValue: string }
>("user/send-reset-password-email", async (payload, thunkApi) => {
    try {
        await sendResetPassword(payload);
    } catch (e) {
        return thunkApi.rejectWithValue(mapError(e));
    }
});

export const verifyResetPasswordCode = createAsyncThunk<
    string, VerifyResetPasswordCodeRequest,
    { rejectValue: string }
>("user/verify-reset-password-code", async (payload, thunkApi) => {
    try {
        return await verifyResetCode(payload);
    } catch (e) {
        return thunkApi.rejectWithValue(mapError(e));
    }
});

export const confirmResetPassword = createAsyncThunk<
    void, ConfirmResetPasswordRequest,
    { rejectValue: string }
>("user/confirm-reset-password", async (payload, thunkApi) => {
    try {
        await confirmResetPasswordApi(payload);
    } catch (e) {
        return thunkApi.rejectWithValue(mapError(e));
    }
});

export const updateUserProfileAction = createAsyncThunk<
    User, UpdateUserRequest,
    { rejectValue: string }
>("user/update-profile", async (payload, thunkApi) => {
    try {
        return await updateUserProfile(payload);
    } catch (e) {
        return thunkApi.rejectWithValue(mapError(e));
    }
});

export const linkGoogleAction = createAsyncThunk<
    User, void,
    { rejectValue: string }
>("user/link-google", async (_, thunkApi) => {
    try {
        return await linkAccountWithGoogle();
    } catch (e) {
        return thunkApi.rejectWithValue(mapError(e));
    }
});

export const unlinkAccountAction = createAsyncThunk<
    User, string,
    { rejectValue: string }
>("user/unlink-account", async (providerId, thunkApi) => {
    try {
        return await unlinkAccount(providerId);
    } catch (e) {
        return thunkApi.rejectWithValue(mapError(e));
    }
});

interface SubscribePayload {
    transaction: TransactionRequest;
    durationDays: number;
}

export const subscribeUser = createAsyncThunk<
    { isVip: boolean; vipExpirationDate: string },
    SubscribePayload,
    { rejectValue: string }
>("user/subscribe", async ({transaction, durationDays}, thunkApi) => {
    try {
        const {createTransaction, updateUserSubscription} = await import("@/services/user/auth.api");

        // 1. Create transaction
        await createTransaction(transaction);

        // 2. Update user subscription
        if (transaction.userId) {
            await updateUserSubscription(transaction.userId, durationDays);
        }

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + durationDays);

        return {
            isVip: true,
            vipExpirationDate: expirationDate.toISOString()
        };

    } catch (e) {
        return thunkApi.rejectWithValue(mapError(e));
    }
});

function mapError(e: unknown): string {
    if (e instanceof Error && e.message.trim()) return e.message.trim();
    if (typeof e === 'string' && e.trim()) return e.trim();
    return 'Có lỗi xảy ra, vui lòng thử lại';
}
