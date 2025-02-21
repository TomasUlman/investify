import { useState } from 'react';
import { BarChartComponent as BarChart } from "./Chart";
/**
 * Tabs component to display different data sets in a tabbed interface.
 * @param {Object} props - The component props.
 * @param {Array<Array<Object>>} props.data - The data sets to display in each tab.
 * @returns {JSX.Element} The rendered tabs component.
 */
export default function Tabs({ data }) {
    const [activeTab, setActiveTab] = useState(0);

    /**
     * Handles the click event for tab buttons.
     * @param {number} index - The index of the clicked tab.
     */
    function handleClick(index) {
        setActiveTab(index);
    }

    return (
        <div className='tabs'>
            <div className='tabs-btn-container'>
                {['Alokace', 'Akcie', 'ETF', 'Kryptoměny'].map((label, index) =>
                    <button
                        key={index}
                        className={`tab-btn ${activeTab === index ? 'active' : ''}`}
                        onClick={() => handleClick(index)}
                    >
                        {label}
                    </button>
                )}
            </div>
            <BarChart data={data[activeTab]} />
        </div >
    );
}