import { Row, Col, Card, Button, Badge } from "react-bootstrap";
import type { Package } from "@/types/types";

import { BsCheckLg } from "react-icons/bs";

interface Props {
  packages: Package[];
  selectedPackage: Package | null;
  onSelect: (pkg: Package) => void;
  onNext: () => void;
}

// Helper định dạng giá tiền kiểu Việt Nam (VD: 5.000đ)
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
};



const SubscriptionStep1 = ({ packages, selectedPackage, onSelect, onNext }: Props) => {
  return (
    <div className="subscription-step-1 subscription-page">
      <h4 className="fw-bold mb-4 brand-blue-text">1. Chọn gói đăng ký</h4>
      
      <Row className="g-4">
        {packages.map((pkg) => {
            const isSelected = selectedPackage?.id === pkg.id;

            return (
                <Col md={4} key={pkg.id}>
                    <Card 
                        className={`h-100 package-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => onSelect(pkg)}
                    >
                        {/* Checkmark icon khi chọn */}
                        {isSelected && (
                             <div className="checkmark-badge">
                                <BsCheckLg size={20} />
                             </div>
                        )}

                        <Card.Body className="text-center d-flex flex-column align-items-center py-4 px-3">
                             {/* Nhãn giảm giá - Đặt ở trên cùng nếu có */}
                             {pkg.discount && pkg.discount > 0 ? (
                                 <Badge className="mb-3 py-2 px-3 rounded-1 fw-bold discount-badge">
                                     Giảm {pkg.discount.toFixed(2)}%
                                 </Badge>
                             ) : (
                                 <div style={{ height: '36px' }} className="mb-3"></div>
                             )}

                            <h5 className="fw-bold text-dark text-uppercase mb-2" style={{ fontSize: '1.1rem' }}>
                                {pkg.name}
                            </h5>

                            <h2 className="fw-bold text-dark display-6 mb-1">
                                {formatPrice(pkg.price)}
                            </h2>
                            
                            {/* Giá gốc và % giảm */}
                            {pkg.originalPrice ? (
                                <div className="text-muted small mb-3">
                                    <span className="text-decoration-line-through me-2">{formatPrice(pkg.originalPrice)}</span>
                                    <span>-{pkg.discount?.toFixed(2)}%</span>
                                </div>
                            ) : (
                                <div className="mb-3" style={{ height: '21px' }}></div>
                            )}

                            <hr className="w-100 my-3 text-muted opacity-25" />

                            <div className="text-muted small">
                                {pkg.note}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            );
        })}
      </Row>
      
      <div className="text-center mt-5">
         <Button 
            size="lg" 
            className="px-5 py-2 rounded-pill fw-bold text-white shadow-sm btn-select-package" 
            onClick={onNext}
            disabled={!selectedPackage}
            >
            Chọn gói này
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionStep1;
