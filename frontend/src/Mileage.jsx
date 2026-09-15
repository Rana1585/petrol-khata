function Mileage({ entries, analytics }) {
    const validMileageEntries = entries.filter(
        (entry) => entry.mileage !== null
    );

    const lastEntry =
        validMileageEntries[validMileageEntries.length - 1];

    return (
        <section className="mileage-section">
            <div className="section-header">
                <div>
                    <h2>Mileage Before Refill</h2>
                    <p>Track your vehicle's fuel efficiency</p>
                </div>
            </div>

            <div className="mileage-cards">

                <div className="mileage-card">
                    <p>Last Mileage</p>
                    <h3>
                        {lastEntry
                            ? `${Number(lastEntry.mileage).toFixed(2)} km/L`
                            : "—"}
                    </h3>
                </div>

                <div className="mileage-card">
                    <p>Average Mileage</p>
                    <h3>
                        {analytics.averageMileage !== null
                            ? `${Number(
                                  analytics.averageMileage
                              ).toFixed(2)} km/L`
                            : "—"}
                    </h3>
                </div>

                <div className="mileage-card">
                    <p>Best Mileage</p>
                    <h3>
                        {analytics.bestMileage !== null
                            ? `${Number(
                                  analytics.bestMileage
                              ).toFixed(2)} km/L`
                            : "—"}
                    </h3>
                </div>

                <div className="mileage-card">
                    <p>Distance Since Last Refill</p>
                    <h3>
                        {lastEntry
                            ? `${lastEntry.distance} km`
                            : "—"}
                    </h3>
                </div>

            </div>
        </section>
    );
}

export default Mileage;