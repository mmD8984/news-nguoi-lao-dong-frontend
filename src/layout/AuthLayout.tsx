import { Link, Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";

import Footer from "../components/layout/Footer.tsx";
import ScrollToTop from "../components/common/ScrollToTop.tsx";
import { logoNldDark } from "../assets";

function AuthLayout() {
  return (
    <div className="auth-page min-vh-100 bg-white d-flex flex-column">
      <ScrollToTop />

      {/* Header */}
      <div className="auth-page__header bg-nld-auth py-3 shadow-sm">
        <Container className="position-relative d-flex justify-content-center align-items-center">
          <Link to="/" className="text-decoration-none auth-page__logo">
            <img src={logoNldDark} alt="Bao Nguoi Lao Dong" />
          </Link>
        </Container>
      </div>

      {/* Nội dung form */}
      <main className="flex-grow-1">
        <Container className="py-4">
          <Outlet />
        </Container>
      </main>

      {/* Footer */}
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

export default AuthLayout;
