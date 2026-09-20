import { useEffect, useState } from "react";

function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://192.168.18.72:5000/dashboard"
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to load dashboard"
                );
            }

            const result = await response.json();

            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <main className="page">
                <div className="loading-state">
                    Loading dashboard...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="page">
                <div className="error-state">
                    {error}
                </div>
            </main>
        );
    }

    const summary = data?.summary || {};
    const currentPrice =
        data?.currentFuelPrice?.price || 0;

    return (
        <main className="page">
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>
                        Your fuel and travel
                        overview at a glance.
                    </p>
                </div>
            </div>

            <section className="dashboard-hero">
                <div>
                    <span className="dashboard-hero-label">
                        CURRENT PETROL PRICE
                    </span>

                    <div className="dashboard-hero-price">
                        Rs{" "}
                        {Number(
                            currentPrice
                        ).toLocaleString()}
                        <span>
                            / litre
                        </span>
                    </div>

                    {data?.currentFuelPrice
                        ?.effectiveDate && (
                        <p>
                            Effective from{" "}
                            {
                                data
                                    .currentFuelPrice
                                    .effectiveDate
                            }
                        </p>
                    )}
                </div>

                <div className="dashboard-hero-icon">
                    ⛽
                </div>
            </section>

            <section className="dashboard-stats">
                <div className="stat-card">
                    <span className="stat-label">
                        TOTAL SPENDING
                    </span>

                    <strong>
                        Rs{" "}
                        {Number(
                            summary.totalSpending ||
                                0
                        ).toLocaleString()}
                    </strong>

                    <span className="stat-description">
                        Fuel expenses
                    </span>
                </div>

                <div className="stat-card">
                    <span className="stat-label">
                        TOTAL FUEL
                    </span>

                    <strong>
                        {Number(
                            summary.totalFuel || 0
                        ).toFixed(1)}{" "}
                        L
                    </strong>

                    <span className="stat-description">
                        Fuel purchased
                    </span>
                </div>

                <div className="stat-card">
                    <span className="stat-label">
                        TOTAL DISTANCE
                    </span>

                    <strong>
                        {Number(
                            summary.totalDistance ||
                                0
                        ).toLocaleString()}{" "}
                        km
                    </strong>

                    <span className="stat-description">
                        Distance tracked
                    </span>
                </div>

                <div className="stat-card">
                    <span className="stat-label">
                        AVERAGE MILEAGE
                    </span>

                    <strong>
                        {Number(
                            summary.averageMileage ||
                                0
                        ).toFixed(2)}{" "}
                        km/L
                    </strong>

                    <span className="stat-description">
                        Overall average
                    </span>
                </div>
            </section>

            <div className="dashboard-grid">
                <section className="dashboard-card">
                    <div className="card-header">
                        <div>
                            <h2>
                                Recent Fuel
                                Entries
                            </h2>

                            <p>
                                Your latest fuel
                                purchases
                            </p>
                        </div>
                    </div>

                    {data?.recentEntries
                        ?.length > 0 ? (
                        <div className="recent-list">
                            {data.recentEntries.map(
                                (entry) => (
                                    <div
                                        className="recent-item"
                                        key={
                                            entry.id
                                        }
                                    >
                                        <div className="recent-item-main">
                                            <strong>
                                                {
                                                    entry.pumpName
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    entry.vehicleName
                                                }

                                                {" • "}

                                                {
                                                    entry.date
                                                }
                                            </span>
                                        </div>

                                        <div className="recent-item-side">
                                            <strong>
                                                Rs{" "}
                                                {Number(
                                                    entry.totalPrice ||
                                                        0
                                                ).toLocaleString()}
                                            </strong>

                                            <span>
                                                {Number(
                                                    entry.litres ||
                                                        0
                                                ).toFixed(
                                                    1
                                                )}{" "}
                                                L
                                            </span>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <div className="empty-state">
                            No fuel entries
                            yet.
                        </div>
                    )}
                </section>

                <section className="dashboard-card">
                    <div className="card-header">
                        <div>
                            <h2>
                                Recent Trips
                            </h2>

                            <p>
                                Your latest
                                journeys
                            </p>
                        </div>
                    </div>

                    {data?.recentTrips
                        ?.length > 0 ? (
                        <div className="recent-list">
                            {data.recentTrips.map(
                                (trip) => (
                                    <div
                                        className="recent-item"
                                        key={
                                            trip.id
                                        }
                                    >
                                        <div className="recent-item-main">
                                            <strong>
                                                {
                                                    trip.name
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    trip.startLocation
                                                }

                                                {" → "}

                                                {
                                                    trip.destination
                                                }
                                            </span>
                                        </div>

                                        <div className="recent-item-side">
                                            <strong>
                                                {
                                                    trip.vehicleName
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    trip.startDate
                                                }
                                            </span>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <div className="empty-state">
                            No trips yet.
                        </div>
                    )}
                </section>
            </div>

            <section className="dashboard-overview">
                <div>
                    <span>
                        Active Vehicles
                    </span>

                    <strong>
                        {summary.activeVehicles ||
                            0}
                    </strong>
                </div>

                <div>
                    <span>
                        Total Trips
                    </span>

                    <strong>
                        {summary.totalTrips ||
                            0}
                    </strong>
                </div>

                <div>
                    <span>
                        Completed Trips
                    </span>

                    <strong>
                        {summary.completedTrips ||
                            0}
                    </strong>
                </div>
            </section>
        </main>
    );
}

export default Dashboard;