import {lazy, Suspense} from "react";
import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import {ToastContainer} from "react-toastify";

const HomePage = lazy(() => import('../pages/HomePage'));
const ArticlePage = lazy(() => import('../pages/ArticlePage'));
const AuthPage = lazy(() => import('../pages/AuthPage'));
const CategoryPage = lazy(() => import('../pages/CategoryPage'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));

function Layout() {
    return (
        <div className="d-flex flex-column min-vh-100 bg-white text-dark position-relative">
            <ScrollToTop/>
            <Header/>
            <main className="flex-grow-1">
                <Outlet/>
            </main>
            <Footer/>

            <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
}

const Router = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    {/* Tài khoản */}
                    <Route path="/login" element={<AuthPage/>}/>
                    <Route path="/register" element={<AuthPage/>}/>

                    <Route path="/" element={<Layout/>}>
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
