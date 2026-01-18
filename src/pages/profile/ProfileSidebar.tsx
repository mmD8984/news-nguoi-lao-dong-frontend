import type {ComponentType} from 'react';
import {Card, ListGroup} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {BsBookmark, BsBoxArrowRight, BsClockHistory, BsGrid, BsHeart, BsPerson, BsPersonCircle} from 'react-icons/bs';
import type {IconBaseProps} from 'react-icons';
import type {User} from '@/types/user/user.types';
import type {Panel} from '@/pages/ProfilePage';

interface ProfileSidebarProps {
    user: User;
    activePanel: Panel;
    onLogout: () => void;
}

// Định nghĩa các menu item
interface MenuItem {
    id: string;
    label: string;
    icon: ComponentType<IconBaseProps>;
    panel?: Panel;
    isLogout?: boolean;
    className?: string;
}

const MENU_ITEMS: MenuItem[] = [
    {
        id: 'tong-quan',
        label: 'Tổng quan',
        icon: BsGrid,
        panel: 'tong-quan'
    },
    {
        id: 'tai-khoan',
        label: 'Thông tin tài khoản',
        icon: BsPerson,
        panel: 'tai-khoan'
    },
    {
        id: 'yeu-thich',
        label: 'Yêu thích',
        icon: BsHeart,
        panel: 'yeu-thich'
    },
    {
        id: 'bai-da-luu',
        label: 'Bài đã lưu',
        icon: BsBookmark,
        panel: 'bai-da-luu'
    },
    {
        id: 'giao-dich',
        label: 'Lịch sử giao dịch',
        icon: BsClockHistory,
        panel: 'giao-dich'
    },
    {
        id: 'logout',
        label: 'Đăng xuất',
        icon: BsBoxArrowRight,
        isLogout: true,
        className: 'profile-nav__item--logout'
    }
];

function ProfileSidebar({user, activePanel, onLogout}: ProfileSidebarProps) {
    const navigate = useNavigate();

    return (
        <Card className="border-0 shadow-sm profile-sidebar">
            {/* User Info Header */}
            <div className="profile-sidebar__header p-4 border-bottom">
                <div className="d-flex align-items-center gap-3">
                    <div className="profile-avatar profile-avatar--md">
                        {user.avatar ? (
                            <img src={user.avatar} alt="avatar"
                                 className="w-100 h-100 object-fit-cover"/>
                        ) : (
                            <BsPersonCircle size={48} className="text-secondary"/>
                        )}
                    </div>
                    <div className="flex-grow-1">
                        <div className="fw-semibold text-dark">{user.displayName}</div>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <ListGroup variant="flush" className="profile-nav">
                {MENU_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.panel === activePanel;
                    const itemClassName = `profile-nav__item ${isActive ? 'active' : ''} ${item.className || ''}`.trim();

                    return (
                        <ListGroup.Item
                            key={item.id}
                            action
                            className={itemClassName}
                            onClick={() => {
                                if (item.isLogout) {
                                    onLogout();
                                } else if (item.panel) {
                                    navigate(`/thong-tin-ca-nhan/${item.panel}`);
                                }
                            }}
                        >
                            <Icon size={18}/>
                            <span>{item.label}</span>
                        </ListGroup.Item>
                    );
                })}
            </ListGroup>
        </Card>
    );
}

export default ProfileSidebar;
