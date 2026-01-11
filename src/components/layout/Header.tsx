import {type ReactNode, useEffect, useMemo, useRef, useState} from 'react';
import {Container} from 'react-bootstrap';
import {Link, NavLink, useLocation, useNavigate} from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import {toast} from 'react-toastify';
import {
    BsBarChart,
    BsBoxArrowRight,
    BsFileText,
    BsHouseFill,
    BsLink45Deg,
    BsList,
    BsPerson,
    BsPersonCircle,
    BsPlayCircle,
    BsSearch,
    BsXLg
} from 'react-icons/bs';

import {useAppDispatch, useAppSelector} from '@/store/hooks.ts';
import {getCategories} from '@/services/api.ts';
import type {MegaMenuData} from '@/data/menu';
import type {NavItem} from '@/types.ts';
import {logoutUser} from '@/store/user/user.actions.ts';
import {getCurrentUser} from "@/store/user/user.selectors.ts";
import {logoNld} from '@/assets';

dayjs.locale('vi');

// Các mục bên phải mega menu
const MEDIA_ITEMS = [
    {label: 'Video', path: '/video', icon: 'video'},
    {label: 'Longform', path: '/longform', icon: 'file-text'},
    {label: 'Infographic', path: '/infographic', icon: 'bar-chart'}
] as const;

const UTILITY_ITEMS = [
    {label: 'Lý tưởng sống', path: '/ly-tuong-song'},
    {label: 'Nói thẳng', path: '/noi-thang'},
    {label: 'Tin độc quyền', path: '/doc-quyen'}
] as const;

function Header() {
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState<NavItem[]>([]);

    const dispatch = useAppDispatch();
    const user = useAppSelector(getCurrentUser);
    const navigate = useNavigate();
    const location = useLocation();

    const menuRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const userMenuTimeoutRef = useRef<number | null>(null);

    // Danh sách item trong menu user
    const userMenuItems = useMemo(
        () => [
            {label: 'Thông tin tài khoản', path: '/thong-tin-ca-nhan/tai-khoan', icon: 'BsPerson'},
            {label: 'Đăng xuất', path: '#', icon: 'BsBoxArrowRight'}
        ],
        []
    );

    const formattedDate = useMemo(() => {
        const currentDate = dayjs().format('dddd, DD/MM/YYYY');
        return currentDate.charAt(0).toUpperCase() + currentDate.slice(1);
    }, []);

    // Chuẩn bị data cho mega menu dựa trên categories
    const megaMenu: MegaMenuData | null = useMemo(() => {
        if (categories.length === 0) return null;
        return {
            mainCategories: categories.map((c) => ({
                title: c.label,
                path: c.path,
                items: c.subItems?.map((s) => ({label: s.label, path: s.path})) ?? []
            })),
            rightSide: {media: [...MEDIA_ITEMS], utilities: [...UTILITY_ITEMS]}
        };
    }, [categories]);

    // Lấy dữ liệu menu (category)
    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    // Tự động đóng menu khi url thay đổi
    useEffect(() => {
        const id = setTimeout(() => {
            setIsMegaMenuOpen(false);
            setShowUserMenu(false);
        }, 1000);
        return () => clearTimeout(id);
    }, [location]);

    // Lock scroll khi mở menu
    useEffect(() => {
        if (isMegaMenuOpen) document.body.classList.add('scroll-locked');
        else document.body.classList.remove('scroll-locked');
        return () => document.body.classList.remove('scroll-locked');
    }, [isMegaMenuOpen]);

    // Click ra ngoài thì đóng menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node))
                setIsMegaMenuOpen(false);
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node))
                setShowUserMenu(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Clear timeout khi unmount
    useEffect(() => {
        return () => {
            if (userMenuTimeoutRef.current) window.clearTimeout(userMenuTimeoutRef.current);
        };
    }, []);

    // Hover vào icon user thì show menu
    const handleUserMenuEnter = () => {
        if (userMenuTimeoutRef.current) {
            window.clearTimeout(userMenuTimeoutRef.current);
            userMenuTimeoutRef.current = null;
        }
        if (user) setShowUserMenu(true);
    };

    const handleUserMenuLeave = () => {
        userMenuTimeoutRef.current = window.setTimeout(() => {
            setShowUserMenu(false);
            userMenuTimeoutRef.current = null;
        }, 200);
    };

    // Logout: clear redux + về Home
    const handleLogout = async () => {
        await dispatch(logoutUser());
        toast.success("Đăng xuất thành công");
        navigate('/');
    };

    // Search: điều hướng qua trang /search?q=
    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const q = searchQuery.trim();
        if (!q) return;
        navigate(`/search?q=${encodeURIComponent(q)}`);
    };

    const toggleMegaMenu = () => setIsMegaMenuOpen((v) => !v);

    // Click icon user: nếu có user -> toggle dropdown, chưa có -> về login
    const handleUserClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (user)
            setShowUserMenu((v) => !v);
        else navigate('/login');
    };

    // Icon mapping cho mega menu
    const megaMenuIcons: Record<string, ReactNode> = {
        video: <BsPlayCircle size={18} className="item-icon"/>,
        'file-text': <BsFileText size={18} className="item-icon"/>,
        'bar-chart': <BsBarChart size={18} className="item-icon"/>
    };

    const userMenuIcons: Record<string, ReactNode> = {
        BsPerson: <BsPerson size={16}/>,
        BsBoxArrowRight: <BsBoxArrowRight size={16}/>
    };

    const getIcon = (iconName: string) => megaMenuIcons[iconName] || null;
    const getUserMenuIcon = (iconName: string) => userMenuIcons[iconName] || null;

    return (
        <>
            {/* Header top: logo + search + user */}
            <div className="header__middle">
                <Container>
                    <div className="header__branding-section">
                        {/* Logo + date */}
                        <div className="header__branding-left d-flex gap-4 align-items-center">
                            <Link to="/" className="header__logo" title="Báo Người Lao Động">
                                <img src={logoNld} className="logo-img" alt="Báo Người Lao Động"/>
                            </Link>
                            <p className="header__date">{formattedDate}</p>
                        </div>

                        {/* Search + user menu */}
                        <div className="header__actions">
                            {/* Search box */}
                            <form onSubmit={handleSearch} className="header__search box-search d-none d-sm-block">
                                <input
                                    className="btn-search txt-search"
                                    placeholder="Tìm kiếm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <a className="btn-submit btn-search-a cursor-pointer text-secondary"
                                   onClick={() => handleSearch()}>
                                    <BsSearch size={16}/>
                                </a>
                            </form>

                            {/* User dropdown */}
                            <div
                                className="header__user-menu-wrapper"
                                ref={userMenuRef}
                                onMouseEnter={handleUserMenuEnter}
                                onMouseLeave={handleUserMenuLeave}
                            >
                                <a
                                    href="/login"
                                    className="header__user-icon cursor-pointer"
                                    onClick={handleUserClick}
                                    title={user ? 'Tài khoản' : 'Đăng nhập'}
                                >
                                    {user?.avatar ? (
                                        <img src={user.avatar} className="rounded-circle border" width="30" height="30"
                                             alt="Avatar"/>
                                    ) : (
                                        <BsPersonCircle size={30} className="text-secondary"/>
                                    )}
                                </a>

                                {showUserMenu && user && (
                                    <div className="header__user-dropdown" onMouseEnter={handleUserMenuEnter}
                                         onMouseLeave={handleUserMenuLeave}>
                                        {/* User info */}
                                        <div className="header__user-info">
                                            {user.avatar
                                                ? <img src={user.avatar} alt="avatar"/>
                                                : <BsPersonCircle size={30} className="text-secondary"/>
                                            }
                                            <Link to="/thong-tin-ca-nhan" className="text-dark text-truncate">
                                                {user.displayName}
                                            </Link>
                                        </div>

                                        {/* Menu items */}
                                        <div className="header__user-menu-items">
                                            <ul>
                                                {userMenuItems.map((item, idx) => (
                                                    <li key={idx}>
                                                        {item.label === 'Đăng xuất' ? (
                                                            <a
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleLogout();
                                                                }}
                                                                className="header__user-menu-item cursor-pointer text-danger"
                                                            >
                                                                {getUserMenuIcon(item.icon)}
                                                                {item.label}
                                                            </a>
                                                        ) : (
                                                            <Link to={item.path} className="header__user-menu-item"
                                                                  onClick={() => setShowUserMenu(false)}>
                                                                {getUserMenuIcon(item.icon)}
                                                                {item.label}
                                                            </Link>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Header bottom: nav + mega menu */}
            <div className="header__sticky-wrapper" ref={menuRef}>
                <div className="header__bottom">
                    <Container>
                        <div className="d-flex align-items-center">
                            {/* Nav categories */}
                            <div className="header__set_nav flex-grow-1 no-scrollbar d-flex align-items-center">
                                <NavLink to="/" className="nav-link" title="Trang chủ">
                                    <BsHouseFill size={20}/>
                                </NavLink>
                                {categories.map((item) => (
                                    <NavLink key={item.path} to={item.path} className="nav-link">
                                        {item.label}
                                    </NavLink>
                                ))}
                            </div>

                            {/* Button mở mega menu */}
                            <div className="btn-menu ps-3 border-start border-white border-opacity-10 ms-2"
                                 onClick={toggleMegaMenu}>
                                {isMegaMenuOpen ? (
                                    <span className="icon-close">
                                        <BsXLg size={22}/>
                                    </span>
                                ) : (
                                    <span className="icon-bar">
                                        <BsList size={26}/>
                                    </span>
                                )}
                            </div>
                        </div>
                    </Container>
                </div>

                {/* Mega menu */}
                {megaMenu && (
                    <div className={`header__mega-menu ${isMegaMenuOpen ? 'open' : ''}`}>
                        <div className="header__mega-scroll">
                            <Container>
                                <div className="header__mm-flex">
                                    {/* Cột categories */}
                                    <div className="header__mm-cate">
                                        {megaMenu.mainCategories.map((cat, idx) => (
                                            <div className="box" key={idx}>
                                                <Link to={cat.path} className="title"
                                                      onClick={() => setIsMegaMenuOpen(false)}>
                                                    {cat.title}
                                                </Link>
                                                <div className="list">
                                                    {cat.items.map((sub, sIdx) => (
                                                        <Link key={sIdx} to={sub.path} className="item">
                                                            {sub.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Cột media + utilities */}
                                    <div className="header__mm-right">
                                        <div className="box">
                                            {megaMenu.rightSide.media.map((media, idx) => (
                                                <Link key={idx} to={media.path} className="item-media"
                                                      onClick={() => setIsMegaMenuOpen(false)}>
                                                    {getIcon(media.icon)}
                                                    {media.label}
                                                </Link>
                                            ))}
                                        </div>
                                        <hr/>
                                        <div className="list-util">
                                            {megaMenu.rightSide.utilities.map((util, idx) => (
                                                <Link key={idx} to={util.path} className="item"
                                                      onClick={() => setIsMegaMenuOpen(false)}>
                                                    <BsLink45Deg size={16} className="opacity-50"/>
                                                    {util.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Container>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Header;
