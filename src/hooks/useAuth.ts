import {useAppSelector} from '@/store/hooks';
import {getCurrentUser} from '@/store/user/user.selectors';

/**
 * Hook kiểm tra tình trạng xác thực hiện tại
 * @return user: người dùng hiện tại và isAuthenticated: đã xác thực hay chưa ?
 */
export const useAuth = () => {
    const currentUser = useAppSelector(getCurrentUser);

    return {
        user: currentUser,
        isAuthenticated: !!currentUser
    };
};
