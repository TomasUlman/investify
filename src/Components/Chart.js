import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { Icon } from './Icon'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

/**
 * LineChartComponent renders a line chart with the given data.
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.data - The data to be displayed in the chart.
 * @returns {JSX.Element} The rendered line chart component.
 */
export function LineChartComponent({ data }) {
    let updatedData = [...data];

    /**
     * If there is data, add a previous month with value 0.
     * This ensures that the chart starts at 0.
     */
    if (updatedData.length) {
        const firstDate = updatedData[0].id.split('_');
        let year = +firstDate[0];
        let month = +firstDate[1];

        // Handle the case where the first data point is in January
        if (month === 1) {
            year -= 1;
            month = 12;
        } else {
            month -= 1;
        }

        const formattedPreviousDate = `${year}_${String(month).padStart(2, "0")}`;


        updatedData = [{ id: formattedPreviousDate, value: 0 }, ...data];
    }

    return (
        <div className="line-chart-container">
            <div className="line-chart-title">
                <Icon bgColor='#1464ae' icon={faChartLine} />
                <h6>Výkonnost</h6>
            </div>
            <div style={{ width: "100%", height: 200 }}>
                {data.length ?
                    <ResponsiveContainer>
                        <LineChart data={updatedData} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
                            <CartesianGrid horizontal={false} stroke='#2194ff31' />
                            <XAxis
                                axisLine={false}
                                tickLine={false}
                                dataKey='id'
                                tick={{ angle: -30, dy: 5, fontSize: 14, fill: '#cbcaca' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(tick) => `${tick} %`}
                                padding={{ top: 10, bottom: 10 }}
                                tick={{ dx: -5, fontSize: 14, fill: '#cbcaca' }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#00000075", borderRadius: "8px", border: 'none' }}
                                itemStyle={{ color: "#fff" }}
                                labelFormatter={() => ""}
                                formatter={(value) => [`${value} %`]}
                            />
                            <Line
                                type="monotone"
                                dataKey='value'
                                stroke="#2192FF"
                                strokeWidth={2}
                                dot={{ fill: "#2192FF", r: 3 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    :
                    <p style={{ color: '#fff', textAlign: 'center', paddingTop: '3rem' }}>Nejsou k dispozici žádná data.</p>
                }
            </div>
        </div>
    );
}

/**
 * BarChartComponent renders a bar chart with the given data.
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.data - The data to be displayed in the chart.
 * @returns {JSX.Element} The rendered bar chart component.
 */
export function BarChartComponent({ data }) {
    const sortedData = data ? [...data].sort((a, b) => b.value - a.value) : [];

    return (
        sortedData.length ?
            <ResponsiveContainer width="100%" height={180}>
                <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid stroke='#2194ff31' />
                    <XAxis
                        dataKey="name"
                        stroke="#2192FF"
                        strokeWidth={2}
                        tickLine={false}
                        tick={{ dy: 5, fontSize: 14, fill: '#cbcaca' }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ dx: -5, fontSize: 14, fill: '#cbcaca' }}
                        tickFormatter={(tick) => `${tick} %`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#00000075", borderRadius: "8px", border: 'none',
                        }}
                        itemStyle={{ color: "#fff" }}
                        labelStyle={{ color: "#fff", margin: 0, padding: 0 }}
                        formatter={(value) => [`${value} %`]}
                        cursor={false}
                    />
                    <Bar
                        dataKey="value"
                        fill="#2194ff58"
                        stroke="#2192FF"
                        strokeWidth={2}
                    />
                </BarChart>
            </ResponsiveContainer >
            :
            <p style={{ color: '#fff' }}>Nejsou k dispozici žádná data.</p>
    );
}