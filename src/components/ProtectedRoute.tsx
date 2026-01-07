import {Navigate, Outlet} from 'react-router-dom';

import {useAuth} from '@/hooks/useAuth';

interface ProtectedRouteProps {
    redirectTo?: string;
}

/**
 * Protected Route dùng cho các trang yêu cầu đăng nhập tài khoản
 *
 * @param redirectTo - Đường dẫn redirect nếu chưa đăng nhập
 */
const ProtectedRoute = ({redirectTo = '/login'}: ProtectedRouteProps) => {
    const {isAuthenticated} = useAuth();

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace/>;
    }

    return <Outlet/>;
};

export default ProtectedRoute;
