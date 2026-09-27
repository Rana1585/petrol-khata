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

function Analytics() {
    const [data, setData] = useState(null);

    const [vehicles, setVehicles] =
        useState([]);

    const [trips, setTrips] =
        useState([]);

    const [selectedVehicleId, setSelectedVehicleId] =
        useState("");

    const [selectedTripId, setSelectedTripId] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    /* =========================
       LOAD VEHICLES + TRIPS
    ========================= */

    useEffect(() => {
        async function loadOptions() {
            try {
                const [
                    vehiclesResponse,
                    tripsResponse
                ] = await Promise.all([
                    fetch(
                        "https://petrol-khata.onrender.com/vehicles"
                    ),
                    fetch(
                        "https://petrol-khata.onrender.com/trips"
                    )
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
                    vehicleData.filter(
                        (vehicle) =>
                            Number(
                                vehicle.active
                            ) === 1
                    )
                );

                setTrips(tripData);
            } catch (error) {
                setError(error.message);
            }
        }

        loadOptions();
    }, []);

    /* =========================
       LOAD ANALYTICS
    ========================= */

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

                const query =
                    params.toString();

                const url = query
                    ? `https://petrol-khata.onrender.com/analytics?${query}`
                    : "https://petrol-khata.onrender.com/analytics";

                const response =
                    await fetch(url);

                if (!response.ok) {
                    const errorText =
                        await response.text();

                    let message =
                        "Failed to load analytics";

                    try {
                        const parsed =
                            JSON.parse(
                                errorText
                            );

                        if (parsed.error) {
                            message =
                                parsed.error;
                        }
                    } catch {
                        if (errorText) {
                            message =
                                errorText;
                        }
                    }

                    throw new Error(
                        message
                    );
                }

                const result =
                    await response.json();

                setData(result);
            } catch (error) {
                setError(error.message);
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

    /* =========================
       RESET INVALID TRIP
    ========================= */

    useEffect(() => {
        if (
            !selectedVehicleId ||
            !selectedTripId
        ) {
            return;
        }

        const trip = trips.find(
            (item) =>
                Number(item.id) ===
                Number(selectedTripId)
        );

        if (
            trip &&
            Number(trip.vehicleId) !==
                Number(selectedVehicleId)
        ) {
            setSelectedTripId("");
        }
    }, [
        selectedVehicleId,
        selectedTripId,
        trips
    ]);

    /* =========================
       AVAILABLE TRIPS
    ========================= */

    const availableTrips =
        selectedVehicleId
            ? trips.filter(
                  (trip) =>
                      Number(
                          trip.vehicleId
                      ) ===
                      Number(
                          selectedVehicleId
                      )
              )
            : trips;

    /* =========================
       LOADING
    ========================= */

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

    /* =========================
       ERROR
    ========================= */

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

    const summary =
        data.summary || {};

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

    /* =========================
       FORMATTING
    ========================= */

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
                maximumFractionDigits:
                    decimals
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

        return `${formatNumber(
            value
        )} km/L`;
    }

    /* =========================
       SELECTED FILTERS
    ========================= */

    const selectedVehicle =
        vehicles.find(
            (vehicle) =>
                Number(vehicle.id) ===
                Number(
                    selectedVehicleId
                )
        );

    const selectedTrip =
        trips.find(
            (trip) =>
                Number(trip.id) ===
                Number(selectedTripId)
        );

    return (
        <div className="analytics-page">

            {/* =========================
                HEADER
            ========================= */}

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

            {/* =========================
                FILTERS
            ========================= */}

            <div
                className="analytics-card"
                style={{
                    padding: "20px",
                    marginBottom: "28px"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        gap: "20px",
                        flexWrap: "wrap"
                    }}
                >
                    <div>
                        <h3
                            style={{
                                margin: 0,
                                marginBottom:
                                    "5px"
                            }}
                        >
                            Analyse your data
                        </h3>

                        <p
                            style={{
                                margin: 0,
                                fontSize:
                                    "14px",
                                opacity: 0.65
                            }}
                        >
                            Choose a vehicle
                            or a specific
                            trip.
                        </p>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            flexWrap:
                                "wrap"
                        }}
                    >
                        <select
                            value={
                                selectedVehicleId
                            }
                            onChange={(
                                event
                            ) =>
                                setSelectedVehicleId(
                                    event
                                        .target
                                        .value
                                )
                            }
                            style={{
                                minWidth:
                                    "190px",
                                padding:
                                    "10px 12px",
                                borderRadius:
                                    "8px",
                                border:
                                    "1px solid #d0d5dd",
                                background:
                                    "#fff"
                            }}
                        >
                            <option value="">
                                All Vehicles
                            </option>

                            {vehicles.map(
                                (
                                    vehicle
                                ) => (
                                    <option
                                        key={
                                            vehicle.id
                                        }
                                        value={
                                            vehicle.id
                                        }
                                    >
                                        {
                                            vehicle.name
                                        }

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
                            onChange={(
                                event
                            ) =>
                                setSelectedTripId(
                                    event
                                        .target
                                        .value
                                )
                            }
                            style={{
                                minWidth:
                                    "220px",
                                padding:
                                    "10px 12px",
                                borderRadius:
                                    "8px",
                                border:
                                    "1px solid #d0d5dd",
                                background:
                                    "#fff"
                            }}
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
                                        {
                                            trip.name
                                        }{" "}
                                        —{" "}
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
                                style={{
                                    padding:
                                        "10px 14px",
                                    borderRadius:
                                        "8px",
                                    border:
                                        "1px solid #d0d5dd",
                                    background:
                                        "#fff",
                                    cursor:
                                        "pointer"
                                }}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {(selectedVehicle ||
                    selectedTrip) && (
                    <div
                        style={{
                            marginTop:
                                "16px",
                            paddingTop:
                                "16px",
                            borderTop:
                                "1px solid #eaecf0",
                            fontSize:
                                "13px",
                            opacity: 0.7
                        }}
                    >
                        Showing analytics
                        for{" "}

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
                                {
                                    selectedTrip.name
                                }
                            </strong>
                        )}
                    </div>
                )}
            </div>

            {/* =========================
                OVERVIEW
            ========================= */}

            <section
                style={{
                    marginBottom:
                        "32px"
                }}
            >
                <div
                    style={{
                        marginBottom:
                            "14px"
                    }}
                >
                    <h2
                        style={{
                            margin: 0
                        }}
                    >
                        Overview
                    </h2>

                    <p
                        style={{
                            margin:
                                "5px 0 0",
                            opacity: 0.65,
                            fontSize:
                                "14px"
                        }}
                    >
                        Your most important
                        fuel numbers at a
                        glance.
                    </p>
                </div>

                <div
                    className="dashboard-stats"
                >
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
                        <span>
                            Fuel Used
                        </span>

                        <strong>
                            {formatNumber(
                                summary.totalFuel
                            )}{" "}
                            L
                        </strong>
                    </div>

                    <div className="stat-card">
                        <span>
                            Distance
                        </span>

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

            {/* =========================
                SPENDING
            ========================= */}

            <section
                style={{
                    marginBottom:
                        "32px"
                }}
            >
                <div
                    style={{
                        marginBottom:
                            "14px"
                    }}
                >
                    <h2
                        style={{
                            margin: 0
                        }}
                    >
                        Fuel Spending
                    </h2>

                    <p
                        style={{
                            margin:
                                "5px 0 0",
                            opacity: 0.65,
                            fontSize:
                                "14px"
                        }}
                    >
                        See where your fuel
                        money is going over
                        time.
                    </p>
                </div>

                <div
                    className="analytics-grid"
                >
                    <div
                        className="analytics-card"
                    >
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
                                    opacity:
                                        0.6,
                                    fontSize:
                                        "13px"
                                }}
                            >
                                Fuel expenditure
                                by month
                            </p>
                        </div>

                        <div
                            className="chart-container"
                        >
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

                    <div
                        className="analytics-card"
                    >
                        <div
                            style={{
                                padding:
                                    "20px 20px 0"
                            }}
                        >
                            <h3>
                                Spending by
                                Vehicle
                            </h3>

                            <p
                                style={{
                                    opacity:
                                        0.6,
                                    fontSize:
                                        "13px"
                                }}
                            >
                                Compare fuel
                                costs between
                                vehicles
                            </p>
                        </div>

                        <div
                            className="chart-container"
                        >
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

            {/* =========================
                MILEAGE
            ========================= */}

            <section
                style={{
                    marginBottom:
                        "32px"
                }}
            >
                <div
                    style={{
                        marginBottom:
                            "14px"
                    }}
                >
                    <h2
                        style={{
                            margin: 0
                        }}
                    >
                        Mileage & Efficiency
                    </h2>

                    <p
                        style={{
                            margin:
                                "5px 0 0",
                            opacity: 0.65,
                            fontSize:
                                "14px"
                        }}
                    >
                        Track how efficiently
                        your vehicles are
                        using fuel.
                    </p>
                </div>

                <div
                    className="analytics-card"
                >
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
                                opacity:
                                    0.6,
                                fontSize:
                                    "13px"
                            }}
                        >
                            Fuel efficiency
                            across your
                            entries
                        </p>
                    </div>

                    <div
                        className="chart-container"
                    >
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
                                        strokeWidth={
                                            2
                                        }
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

                <div
                    className="analytics-card"
                    style={{
                        marginTop:
                            "20px"
                    }}
                >
                    <div
                        style={{
                            padding:
                                "20px 20px 10px"
                        }}
                    >
                        <h3>
                            Vehicle Efficiency
                        </h3>

                        <p
                            style={{
                                opacity:
                                    0.6,
                                fontSize:
                                    "13px"
                            }}
                        >
                            Average, best and
                            worst recorded
                            mileage
                        </p>
                    </div>

                    <div
                        className="table-container"
                    >
                        <table
                            className="analytics-table"
                        >
                            <thead>
                                <tr>
                                    <th>
                                        Vehicle
                                    </th>

                                    <th>
                                        Average
                                    </th>

                                    <th>
                                        Best
                                    </th>

                                    <th>
                                        Worst
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {mileageByVehicle.length >
                                0 ? (
                                    mileageByVehicle.map(
                                        (
                                            vehicle
                                        ) => (
                                            <tr
                                                key={
                                                    vehicle.vehicleId
                                                }
                                            >
                                                <td>
                                                    <strong>
                                                        {
                                                            vehicle.vehicleName
                                                        }
                                                    </strong>

                                                    {vehicle.vehicleRegistration && (
                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                                opacity:
                                                                    0.55
                                                            }}
                                                        >
                                                            {
                                                                vehicle.vehicleRegistration
                                                            }
                                                        </div>
                                                    )}
                                                </td>

                                                <td>
                                                    {formatMileage(
                                                        vehicle.averageMileage
                                                    )}
                                                </td>

                                                <td>
                                                    {formatMileage(
                                                        vehicle.bestMileage
                                                    )}
                                                </td>

                                                <td>
                                                    {formatMileage(
                                                        vehicle.worstMileage
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            style={{
                                                textAlign:
                                                    "center",
                                                padding:
                                                    "30px"
                                            }}
                                        >
                                            No mileage
                                            data
                                            available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* =========================
                TRIPS
            ========================= */}

            <section
                style={{
                    marginBottom:
                        "32px"
                }}
            >
                <div
                    style={{
                        marginBottom:
                            "14px"
                    }}
                >
                    <h2
                        style={{
                            margin: 0
                        }}
                    >
                        Trip Performance
                    </h2>

                    <p
                        style={{
                            margin:
                                "5px 0 0",
                            opacity: 0.65,
                            fontSize:
                                "14px"
                        }}
                    >
                        Compare distance,
                        fuel and cost of
                        your trips.
                    </p>
                </div>

                <div
                    className="analytics-card"
                >
                    <div
                        className="table-container"
                    >
                        <table
                            className="analytics-table"
                        >
                            <thead>
                                <tr>
                                    <th>
                                        Trip
                                    </th>

                                    <th>
                                        Route
                                    </th>

                                    <th>
                                        Distance
                                    </th>

                                    <th>
                                        Fuel
                                    </th>

                                    <th>
                                        Cost
                                    </th>

                                    <th>
                                        Mileage
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {tripAnalytics.length >
                                0 ? (
                                    tripAnalytics.map(
                                        (
                                            trip
                                        ) => (
                                            <tr
                                                key={
                                                    trip.id
                                                }
                                            >
                                                <td>
                                                    <strong>
                                                        {
                                                            trip.name
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    {
                                                        trip.startLocation
                                                    }{" "}
                                                    →{" "}
                                                    {
                                                        trip.destination
                                                    }
                                                </td>

                                                <td>
                                                    {formatNumber(
                                                        trip.distance
                                                    )}{" "}
                                                    km
                                                </td>

                                                <td>
                                                    {formatNumber(
                                                        trip.totalFuel
                                                    )}{" "}
                                                    L
                                                </td>

                                                <td>
                                                    {formatMoney(
                                                        trip.totalCost
                                                    )}
                                                </td>

                                                <td>
                                                    {formatMileage(
                                                        trip.mileage
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            style={{
                                                textAlign:
                                                    "center",
                                                padding:
                                                    "30px"
                                            }}
                                        >
                                            No trip
                                            data
                                            available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* =========================
                FUEL PRICE
            ========================= */}

            <section
                style={{
                    marginBottom:
                        "32px"
                }}
            >
                <div
                    style={{
                        marginBottom:
                            "14px"
                    }}
                >
                    <h2
                        style={{
                            margin: 0
                        }}
                    >
                        Fuel Price History
                    </h2>

                    <p
                        style={{
                            margin:
                                "5px 0 0",
                            opacity: 0.65,
                            fontSize:
                                "14px"
                        }}
                    >
                        Track how petrol
                        prices have changed
                        over time.
                    </p>
                </div>

                <div
                    className="analytics-card"
                >
                    <div
                        className="chart-container"
                    >
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
                                        strokeWidth={
                                            2
                                        }
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

            {/* =========================
                QUICK INSIGHTS
            ========================= */}

            <section>
                <div
                    style={{
                        marginBottom:
                            "14px"
                    }}
                >
                    <h2
                        style={{
                            margin: 0
                        }}
                    >
                        Quick Insights
                    </h2>

                    <p
                        style={{
                            margin:
                                "5px 0 0",
                            opacity: 0.65,
                            fontSize:
                                "14px"
                        }}
                    >
                        A quick summary of
                        the selected data.
                    </p>
                </div>

                <div
                    className="dashboard-stats"
                >
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
                                    fontSize:
                                        "12px",
                                    fontWeight:
                                        "normal",
                                    marginLeft:
                                        "4px"
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

/* =========================
   EMPTY CHART
========================= */

function EmptyState() {
    return (
        <div
            style={{
                height: "280px",
                display: "flex",
                alignItems:
                    "center",
                justifyContent:
                    "center",
                opacity: 0.55,
                fontSize: "14px"
            }}
        >
            No data available for
            this selection.
        </div>
    );
}

export default Analytics;