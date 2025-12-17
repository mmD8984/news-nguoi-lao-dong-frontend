import {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {BsArrowUp} from 'react-icons/bs';

export default function ScrollToTop() {
    const {pathname} = useLocation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.pageYOffset > 300);
        };

        toggleVisibility();
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (!isVisible) return null;

    return (
        <div
            onClick={scrollToTop}
            role="button"
            tabIndex={0}
            aria-label="Scroll to top"
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') scrollToTop();
            }}
            className="position-fixed bottom-0 end-0 m-4 border rounded-circle bg-white shadow-sm cursor-pointer d-flex flex-column align-items-center justify-content-center hover-shadow go-top-button"
        >
            <BsArrowUp className="text-secondary" size={20}/>
        </div>
    );
}
