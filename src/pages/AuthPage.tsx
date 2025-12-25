import {useMemo, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {Button, Col, Container, Form, Row, Tab, Tabs} from 'react-bootstrap';
import {toast, ToastContainer} from "react-toastify";

import Footer from '@/components/Footer';
import {useAppDispatch} from '@/store/hooks';
import {iconGoogle} from '@/assets';
import {googleLoginUser, loginUser, registerUser} from "@/store/user/user.actions.ts";

function AuthPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Dựa theo route để set tab mặc định
    const isRegisterPath = location.pathname === '/register';
    const [activeTab, setActiveTab] = useState(isRegisterPath ? 'register' : 'login');

    // Trạng thái form ban đầu
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');

    // Validate tối thiểu cho đăng ký
    const canRegister = useMemo(
        function () {
            if (!fullName.trim())
                return false;

            if (!email.trim())
                return false;

            if (!password)
                return false;

            if (password !== confirmPassword)
                return false;

            return true;
        },
        [confirmPassword, email, fullName, password]
    );

    // Đăng ký
    async function handleRegister() {
        if (!canRegister) return;
        try {
            await dispatch(registerUser({email, password, fullName})).unwrap();
            toast.success("Đăng ký tài khoản thành công");
            setTimeout(() => navigate('/profile'), 1000);
        } catch (msg) {
            toast.error(String(msg));
        }
    }

    // Đăng nhập
    async function handleLogin() {
        if (!email.trim() || !password) {
            toast.error("Vui lòng nhập email và mật khẩu");
            return;
        }
        try {
            await dispatch(loginUser({email, password})).unwrap();
            toast.success("Đăng nhập thành công");
            setTimeout(() => navigate('/profile'), 1000);
        } catch (msg) {
            toast.error(String(msg));
        }
    }

    function handleTabSelect(k: string | null) {
        setActiveTab(k || 'login');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
    }

    async function handleGoogleClick() {
        try {
            await dispatch(googleLoginUser({email, password})).unwrap();
            toast.success("Đăng nhập Google thành công");
            setTimeout(() => navigate('/profile'), 1000);
        } catch (msg) {
            toast.error(String(msg));
        }
    }

    return (
        <div className="auth-page min-vh-100 bg-white">
            {/* Header Auth */}
            <div className="auth-page__header bg-nld-auth py-3 shadow-sm">
                <Container className="position-relative d-flex justify-content-center align-items-center">
                    <Link to="/" className="text-decoration-none">
                        <h1 className="auth-page__title h3 fw-bold text-white m-0 text-uppercase">NGƯỜI LAO ĐỘNG</h1>
                    </Link>
                </Container>
            </div>

            {/* Content */}
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={5}>
                        {/* Tabs: login/register */}
                        <Tabs activeKey={activeTab} onSelect={handleTabSelect} className="mb-4">
                            <Tab eventKey="login" title={<span className="fw-bold text-dark">Đăng nhập</span>}>
                                {/* Form login */}
                                <Form className="mt-4" onSubmit={(e) => e.preventDefault()}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold small">Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Nhập Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="py-2"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold small">Mật khẩu</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Nhập mật khẩu"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="py-2"
                                        />
                                    </Form.Group>

                                    <div className="d-flex justify-content-end mb-4">
                                        <a href="#" className="small text-muted text-decoration-none">
                                            Quên mật khẩu?
                                        </a>
                                    </div>

                                    <Button onClick={handleLogin}
                                            className="w-100 bg-nld-auth border-0 py-2 fw-bold mb-4" size="lg">
                                        Tiếp tục
                                    </Button>
                                </Form>
                            </Tab>

                            <Tab eventKey="register" title={<span className="fw-bold text-dark">Đăng ký</span>}>
                                {/* Form register */}
                                <Form className="mt-4" onSubmit={(e) => e.preventDefault()}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold small">Họ và tên</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập họ và tên"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="py-2"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold small">Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Nhập Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="py-2"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold small">Mật khẩu</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Nhập mật khẩu"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="py-2"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-bold small">Xác nhận mật khẩu</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Nhập lại mật khẩu"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="py-2"
                                        />
                                        {confirmPassword && password !== confirmPassword && (
                                            <div className="text-danger small mt-2">Mật khẩu xác nhận không khớp.</div>
                                        )}
                                    </Form.Group>

                                    <Button
                                        onClick={handleRegister}
                                        className="w-100 bg-nld-auth border-0 py-2 fw-bold mb-4"
                                        size="lg"
                                        disabled={!canRegister}
                                    >
                                        Đăng ký
                                    </Button>
                                </Form>
                            </Tab>
                        </Tabs>

                        {/* Divider */}
                        <div className="position-relative mb-4 text-center">
                            <hr/>
                            <span className="bg-white px-2 text-muted small
                            position-absolute top-50 start-50 translate-middle">
                                Hoặc đăng nhập với
                            </span>
                        </div>

                        <p className="small text-muted text-center mb-4">
                            Khi nhấn tiếp tục, bạn đồng ý với{' '}
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
                                <img src={iconGoogle} alt="Google" className="auth-page__social-icon"/>
                                <span className="small fw-bold">Google</span>
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>

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

export default AuthPage;
