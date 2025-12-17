import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

export interface User {
    id: string;
    displayName: string;
    avatar: string;
    emailOrPhone: string;
    gender: 'male' | 'female' | 'other' | null;
    savedArticleIds: string[];
}

type UpdateProfilePayload = Partial<Pick<User, 'displayName' | 'avatar' | 'gender'>>;

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

        // Cập nhật profile
        updateProfile: (state, action: PayloadAction<UpdateProfilePayload>) => {
            const user = state.currentUser;
            if (!user)
                return;

            Object.assign(user, action.payload);
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
    }
});

export const {setUser, clearUser, updateProfile, toggleSavedArticle} = userSlice.actions;
export default userSlice.reducer;