import { useState } from 'react';
import { fetchMarketData, typeTranslations } from "../Helpers";

/**
 * FormEdit component for editing an existing investment in the portfolio.
 * @param {Object} props - The component props.
 * @param {string} props.ticker - The ticker of the investment to edit.
 * @param {Function} props.onEdit - Function to edit the investment in the portfolio.
 * @returns {JSX.Element} The rendered form component.
 */
export default function FormEdit({ ticker, onEdit }) {
    const [shares, setShares] = useState('');
    const [investment, setInvestment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sharesError, setSharesError] = useState(null);
    const [investmentError, setinvestmentError] = useState(null);

    /**
     * Resets all error messages.
     */
    function resetErrors() {
        setError(null);
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

        // Validate the shares
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

            // If the data is available, update the investment
            if (data.body.length) {
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
                };

                onEdit(newItem);
            }
        } catch (err) {
            console.error('❌ Failed to fetch:', err.message)
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            {error && <p className="form-error-message" style={{ textAlign: 'center' }}>{error}</p>}
            {!error &&
                <form className='form-edit' onSubmit={handleSubmit}>
                    <div className='form-edit-badge'>✏ {ticker}</div>
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
                    {isLoading ?
                        <button className='submit-btn-disabled' disabled>
                            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                            <span className="visually-hidden" role="status">Loading...</span>
                        </button>
                        :
                        <button className='submit-btn'>Uložit</button>
                    }
                    {sharesError && <p className="form-error-message edit-shares-error">{sharesError}</p>}
                    {investmentError && <p className="form-error-message edit-investment-error">{investmentError}</p>}
                </form>
            }
        </div>
    );
}