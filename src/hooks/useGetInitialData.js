import { useState, useEffect } from 'react';
import { getDbData } from '../Firebase';
import { fetchMarketData, typeTranslations } from '../Helpers';

/**
 * Custom hook to fetch initial data for the portfolio and monthly performance.
 * @param {Function} setPortfolio - Function to set the portfolio state.
 * @param {Function} setMonthlyPerformance - Function to set the monthly performance state.
 * @returns {Object} An object containing isLoading, error, and ccyRate.
 */
export function useGetInitialData(setPortfolio, setMonthlyPerformance) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ccyRate, setCcyRate] = useState(null);

    useEffect(function () {
        /**
         * Loads data from the database and market API.
         * @returns {Promise<void>}
         */
        async function loadData() {
            setIsLoading(true);
            setError(null);

            try {
                // Portfolio data from the database
                const dbData = await getDbData('portfolio');
                if (!dbData.length) {
                    setPortfolio([]);
                    return;
                }
                // Replace _ with . in tickers
                const dbItemsData = dbData.map(item => ({
                    ...item,
                    ticker: item.ticker.includes('_') ? item.ticker.replace(/_/g, '.') : item.ticker
                }));

                // Monthly performance data from the database
                const dbPerformanceData = await getDbData('performance');
                if (!dbPerformanceData.length) setMonthlyPerformance([]);


                // Tickers for the Rapid API request
                const tickers = dbItemsData.map(item => item.ticker);
                const urlParam = `${tickers.join('%2C')}%2CUSDCZK%3DX`; // Všechny tickery a kód USD/CZK

                // Data from the Rapid API
                const fetchedMarketData = await fetchMarketData(urlParam);
                if (!fetchedMarketData.body.length) {
                    throw new Error("Chyba načtení tržních dat");
                }

                // Data from the database + data from the Rapid API
                const updatedPortfolio = dbItemsData.map(item => {
                    const itemMarketData = fetchedMarketData.body.find(obj => obj.symbol === item.ticker);

                    return {
                        ...item,
                        name: itemMarketData.longName ?? "Neznámý název",
                        type: typeTranslations[itemMarketData.quoteType] ?? "Neznámý typ",
                        value: item.shares * (itemMarketData.regularMarketPrice ?? 0),
                        price: itemMarketData.regularMarketPrice ?? 0,
                        profit: (item.shares * (itemMarketData.regularMarketPrice ?? 0)) - item.investment,
                        profitPercentage: item.investment !== 0
                            ? (((item.shares * (itemMarketData.regularMarketPrice ?? 0)) - item.investment) / item.investment) * 100
                            : 0
                    };
                });

                // USD/CZK exchange rate
                const ccyRate = fetchedMarketData.body.find(obj => obj.symbol === 'USDCZK=X').regularMarketPrice;
                setCcyRate(ccyRate);

                setPortfolio(updatedPortfolio);
                setMonthlyPerformance(dbPerformanceData);
            } catch (err) {
                console.error("❌ Failed to fetch:", err.message);
                setError(`Něco se nepovedlo: Chyba načtení tržních dat.`);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [setPortfolio, setMonthlyPerformance]);

    return { isLoading, error, ccyRate };
}