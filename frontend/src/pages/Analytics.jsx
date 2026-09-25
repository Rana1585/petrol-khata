
import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";
import { apiFetch } from "../api";

function Analytics() {
    const [data, setData] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [trips, setTrips] = useState([]);

    const [selectedVehicleId, setSelectedVehicleId] =
        useState("");

    const [selectedTripId, setSelectedTripId] =
        useState("");

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadOptions() {
            try {
                const [
                    vehiclesResponse,
                    tripsResponse
                ] = await Promise.all([
                    apiFetch("/vehicles"),
                    apiFetch("/trips")
                ]);

                if (!vehiclesResponse.ok) {
                    throw new Error(
                        "Failed to load vehicles"
                    );
                }

                if (!tripsResponse.ok) {
                    throw new Error(
                        "Failed to load trips"
                    );
                }

                const vehicleData =
                    await vehiclesResponse.json();

                const tripData =
                    await tripsResponse.json();

                setVehicles(
                    (
                        vehicleData.vehicles ||
                        vehicleData ||
                        []
                    ).filter(
                        (vehicle) =>
                            Number(vehicle.active) === 1
                    )
                );

                setTrips(
                    tripData.trips ||
                    tripData ||
                    []
                );
            } catch (err) {
                setError(err.message);
            }
        }

        loadOptions();
    }, []);

    useEffect(() => {
        async function loadAnalytics() {
            try {
                if (data) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                const params =
                    new URLSearchParams();

                if (selectedVehicleId) {
                    params.set(
                        "vehicleId",
                        selectedVehicleId
                    );
                }

                if (selectedTripId) {
                    params.set(
                        "tripId",
                        selectedTripId
                    );
                }

                const queryString =
                    params.toString();

                const endpoint =
                    queryString
                        ? `/analytics?${queryString}`
                        : "/analytics";

                const response =
                    await apiFetch(endpoint);

                if (!response.ok) {
                    const message =
                        await response.text();

                    throw new Error(
                        message ||
                        "Failed to load analytics"
                    );
                }

                const result =
                    await response.json();

                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        }

        loadAnalytics();
    }, [
        selectedVehicleId,
        selectedTripId
    ]);

    useEffect(() => {
        if (
            !selectedTripId ||
            !selectedVehicleId
        ) {
            return;
        }

        const selectedTrip =
            trips.find(
                (trip) =>
                    Number(trip.id) ===
                    Number(selectedTripId)
            );

        if (
            selectedTrip &&
            Number(selectedTrip.vehicleId) !==
                Number(selectedVehicleId)
        ) {
            setSelectedTripId("");
        }
    }, [
        selectedVehicleId,
        selectedTripId,
        trips
    ]);

    const availableTrips =
        selectedVehicleId
            ? trips.filter(
                  (trip) =>
                      Number(trip.vehicleId) ===
                      Number(selectedVehicleId)
              )
            : trips;

    if (loading && !data) {
        return (
            <div className="analytics-page">
                <div className="page-header">
                    <h1>Analytics</h1>

                    <p>
                        Loading your fuel
                        analytics...
                    </p>
                </div>
            </div>
        );
    }

    if (error && !data) {
        return (
            <div className="analytics-page">
                <div className="page-header">
                    <h1>Analytics</h1>

                    <p>
                        Unable to load
                        analytics.
                    </p>
                </div>

                <div
                    className="analytics-card"
                    style={{
                        padding: "24px",
                        color: "#b42318"
                    }}
                >
                    {error}
                </div>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    const summary = data.summary || {};

    const spendingByMonth =
        data.spendingByMonth || [];

    const spendingByVehicle =
        data.spendingByVehicle || [];

    const mileageByVehicle =
        data.mileageByVehicle || [];

    const mileageTrend =
        data.mileageTrend || [];

    const fuelPriceHistory =
        data.fuelPriceHistory || [];

    const tripAnalytics =
        data.tripAnalytics || [];

    function formatNumber(
        value,
        decimals = 2
    ) {
        if (
            value === null ||
            value === undefined ||
            Number.isNaN(Number(value))
        ) {
            return "—";
        }

        return Number(value).toLocaleString(
            undefined,
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: decimals
            }
        );
    }

    function formatMoney(value) {
        if (
            value === null ||
            value === undefined
        ) {
            return "Rs 0";
        }

        return `Rs ${Number(
            value
        ).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        })}`;
    }

    function formatMileage(value) {
        if (
            value === null ||
            value === undefined
        ) {
            return "—";
        }

        return `${formatNumber(value)} km/L`;
    }

    const selectedVehicle =
        vehicles.find(
            (vehicle) =>
                Number(vehicle.id) ===
                Number(selectedVehicleId)
        );

    const selectedTrip =
        trips.find(
            (trip) =>
                Number(trip.id) ===
                Number(selectedTripId)
        );

    return (
        <div className="analytics-page">

            {/* HEADER */}

            <div
                className="page-header"
                style={{
                    marginBottom: "24px"
                }}
            >
                <div>
                    <h1>Analytics</h1>

                    <p>
                        Understand your fuel
                        spending, mileage and
                        vehicle performance.
                    </p>
                </div>

                {refreshing && (
                    <span
                        style={{
                            fontSize: "13px",
                            opacity: 0.65
                        }}
                    >
                        Updating...
                    </span>
                )}
            </div>

            {/* FILTERS */}

            <div
                className="analytics-card"
                style={{
                    padding: "20px",
                    marginBottom: "24px"
                }}
            >
                <div className="analytics-filter-layout">
                    <div>
                        <h3
                            style={{
                                margin: 0,
                                marginBottom: "5px"
                            }}
                        >
                            Analyse your data
                        </h3>

                        <p
                            style={{
                                margin: 0,
                                fontSize: "14px",
                                opacity: 0.65
                            }}
                        >
                            Choose a vehicle or a
                            specific trip.
                        </p>
                    </div>

                    <div className="analytics-filter-controls">
                        <select
                            value={
                                selectedVehicleId
                            }
                            onChange={(event) =>
                                setSelectedVehicleId(
                                    event.target.value
                                )
                            }
                            className="analytics-select"
                        >
                            <option value="">
                                All Vehicles
                            </option>

                            {vehicles.map(
                                (vehicle) => (
                                    <option
                                        key={
                                            vehicle.id
                                        }
                                        value={
                                            vehicle.id
                                        }
                                    >
                                        {vehicle.name}

                                        {vehicle.registration
                                            ? ` — ${vehicle.registration}`
                                            : ""}
                                    </option>
                                )
                            )}
                        </select>

                        <select
                            value={
                                selectedTripId
                            }
                            onChange={(event) =>
                                setSelectedTripId(
                                    event.target.value
                                )
                            }
                            className="analytics-select analytics-trip-select"
                        >
                            <option value="">
                                All Trips
                            </option>

                            {availableTrips.map(
                                (trip) => (
                                    <option
                                        key={
                                            trip.id
                                        }
                                        value={
                                            trip.id
                                        }
                                    >
                                        {trip.name} —{" "}
                                        {
                                            trip.startLocation
                                        }{" "}
                                        →{" "}
                                        {
                                            trip.destination
                                        }
                                    </option>
                                )
                            )}
                        </select>

                        {(selectedVehicleId ||
                            selectedTripId) && (
                            <button
                                onClick={() => {
                                    setSelectedVehicleId(
                                        ""
                                    );
                                    setSelectedTripId(
                                        ""
                                    );
                                }}
                                className="analytics-clear-button"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {(selectedVehicle ||
                    selectedTrip) && (
                    <div className="analytics-filter-summary">
                        Showing analytics for{" "}

                        {selectedVehicle && (
                            <strong>
                                {
                                    selectedVehicle.name
                                }
                            </strong>
                        )}

                        {selectedVehicle &&
                            selectedTrip &&
                            " · "}

                        {selectedTrip && (
                            <strong>
                                {selectedTrip.name}
                            </strong>
                        )}
                    </div>
                )}
            </div>

            {/* OVERVIEW */}

            <section
                style={{
                    marginBottom: "32px"
                }}
            >
                <div
                    style={{
                        marginBottom: "14px"
                    }}
                >
                    <h2 style={{ margin: 0 }}>
                        Overview
                    </h2>

                    <p
                        style={{
                            margin: "5px 0 0",
                            opacity: 0.65,
                            fontSize: "14px"
                        }}
                    >
                        Your most important fuel
                        numbers at a glance.
                    </p>
                </div>

                <div className="dashboard-stats">
                    <div className="stat-card">
                        <span>
                            Total Spending
                        </span>

                        <strong>
                            {formatMoney(
                                summary.totalSpending
                            )}
                        </strong>
                    </div>

                    <div className="stat-card">
                        <span>Fuel Used</span>

                        <strong>
                            {formatNumber(
                                summary.totalFuel
                            )}{" "}
                            L
                        </strong>
                    </div>

                    <div className="stat-card">
                        <span>Distance</span>

                        <strong>
                            {formatNumber(
                                summary.totalDistance
                            )}{" "}
                            km
                        </strong>
                    </div>

                    <div className="stat-card">
                        <span>
                            Average Mileage
                        </span>

                        <strong>
                            {formatMileage(
                                summary.averageMileage
                            )}
                        </strong>
                    </div>
                </div>
            </section>

            {/* SPENDING */}

            <section
                style={{
                    marginBottom: "32px"
                }}
            >
                <div
                    style={{
                        marginBottom: "14px"
                    }}
                >
                    <h2 style={{ margin: 0 }}>
                        Fuel Spending
                    </h2>

                    <p
                        style={{
                            margin: "5px 0 0",
                            opacity: 0.65,
                            fontSize: "14px"
                        }}
                    >
                        See where your fuel money
                        is going over time.
                    </p>
                </div>

                <div className="analytics-grid">

                    <div className="analytics-card">
                        <div
                            style={{
                                padding:
                                    "20px 20px 0"
                            }}
                        >
                            <h3>
                                Monthly Spending
                            </h3>

                            <p
                                style={{
                                    opacity: 0.6,
                                    fontSize: "13px"
                                }}
                            >
                                Fuel expenditure by
                                month
                            </p>
                        </div>

                        <div className="chart-container">
                            {spendingByMonth.length >
                            0 ? (
                                <ResponsiveContainer
                                    width="100%"
                                    height={300}
                                >
                                    <BarChart
                                        data={
                                            spendingByMonth
                                        }
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                        />

                                        <XAxis
                                            dataKey="month"
                                        />

                                        <YAxis />

                                        <Tooltip
                                            formatter={(
                                                value
                                            ) =>
                                                formatMoney(
                                                    value
                                                )
                                            }
                                        />

                                        <Bar
                                            dataKey="spending"
                                            name="Spending"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <EmptyState />
                            )}
                        </div>
                    </div>

                    <div className="analytics-card">
                        <div
                            style={{
                                padding:
                                    "20px 20px 0"
                            }}
                        >
                            <h3>
                                Spending by Vehicle
                            </h3>

                            <p
                                style={{
                                    opacity: 0.6,
                                    fontSize: "13px"
                                }}
                            >
                                Compare fuel costs
                                between vehicles
                            </p>
                        </div>

                        <div className="chart-container">
                            {spendingByVehicle.length >
                            0 ? (
                                <ResponsiveContainer
                                    width="100%"
                                    height={300}
                                >
                                    <BarChart
                                        data={
                                            spendingByVehicle
                                        }
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                        />

                                        <XAxis
                                            dataKey="vehicleName"
                                        />

                                        <YAxis />

                                        <Tooltip
                                            formatter={(
                                                value
                                            ) =>
                                                formatMoney(
                                                    value
                                                )
                                            }
                                        />

                                        <Bar
                                            dataKey="spending"
                                            name="Spending"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <EmptyState />
                            )}
                        </div>
                    </div>

                </div>
            </section>

            {/* MILEAGE */}

            <section
                style={{
                    marginBottom: "32px"
                }}
            >
                <div
                    style={{
                        marginBottom: "14px"
                    }}
                >
                    <h2 style={{ margin: 0 }}>
                        Mileage & Efficiency
                    </h2>

                    <p
                        style={{
                            margin: "5px 0 0",
                            opacity: 0.65,
                            fontSize: "14px"
                        }}
                    >
                        Track how efficiently your
                        vehicles are using fuel.
                    </p>
                </div>

                <div className="analytics-card">
                    <div
                        style={{
                            padding:
                                "20px 20px 0"
                        }}
                    >
                        <h3>
                            Mileage Trend
                        </h3>

                        <p
                            style={{
                                opacity: 0.6,
                                fontSize: "13px"
                            }}
                        >
                            Fuel efficiency across
                            your entries
                        </p>
                    </div>

                    <div className="chart-container">
                        {mileageTrend.length >
                        0 ? (
                            <ResponsiveContainer
                                width="100%"
                                height={320}
                            >
                                <LineChart
                                    data={
                                        mileageTrend
                                    }
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="date"
                                    />

                                    <YAxis />

                                    <Tooltip
                                        formatter={(
                                            value
                                        ) =>
                                            `${formatNumber(
                                                value
                                            )} km/L`
                                        }
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="mileage"
                                        name="Mileage"
                                        strokeWidth={2}
                                        dot={{
                                            r: 3
                                        }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState />
                        )}
                    </div>
                </div>

                {/* VEHICLE EFFICIENCY */}

                <div
                    className="analytics-card vehicle-efficiency-card"
                    style={{
                        marginTop: "20px"
                    }}
                >
                    <div className="analytics-card-heading">
                        <div>
                            <h3>
                                Vehicle Efficiency
                            </h3>

                            <p>
                                Compare the fuel
                                efficiency of each
                                vehicle.
                            </p>
                        </div>
                    </div>

                    {mileageByVehicle.length >
                    0 ? (
                        <div className="vehicle-efficiency-grid">
                            {mileageByVehicle.map(
                                (vehicle) => {
                                    const average =
                                        Number(
                                            vehicle.averageMileage
                                        ) || 0;

                                    const best =
                                        Number(
                                            vehicle.bestMileage
                                        ) || 0;

                                    const worst =
                                        Number(
                                            vehicle.worstMileage
                                        ) || 0;

                                    const maxMileage =
                                        Math.max(
                                            best,
                                            average,
                                            1
                                        );

                                    const averageWidth =
                                        Math.min(
                                            (average /
                                                maxMileage) *
                                                100,
                                            100
                                        );

                                    return (
                                        <div
                                            className="vehicle-efficiency-item"
                                            key={
                                                vehicle.vehicleId
                                            }
                                        >
                                            <div className="vehicle-efficiency-top">
                                                <div>
                                                    <h4>
                                                        {
                                                            vehicle.vehicleName
                                                        }
                                                    </h4>

                                                    {vehicle.vehicleRegistration && (
                                                        <span>
                                                            {
                                                                vehicle.vehicleRegistration
                                                            }
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="vehicle-average">
                                                    <strong>
                                                        {formatNumber(
                                                            average
                                                        )}
                                                    </strong>

                                                    <small>
                                                        km/L
                                                    </small>
                                                </div>
                                            </div>

                                            <div className="vehicle-efficiency-label">
                                                <span>
                                                    Average
                                                    efficiency
                                                </span>

                                                <span>
                                                    {formatMileage(
                                                        average
                                                    )}
                                                </span>
                                            </div>

                                            <div className="vehicle-efficiency-bar">
                                                <div
                                                    className="vehicle-efficiency-bar-fill"
                                                    style={{
                                                        width: `${averageWidth}%`
                                                    }}
                                                />
                                            </div>

                                            <div className="vehicle-efficiency-comparison">
                                                <div>
                                                    <span>
                                                        Best
                                                    </span>

                                                    <strong>
                                                        {formatMileage(
                                                            best
                                                        )}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>
                                                        Lowest
                                                    </span>

                                                    <strong>
                                                        {formatMileage(
                                                            worst
                                                        )}
                                                    </strong>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    ) : (
                        <div className="analytics-empty-panel">
                            No mileage data
                            available.
                        </div>
                    )}
                </div>
            </section>

            {/* TRIP PERFORMANCE */}

            <section
                style={{
                    marginBottom: "32px"
                }}
            >
                <div
                    style={{
                        marginBottom: "14px"
                    }}
                >
                    <h2 style={{ margin: 0 }}>
                        Trip Performance
                    </h2>

                    <p
                        style={{
                            margin: "5px 0 0",
                            opacity: 0.65,
                            fontSize: "14px"
                        }}
                    >
                        Compare the distance,
                        fuel and cost of your
                        trips.
                    </p>
                </div>

                <div className="analytics-card trip-performance-card">
                    {tripAnalytics.length >
                    0 ? (
                        <div className="trip-performance-list">
                            {tripAnalytics.map(
                                (trip) => (
                                    <div
                                        className="trip-performance-item"
                                        key={
                                            trip.id
                                        }
                                    >
                                        <div className="trip-performance-main">
                                            <div className="trip-performance-title">
                                                <h3>
                                                    {
                                                        trip.name
                                                    }
                                                </h3>

                                                <span>
                                                    {
                                                        trip.startLocation
                                                    }{" "}
                                                    <span className="trip-arrow">
                                                        →
                                                    </span>{" "}
                                                    {
                                                        trip.destination
                                                    }
                                                </span>
                                            </div>

                                            <div className="trip-performance-mileage">
                                                <span>
                                                    Mileage
                                                </span>

                                                <strong>
                                                    {formatMileage(
                                                        trip.mileage
                                                    )}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="trip-performance-metrics">
                                            <div className="trip-metric">
                                                <span>
                                                    Distance
                                                </span>

                                                <strong>
                                                    {formatNumber(
                                                        trip.distance
                                                    )}{" "}
                                                    km
                                                </strong>
                                            </div>

                                            <div className="trip-metric">
                                                <span>
                                                    Fuel
                                                </span>

                                                <strong>
                                                    {formatNumber(
                                                        trip.totalFuel
                                                    )}{" "}
                                                    L
                                                </strong>
                                            </div>

                                            <div className="trip-metric">
                                                <span>
                                                    Cost
                                                </span>

                                                <strong>
                                                    {formatMoney(
                                                        trip.totalCost
                                                    )}
                                                </strong>
                                            </div>

                                            <div className="trip-metric trip-metric-highlight">
                                                <span>
                                                    Cost / km
                                                </span>

                                                <strong>
                                                    {trip.distance >
                                                    0
                                                        ? formatMoney(
                                                              Number(
                                                                  trip.totalCost
                                                              ) /
                                                                  Number(
                                                                      trip.distance
                                                                  )
                                                          )
                                                        : "—"}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <div className="analytics-empty-panel">
                            No trip data
                            available.
                        </div>
                    )}
                </div>
            </section>

            {/* FUEL PRICE */}

            <section
                style={{
                    marginBottom: "32px"
                }}
            >
                <div
                    style={{
                        marginBottom: "14px"
                    }}
                >
                    <h2 style={{ margin: 0 }}>
                        Fuel Price History
                    </h2>

                    <p
                        style={{
                            margin: "5px 0 0",
                            opacity: 0.65,
                            fontSize: "14px"
                        }}
                    >
                        Track how petrol prices
                        have changed over time.
                    </p>
                </div>

                <div className="analytics-card">
                    <div className="chart-container">
                        {fuelPriceHistory.length >
                        0 ? (
                            <ResponsiveContainer
                                width="100%"
                                height={320}
                            >
                                <LineChart
                                    data={
                                        fuelPriceHistory
                                    }
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="effectiveDate"
                                    />

                                    <YAxis />

                                    <Tooltip
                                        formatter={(
                                            value
                                        ) =>
                                            `Rs ${formatNumber(
                                                value
                                            )}`
                                        }
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="price"
                                        name="Petrol Price"
                                        strokeWidth={2}
                                        dot={{
                                            r: 3
                                        }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState />
                        )}
                    </div>
                </div>
            </section>

            {/* QUICK INSIGHTS */}

            <section>
                <div
                    style={{
                        marginBottom: "14px"
                    }}
                >
                    <h2 style={{ margin: 0 }}>
                        Quick Insights
                    </h2>

                    <p
                        style={{
                            margin: "5px 0 0",
                            opacity: 0.65,
                            fontSize: "14px"
                        }}
                    >
                        A quick summary of the
                        selected data.
                    </p>
                </div>

                <div className="dashboard-stats">
                    <div className="stat-card">
                        <span>
                            Fuel Entries
                        </span>

                        <strong>
                            {formatNumber(
                                summary.totalEntries,
                                0
                            )}
                        </strong>
                    </div>

                    <div className="stat-card">
                        <span>
                            Average Fuel Cost
                        </span>

                        <strong>
                            {summary.averageFuelCost !==
                                null &&
                            summary.averageFuelCost !==
                                undefined
                                ? formatMoney(
                                      summary.averageFuelCost
                                  )
                                : "—"}

                            <small
                                style={{
                                    fontSize: "12px",
                                    fontWeight:
                                        "normal",
                                    marginLeft: "4px"
                                }}
                            >
                                / L
                            </small>
                        </strong>
                    </div>

                    <div className="stat-card">
                        <span>
                            Best Mileage
                        </span>

                        <strong>
                            {formatMileage(
                                summary.bestMileage
                            )}
                        </strong>
                    </div>

                    <div className="stat-card">
                        <span>
                            Lowest Mileage
                        </span>

                        <strong>
                            {formatMileage(
                                summary.worstMileage
                            )}
                        </strong>
                    </div>
                </div>
            </section>
        </div>
    );
}

function EmptyState() {
    return (
        <div
            style={{
                height: "280px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.55,
                fontSize: "14px"
            }}
        >
            No data available for this
            selection.
        </div>
    );
}

export default Analytics;
