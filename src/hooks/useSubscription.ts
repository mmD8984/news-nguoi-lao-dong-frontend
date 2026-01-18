
import { useAppSelector } from "@/store/hooks";
import { getCurrentUser } from "@/store/user/user.selectors";

export const useSubscription = () => {
    const user = useAppSelector(getCurrentUser);

    const isVip = !!(user?.isVip && user.vipExpirationDate && new Date(user.vipExpirationDate) > new Date());
    
    return {
        isVip,
        user
    };
};
