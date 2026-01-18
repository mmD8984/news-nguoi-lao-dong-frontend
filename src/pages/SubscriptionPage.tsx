import {useEffect, useState} from "react";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useAuth} from "@/hooks/useAuth";
import SubscriptionStep1 from "./subscription/SubscriptionStep1";
import SubscriptionStep2 from "./subscription/SubscriptionStep2";
import type {Package} from "@/types/types";

const PACKAGES: Package[] = [
    {id: 1, name: "Mua số đang đọc", price: 5000, durationDays: 1, note: "Chi phí bỏ ra chỉ 5.000đ /ngày"},
    {
        id: 2,
        name: "30 Ngày",
        price: 50000,
        originalPrice: 100000,
        durationDays: 30,
        discount: 50,
        note: "Chi phí bỏ ra chỉ 1.667đ /ngày"
    },
    {
        id: 3,
        name: "3 Tháng",
        price: 100000,
        originalPrice: 200000,
        durationDays: 90,
        discount: 50,
        note: "Chi phí bỏ ra chỉ 1.111đ /ngày"
    },
    {
        id: 4,
        name: "6 Tháng",
        price: 200000,
        originalPrice: 300000,
        durationDays: 180,
        discount: 33.33,
        note: "Chi phí bỏ ra chỉ 1.111đ /ngày"
    },
    {
        id: 5,
        name: "12 Tháng",
        price: 300000,
        originalPrice: 600000,
        durationDays: 365,
        discount: 50,
        note: "Chi phí bỏ ra chỉ 822đ /ngày"
    },
    {
        id: 6,
        name: "24 Tháng",
        price: 500000,
        originalPrice: 1000000,
        durationDays: 730,
        discount: 50,
        note: "Chi phí bỏ ra chỉ 685đ /ngày"
    },
];

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
};

const SubscriptionPage = () => {
    const [step, setStep] = useState(1);
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(PACKAGES[4]);

    const {user} = useAuth();
    const navigate = useNavigate();

    // Tránh người dùng đã đăng ký VIP vào lại
    useEffect(() => {
        if (user?.isVip && user.vipExpirationDate) {
            const expirationDate = new Date(user.vipExpirationDate);
            if (expirationDate > new Date()) {
                navigate('/thong-tin-ca-nhan');
            }
        }
    }, [user, navigate]);

    const handlePackageSelect = (pkg: Package) => {
        setSelectedPackage(pkg);
    };

    const handleNextStep = () => {
        if (selectedPackage) {
            setStep(2);
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    };

    const handleChangePackage = () => {
        setStep(1);
    };

    return (
        <Container className="subscription-page">
            <Row className="justify-content-center">
                <Col md={8} lg={8} xl={8}>
                    <div className="text-center mb-5">
                        <h2 className="fw-bold fs-3 mb-2 page-title">Đăng ký gói đọc báo "Dành cho bạn đọc VIP"</h2>
                        <p className="text-muted fst-italic mb-1">Đăng ký dài hạn để tiết kiệm hơn 50%</p>
                        <p className="text-muted fst-italic small">Mọi thắc mắc vui lòng liên hệ hotline: <span
                            className="fw-bold text-dark">0903.343.439</span> hoặc Zalo: <span
                            className="fw-bold text-dark">0903343439</span></p>
                    </div>

                    {step === 1 && (
                        <SubscriptionStep1
                            packages={PACKAGES}
                            selectedPackage={selectedPackage}
                            onSelect={handlePackageSelect}
                            onNext={handleNextStep}
                        />
                    )}

                    {step === 2 && selectedPackage && (
                        <div className="fade-in">
                            {/* Tổng quan */}
                            <Card className="mb-4 border-primary shadow-sm">
                                <Card.Body className="d-flex justify-content-between align-items-center p-3 p-md-4">
                                    <div>
                                        <div className="text-muted small mb-1">Dịch vụ bạn chọn:</div>
                                        <h5 className="fw-bold text-primary mb-0">{selectedPackage.name}</h5>
                                        <div className="fw-bold fs-5 mt-1">{formatPrice(selectedPackage.price)}</div>
                                    </div>
                                    <Button variant="outline-primary" size="sm" onClick={handleChangePackage}
                                            className="rounded-pill px-3">
                                        Đổi gói khác
                                    </Button>
                                </Card.Body>
                            </Card>

                            <SubscriptionStep2
                                selectedPackage={selectedPackage}
                            />
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default SubscriptionPage;
