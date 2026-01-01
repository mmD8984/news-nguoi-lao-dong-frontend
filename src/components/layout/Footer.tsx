import {useEffect, useState} from "react";
import {BsFacebook, BsRss, BsYoutube} from "react-icons/bs";
import {Link} from "react-router-dom";
import {Container, Row, Col} from "react-bootstrap";
import {getCategories} from "../../services/api.ts";
import type {NavItem} from "../../types.ts";
import {iconAppStore, iconGooglePlay} from '../../assets';
import {logoNld} from '@/assets';

function Footer() {
    const [categories, setCategories] = useState<NavItem[]>([]);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    return (
        <footer className="bg-white border-top mt-5 pt-4 font-sans">
            <Container>
                <div className="pb-3 mb-4 border-bottom">
                    <Link to="/" className="text-decoration-none">
                        <img src={logoNld} className="logo-img" alt="Báo Người Lao Động"/>
                    </Link>

                    <div className="d-flex flex-wrap gap-3 mt-3 text-secondary footer__links">
                        {categories.map((cat) => (
                            <Link
                                key={cat.path}
                                to={cat.path}
                                className="hover-link text-dark"
                            >
                                {cat.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <Row className="gy-4 footer__body">
                    <Col md={4} className="pe-md-4">
                        <h6 className="text-uppercase fw-bold mb-2">
                            BÁO NGƯỜI LAO ĐỘNG ĐIỆN TỬ
                        </h6>
                        <p className="mb-3 text-secondary">
                            Cơ quan chủ quản: Thành ủy Thành phố Hồ Chí Minh
                        </p>

                        <p className="mb-1 text-secondary">
                            Giấy phép số 115/GP- BTTTT cấp ngày 09.02.2021
                        </p>
                        <p className="mb-1 text-secondary">Tổng Biên tập: TÔ ĐÌNH TUÂN</p>
                        <p className="mb-1 text-secondary">
                            Phó Tổng Biên tập: DƯƠNG QUANG, BÙI THANH LIÊM, LÊ CƯỜNG
                        </p>
                        <p className="mb-0 text-secondary">Tổng TKTS: NGUYỄN TÔ BÌNH</p>
                    </Col>

                    <Col md={4} className="px-md-4 border-start border-end border-light">
                        <h6 className="text-uppercase fw-bold mb-2">TRỤ SỞ CHÍNH</h6>
                        <p className="mb-1 text-secondary">
                            127 Võ Văn Tần, Phường Xuân Hòa, TPHCM
                        </p>
                        <p className="mb-1 text-secondary">
                            Điện thoại:{" "}
                            <a
                                href="tel:02839306262"
                                className="text-primary text-decoration-none"
                            >
                                028-3930.6262
                            </a>{" "}
                            /{" "}
                            <a
                                href="tel:02839305376"
                                className="text-primary text-decoration-none"
                            >
                                028-3930.5376
                            </a>
                        </p>
                        <p className="mb-3 text-secondary">
                            Fax: <span className="text-primary">028-3930.4707</span>
                        </p>

                        <h6 className="text-uppercase fw-bold mb-2">LIÊN HỆ QUẢNG CÁO</h6>
                        <p className="mb-1 text-secondary text-uppercase footer__subheading">
                            LIÊN HỆ QUẢNG CÁO BÁO ĐIỆN TỬ
                        </p>
                        <p className="mb-1 text-secondary">
                            Email: lienhequangbadoanhnghiep@gmail.com
                        </p>
                        <p className="mb-3 text-secondary">Điện thoại: 0988154838</p>
                    </Col>

                    <Col md={4} className="ps-md-4">
                        <h6 className="text-uppercase fw-bold mb-3">THEO DÕI CHÚNG TÔI</h6>
                        <div className="d-flex gap-3 mb-5">
                            <a href="#" aria-label="Facebook">
                                <BsFacebook className="text-primary" size={28}/>
                            </a>
                            <a href="#" aria-label="YouTube">
                                <BsYoutube className="text-danger" size={28}/>
                            </a>
                            <a
                                href="#"
                                aria-label="Zalo"
                                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold footer__zalo"
                            >
                                Zalo
                            </a>
                            <a href="#" aria-label="RSS">
                                <BsRss className="text-warning" size={28}/>
                            </a>
                        </div>

                        <h6 className="text-uppercase fw-bold mb-3">
                            TẢI ỨNG DỤNG ĐỌC BÁO NGƯỜI LAO ĐỘNG
                        </h6>
                        <div className="d-flex gap-2">
                            <img
                                src={iconAppStore}
                                height="40"
                                alt="App Store"
                            />
                            <img
                                src={iconGooglePlay}
                                height="40"
                                alt="Google Play"
                            />
                        </div>
                    </Col>
                </Row>

                <div className="border-top mt-5 py-4 text-center">
                    <small className="text-muted">
                        Bản quyền thuộc về Báo Người Lao Động. Các website khác đã được chấp
                        thuận khai thác thông tin, khi sử dụng phải ghi rõ nguồn: Theo Báo
                        Người Lao Động (www.nld.com.vn).
                    </small>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;
