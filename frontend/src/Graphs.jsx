
import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

function Graphs() {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        fetch("https://petrol-khata.onrender.com/entries")
            .then((response) => response.json())
            .then((data) => {
                setEntries(data.entries || []);
            })
            .catch((error) => {
                console.error("Failed to fetch graphs:", error);
            });
    }, []);

    const spendingData = entries.map((entry) => ({
        date: entry.date,
        spending: Number(entry.totalPrice)
    }));

    const fuelData = entries.map((entry) => ({
        date: entry.date,
        litres: Number(entry.litres)
    }));

    const mileageData = entries
        .filter((entry) => entry.mileage !== null)
        .map((entry) => ({
            date: entry.date,
            mileage: Number(entry.mileage)
        }));

    return (
        <main className="analytics-page">

            <div className="dashboard-header">
                <div>
                    <h1>Graphs</h1>
                    <p>
                        Visualize your fuel spending, consumption,
                        and mileage
                    </p>
                </div>
            </div>

            <div className="graphs-grid">

                <section className="graph-card">

                    <h2>Spending Over Time</h2>

                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={spendingData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />

                                <Line
                                    type="monotone"
                                    dataKey="spending"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                </section>

                <section className="graph-card">

                    <h2>Fuel Consumption</h2>

                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={fuelData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />

                                <Bar
                                    dataKey="litres"
                                    fill="#2563eb"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </section>

                <section className="graph-card full-width">

                    <h2>Mileage Trend</h2>

                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={mileageData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />

                                <Line
                                    type="monotone"
                                    dataKey="mileage"
                                    stroke="#16a34a"
                                    strokeWidth={3}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                </section>

            </div>

        </main>
    );
}

export default Graphs;
