import { useEffect, useState } from "react";
import {
BarChart,
Bar,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
ResponsiveContainer
} from "recharts";

function PumpCarStats() {
const [entries, setEntries] = useState([]);


const [selectedCar, setSelectedCar] = useState("all");
const [selectedPump, setSelectedPump] = useState("all");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");

useEffect(() => {
    fetch("http://192.168.18.72:5000/entries")
        .then((response) => response.json())
        .then((data) => {
            setEntries(data.entries || []);
        })
        .catch((error) => {
            console.error(
                "Failed to fetch entries:",
                error
            );
        });
}, []);

const cars = [
    ...new Set(
        entries
            .map((entry) => entry.carName)
            .filter(Boolean)
    )
];

const pumps = [
    ...new Set(
        entries
            .map((entry) => entry.pumpName)
            .filter(Boolean)
    )
];

const filteredEntries = entries.filter((entry) => {
    if (
        selectedCar !== "all" &&
        entry.carName !== selectedCar
    ) {
        return false;
    }

    if (
        selectedPump !== "all" &&
        entry.pumpName !== selectedPump
    ) {
        return false;
    }

    if (startDate && entry.date < startDate) {
        return false;
    }

    if (endDate && entry.date > endDate) {
        return false;
    }

    return true;
});

const pumpStats = {};

filteredEntries.forEach((entry) => {
    const pump = entry.pumpName;

    if (!pumpStats[pump]) {
        pumpStats[pump] = {
            visits: 0,
            spending: 0,
            litres: 0,
            prices: []
        };
    }

    pumpStats[pump].visits += 1;
    pumpStats[pump].spending += Number(
        entry.totalPrice
    );
    pumpStats[pump].litres += Number(
        entry.litres
    );
    pumpStats[pump].prices.push(
        Number(entry.price)
    );
});

const carStats = {};

filteredEntries.forEach((entry) => {
    const car = entry.carName;

    if (!carStats[car]) {
        carStats[car] = {
            refills: 0,
            spending: 0,
            litres: 0,
            distance: 0,
            mileage: []
        };
    }

    carStats[car].refills += 1;
    carStats[car].spending += Number(
        entry.totalPrice
    );
    carStats[car].litres += Number(
        entry.litres
    );

    if (entry.distance !== null) {
        carStats[car].distance += Number(
            entry.distance
        );
    }

    if (entry.mileage !== null) {
        carStats[car].mileage.push(
            Number(entry.mileage)
        );
    }
});

const pumpChartData = Object.entries(
    pumpStats
).map(([pump, stats]) => ({
    pump,
    spending: stats.spending,
    litres: stats.litres
}));

const carChartData = Object.entries(
    carStats
).map(([car, stats]) => {
    const averageMileage =
        stats.mileage.length > 0
            ? stats.mileage.reduce(
                  (total, mileage) =>
                      total + mileage,
                  0
              ) / stats.mileage.length
            : 0;

    return {
        car,
        mileage: averageMileage
    };
});

function resetFilters() {
    setSelectedCar("all");
    setSelectedPump("all");
    setStartDate("");
    setEndDate("");
}

const hasActiveFilters =
    selectedCar !== "all" ||
    selectedPump !== "all" ||
    startDate ||
    endDate;

return (
    <main className="stats-page">

        <div className="page-header">
            <h1>Pump & Car Stats</h1>

            <p>
                Track your fuel spending and vehicle
                performance.
            </p>
        </div>

        <section className="stats-filters">

            <div className="filter-group">
                <label htmlFor="car-filter">
                    Car
                </label>

                <select
                    id="car-filter"
                    value={selectedCar}
                    onChange={(event) =>
                        setSelectedCar(
                            event.target.value
                        )
                    }
                >
                    <option value="all">
                        All Cars
                    </option>

                    {cars.map((car) => (
                        <option
                            key={car}
                            value={car}
                        >
                            {car}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="pump-filter">
                    Petrol Pump
                </label>

                <select
                    id="pump-filter"
                    value={selectedPump}
                    onChange={(event) =>
                        setSelectedPump(
                            event.target.value
                        )
                    }
                >
                    <option value="all">
                        All Pumps
                    </option>

                    {pumps.map((pump) => (
                        <option
                            key={pump}
                            value={pump}
                        >
                            {pump}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="start-date">
                    From
                </label>

                <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(event) =>
                        setStartDate(
                            event.target.value
                        )
                    }
                />
            </div>

            <div className="filter-group">
                <label htmlFor="end-date">
                    To
                </label>

                <input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(event) =>
                        setEndDate(
                            event.target.value
                        )
                    }
                />
            </div>

            <button
                className="reset-filters-button"
                onClick={resetFilters}
                disabled={!hasActiveFilters}
            >
                Reset
            </button>

        </section>

        <section className="charts-section">

            <div className="chart-card">
                <h2>Spending by Petrol Pump</h2>

                <ResponsiveContainer
                    width="100%"
                    height={300}
                >
                    <BarChart data={pumpChartData}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="pump" />

                        <YAxis />

                        <Tooltip
                            formatter={(value) =>
                                `Rs ${Number(
                                    value
                                ).toFixed(2)}`
                            }
                        />

                        <Bar
                            dataKey="spending"
                            name="Spending"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="chart-card">
                <h2>
                    Fuel Consumption by Petrol Pump
                </h2>

                <ResponsiveContainer
                    width="100%"
                    height={300}
                >
                    <BarChart data={pumpChartData}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="pump" />

                        <YAxis />

                        <Tooltip
                            formatter={(value) =>
                                `${Number(
                                    value
                                ).toFixed(2)} L`
                            }
                        />

                        <Bar
                            dataKey="litres"
                            name="Fuel"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="chart-card chart-full-width">
                <h2>Mileage by Car</h2>

                <ResponsiveContainer
                    width="100%"
                    height={300}
                >
                    <BarChart data={carChartData}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="car" />

                        <YAxis />

                        <Tooltip
                            formatter={(value) =>
                                `${Number(
                                    value
                                ).toFixed(2)} km/L`
                            }
                        />

                        <Bar
                            dataKey="mileage"
                            name="Mileage"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </section>

        <section className="stats-section">

            <div className="section-header">
                <div>
                    <h2>Petrol Pump Statistics</h2>

                    <p>
                        Compare your fuel spending
                        across different petrol
                        pumps.
                    </p>
                </div>
            </div>

            <div className="stats-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Petrol Pump</th>
                            <th>Visits</th>
                            <th>Total Spending</th>
                            <th>Total Litres</th>
                            <th>Average Price/L</th>
                            <th>
                                Average Litres/Refill
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {Object.entries(
                            pumpStats
                        ).map(
                            ([pump, stats]) => {
                                const averagePrice =
                                    stats.prices.length >
                                    0
                                        ? stats.prices.reduce(
                                              (
                                                  total,
                                                  price
                                              ) =>
                                                  total +
                                                  price,
                                              0
                                          ) /
                                          stats
                                              .prices
                                              .length
                                        : 0;

                                const averageLitres =
                                    stats.visits > 0
                                        ? stats.litres /
                                          stats.visits
                                        : 0;

                                return (
                                    <tr key={pump}>
                                        <td>
                                            {pump}
                                        </td>

                                        <td>
                                            {stats.visits}
                                        </td>

                                        <td>
                                            Rs{" "}
                                            {stats.spending.toFixed(
                                                2
                                            )}
                                        </td>

                                        <td>
                                            {stats.litres.toFixed(
                                                2
                                            )}{" "}
                                            L
                                        </td>

                                        <td>
                                            Rs{" "}
                                            {averagePrice.toFixed(
                                                2
                                            )}
                                        </td>

                                        <td>
                                            {averageLitres.toFixed(
                                                2
                                            )}{" "}
                                            L
                                        </td>
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </table>
            </div>

        </section>

        <section className="stats-section">

            <div className="section-header">
                <div>
                    <h2>Car Statistics</h2>

                    <p>
                        Compare fuel usage and mileage
                        across your cars.
                    </p>
                </div>
            </div>

            <div className="stats-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Car</th>
                            <th>Refills</th>
                            <th>Total Spending</th>
                            <th>Total Fuel</th>
                            <th>Total Distance</th>
                            <th>Average Mileage</th>
                            <th>Best Mileage</th>
                            <th>Worst Mileage</th>
                        </tr>
                    </thead>

                    <tbody>
                        {Object.entries(
                            carStats
                        ).map(([car, stats]) => {
                            const averageMileage =
                                stats.mileage.length >
                                0
                                    ? stats.mileage.reduce(
                                          (
                                              total,
                                              mileage
                                          ) =>
                                              total +
                                              mileage,
                                          0
                                      ) /
                                      stats.mileage
                                          .length
                                    : null;

                            const bestMileage =
                                stats.mileage.length >
                                0
                                    ? Math.max(
                                          ...stats.mileage
                                      )
                                    : null;

                            const worstMileage =
                                stats.mileage.length >
                                0
                                    ? Math.min(
                                          ...stats.mileage
                                      )
                                    : null;

                            return (
                                <tr key={car}>
                                    <td>{car}</td>

                                    <td>
                                        {stats.refills}
                                    </td>

                                    <td>
                                        Rs{" "}
                                        {stats.spending.toFixed(
                                            2
                                        )}
                                    </td>

                                    <td>
                                        {stats.litres.toFixed(
                                            2
                                        )}{" "}
                                        L
                                    </td>

                                    <td>
                                        {stats.distance.toFixed(
                                            2
                                        )}{" "}
                                        km
                                    </td>

                                    <td>
                                        {averageMileage !==
                                        null
                                            ? `${averageMileage.toFixed(
                                                  2
                                              )} km/L`
                                            : "—"}
                                    </td>

                                    <td>
                                        {bestMileage !==
                                        null
                                            ? `${bestMileage.toFixed(
                                                  2
                                              )} km/L`
                                            : "—"}
                                    </td>

                                    <td>
                                        {worstMileage !==
                                        null
                                            ? `${worstMileage.toFixed(
                                                  2
                                              )} km/L`
                                            : "—"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

        </section>

    </main>
);


}

export default PumpCarStats;
