import {lazy, Suspense} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";

import AuthLayout from "@/layout/AuthLayout";
import MainLayout from "@/layout/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";

const HomePage = lazy(() => import("@/pages/HomePage"));
const ArticlePage = lazy(() => import("@/pages/ArticlePage"));
const AuthPage = lazy(() => import("@/pages/AuthPage"));
const CategoryPage = lazy(() => import("@/pages/CategoryPage"));
const SearchPage = lazy(() => import("@/pages/SearchPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage"));
const SubscriptionPage = lazy(() => import("@/pages/SubscriptionPage"));

const Router = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    {/* Public Routes - Ngăn user đã đăng nhập truy cập */}
                    <Route element={<PublicRoute restricted={true}/>}>
                        <Route element={<AuthLayout/>}>
                            <Route path="/login" element={<AuthPage/>}/>
                            <Route path="/register" element={<AuthPage/>}/>
                            <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
                            <Route path="/reset-password" element={<ResetPasswordPage/>}/>
                        </Route>
                    </Route>

                    <Route element={<PublicRoute restricted={false}/>}>
                        <Route element={<AuthLayout/>}>
                            <Route path="/dang-ky-goi-vip" element={<SubscriptionPage/>}/>
                        </Route>
                    </Route>
                    
                    {/* Public Routes - Các đường dẫn công khai */}
                    <Route path="/" element={<MainLayout/>}>
                        {/* Trang chủ */}
                        <Route index element={<HomePage/>}/>

                        {/* Trang báo */}
                        <Route path="article/:id" element={<ArticlePage/>}/>

                        {/* Tìm kiếm */}
                        <Route path="search" element={<SearchPage/>}/>

                        {/* Trang danh mục
                          - /quoc-te
                          - /quoc-te/nguoi-viet-do-day */}
                        <Route path=":category" element={<CategoryPage/>}/>
                        <Route path=":category/:subCategory" element={<CategoryPage/>}/>
                    </Route>

                    {/* Protected Routes - Ngăn người dùng chưa đăng nhập truy cập */}
                    <Route element={<ProtectedRoute/>}>
                        <Route element={<MainLayout/>}>
                            <Route path="/thong-tin-ca-nhan/:section?" element={<ProfilePage/>}/>
                            <Route path="/dang-ky-goi-vip" element={<SubscriptionPage/>}/>
                        </Route>
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default Router;
