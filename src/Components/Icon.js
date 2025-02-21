import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Icon component to display a FontAwesome icon with optional background circle.
 * @param {Object} props - The component props.
 * @param {string} [props.bgColor='#1464ae'] - The background color of the icon container.
 * @param {string} [props.iconColor='#fff'] - The color of the icon.
 * @param {Object} props.icon - The FontAwesome icon to display.
 * @param {string} [props.size='lg'] - The size of the icon.
 * @param {boolean} [props.bgCircle=true] - Whether to display a background circle.
 * @param {string} [props.className=''] - Additional class names for the icon container.
 * @returns {JSX.Element} The rendered icon component.
 */
export function Icon({
    bgColor = '#1464ae', iconColor = '#fff', icon, size = 'lg', bgCircle = true, className = '',
}) {
    const iconContainerStyle = {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor,
    };

    const iconStyle = {
        color: iconColor,
    };

    return (
        <div className={className} style={bgCircle ? iconContainerStyle : {}}>
            <FontAwesomeIcon icon={icon} size={size} style={iconStyle} />
        </div>
    );
}
