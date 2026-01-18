interface SectionTitleProps {
    text: string;
    className?: string;
}

const SectionTitle = ({text, className = 'mb-4'}: SectionTitleProps) => {
    return (
        <h5 className={`profile-section-title ${className}`}>
            <span className="profile-section-title__bar"/>
            {text}
        </h5>
    );
};

export default SectionTitle;
