import {useMemo, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {Button, Col, Container, Form, Row, Tab, Tabs} from 'react-bootstrap';
import Footer from '../components/Footer';
import {useAppDispatch} from '../store/hooks';
import {setUser, type User} from '../store/userSlice';
import {iconGoogle, iconZalo} from '../assets';

// Tạo id user demo
function generateAccountId() {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
    return `u-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function AuthPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Dựa theo route để set tab mặc định
    const isRegisterPath = location.pathname === '/register';
    const [activeTab, setActiveTab] = useState(isRegisterPath ? 'register' : 'login');

    // Form state (demo)
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [gender, setGender] = useState<User['gender']>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Validate tối thiểu cho register
    const canRegister = useMemo(
        function () {
            if (!emailOrPhone.trim())
                return false;

            if (!displayName.trim())
                return false;

            if (!password)
                return false;

            if (password !== confirmPassword)
                return false;

            return true;
        },
        [confirmPassword, displayName, emailOrPhone, password]
    );

    // User demo cho login (để test UI)
    const loginUser: User = useMemo(
        function () {
            return {
                id: 'u-001',
                displayName: displayName.trim() || 'Sinh viên',
                avatar: '',
                emailOrPhone: emailOrPhone.trim() || 'sinhvien@st.hcmuaf.edu.vn',
                gender: gender ?? null,
                savedArticleIds: ['a-001', 'a-005']
            };
        },
        [displayName, emailOrPhone, gender]
    );

    // Login
    function handleLogin() {
        dispatch(setUser(loginUser));
        navigate('/profile');
    }

    // Register
    function handleRegister() {
        if (!canRegister) return;
        const newUser: User = {
            id: generateAccountId(),
            displayName: displayName.trim(),
            avatar: '',
            emailOrPhone: emailOrPhone.trim(),
            gender: gender,
            savedArticleIds: []
        };
        dispatch(setUser(newUser));
        navigate('/profile');
    }

    // Social login demo
    function handleSocialLogin(provider: string) {
        const socialUser: User = {
            id: generateAccountId(),
            displayName: `User ${provider}`,
            avatar: '',
            emailOrPhone: `${provider}@example.com`,
            gender: null,
            savedArticleIds: ['a-003']
        };
        dispatch(setUser(socialUser));
        navigate('/profile');
    }

    function handleTabSelect(k: string | null) {
        setActiveTab(k || 'login');
    }

    function handleGoogleClick() {
        handleSocialLogin('google');
    }

    function handleZaloClick() {
        handleSocialLogin('zalo');
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
                                        <Form.Label className="fw-bold small">Email / Số điện thoại</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập Email / Số điện thoại"
                                            value={emailOrPhone}
                                            onChange={(e) => setEmailOrPhone(e.target.value)}
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
                                        <Form.Label className="fw-bold small">Tên hiển thị</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập tên hiển thị"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="py-2"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold small">Email / Số điện thoại</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập Email / Số điện thoại"
                                            value={emailOrPhone}
                                            onChange={(e) => setEmailOrPhone(e.target.value)}
                                            className="py-2"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold small">Giới tính (tuỳ chọn)</Form.Label>
                                        <Form.Select value={gender ?? ''}
                                                     onChange={(e) => setGender((e.target.value as any) || null)}>
                                            <option value="">Chưa chọn</option>
                                            <option value="male">Nam</option>
                                            <option value="female">Nữ</option>
                                            <option value="other">Khác</option>
                                        </Form.Select>
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
                                className="w-50 border text-dark d-flex align-items-center justify-content-center gap-2 py-2"
                                onClick={handleGoogleClick}
                            >
                                <img src={iconGoogle} alt="Google" className="auth-page__social-icon"/>
                                <span className="small fw-bold">Google</span>
                            </Button>

                            <Button
                                variant="outline-light"
                                className="w-50 border text-dark d-flex align-items-center justify-content-center gap-2 py-2"
                                onClick={handleZaloClick}
                            >
                                <img src={iconZalo} alt="Zalo" className="auth-page__social-icon"/>
                                <span className="small fw-bold">Zalo</span>
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Footer */}
            <Footer/>
        </div>
    );
}

export default AuthPage;
