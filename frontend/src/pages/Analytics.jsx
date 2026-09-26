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
            <main className="page analytics-page">
                <div className="analytics-loading">
                    <div className="analytics-loading-icon">
                        <ChartIcon />
                    </div>

                    <h2>Loading analytics</h2>

                    <p>
                        Preparing your fuel and
                        vehicle insights...
                    </p>
                </div>
            </main>
        );
    }

    if (error && !data) {
        return (
            <main className="page analytics-page">
                <div className="analytics-page-header">
                    <div>
                        <span className="analytics-eyebrow">
                            INSIGHTS
                        </span>

                        <h1>Analytics</h1>

                        <p>
                            Understand your fuel
                            spending, mileage and
                            vehicle performance.
                        </p>
                    </div>
                </div>

                <div className="analytics-error">
                    <div className="analytics-error-icon">
                        <AlertIcon />
                    </div>

                    <div>
                        <h3>
                            Unable to load
                            analytics
                        </h3>

                        <p>{error}</p>
                    </div>
                </div>
            </main>
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
        <main className="page analytics-page">

            {/* HEADER */}

            <div className="analytics-page-header">
                <div>
                    <span className="analytics-eyebrow">
                        INSIGHTS
                    </span>

                    <div className="analytics-title-row">
                        <div className="analytics-title-icon">
                            <ChartIcon />
                        </div>

                        <div>
                            <h1>Analytics</h1>

                            <p>
                                Understand your fuel
                                spending, mileage and
                                vehicle performance.
                            </p>
                        </div>
                    </div>
                </div>

                {refreshing && (
                    <div className="analytics-refreshing">
                        <span className="analytics-refresh-dot" />
                        Updating
                    </div>
                )}
            </div>

            {/* ERROR WHILE REFRESHING */}

            {error && data && (
                <div className="analytics-inline-error">
                    <AlertIcon />
                    <span>{error}</span>
                </div>
            )}

            {/* FILTERS */}

            <section className="analytics-filter-card">
                <div className="analytics-filter-heading">
                    <div className="analytics-filter-icon">
                        <FilterIcon />
                    </div>

                    <div>
                        <h2>
                            Filter your analytics
                        </h2>

                        <p>
                            Focus on a vehicle or
                            specific trip to explore
                            detailed performance.
                        </p>
                    </div>
                </div>

                <div className="analytics-filter-controls">

                    <div className="analytics-filter-field">
                        <label>
                            Vehicle
                        </label>

                        <div className="analytics-select-wrapper">
                            <CarIcon />

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
                        </div>
                    </div>

                    <div className="analytics-filter-field">
                        <label>
                            Trip
                        </label>

                        <div className="analytics-select-wrapper">
                            <RouteIcon />

                            <select
                                value={
                                    selectedTripId
                                }
                                onChange={(event) =>
                                    setSelectedTripId(
                                        event.target.value
                                    )
                                }
                                className="analytics-select"
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
                        </div>
                    </div>

                    {(selectedVehicleId ||
                        selectedTripId) && (
                        <button
                            type="button"
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
                            <CloseIcon />
                            Clear filters
                        </button>
                    )}
                </div>

                {(selectedVehicle ||
                    selectedTrip) && (
                    <div className="analytics-active-filter">
                        <span className="analytics-active-dot" />

                        <span>
                            Showing analytics for
                        </span>

                        {selectedVehicle && (
                            <strong>
                                {
                                    selectedVehicle.name
                                }
                            </strong>
                        )}

                        {selectedVehicle &&
                            selectedTrip && (
                                <span className="analytics-filter-separator">
                                    /
                                </span>
                            )}

                        {selectedTrip && (
                            <strong>
                                {selectedTrip.name}
                            </strong>
                        )}
                    </div>
                )}
            </section>

            {/* OVERVIEW */}

            <AnalyticsSection
                eyebrow="OVERVIEW"
                title="Your fuel overview"
                description="The numbers that matter most, all in one place."
            >
                <div className="analytics-stat-grid">

                    <AnalyticsStatCard
                        icon={<MoneyIcon />}
                        label="Total Spending"
                        value={formatMoney(
                            summary.totalSpending
                        )}
                        description="Total fuel expenses"
                    />

                    <AnalyticsStatCard
                        icon={<FuelIcon />}
                        label="Fuel Used"
                        value={`${formatNumber(
                            summary.totalFuel
                        )} L`}
                        description="Total fuel purchased"
                    />

                    <AnalyticsStatCard
                        icon={<RouteIcon />}
                        label="Distance"
                        value={`${formatNumber(
                            summary.totalDistance
                        )} km`}
                        description="Distance tracked"
                    />

                    <AnalyticsStatCard
                        icon={<GaugeIcon />}
                        label="Average Mileage"
                        value={formatMileage(
                            summary.averageMileage
                        )}
                        description="Overall fuel efficiency"
                    />

                </div>
            </AnalyticsSection>

            {/* SPENDING */}

            <AnalyticsSection
                eyebrow="SPENDING"
                title="Fuel spending"
                description="See how your fuel expenses change over time and across vehicles."
            >
                <div className="analytics-chart-grid">

                    <AnalyticsChartCard
                        title="Monthly Spending"
                        description="Fuel expenditure by month"
                        icon={<CalendarIcon />}
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
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: 0,
                                        bottom: 0
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />

                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tickMargin={10}
                                    />

                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(
                                            value
                                        ) =>
                                            `Rs ${Number(
                                                value
                                            ).toLocaleString()}`
                                        }
                                    />

                                    <Tooltip
                                        cursor={{
                                            opacity: 0.08
                                        }}
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
                                        radius={[
                                            6,
                                            6,
                                            0,
                                            0
                                        ]}
                                        maxBarSize={48}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState />
                        )}
                    </AnalyticsChartCard>

                    <AnalyticsChartCard
                        title="Spending by Vehicle"
                        description="Compare fuel costs between vehicles"
                        icon={<CarIcon />}
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
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: 0,
                                        bottom: 0
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />

                                    <XAxis
                                        dataKey="vehicleName"
                                        axisLine={false}
                                        tickLine={false}
                                        tickMargin={10}
                                    />

                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(
                                            value
                                        ) =>
                                            `Rs ${Number(
                                                value
                                            ).toLocaleString()}`
                                        }
                                    />

                                    <Tooltip
                                        cursor={{
                                            opacity: 0.08
                                        }}
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
                                        radius={[
                                            6,
                                            6,
                                            0,
                                            0
                                        ]}
                                        maxBarSize={48}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState />
                        )}
                    </AnalyticsChartCard>

                </div>
            </AnalyticsSection>

            {/* MILEAGE */}

            <AnalyticsSection
                eyebrow="EFFICIENCY"
                title="Mileage & efficiency"
                description="Track how efficiently your vehicles are using fuel."
            >
                <AnalyticsChartCard
                    title="Mileage Trend"
                    description="Fuel efficiency across your entries"
                    icon={<GaugeIcon />}
                    className="analytics-full-chart"
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
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 0,
                                    bottom: 0
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={10}
                                />

                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                />

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
                                    strokeWidth={2.5}
                                    dot={{
                                        r: 3
                                    }}
                                    activeDot={{
                                        r: 5
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyState />
                    )}
                </AnalyticsChartCard>

                {/* VEHICLE EFFICIENCY */}

                <div className="analytics-card vehicle-efficiency-card">
                    <div className="analytics-card-heading">
                        <div className="analytics-card-title-group">
                            <div className="analytics-card-icon">
                                <CarIcon />
                            </div>

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
                                                <div className="vehicle-efficiency-identity">
                                                    <div className="vehicle-efficiency-avatar">
                                                        <CarIcon />
                                                    </div>

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
                            <EmptyIcon />

                            <span>
                                No mileage data
                                available.
                            </span>
                        </div>
                    )}
                </div>
            </AnalyticsSection>

            {/* TRIP PERFORMANCE */}

            <AnalyticsSection
                eyebrow="TRIPS"
                title="Trip performance"
                description="Compare the distance, fuel and cost of your journeys."
            >
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
                                                <div className="trip-performance-icon">
                                                    <RouteIcon />
                                                </div>

                                                <div>
                                                    <h3>
                                                        {
                                                            trip.name
                                                        }
                                                    </h3>

                                                    <span>
                                                        {
                                                            trip.startLocation
                                                        }

                                                        <span className="trip-arrow">
                                                            →
                                                        </span>

                                                        {
                                                            trip.destination
                                                        }
                                                    </span>
                                                </div>
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
                            <EmptyIcon />

                            <span>
                                No trip data
                                available.
                            </span>
                        </div>
                    )}
                </div>
            </AnalyticsSection>

            {/* FUEL PRICE */}

            <AnalyticsSection
                eyebrow="FUEL PRICES"
                title="Fuel price history"
                description="Track how petrol prices have changed over time."
            >
                <AnalyticsChartCard
                    title="Petrol Price"
                    description="Historical fuel price movement"
                    icon={<FuelIcon />}
                    className="analytics-full-chart"
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
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 0,
                                    bottom: 0
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="effectiveDate"
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={10}
                                />

                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                />

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
                                    strokeWidth={2.5}
                                    dot={{
                                        r: 3
                                    }}
                                    activeDot={{
                                        r: 5
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyState />
                    )}
                </AnalyticsChartCard>
            </AnalyticsSection>

            {/* QUICK INSIGHTS */}

            <AnalyticsSection
                eyebrow="QUICK INSIGHTS"
                title="At a glance"
                description="A quick summary of the selected data."
                last
            >
                <div className="analytics-stat-grid">

                    <AnalyticsStatCard
                        icon={<ReceiptIcon />}
                        label="Fuel Entries"
                        value={formatNumber(
                            summary.totalEntries,
                            0
                        )}
                        description="Recorded fuel purchases"
                    />

                    <AnalyticsStatCard
                        icon={<MoneyIcon />}
                        label="Average Fuel Cost"
                        value={
                            summary.averageFuelCost !==
                                null &&
                            summary.averageFuelCost !==
                                undefined
                                ? formatMoney(
                                      summary.averageFuelCost
                                  )
                                : "—"
                        }
                        suffix="/ L"
                        description="Average price per litre"
                    />

                    <AnalyticsStatCard
                        icon={<TrendingUpIcon />}
                        label="Best Mileage"
                        value={formatMileage(
                            summary.bestMileage
                        )}
                        description="Highest recorded efficiency"
                    />

                    <AnalyticsStatCard
                        icon={<TrendingDownIcon />}
                        label="Lowest Mileage"
                        value={formatMileage(
                            summary.worstMileage
                        )}
                        description="Lowest recorded efficiency"
                    />

                </div>
            </AnalyticsSection>
        </main>
    );
}

function AnalyticsSection({
    eyebrow,
    title,
    description,
    children,
    last = false
}) {
    return (
        <section
            className={`analytics-section ${
                last
                    ? "analytics-section-last"
                    : ""
            }`}
        >
            <div className="analytics-section-header">
                <div>
                    <span className="analytics-section-eyebrow">
                        {eyebrow}
                    </span>

                    <h2>{title}</h2>

                    <p>{description}</p>
                </div>
            </div>

            {children}
        </section>
    );
}

function AnalyticsStatCard({
    icon,
    label,
    value,
    description,
    suffix
}) {
    return (
        <div className="analytics-stat-card">
            <div className="analytics-stat-top">
                <div className="analytics-stat-icon">
                    {icon}
                </div>

                <span className="analytics-stat-label">
                    {label}
                </span>
            </div>

            <div className="analytics-stat-value-row">
                <strong>
                    {value}
                </strong>

                {suffix && (
                    <small>
                        {suffix}
                    </small>
                )}
            </div>

            <span className="analytics-stat-description">
                {description}
            </span>
        </div>
    );
}

function AnalyticsChartCard({
    title,
    description,
    icon,
    children,
    className = ""
}) {
    return (
        <div
            className={`analytics-card analytics-chart-card ${className}`}
        >
            <div className="analytics-card-heading">
                <div className="analytics-card-title-group">
                    <div className="analytics-card-icon">
                        {icon}
                    </div>

                    <div>
                        <h3>{title}</h3>

                        <p>{description}</p>
                    </div>
                </div>
            </div>

            <div className="chart-container">
                {children}
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="analytics-chart-empty">
            <div className="analytics-empty-icon">
                <ChartIcon />
            </div>

            <strong>
                No data available
            </strong>

            <span>
                There isn't enough data for
                this selection yet.
            </span>
        </div>
    );
}

/* ---------------- ICONS ---------------- */

function ChartIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M4 19V5" />
            <path d="M4 19h16" />
            <path d="m7 15 4-5 3 3 5-7" />
        </svg>
    );
}

function CarIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M5 17h14" />
            <path d="M6 17H4a1 1 0 0 1-1-1v-3a2 2 0 0 1 2-2h1l1.5-4h7L17 11h1a2 2 0 0 1 2 2v3a1 1 0 0 1-1 1h-2" />
            <path d="M7 17v2" />
            <path d="M17 17v2" />
            <circle cx="7" cy="15" r="1.2" />
            <circle cx="17" cy="15" r="1.2" />
        </svg>
    );
}

function FuelIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M6 20V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15" />
            <path d="M6 20h12" />
            <path d="M9 7h4" />
            <path d="M16 7h2l2 2v7a2 2 0 0 0 2 2" />
            <path d="M20 9v4h-2" />
        </svg>
    );
}

function MoneyIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
            />
            <circle
                cx="12"
                cy="12"
                r="3"
            />
            <path d="M7 9h.01" />
            <path d="M17 15h.01" />
        </svg>
    );
}

function RouteIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle
                cx="6"
                cy="18"
                r="2.5"
            />
            <circle
                cx="18"
                cy="6"
                r="2.5"
            />
            <path d="M8.5 18H10a4 4 0 0 0 4-4v-2a4 4 0 0 1 4-4" />
        </svg>
    );
}

function GaugeIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M4 16a8 8 0 1 1 16 0" />
            <path d="M12 12l4-3" />
            <path d="M5 19h14" />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect
                x="3"
                y="4"
                width="18"
                height="17"
                rx="2"
            />
            <path d="M16 2v4" />
            <path d="M8 2v4" />
            <path d="M3 10h18" />
        </svg>
    );
}

function FilterIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M4 6h16" />
            <path d="M7 12h10" />
            <path d="M10 18h4" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
        >
            <path d="m7 7 10 10" />
            <path d="m17 7-10 10" />
        </svg>
    );
}

function AlertIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M10.3 3.8 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
        </svg>
    );
}

function EmptyIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect
                x="4"
                y="4"
                width="16"
                height="16"
                rx="3"
            />
            <path d="M8 15l2.5-3 2.5 2 3-4" />
        </svg>
    );
}

function TrendingUpIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M3 17l6-6 4 4 7-8" />
            <path d="M15 7h5v5" />
        </svg>
    );
}

function TrendingDownIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M3 7l6 6 4-4 7 8" />
            <path d="M15 17h5v-5" />
        </svg>
    );
}

function ReceiptIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
            <path d="M9 8h6" />
            <path d="M9 12h6" />
            <path d="M9 16h3" />
        </svg>
    );
}

export default Analytics;