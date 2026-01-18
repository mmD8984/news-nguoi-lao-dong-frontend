import {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Col, Container, Row} from 'react-bootstrap';
import {toast} from "react-toastify";

import ProfileSidebar from '@/pages/profile/ProfileSidebar';
import OverviewPanel from '@/pages/profile/panels/OverviewPanel';
import AccountPanel from '@/pages/profile/panels/AccountPanel';
import SavedPanel from '@/pages/profile/panels/SavedPanel';
import TransactionsPanel from '@/pages/profile/panels/TransactionsPanel';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {getCurrentUser} from "@/store/user/user.selectors.ts";
import {logoutUser} from '@/store/user/user.actions.ts';

export type Panel = 'tong-quan' | 'tai-khoan' | 'bai-da-luu' | 'binh-luan' | 'giao-dich';

function ProfilePage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(getCurrentUser);
    const {section} = useParams<{ section?: string }>();


    // Lấy active panel từ URL, mặc định là 'tong-quan'
    const active = (section || 'tong-quan') as Panel;

    // Chuyển hướng đến /thong-tin-ca-nhan/tong-quan nếu không có section cụ thể
    useEffect(() => {
        if (!section) {
            navigate('/thong-tin-ca-nhan/tong-quan', {replace: true});
        }
    }, [section, navigate]);


    if (!user) return null;

    return (
        <div className="profile-page bg-light font-sans py-4 py-lg-5 min-vh-100">
            <Container>
                <Row className="g-4">
                    {/* Sidebar profile */}
                    <Col lg={3}>
                        <ProfileSidebar
                            user={user}
                            activePanel={active}
                            onLogout={async () => {
                                await dispatch(logoutUser());
                                toast.success("Đăng xuất thành công");
                                navigate('/');
                            }}
                        />
                    </Col>

                    {/* Main content */}
                    <Col lg={9}>
                        {active === 'tong-quan' && <OverviewPanel/>}
                        {active === 'tai-khoan' && (
                            <AccountPanel
                                onSaveSuccess={() => {
                                }}
                            />
                        )}
                        {active === 'bai-da-luu' && <SavedPanel/>}
                        {active === 'giao-dich' && <TransactionsPanel/>}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ProfilePage;
