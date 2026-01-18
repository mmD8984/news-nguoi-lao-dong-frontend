import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Alert,
    Button,
    Card,
    Col,
    Container,
    Form,
    ListGroup,
    Row,
} from "react-bootstrap";
import {
    BsBookmark,
    BsBoxArrowRight,
    BsPerson,
    BsPersonCircle,
} from "react-icons/bs";

import NewsCard from "@/components/NewsCard";
import { useSavedArticlesRTDB } from "@/hooks/useSavedArticlesRTDB";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateProfile } from "@/store/user/user.slice";
import { logoutUser } from "@/store/user/user.actions";
import { ViewMode } from "@/types/types";

type Panel = "account" | "saved";
type Notice = { variant: "success" | "secondary"; message: string };

function ProfilePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.currentUser);

    // tab mặc định
    const initialPanel = (searchParams.get("saved")
        ? "saved"
        : "account") as Panel;
    const [active, setActive] = useState<Panel>(initialPanel);

    // popup message
    const [notice, setNotice] = useState<Notice | null>(null);

    // redirect nếu chưa login
    useEffect(() => {
        if (!user) navigate("/login");
    }, [user, navigate]);

    // load bài đã lưu từ Firebase RTDB
    const { items: savedItems, loading: loadingSaved } =
        useSavedArticlesRTDB(user?.id);

    // auto hide notice
    useEffect(() => {
        if (!notice) return;
        const t = window.setTimeout(() => setNotice(null), 1200);
        return () => window.clearTimeout(t);
    }, [notice]);

    const genderLabel = useMemo(() => {
        if (!user?.gender) return "Chưa chọn";
        if (user.gender === "male") return "Nam";
        if (user.gender === "female") return "Nữ";
        return "Khác";
    }, [user?.gender]);

    if (!user) return null;

    return (
        <div className="profile-page bg-light font-sans py-4 py-lg-5 min-vh-100">
            {/* Notice */}
            {notice && (
                <div className="article-notice">
                    <Alert
                        variant={notice.variant}
                        className="m-0 py-2 px-3 shadow-sm"
                        dismissible
                        onClose={() => setNotice(null)}
                    >
                        {notice.message}
                    </Alert>
                </div>
            )}

            <Container>
                <Row className="g-4">
                    {/* Sidebar */}
                    <Col lg={3}>
                        <Card className="border-0 shadow-sm profile-sidebar">
                            <div className="p-3 border-bottom">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="profile-avatar profile-avatar--sm">
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt="avatar"
                                                className="w-100 h-100 object-fit-cover"
                                            />
                                        ) : (
                                            <BsPersonCircle size={34} className="text-secondary" />
                                        )}
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="fw-bold text-dark text-truncate">
                                            {user.displayName}
                                        </div>
                                        <div className="text-secondary small text-truncate">
                                            {user.emailOrPhone}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <ListGroup variant="flush" className="profile-nav">
                                <ListGroup.Item
                                    action
                                    className={`profile-nav__item ${
                                        active === "account" ? "active" : ""
                                    }`}
                                    onClick={() => setActive("account")}
                                >
                                    <BsPerson size={18} /> Thông tin tài khoản
                                </ListGroup.Item>

                                <ListGroup.Item
                                    action
                                    className={`profile-nav__item ${
                                        active === "saved" ? "active" : ""
                                    }`}
                                    onClick={() => setActive("saved")}
                                >
                                    <BsBookmark size={18} /> Bài đã lưu
                                </ListGroup.Item>

                                <ListGroup.Item
                                    action
                                    className="profile-nav__item text-danger"
                                    onClick={() => {
                                        dispatch(logoutUser());
                                        navigate("/");
                                    }}
                                >
                                    <BsBoxArrowRight size={18} /> Đăng xuất
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>

                    {/* Main content */}
                    <Col lg={9}>
                        {/* ACCOUNT */}
                        {active === "account" && (
                            <Card className="border-0 shadow-sm p-4">
                                <h4 className="profile-section-title mb-4">
                                    <span className="profile-section-title__bar" />
                                    Thông tin tài khoản
                                </h4>

                                <Row className="g-4">
                                    {/* Avatar */}
                                    <Col md={4} className="text-center">
                                        <div className="text-secondary small text-start mb-2">
                                            Ảnh đại diện
                                        </div>
                                        <div className="profile-avatar profile-avatar--lg mx-auto">
                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt="avatar"
                                                    className="w-100 h-100 object-fit-cover"
                                                />
                                            ) : (
                                                <BsPersonCircle size={60} className="text-secondary" />
                                            )}
                                        </div>

                                        <div className="mt-3">
                                            <Form.Label className="btn btn-outline-secondary btn-sm mb-0">
                                                Thay đổi
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*"
                                                    className="d-none"
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;
                                                        const url = URL.createObjectURL(file);
                                                        dispatch(updateProfile({ avatar: url }));
                                                    }}
                                                />
                                            </Form.Label>
                                        </div>
                                    </Col>

                                    {/* Form */}
                                    <Col md={8}>
                                        <Form>
                                            <Row className="mb-3">
                                                <Col sm={4} className="text-secondary">
                                                    ID tài khoản
                                                </Col>
                                                <Col sm={8}>{user.id}</Col>
                                            </Row>

                                            <Row className="mb-3">
                                                <Col sm={4} className="text-secondary">
                                                    Tên hiển thị
                                                </Col>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        value={user.displayName}
                                                        onChange={(e) =>
                                                            dispatch(
                                                                updateProfile({
                                                                    displayName: e.target.value,
                                                                })
                                                            )
                                                        }
                                                    />
                                                </Col>
                                            </Row>

                                            <Row className="mb-3">
                                                <Col sm={4} className="text-secondary">
                                                    Giới tính
                                                </Col>
                                                <Col sm={8}>
                                                    <Form.Select
                                                        value={user.gender ?? ""}
                                                        onChange={(e) =>
                                                            dispatch(
                                                                updateProfile({
                                                                    gender:
                                                                        (e.target.value as any) || null,
                                                                })
                                                            )
                                                        }
                                                    >
                                                        <option value="">{genderLabel}</option>
                                                        <option value="male">Nam</option>
                                                        <option value="female">Nữ</option>
                                                        <option value="other">Khác</option>
                                                    </Form.Select>
                                                </Col>
                                            </Row>

                                            <Row className="mb-4">
                                                <Col sm={4} className="text-secondary">
                                                    Email / SĐT
                                                </Col>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        value={user.emailOrPhone}
                                                        disabled
                                                        className="bg-light"
                                                    />
                                                </Col>
                                            </Row>

                                            <div className="text-end">
                                                <Button
                                                    className="bg-nld-auth border-0 px-4 fw-bold"
                                                    onClick={() =>
                                                        setNotice({
                                                            variant: "success",
                                                            message: "Đã lưu thay đổi",
                                                        })
                                                    }
                                                >
                                                    Lưu thay đổi
                                                </Button>
                                            </div>
                                        </Form>
                                    </Col>
                                </Row>
                            </Card>
                        )}

                        {/* SAVED */}
                        {active === "saved" && (
                            <Card className="border-0 shadow-sm p-4">
                                <h4 className="profile-section-title mb-4">
                                    <span className="profile-section-title__bar" />
                                    Bài đã lưu
                                </h4>

                                {loadingSaved ? (
                                    <p className="text-secondary mb-0">Loading...</p>
                                ) : savedItems.length === 0 ? (
                                    <p className="text-muted mb-0">
                                        Bạn chưa lưu bài viết nào.
                                    </p>
                                ) : (
                                    <div className="d-flex flex-column gap-2">
                                        {savedItems.map((s) => (
                                            <NewsCard
                                                key={s.url}
                                                mode={ViewMode.LIST}
                                                article={{
                                                    id: s.url,
                                                    title: s.title,
                                                    slug: "",
                                                    categorySlug: "saved",
                                                    categoryName: "Bài đã lưu",
                                                    description: s.description,
                                                    content: "",
                                                    thumbnail: s.thumbnail,
                                                    coverImage: s.coverImage,
                                                    author: "Người Lao Động",
                                                    source: s.source || "nld.com.vn",
                                                    publishedAt: s.publishedAt || "",
                                                    tags: [],
                                                    isFeatured: false,
                                                    isHot: false,
                                                    link: s.url,
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </Card>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ProfilePage;
