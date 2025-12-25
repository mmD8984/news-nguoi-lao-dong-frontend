import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Col, Container, Form, Row, Tab, Tabs } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

import Footer from "@/components/Footer";
import { useAppDispatch } from "@/store/hooks";
import { iconGoogle, logoNldDark } from "@/assets";
import {
  googleLoginUser,
  loginUser,
  registerUser,
} from "@/store/user/user.actions.ts";
import type { LoginFormData, RegisterFormData } from "@/types/user/user.types";
import {
  confirmPasswordRequiredMessage,
  loginEmailRules,
  loginPasswordRules,
  registerEmailRules,
  registerFullNameRules,
  registerPasswordRules,
  validateConfirmPassword,
} from "@/utils/formValidation";

function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Dựa theo route để set tab mặc định
  const isRegisterPath = location.pathname === "/register";
  const [activeTab, setActiveTab] = useState(
    isRegisterPath ? "register" : "login"
  );

  // Xử lý chuyển tab
  function handleTabSelect(k: string | null) {
    setActiveTab(k || "login");
    resetLogin();
    resetRegister();
  }

  // Trạng thái form ban đầu, sử dụng useForm để xử lý form
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
    reset: resetLogin,
  } = useForm<LoginFormData>({ mode: "onTouched" });

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors, isSubmitting: isRegisterSubmitting },
    getValues: getRegisterValues,
    reset: resetRegister,
  } = useForm<RegisterFormData>({ mode: "onTouched" });

  // Đăng ký tài khoản với email và mật khẩu
  const onRegisterSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    const payload = {
      email: data.email,
      password: data.password,
      fullName: data.fullName,
    };
    try {
      await dispatch(registerUser(payload)).unwrap();
      toast.success("Đăng ký tài khoản thành công");
      setTimeout(() => navigate("/"), 1000);
    } catch (msg) {
      toast.error(String(msg));
    }
  };

  // Đăng nhập tài khoản với email và mật khẩu
  const onLoginSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      toast.success("Đăng nhập thành công");
      setTimeout(() => navigate("/"), 1000);
    } catch (msg) {
      toast.error(String(msg));
    }
  };

  // Đăng nhập với Google account
  async function handleGoogleClick() {
    try {
      await dispatch(googleLoginUser()).unwrap();
      toast.success("Đăng nhập Google thành công");
      setTimeout(() => navigate("/"), 1000);
    } catch (msg) {
      toast.error(String(msg));
    }
  }

  return (
    <div className="auth-page min-vh-100 bg-white">
      {/* Header */}
      <div className="auth-page__header bg-nld-auth py-3 shadow-sm">
        <Container className="position-relative d-flex justify-content-center align-items-center">
          <Link to="/" className="text-decoration-none auth-page__logo">
            <img src={logoNldDark} alt="Báo Người Lao Động" />
          </Link>
        </Container>
      </div>

      {/* Content */}
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={5}>
            {/* Tabs: login/register */}
            <Tabs
              activeKey={activeTab}
              onSelect={handleTabSelect}
              className="auth-page__tabs mb-4"
              justify
            >
              <Tab eventKey="login" title="Đăng nhập">
                {/* Form login */}
                <Form
                  className="mt-4"
                  onSubmit={handleLoginSubmit(onLoginSubmit)}
                >
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Nhập Email"
                      isInvalid={!!loginErrors.email}
                      {...registerLogin("email", loginEmailRules)}
                      className="py-2"
                    />
                    <Form.Control.Feedback type="invalid">
                      {loginErrors.email?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">Mật khẩu</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Nhập mật khẩu"
                      isInvalid={!!loginErrors.password}
                      {...registerLogin("password", loginPasswordRules)}
                      className="py-2"
                    />
                    <Form.Control.Feedback type="invalid">
                      {loginErrors.password?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-flex justify-content-end mb-4">
                    <a
                      href="#"
                      className="small text-muted text-decoration-none"
                    >
                      Quên mật khẩu?
                    </a>
                  </div>

                  <Button
                    type="submit"
                    className="w-100 bg-nld-auth border-0 py-2 fw-bold mb-4"
                    size="lg"
                    disabled={isLoginSubmitting}
                  >
                    Tiếp tục
                  </Button>
                </Form>
              </Tab>

              <Tab eventKey="register" title="Đăng ký tài khoản">
                {/* Form register */}
                <Form
                  className="mt-4"
                  onSubmit={handleRegisterSubmit(onRegisterSubmit)}
                >
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">Họ và tên</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nhập Họ và tên"
                      isInvalid={!!registerErrors.fullName}
                      {...registerRegister("fullName", registerFullNameRules)}
                      className="py-2"
                    />
                    <Form.Control.Feedback type="invalid">
                      {registerErrors.fullName?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Nhập Email"
                      isInvalid={!!registerErrors.email}
                      {...registerRegister("email", registerEmailRules)}
                      className="py-2"
                    />
                    <Form.Control.Feedback type="invalid">
                      {registerErrors.email?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">Mật khẩu</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Nhập mật khẩu"
                      isInvalid={!!registerErrors.password}
                      {...registerRegister("password", registerPasswordRules)}
                      className="py-2"
                    />
                    <Form.Control.Feedback type="invalid">
                      {registerErrors.password?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold small">
                      Xác nhận mật khẩu
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Nhập lại mật khẩu"
                      isInvalid={!!registerErrors.confirmPassword}
                      {...registerRegister("confirmPassword", {
                        required: confirmPasswordRequiredMessage,
                        validate: (value) =>
                          validateConfirmPassword(
                            value,
                            getRegisterValues("password")
                          ),
                      })}
                      className="py-2"
                    />
                    <Form.Control.Feedback type="invalid">
                      {registerErrors.confirmPassword?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100 bg-nld-auth border-0 py-2 fw-bold mb-4"
                    size="lg"
                    disabled={isRegisterSubmitting}
                  >
                    Đăng ký
                  </Button>
                </Form>
              </Tab>
            </Tabs>

            {/* Divider */}
            <div className="position-relative mb-4 text-center">
              <hr />
              <span
                className="bg-white px-2 text-muted small
                            position-absolute top-50 start-50 translate-middle"
              >
                Hoặc đăng nhập với
              </span>
            </div>

            <p className="small text-muted text-center mb-4">
              Khi nhấn tiếp tục, bạn đồng ý với{" "}
              <a href="#" className="text-decoration-underline">
                điều khoản sử dụng
              </a>
              .
            </p>

            {/* Social buttons */}
            <div className="d-flex gap-3">
              <Button
                variant="outline-light"
                className="w-100 border text-dark d-flex align-items-center justify-content-center gap-2 py-2"
                onClick={handleGoogleClick}
              >
                <img
                  src={iconGoogle}
                  alt="Google"
                  className="auth-page__social-icon"
                />
                <span className="small fw-bold">Google</span>
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

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

export default AuthPage;
