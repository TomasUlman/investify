/**
 * Translations for different types of investments.
 * @type {Object}
 */
export const typeTranslations = {
    EQUITY: "Akcie",
    ETF: "ETF",
    CRYPTOCURRENCY: "Kryptoměny"
};

/**
 * Sums the values of a specified key in an array of objects.
 * @param {Array<Object>} arr - The array of objects.
 * @param {string} [key='investment'] - The key to sum by.
 * @returns {number} The sum of the values.
 */
export const sumByKey = (arr, key = 'investment') =>
    arr.reduce((sum, item) => sum + (item[key] || 0), 0);

/**
 * Sums the values of a specified key grouped by another key in an array of objects.
 * @param {Array<Object>} arr - The array of objects.
 * @param {string} [groupKey='type'] - The key to group by.
 * @param {string} [sumKey='investment'] - The key to sum by.
 * @returns {Object} The summed values grouped by the specified key.
 * example return value: { EQUITY: 1000, ETF: 2000, CRYPTOCURRENCY: 500 }
 */
const sumByGroup = (arr, groupKey = 'type', sumKey = 'investment') =>
    arr.reduce((acc, item) => ({
        ...acc, [item[groupKey]]: (acc[item[groupKey]] || 0) + (item[sumKey] || 0)
    }), {});

/**
* Maps grouped data to percentages.
* @param {Object} groupedData - The grouped data.
* @param {number} total - The total value for percentage calculation.
* @returns {Array<Object>} The mapped data with percentages.
* example return value: [{ name: 'EQUITY', value: '28.57' }, { name: 'ETF', value: '57.14' }, { name: 'CRYPTOCURRENCY', value: '14.29' }]
*/
const mapToPercentage = (groupedData, total) =>
    Object.entries(groupedData).map(([key, value]) => ({
        name: key,
        value: ((value / total) * 100).toFixed(2)
    }));

/**
 * Groups data by a specified key and maps it to percentages.
 * @param {Array<Object>} arr - The array of objects.
 * @param {string} [filterType=''] - The type to filter by.
 * @param {string} [groupKey=''] - The key to group by.
 * @returns {Array<Object>} The grouped data mapped to percentages.
 * example return value: [{ name: 'AAPL', value: '40.00' }, { name: 'GOOGL', value: '60.00' }]
 */
const getGroupedData = (arr, filterType = '', groupKey = '') => {
    const filteredArr = filterType ? arr.filter(item => item.type === filterType) : arr;
    const total = sumByKey(filteredArr);
    const groupedData = groupKey ? sumByGroup(filteredArr, groupKey) : sumByGroup(arr);
    return mapToPercentage(groupedData, total);
}

/**
 * Gets bar chart data from an array of objects.
 * @param {Array<Object>} arr - The array of objects.
 * @returns {Array<Array<Object>>} The bar chart data.
 */
export const getBarChartData = (arr) => {
    if (!arr.length) return [];

    return [
        getGroupedData(arr, '', ''),  // All investments
        getGroupedData(arr, 'Akcie', 'ticker'),  // Stocks by ticker
        getGroupedData(arr, 'ETF', 'ticker'),    // ETFs by ticker
        getGroupedData(arr, 'Kryptoměny', 'ticker') // Cryptocurrencies by ticker
    ];
}

/**
 * Gets summary data from a portfolio and currency rate.
 * @param {Array<Object>} portfolio - The portfolio data.
 * @param {number} ccyRate - The currency rate.
 * @returns {Object|null} The summary data or null if the portfolio is empty.
 */
export const getSummaryData = (portfolio, ccyRate) => {
    if (!portfolio.length) return null;

    const totalInvestment = sumByKey(portfolio);
    const totalValue = sumByKey(portfolio, 'value');
    const totalProfit = sumByKey(portfolio, 'profit');

    return {
        ccyRate: ccyRate,
        totalInvestment,
        totalInvestmentCzk: totalInvestment * ccyRate,
        totalValue,
        totalValueCzk: totalValue * ccyRate,
        totalProfit,
        totalProfitCzk: totalProfit * ccyRate,
        totalProfitPercentage: ((totalValue - totalInvestment) / totalInvestment) * 100
    }
}


const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': process.env.REACT_APP_RAPID_API_KEY,
        'x-rapidapi-host': process.env.REACT_APP_RAPID_API_HOST
    }
};

/**
 * Fetches market data from an API.
 * @param {string} urlParam - The URL parameter for the API request.
 * @returns {Promise<Object>} The fetched market data.
 * @throws {Error} If fetching market data fails.
 */
export async function fetchMarketData(urlParam) {
    try {
        const response = await fetch
            (
                `https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/quotes?ticker=${urlParam}`,
                options
            );
        if (!response.ok) {
            if (response.status === 429) {
                throw new Error('Vyčerpaný limit volání API.');
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        if (result?.message) {
            console.error("❌ Failed to fetch:", result);
            throw new Error('Chyba načtení dat z API');
        }

        return result;
    } catch (err) {
        console.error('❌ Failed to fetch:', err.message);
        throw new Error(err.message);
    }
}