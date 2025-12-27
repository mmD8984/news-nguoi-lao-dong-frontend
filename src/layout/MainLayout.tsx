import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Footer from "../components/Footer";
import Header from "../components/Header";
import ScrollToTop from "../components/ScrollToTop";

function MainLayout() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-white text-dark position-relative">
      <ScrollToTop />
      <Header />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />

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

export default MainLayout;
