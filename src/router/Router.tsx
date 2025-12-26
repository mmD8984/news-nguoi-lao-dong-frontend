import {lazy, Suspense} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";

import AuthLayout from "../layout/AuthLayout";
import MainLayout from "../layout/MainLayout";

const HomePage = lazy(() => import("../pages/HomePage"));
const ArticlePage = lazy(() => import("../pages/ArticlePage"));
const AuthPage = lazy(() => import("../pages/AuthPage"));
const CategoryPage = lazy(() => import("../pages/CategoryPage"));
const SearchPage = lazy(() => import("../pages/SearchPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const ResetPasswordPage = lazy(() => import("../pages/ResetPasswordPage"));
const ForgotPasswordPage = lazy(() => import("../pages/ForgotPasswordPage"));

const Router = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    {/* Tài khoản */}
                    <Route element={<AuthLayout/>}>
                        <Route path="/login" element={<AuthPage/>}/>
                        <Route path="/register" element={<AuthPage/>}/>
                        <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
                        <Route path="/reset-password" element={<ResetPasswordPage/>}/>
                    </Route>

                    <Route path="/" element={<MainLayout/>}>
                        {/* Trang chủ */}
                        <Route index element={<HomePage/>}/>

                        {/* Trang báo */}
                        <Route path="article/:id" element={<ArticlePage/>}/>

                        {/* Tìm kiếm */}
                        <Route path="search" element={<SearchPage/>}/>

                        {/* Trang tài khoản */}
                        <Route path="profile" element={<ProfilePage/>}/>

                        {/* Trang danh mục
                          - /quoc-te
                          - /quoc-te/nguoi-viet-do-day */}
                        <Route path=":category/:subCategory" element={<CategoryPage/>}/>
                        <Route path=":category" element={<CategoryPage/>}/>
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default Router;
