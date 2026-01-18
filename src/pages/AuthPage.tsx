import {useEffect, useState} from "react";
import {type SubmitHandler, useForm} from "react-hook-form";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Button, Col, Container, Form, Nav, Row, Tab} from "react-bootstrap";
import {toast} from "react-toastify";
import {BsEye, BsEyeSlash} from "react-icons/bs";

import {useAppDispatch} from "@/store/hooks";
import {iconGoogle} from "@/assets";
import {googleLoginUser, loginUser, registerUser,} from "@/store/user/user.actions.ts";
import type {LoginFormData, RegisterFormData} from "@/types/user.types.ts";
import {
    confirmPasswordRequiredMessage,
    loginEmailRules,
    loginPasswordRules,
    registerDisplayNameRules,
    registerEmailRules,
    registerPasswordRules,
    validateConfirmPassword,
} from "@/utils/formValidation";

function AuthPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Ẩn, hiện mật khẩu
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] =
        useState(false);

    // Dựa theo route để set tab mặc định
    const isRegisterPath = location.pathname === "/register";
    const activeTab = isRegisterPath ? "register" : "login";

    // Xử lý chuyển tab
    const handleTabSelect = (k: string | null) => {
        if (k === "register") navigate("/register");
        else navigate("/login");
    };

    // Trạng thái form ban đầu, sử dụng useForm để xử lý form
    const {
        register: registerLogin,
        handleSubmit: handleLoginSubmit,
        formState: {errors: loginErrors, isSubmitting: isLoginSubmitting},
        reset: resetLogin,
        watch: watchLogin,
    } = useForm<LoginFormData>({mode: "onTouched"});

    const {
        register: registerRegister,
        handleSubmit: handleRegisterSubmit,
        formState: {errors: registerErrors, isSubmitting: isRegisterSubmitting},
        getValues: getRegisterValues,
        reset: resetRegister,
        watch: watchRegister,
    } = useForm<RegisterFormData>({mode: "onTouched"});

    // Theo dõi giá trị các trường
    const loginPasswordValue = watchLogin("password");
    const registerPasswordValue = watchRegister("password");
    const registerConfirmValue = watchRegister("confirmPassword");

    // Reset form khi thay đổi route
    useEffect(() => {
        resetLogin();
        resetRegister();
    }, [location.pathname, resetLogin, resetRegister]);

    // Đăng ký tài khoản với email và mật khẩu
    const onRegisterSubmit: SubmitHandler<RegisterFormData> = async (data) => {
        const payload = {
            email: data.email,
            password: data.password,
            displayName: data.displayName,
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
        <Container className="py-5">
            <Row className="justify-content-center gap-0">
                <Col xs={12} md={8} lg={5}>
                    {/* Tabs: login/register */}
                    <Tab.Container activeKey={activeTab} onSelect={handleTabSelect}>
                        <Nav variant="underline" className="mb-4 font-serif gap-0 border-bottom justify-content-center">
                            <Nav.Item className="w-50">
                                <Nav.Link
                                    eventKey="login"
                                    className={`fs-5 pb-2 text-center ${activeTab === 'login' ? 'fw-bold text-nld-blue' : 'fw-semibold text-muted'}`}
                                >
                                    Đăng nhập
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="w-50">
                                <Nav.Link
                                    eventKey="register"
                                    className={`fs-5 pb-2 text-center ${activeTab === 'register' ? 'fw-bold text-nld-blue' : 'fw-semibold text-muted'}`}
                                >
                                    Đăng ký tài khoản
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>

                        <Tab.Content>
                            <Tab.Pane eventKey="login">
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
                                        <div className="position-relative">
                                            <Form.Control
                                                type={showLoginPassword ? "text" : "password"}
                                                placeholder="Nhập mật khẩu"
                                                isInvalid={!!loginErrors.password}
                                                {...registerLogin("password", loginPasswordRules)}
                                                className="py-2 pe-5"
                                            />
                                            {loginPasswordValue && (
                                                <Button
                                                    variant="link"
                                                    type="button"
                                                    tabIndex={-1}
                                                    onClick={() => setShowLoginPassword((v) => !v)}
                                                    aria-label={
                                                        showLoginPassword
                                                            ? "Ẩn mật khẩu"
                                                            : "Hiển thị mật khẩu"
                                                    }
                                                    className="position-absolute end-0 top-50 translate-middle-y text-muted px-3"
                                                >
                                                    {showLoginPassword ? (
                                                        <BsEyeSlash size={18}/>
                                                    ) : (
                                                        <BsEye size={18}/>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                        {loginErrors.password?.message && (
                                            <div className="invalid-feedback d-block">
                                                {loginErrors.password.message}
                                            </div>
                                        )}
                                    </Form.Group>

                                    <div className="d-flex justify-content-end mb-4">
                                        <Link
                                            to="/forgot-password"
                                            className="small text-muted text-decoration-none"
                                        >
                                            Quên mật khẩu?
                                        </Link>
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
                            </Tab.Pane>

                            <Tab.Pane eventKey="register">
                                {/* Form register */}
                                <Form
                                    className="mt-4"
                                    onSubmit={handleRegisterSubmit(onRegisterSubmit)}
                                >
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold small">Họ và tên</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập họ và tên"
                                            isInvalid={!!registerErrors.displayName}
                                            {...registerRegister("displayName", registerDisplayNameRules)}
                                            className="py-2"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {registerErrors.displayName?.message}
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
                                        <div className="position-relative">
                                            <Form.Control
                                                type={showRegisterPassword ? "text" : "password"}
                                                placeholder="Nhập mật khẩu"
                                                isInvalid={!!registerErrors.password}
                                                {...registerRegister("password", registerPasswordRules)}
                                                className="py-2 pe-5"
                                            />
                                            {registerPasswordValue && (
                                                <Button
                                                    variant="link"
                                                    type="button"
                                                    tabIndex={-1}
                                                    onClick={() => setShowRegisterPassword((v) => !v)}
                                                    aria-label={
                                                        showRegisterPassword
                                                            ? "Ẩn mật khẩu"
                                                            : "Hiển thị mật khẩu"
                                                    }
                                                    className="position-absolute end-0 top-50 translate-middle-y text-muted px-3"
                                                >
                                                    {showRegisterPassword ? (
                                                        <BsEyeSlash size={18}/>
                                                    ) : (
                                                        <BsEye size={18}/>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                        {registerErrors.password?.message && (
                                            <div className="invalid-feedback d-block">
                                                {registerErrors.password.message}
                                            </div>
                                        )}
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-bold small">
                                            Xác nhận mật khẩu
                                        </Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type={showRegisterConfirmPassword ? "text" : "password"}
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
                                                className="py-2 pe-5"
                                            />
                                            {registerConfirmValue && (
                                                <Button
                                                    variant="link"
                                                    type="button"
                                                    tabIndex={-1}
                                                    onClick={() =>
                                                        setShowRegisterConfirmPassword((v) => !v)
                                                    }
                                                    aria-label={
                                                        showRegisterConfirmPassword
                                                            ? "Ẩn mật khẩu"
                                                            : "Hiển thị mật khẩu"
                                                    }
                                                    className="position-absolute end-0 top-50 translate-middle-y text-muted px-3"
                                                >
                                                    {showRegisterConfirmPassword ? (
                                                        <BsEyeSlash size={18}/>
                                                    ) : (
                                                        <BsEye size={18}/>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                        {registerErrors.confirmPassword?.message && (
                                            <div className="invalid-feedback d-block">
                                                {registerErrors.confirmPassword.message}
                                            </div>
                                        )}
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
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>

                    {/* Divider */}
                    <div className="position-relative mb-4 text-center">
                        <hr/>
                        <span
                            className="bg-white px-2 text-muted small position-absolute top-50 start-50 translate-middle">
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
                                style={{width: "20px", height: "20px"}}
                            />
                            <span className="small fw-bold">Google</span>
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default AuthPage;
