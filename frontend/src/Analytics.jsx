import { useEffect, useState } from "react";

function Analytics() {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/entries")
            .then((response) => response.json())
            .then((data) => {
                setEntries(data.entries || []);
            })
            .catch((error) => {
                console.error("Failed to fetch analytics:", error);
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

    const totalDistance = entries.reduce(
        (total, entry) =>
            total +
            (entry.distance !== null ? Number(entry.distance) : 0),
        0
    );

    const averageSpending =
        entries.length > 0 ? totalSpending / entries.length : 0;

    const averageLitres =
        entries.length > 0 ? totalFuel / entries.length : 0;

    const highestRefill =
        entries.length > 0
            ? Math.max(
                  ...entries.map((entry) => Number(entry.totalPrice))
              )
            : 0;

    const highestLitres =
        entries.length > 0
            ? Math.max(
                  ...entries.map((entry) => Number(entry.litres))
              )
            : 0;

    const mileageEntries = entries.filter(
        (entry) => entry.mileage !== null
    );

    const averageMileage =
        mileageEntries.length > 0
            ? mileageEntries.reduce(
                  (total, entry) => total + Number(entry.mileage),
                  0
              ) / mileageEntries.length
            : null;

    const bestMileage =
        mileageEntries.length > 0
            ? Math.max(
                  ...mileageEntries.map(
                      (entry) => Number(entry.mileage)
                  )
              )
            : null;

    const worstMileage =
        mileageEntries.length > 0
            ? Math.min(
                  ...mileageEntries.map(
                      (entry) => Number(entry.mileage)
                  )
              )
            : null;

    return (
        <main className="analytics-page">

            <div className="dashboard-header">
                <div>
                    <h1>Analytics</h1>
                    <p>
                        Analyze your fuel spending, consumption,
                        and mileage
                    </p>
                </div>
            </div>

            <section className="analytics-section">

                <h2>Spending Overview</h2>

                <div className="analytics-cards">

                    <div className="analytics-card">
                        <p>Total Spending</p>
                        <h3>
                            Rs {totalSpending.toLocaleString()}
                        </h3>
                    </div>

                    <div className="analytics-card">
                        <p>Average Per Refill</p>
                        <h3>
                            Rs {averageSpending.toFixed(0)}
                        </h3>
                    </div>

                    <div className="analytics-card">
                        <p>Highest Refill</p>
                        <h3>
                            Rs {highestRefill.toLocaleString()}
                        </h3>
                    </div>

                </div>

            </section>

            <section className="analytics-section">

                <h2>Fuel Consumption</h2>

                <div className="analytics-cards four-cards">

                    <div className="analytics-card">
                        <p>Total Fuel</p>
                        <h3>
                            {totalFuel.toFixed(2)} L
                        </h3>
                    </div>

                    <div className="analytics-card">
                        <p>Average Per Refill</p>
                        <h3>
                            {averageLitres.toFixed(2)} L
                        </h3>
                    </div>

                    <div className="analytics-card">
                        <p>Highest Refill</p>
                        <h3>
                            {highestLitres.toFixed(2)} L
                        </h3>
                    </div>

                    <div className="analytics-card">
                        <p>Total Distance</p>
                        <h3>
                            {totalDistance.toLocaleString()} km
                        </h3>
                    </div>

                </div>

            </section>

            <section className="analytics-section">

                <h2>Mileage</h2>

                <div className="analytics-cards">

                    <div className="analytics-card">
                        <p>Average Mileage</p>
                        <h3>
                            {averageMileage !== null
                                ? averageMileage.toFixed(2) + " km/L"
                                : "—"}
                        </h3>
                    </div>

                    <div className="analytics-card">
                        <p>Best Mileage</p>
                        <h3>
                            {bestMileage !== null
                                ? bestMileage.toFixed(2) + " km/L"
                                : "—"}
                        </h3>
                    </div>

                    <div className="analytics-card">
                        <p>Worst Mileage</p>
                        <h3>
                            {worstMileage !== null
                                ? worstMileage.toFixed(2) + " km/L"
                                : "—"}
                        </h3>
                    </div>

                </div>

            </section>

        </main>
    );
}

export default Analytics;
