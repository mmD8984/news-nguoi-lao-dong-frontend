import {createAsyncThunk} from "@reduxjs/toolkit";
import type {LoginRequest, RegisterRequest, User} from "@/types/user/user.types.ts";
import {login, loginWithGoogle, logout, register} from "@/services/user";

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
    void,
    void,
    { rejectValue: string }
>('user/logout', async (_, thunkApi) => {
    try {
        await logout();
    } catch (e) {
        return thunkApi.rejectWithValue(mapError(e));
    }
});

function mapError(e: unknown): string {
    if (e instanceof Error && e.message.trim()) return e.message.trim();
    if (typeof e === 'string' && e.trim()) return e.trim();
    return 'Có lỗi xảy ra, vui lòng thử lại';
}
