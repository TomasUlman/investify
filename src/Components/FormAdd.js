import { useState } from "react";
import { fetchMarketData, typeTranslations } from "../Helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";

/**
 * FormAdd component for adding a new investment to the portfolio.
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.portfolio - The current portfolio data.
 * @param {Function} props.onAdd - Function to add a new item to the portfolio.
 * @returns {JSX.Element} The rendered form component.
 */
export default function FormAdd({ portfolio, onAdd }) {
    const [ticker, setTicker] = useState('');
    const [shares, setShares] = useState('');
    const [investment, setInvestment] = useState('');
    const [tickerError, setTickerError] = useState(null);
    const [sharesError, setSharesError] = useState(null);
    const [investmentError, setinvestmentError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);

    /**
     * Resets all error messages.
     */
    function resetErrors() {
        setTickerError(null);
        setSharesError(null);
        setinvestmentError(null);
    }

    /**
     * Handles the form submission.
     * @param {Event} e - The form submission event.
     * @returns {Promise<void>}
     */
    async function handleSubmit(e) {
        e.preventDefault();

        setIsLoading(true);
        resetErrors();

        // Get all tickers from the portfolio
        const tickers = portfolio.length ? portfolio.map(item => item.ticker) : [];

        // Validate the ticker
        if (!ticker.trim()) {
            setTickerError('Ticker nesmí být prázdný.');
            setIsLoading(false);
            return;
        }

        // Check if the ticker is already in the portfolio
        if (tickers.includes(ticker.trim())) {
            setTickerError('Ticker již v portfoliu je.');
            setIsLoading(false);
            return;
        }

        // Validate the shares investment
        if (+shares <= 0) {
            setSharesError('Počet musí být větší než 0.');
            setIsLoading(false);
            setShares('');
            return;
        }

        // Validate the investment
        if (+investment <= 0) {
            setinvestmentError('Částka musí být větší než 0.');
            setIsLoading(false);
            setInvestment('');
            return;
        }

        try {
            // Fetch the market data for the ticker
            const data = await fetchMarketData(ticker.trim());

            // Check if the data is valid
            if (!data || !data.body || data.body.length === 0) {
                throw new Error('Ticker nenalezen.');
            }

            // Create a new item with the fetched data
            const itemMarketData = data.body[0];
            const newItem = {
                ticker,
                shares: +shares,
                investment: +investment,
                name: itemMarketData.longName ?? "Neznámý název",
                type: typeTranslations[itemMarketData.quoteType] ?? "Neznámý typ",
                value: +shares * (itemMarketData.regularMarketPrice),
                price: itemMarketData.regularMarketPrice,
                profit: (+shares * (itemMarketData.regularMarketPrice)) - +investment,
                profitPercentage: (((+shares * (itemMarketData.regularMarketPrice)) - +investment) / +investment) * 100
            }

            onAdd(newItem);
        } catch (err) {
            console.error("❌ Failed to fetch:", err.message);
            setTickerError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <form className='form-add' onSubmit={handleSubmit}>
                <div className='input-group'>
                    <span>Ticker</span>
                    <input
                        type='text'
                        value={ticker}
                        onChange={e => {
                            setTicker(e.target.value.toUpperCase())
                            resetErrors()
                        }}
                        required
                    />
                    <FontAwesomeIcon
                        icon={faInfo}
                        size='sm'
                        color='#fff'
                        className='form-info'
                        onMouseEnter={() => setIsTooltipOpen(true)}
                        onMouseLeave={() => setIsTooltipOpen(false)}
                    />
                    {isTooltipOpen && <Tooltip />}
                </div>
                {tickerError && <p className="form-error-message">{tickerError}</p>}
                <div className='input-group'>
                    <span>Počet</span>
                    <input
                        type='number'
                        value={shares}
                        onChange={e => {
                            setShares(e.target.value)
                            resetErrors()
                        }}
                        required
                    />
                </div>
                {sharesError && <p className="form-error-message">{sharesError}</p>}
                <div className='input-group'>
                    <span>Částka ($)</span>
                    <input
                        type='number'
                        value={investment}
                        onChange={e => {
                            setInvestment(e.target.value)
                            resetErrors()
                        }}
                        required
                    />
                </div>
                {investmentError && <p className="form-error-message">{investmentError}</p>}
                {isLoading ?
                    <button className='submit-btn-disabled' disabled>
                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        <span className="visually-hidden" role="status">Loading...</span>
                    </button>
                    :
                    <button className='submit-btn'>Přidat</button>
                }
            </form >
        </div>
    );
}

/**
 * Tooltip component to display information about the input format.
 * @returns {JSX.Element} The rendered tooltip component.
 */
function Tooltip() {
    return (
        <div className='form-tooltip'>
            <p>Akcie (např. AAPL)</p>
            <p>ETF (např. IVV)</p>
            <p>Kryptoměny (např. BTC-USD)</p>
        </div>
    );
}