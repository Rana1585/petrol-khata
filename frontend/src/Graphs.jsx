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
import { apiFetch } from "./api";

function Graphs() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadEntries = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await apiFetch("/entries");

                if (!response.ok) {
                    throw new Error(`Server returned ${response.status}`);
                }

                const data = await response.json();

                const entriesData = Array.isArray(data)
                    ? data
                    : Array.isArray(data.entries)
                        ? data.entries
                        : [];

                setEntries(entriesData);
            } catch (err) {
                console.error("Failed to fetch graphs:", err);
                setError("Unable to load graph data.");
            } finally {
                setLoading(false);
            }
        };

        loadEntries();
    }, []);

    const spendingData = entries
        .filter((entry) => entry.date && entry.totalPrice != null)
        .map((entry) => ({
            date: entry.date,
            spending: Number(entry.totalPrice) || 0
        }));

    const fuelData = entries
        .filter((entry) => entry.date && entry.litres != null)
        .map((entry) => ({
            date: entry.date,
            litres: Number(entry.litres) || 0
        }));

    const mileageData = entries
        .filter(
            (entry) =>
                entry.date &&
                entry.mileage != null &&
                Number.isFinite(Number(entry.mileage))
        )
        .map((entry) => ({
            date: entry.date,
            mileage: Number(entry.mileage)
        }));

    if (loading) {
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

                <div className="graph-card">
                    <p>Loading graphs...</p>
                </div>
            </main>
        );
    }

    if (error) {
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

                <div className="graph-card">
                    <p>{error}</p>
                </div>
            </main>
        );
    }

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

                {/* Spending */}
                <section className="graph-card">
                    <h2>Spending Over Time</h2>

                    <div className="chart-container">
                        {spendingData.length > 0 ? (
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
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p>No spending data available.</p>
                        )}
                    </div>
                </section>

                {/* Fuel */}
                <section className="graph-card">
                    <h2>Fuel Consumption</h2>

                    <div className="chart-container">
                        {fuelData.length > 0 ? (
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
                        ) : (
                            <p>No fuel consumption data available.</p>
                        )}
                    </div>
                </section>

                {/* Mileage */}
                <section className="graph-card full-width">
                    <h2>Mileage Trend</h2>

                    <div className="chart-container">
                        {mileageData.length > 0 ? (
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
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p>No mileage data available.</p>
                        )}
                    </div>
                </section>

            </div>
        </main>
    );
}

export default Graphs;