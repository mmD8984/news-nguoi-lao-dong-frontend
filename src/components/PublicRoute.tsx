import {Navigate, Outlet} from 'react-router-dom';

import {useAuth} from '@/hooks/useAuth';

interface PublicRouteProps {
    redirectTo?: string;
    restricted?: boolean;
}

/**
 * Public Route dùng cho các trang public (login, register, ...)
 *
 * @param redirectTo - Đường dẫn sẽ redirect tới (mặc định là '/')
 * @param restricted - Nếu true -> ngăn user đã đăng nhập truy cập
 */
function PublicRoute(
    {redirectTo = '/', restricted = false}: PublicRouteProps
) {

    const {isAuthenticated} = useAuth();

    if (isAuthenticated && restricted) {
        return <Navigate to={redirectTo} replace/>;
    }

    return <Outlet/>;
}

export default PublicRoute;

