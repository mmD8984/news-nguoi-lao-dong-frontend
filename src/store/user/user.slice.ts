import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {User} from '@/types/user/user.types.ts';
import {
    googleLoginUser,
    linkGoogleAction,
    loginUser,
    logoutUser,
    registerUser,
    unlinkAccountAction,
    updateUserProfileAction,
    subscribeUser
} from "./user.actions.ts";



interface UserState {
    currentUser: User | null;
}

const initialState: UserState = {
    currentUser: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Cập nhật state login
        setUser: (state, action: PayloadAction<User>) => {
            state.currentUser = action.payload;
        },

        // Logout
        clearUser: (state) => {
            state.currentUser = null;
        },



        // Lưu / Xoá bài viết đã lưu
        toggleSavedArticle: (state, action: PayloadAction<string>) => {
            const user = state.currentUser;
            if (!user)
                return;

            const articleId = action.payload;
            const idx = user.savedArticleIds.indexOf(articleId);

            if (idx >= 0)
                user.savedArticleIds.splice(idx, 1);
            else
                user.savedArticleIds.unshift(articleId);
        },
    },
    extraReducers: (builder) => {
        // Đăng ký tài khoản với email, password
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.currentUser = action.payload;
        });

        // Đăng nhập bằng email, password
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.currentUser = action.payload;
        });

        // Đăng nhập bằng Google
        builder.addCase(googleLoginUser.fulfilled, (state, action) => {
            state.currentUser = action.payload;
        });

        // Đăng xuất
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.currentUser = null;
        });

        // Cập nhật profile
        builder.addCase(updateUserProfileAction.fulfilled, (state, action) => {
            state.currentUser = action.payload;
        });

        // Liên kết Google
        builder.addCase(linkGoogleAction.fulfilled, (state, action) => {
            state.currentUser = action.payload;
        });

        // Hủy liên kết
        builder.addCase(unlinkAccountAction.fulfilled, (state, action) => {
            state.currentUser = action.payload;
        });

        // Đăng ký VIP thành công
        builder.addCase(subscribeUser.fulfilled, (state, action) => {
            if (state.currentUser) {
                state.currentUser.isVip = action.payload.isVip;
                state.currentUser.vipExpirationDate = action.payload.vipExpirationDate;
            }
        });
    }
});

export const {setUser, clearUser, toggleSavedArticle} = userSlice.actions;
export default userSlice.reducer;
