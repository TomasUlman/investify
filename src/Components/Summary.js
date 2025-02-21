import LogoSvg from '../Assets/Logo.svg'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSeedling, faHandHoldingDollar, faCoins, faPercent, faRotate, faRightFromBracket
} from "@fortawesome/free-solid-svg-icons";
import { Icon } from './Icon';

/**
 * Summary component to display the summary of the portfolio.
 * @param {Object} props - The component props.
 * @param {Object} props.data - The summary data.
 * @param {Function} props.onLogOut - Function to handle user logout.
 * @returns {JSX.Element} The rendered summary component.
 */
export default function Summary({ data, onLogOut }) {
    return (
        <div className="summary-container">
            <SummaryItem value1={data?.totalInvestment || ''} value2={data?.totalInvestmentCzk || ''}>
                <Icon bgColor='#008170' icon={faSeedling} /><h6>Celková investice</h6>
            </SummaryItem>
            <SummaryItem value1={data?.totalValue || ''} value2={data?.totalValueCzk || ''}>
                <Icon bgColor='#1464ae' icon={faHandHoldingDollar} /><h6>Hodnota portfolia</h6>
            </SummaryItem>
            <SummaryItem value1={data?.totalProfit || ''} value2={data?.totalProfitCzk || ''}>
                <Icon bgColor='#CD1818' icon={faCoins} /><h6>Výnos / Ztráta</h6>
            </SummaryItem>
            <SummaryItem value1={data?.totalProfitPercentage || ''} suffix='%'>
                <Icon bgColor='#93329E' icon={faPercent} /><h6>Výnos / Ztráta (%)</h6>
            </SummaryItem>
            <SummaryItem value1={data?.ccyRate || ''}>
                <Icon bgColor='#9a0a3f' icon={faRotate} /><h6>Cena USD / CZK</h6>
            </SummaryItem>
            <Logo onLogOut={onLogOut} />
        </div>
    );
}

/**
 * Logo component to display the application logo and handle logout.
 * @param {Object} props - The component props.
 * @param {Function} props.onLogOut - Function to handle user logout.
 * @returns {JSX.Element} The rendered logo component.
 */
function Logo({ onLogOut }) {
    return (
        <div className='summary-card text-bg-dark'>
            <div className='logo-container'>
                <div className='app-name-container'>
                    <h1>investify</h1>
                    <span>&copy; Tomáš Ulman</span>
                </div>
                <img src={LogoSvg} alt='Logo' />
            </div>
            <FontAwesomeIcon icon={faRightFromBracket} size='2x' color='#fff' className='log-out-btn' onClick={onLogOut} />
        </div >
    );
}

/**
 * SummaryItem component to display individual summary items.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to display inside the summary item.
 * @param {number|string} props.value1 - The primary value to display.
 * @param {number|string} [props.value2] - The secondary value to display.
 * @param {string} [props.suffix='$'] - The suffix to append to the primary value.
 * @returns {JSX.Element} The rendered summary item component.
 */
function SummaryItem({ children, value1, value2, suffix = '$' }) {
    /**
     * Formats a number to a localized string with two decimal places.
     * @param {number|string} number - The number to format.
     * @returns {string} The formatted number.
     */
    function formatNumber(number) {
        if (typeof number !== 'number') return number;
        return Number(number.toFixed(2)).toLocaleString('cs-CZ').replace(/\u00A0/g, ' ');
    }

    return (
        <div className='summary-card text-bg-dark'>
            <div className='summary-card-title'>{children}</div>
            {value1 && <span>{formatNumber(value1)} {suffix}</span>}
            {value2 && <span>{formatNumber(value2)} CZK</span>}
        </div >
    );
}