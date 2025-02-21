import { useEffect } from "react";
import { setPerformanceDb, addPerformanceDb } from "../Firebase";

/**
 * Custom hook to update the monthly performance data.
 * @param {Array<Object>} portfolio - The portfolio data.
 * @param {Object} summaryData - The summary data.
 * @param {Array<Object>} monthlyPerformance - The monthly performance data.
 * @param {Function} setMonthlyPerformance - Function to set the monthly performance state.
 */
export function useUpdateMonthlyPerformance(portfolio, summaryData, monthlyPerformance, setMonthlyPerformance) {
    useEffect(() => {
        if (!portfolio.length || !summaryData || summaryData.totalProfitPercentage == null) return;

        const dateNow = new Date();
        const formattedDateNow = `${dateNow.getFullYear()}_${String(dateNow.getMonth() + 1).padStart(2, "0")}`;

        const lastDbPerformance = monthlyPerformance.length > 0 ? monthlyPerformance[monthlyPerformance.length - 1] : null;
        const newPerformanceValue = Number(summaryData.totalProfitPercentage.toFixed(2));

        const newPerformance = { id: formattedDateNow, value: newPerformanceValue };

        // Update performance for the current month if the value has changed
        if (
            lastDbPerformance &&
            lastDbPerformance.id === formattedDateNow &&
            lastDbPerformance.value !== newPerformanceValue
        ) {
            setPerformanceDb(newPerformance);
            setMonthlyPerformance(prevPerformance =>
                prevPerformance.map(perf => (perf.id === formattedDateNow ? newPerformance : perf))
            );
            return;
        }

        // Add new performance if it's a new month or if performance does not exist
        if (!lastDbPerformance || lastDbPerformance.id !== formattedDateNow) {
            addPerformanceDb(newPerformance);
            setMonthlyPerformance(prevPerformance => [...prevPerformance, newPerformance]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [portfolio, monthlyPerformance, summaryData]);
}