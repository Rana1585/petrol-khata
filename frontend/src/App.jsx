
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Navbar";
import AddEntry from "./AddEntry";
import EntriesTable from "./EntriesTable";
import Mileage from "./Mileage";
import Analytics from "./Analytics";
import Graphs from "./Graphs";

function Dashboard() {
    const [entries, setEntries] = useState([]);
    const [analytics, setAnalytics] = useState({
        averageMileage: null,
        bestMileage: null
    });
    const [showAddEntry, setShowAddEntry] = useState(false);

    useEffect(() => {
        fetch("http://localhost:5000/entries")
            .then((response) => response.json())
            .then((data) => {
                setEntries(data.entries || []);
                setAnalytics(
                    data.analytics || {
                        averageMileage: null,
                        bestMileage: null
                    }
                );
            })
            .catch((error) => {
                console.error("Failed to fetch entries:", error);
            });
    }, []);

    const totalSpending = entries.reduce(
        (total, entry) => total + Number(entry.totalPrice),
        0
    );

    const totalFuel = entries.reduce(
        (total, entry) => total + Number(entry.litres),
        0
    );

    return (
        <main id="dashboard">

            <div className="dashboard-header">
                <div>
                    <h1>Petrol Khata Dashboard</h1>
                    <p>Track and manage your fuel expenses</p>
                </div>
            </div>

            <div className="top-section">

                <div className="summary-cards">

                    <div className="summary-card">
                        <p>📋 Total Entries</p>
                        <h2>{entries.length}</h2>
                    </div>

                    <div className="summary-card">
                        <p>💰 Total Spending</p>
                        <h2>
                            Rs {totalSpending.toLocaleString()}
                        </h2>
                    </div>

                    <div className="summary-card">
                        <p>⛽ Total Fuel</p>
                        <h2>
                            {totalFuel.toFixed(2)} L
                        </h2>
                    </div>

                </div>

            </div>

            <Mileage
                entries={entries}
                analytics={analytics}
            />

            <EntriesTable
                entries={entries}
                setEntries={setEntries}
                setShowAddEntry={setShowAddEntry}
            />

            {showAddEntry && (
                <AddEntry
                    setEntries={setEntries}
                    setShowAddEntry={setShowAddEntry}
                />
            )}

        </main>
    );
}

function NotFound() {
    return (
        <main className="not-found">
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>The page you're looking for doesn't exist.</p>
        </main>
    );
}

function App() {
    return (
        <BrowserRouter>

            <div className="app">

                <Navbar />

                <Routes>

                    <Route
                        path="/"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/analytics"
                        element={<Analytics />}
                    />

                    <Route
                        path="/graphs"
                        element={<Graphs />}
                    />

                    <Route
                        path="*"
                        element={<NotFound />}
                    />

                </Routes>

            </div>

        </BrowserRouter>
    );
}

export default App;
