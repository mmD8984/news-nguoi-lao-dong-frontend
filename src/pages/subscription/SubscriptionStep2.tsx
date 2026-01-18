import { useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import type { Package } from "@/types/types";
import { useAuth } from "@/hooks/useAuth";
import { logoutUser, subscribeUser } from "@/store/user/user.actions";
import { useAppDispatch } from "@/store/hooks";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { iconMomo, iconZalo } from "@/assets";

interface Props {
  selectedPackage: Package;
}

const PAYMENT_METHODS = [
  { id: 'zalopay', name: 'Zalopay', icon: iconZalo, description: 'Cổng thanh toán ZaloPay' },
  { id: 'momo', name: 'Ví MoMo', icon: iconMomo, description: 'Ví điện tử MoMo' },
];

const SubscriptionStep2 = ({ selectedPackage }: Props) => {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [method, setMethod] = useState<string>('zalopay');
  const [agreed, setAgreed] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handlePayment = async () => {
    // 1. Kiểm tra đăng nhập
    if (!isAuthenticated) {
        toast.error("Vui lòng đăng nhập để thanh toán.");
        return;
    }

    // 2. Kiểm tra điều khoản
    if (!agreed) {
      toast.error("Bạn cần đồng ý với điều khoản sử dụng.");
      return;
    }

    setIsProcessing(true);
    try {
      // Giả lập độ trễ mạng khi thanh toán
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 3. Dispatch action subscribe
      const transactionData = {
        date: new Date().toISOString(),
        productName: selectedPackage.name,
        amount: selectedPackage.price,
        paymentMethod: method,
        status: 'SUCCESS',
        userId: user?.id,
        userEmail: user?.emailOrPhone || undefined,
        };
        
      await dispatch(subscribeUser({
          transaction: transactionData,
          durationDays: selectedPackage.durationDays
      })).unwrap();

      toast.success("Thanh toán thành công! Gói cước đã được kích hoạt.");
      navigate('/thong-tin-ca-nhan/lich-su-giao-dich'); // Điều hướng về trang lịch sử giao dịch
    } catch (error) {
      console.error(error);
      toast.error(typeof error === 'string' ? error : "Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="subscription-step-2 fade-in subscription-page">
        <div className="mb-4 text-center">
             <h4 className="fw-bold text-nld-blue mb-1">Bước 2: Thanh toán</h4>
             <p className="text-secondary">Chọn hình thức thanh toán phù hợp</p>
        </div>

        {/* Phần thông tin tài khoản */}
        <div className="mb-4">
            {!isAuthenticated ? (
                <div className="text-center py-4 border rounded bg-light">
                    <h5 className="fw-bold mb-3">Vui lòng đăng nhập</h5>
                    <p className="text-muted mb-4 small">Bạn cần đăng nhập để hệ thống ghi nhận gói cước vào tài khoản.</p>
                    <div>
                        <Link to="/register" className="btn btn-primary rounded-pill px-4 me-2 fw-bold btn-sm">
                            <i className="bi bi-box-arrow-in-right me-2"></i> Đăng ký
                        </Link>
                        <Link to="/login" className="btn btn-outline-primary rounded-pill px-4 fw-bold btn-sm">
                            <i className="bi bi-person me-2"></i> Đăng nhập
                        </Link>
                    </div>
                </div>
            ) : (
                 <div className="alert alert-light border d-flex justify-content-between align-items-center p-3">
                    <div className="d-flex align-items-center">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: 32, height: 32}}>
                             <i className="bi bi-person-fill"></i>
                        </div>
                        <div className="lh-1">
                            <div className="text-muted fst-italic small mb-1">Tài khoản thanh toán:</div>
                            <div className="fw-bold text-dark">{user?.emailOrPhone || user?.displayName || 'Thành viên'}</div>
                        </div>
                    </div>
                    <Button variant="link" className="text-decoration-none text-danger p-0 small" onClick={handleLogout}>
                        Đổi tài khoản
                    </Button>
                </div>
            )}
        </div>
        
        {/* Danh sách gói đã chọn (Tóm tắt) */}
        <div className="border rounded p-3 mb-4 bg-light bg-opacity-50">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                     <div className="text-muted small">Gói dịch vụ</div>
                     <div className="fw-bold text-primary">{selectedPackage.name}</div>
                     <div className="small text-secondary">{selectedPackage.durationDays > 0 ? `${selectedPackage.durationDays} ngày` : 'Theo kỳ'}</div>
                </div>
                <div className="text-end">
                    <div className="text-muted small">Tổng tiền</div>
                    <div className="fw-bold fs-5 text-danger">{selectedPackage.price.toLocaleString('vi-VN')}đ</div>
                </div>
            </div>
        </div>

        {/* Grid phương thức thanh toán */}
        <div style={{ opacity: isAuthenticated ? 1 : 0.6, pointerEvents: isAuthenticated ? 'auto' : 'none' }}>
            <p className="fw-bold mb-3 small text-uppercase text-secondary">Phương thức thanh toán</p>
            <Row className="g-3 mb-4">
                {PAYMENT_METHODS.map((pm) => {
                    const isSelected = method === pm.id;
                    return (
                        <Col md={6} key={pm.id}>
                            <Card 
                                className={`h-100 payment-method-card ${isSelected ? 'selected' : 'border-light-subtle hover-shadow'}`}
                                onClick={() => isAuthenticated && setMethod(pm.id)}
                            >
                                <Card.Body className="d-flex align-items-center p-3">
                                    <div className="me-3 icon-wrapper">
                                        <img src={pm.icon} alt={pm.name} className="img-fluid" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className={`fw-bold ${isSelected ? 'text-primary' : 'text-dark'}`}>{pm.name}</div>
                                        {/* <small className="text-muted d-none d-sm-block" style={{fontSize: '0.75rem'}}>{pm.description}</small> */}
                                    </div>
                                    {isSelected && (
                                         <div className="text-primary">
                                            <i className="bi bi-check-circle-fill fs-5"></i>
                                         </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                })}
            </Row>
            
            <div className="form-check mb-4">
                <input 
                    className="form-check-input cursor-pointer" 
                    type="checkbox" 
                    id="terms" 
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    disabled={!isAuthenticated}
                />
                <label className="form-check-label user-select-none small text-secondary" htmlFor="terms">
                    Tôi đồng ý với <a href="#" className="text-decoration-underline text-dark fw-bold">Quy định thanh toán</a> và <a href="#" className="text-decoration-underline text-dark fw-bold">Chính sách bảo mật</a> của Người Lao Động.
                </label>
            </div>

                <div className="text-center">
                <Button 
                    size="lg" 
                    className="px-5 py-3 rounded-pill fw-bold text-white w-100 shadow-sm btn-payment-large" 
                    onClick={handlePayment}
                    disabled={isProcessing || !isAuthenticated}
                >
                    {isProcessing ? (
                        <span><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Đang xử lý...</span>
                    ) : (
                        `Thanh toán ${selectedPackage.price.toLocaleString('vi-VN')}đ`
                    )}
                </Button>
                 <div className="mt-3 text-muted" style={{fontSize: '0.8rem'}}>
                    <i className="bi bi-shield-lock-fill me-1"></i> Thông tin thanh toán được bảo mật an toàn.
                </div>
            </div>
        </div>
    </div>
  );
};

export default SubscriptionStep2;
