import type {RootState} from "../store.ts";

export const getCurrentUser = (state: RootState) => state.user.currentUser;