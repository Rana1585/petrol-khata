
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api";

/* ─────────────────────────────────────────────
   Icons
───────────────────────────────────────────── */

function ChartIcon({ size = 20 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 19V5" />
            <path d="M4 19h16" />
            <path d="m7 15 4-4 3 2 5-6" />
        </svg>
    );
}

function CarIcon({ size = 20 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 17h14" />
            <path d="M6 17H4.5a1.5 1.5 0 0 1-1.5-1.5v-3A1.5 1.5 0 0 1 4.5 11h1l1.5-4h10l1.5 4h1a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 19.5 17H18" />
            <path d="M7 17v2" />
            <path d="M17 17v2" />
            <path d="M7 11h10" />
            <circle cx="7" cy="14.5" r="1" />
            <circle cx="17" cy="14.5" r="1" />
        </svg>
    );
}

function FuelIcon({ size = 20 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16" />
            <path d="M4 21h13" />
            <path d="M8 7h5v4H8z" />
            <path d="M16 7h2l2 2v7a2 2 0 0 0 2 2" />
            <path d="M20 11h2" />
        </svg>
    );
}

function MoneyIcon({ size = 20 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="12" cy="12" r="3" />
            <path d="M7 9h.01" />
            <path d="M17 15h.01" />
        </svg>
    );
}

function RouteIcon({ size = 20 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="6" cy="18" r="2.5" />
            <circle cx="18" cy="6" r="2.5" />
            <path d="M8.5 18c5 0 2-12 7-12" />
        </svg>
    );
}

function GaugeIcon({ size = 20 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4.5 16a8 8 0 1 1 15 0" />
            <path d="m12 12 4-4" />
            <path d="M12 12h.01" />
            <path d="M7 18h10" />
        </svg>
    );
}

function CalendarIcon({ size = 18 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="4.5" width="18" height="17" rx="2" />
            <path d="M16 2.5v4" />
            <path d="M8 2.5v4" />
            <path d="M3 9h18" />
        </svg>
    );
}

function FilterIcon({ size = 18 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 6h16" />
            <path d="M7 12h10" />
            <path d="M10 18h4" />
        </svg>
    );
}

function RefreshIcon({ size = 18 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 11a8 8 0 0 0-14.9-3" />
            <path d="M4 5v4h4" />
            <path d="M4 13a8 8 0 0 0 14.9 3" />
            <path d="M20 19v-4h-4" />
        </svg>
    );
}

function CloseIcon({ size = 16 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        >
            <path d="m6 6 12 12" />
            <path d="m18 6-12 12" />
        </svg>
    );
}

function TrendingUpIcon({ size = 18 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m4 16 5-5 4 3 7-8" />
            <path d="M15 6h5v5" />
        </svg>
    );
}

function TrendingDownIcon({ size = 18 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m4 8 5 5 4-3 7 8" />
            <path d="M15 18h5v-5" />
        </svg>
    );
}

function EmptyIcon({ size = 28 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 19V5" />
            <path d="M4 19h16" />
            <path d="M7 15h2" />
            <path d="M11 12h2" />
            <path d="M15 9h2" />
        </svg>
    );
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

function formatNumber(value, decimals = 0) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

function formatMoney(value) {
    return `Rs. ${formatNumber(value, 0)}`;
}

function formatMileage(value) {
    const number = Number(value);

    if (!Number.isFinite(number) || number <= 0) {
        return "—";
    }

    return `${formatNumber(number, 1)} km/L`;
}

function getVehicleName(vehicle) {
    if (!vehicle) {
        return "Unknown vehicle";
    }

    return vehicle.name || vehicle.registration || "Unnamed vehicle";
}

function getVehicleRegistration(vehicle) {
    if (!vehicle) {
        return "";
    }

    return vehicle.registration || "";
}

/* ─────────────────────────────────────────────
   Reusable UI
───────────────────────────────────────────── */

function AnalyticsSection({ eyebrow, title, description, children, last = false }) {
    return (
        <section
            className={`analytics-section ${
                last ? "analytics-section-last" : ""
            }`}
        >
            <div className="analytics-section-header">
                <div>
                    {eyebrow && (
                        <span className="analytics-section-eyebrow">
                            {eyebrow}
                        </span>
                    )}

                    <h2>{title}</h2>

                    {description && <p>{description}</p>}
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
    subtle,
}) {
    return (
        <article className="analytics-stat-card">
            <div className="analytics-stat-top">
                <div className="analytics-stat-icon">
                    {icon}
                </div>

                {subtle && (
                    <span className="analytics-stat-subtle">
                        {subtle}
                    </span>
                )}
            </div>

            <span className="analytics-stat-label">
                {label}
            </span>

            <div className="analytics-stat-value-row">
                <strong>{value}</strong>
            </div>

            {description && (
                <span className="analytics-stat-description">
                    {description}
                </span>
            )}
        </article>
    );
}

function AnalyticsCard({
    title,
    description,
    icon,
    children,
    className = "",
}) {
    return (
        <article className={`analytics-card ${className}`}>
            <div className="analytics-card-heading">
                <div className="analytics-card-icon">
                    {icon}
                </div>

                <div className="analytics-card-title-group">
                    <h3>{title}</h3>

                    {description && (
                        <p>{description}</p>
                    )}
                </div>
            </div>

            {children}
        </article>
    );
}

function EmptyState({
    message = "There is no data available for the selected filters.",
}) {
    return (
        <div className="analytics-chart-empty">
            <div className="analytics-empty-icon">
                <EmptyIcon />
            </div>

            <span>{message}</span>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Simple chart components
───────────────────────────────────────────── */

function BarChart({ data, valueKey, labelKey, money = false }) {
    if (!data || data.length === 0) {
        return <EmptyState />;
    }

    const values = data.map((item) => Number(item[valueKey]) || 0);
    const max = Math.max(...values, 1);

    return (
        <div className="analytics-bar-chart">
            {data.map((item, index) => {
                const value = Number(item[valueKey]) || 0;
                const percentage = Math.max(
                    3,
                    (value / max) * 100
                );

                return (
                    <div
                        className="analytics-bar-item"
                        key={`${labelKey}-${index}`}
                    >
                        <div className="analytics-bar-label-row">
                            <span>
                                {item[labelKey]}
                            </span>

                            <strong>
                                {money
                                    ? formatMoney(value)
                                    : formatNumber(value)}
                            </strong>
                        </div>

                        <div className="analytics-bar-track">
                            <div
                                className="analytics-bar-fill"
                                style={{
                                    width: `${percentage}%`,
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function LineChart({ data, valueKey, labelKey, money = false }) {
    if (!data || data.length === 0) {
        return <EmptyState />;
    }

    const values = data.map((item) => Number(item[valueKey]) || 0);

    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);

    const width = 900;
    const height = 300;
    const paddingX = 24;
    const paddingY = 24;

    const usableWidth = width - paddingX * 2;
    const usableHeight = height - paddingY * 2;

    const range = max - min || 1;

    const points = data.map((item, index) => {
        const x =
            data.length === 1
                ? width / 2
                : paddingX +
                  (index / (data.length - 1)) *
                      usableWidth;

        const y =
            paddingY +
            ((max - (Number(item[valueKey]) || 0)) /
                range) *
                usableHeight;

        return {
            x,
            y,
            item,
        };
    });

    const polyline = points
        .map((point) => `${point.x},${point.y}`)
        .join(" ");

    return (
        <div className="analytics-line-chart">
            <svg
                className="analytics-line-svg"
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="none"
            >
                <line
                    x1={paddingX}
                    y1={height - paddingY}
                    x2={width - paddingX}
                    y2={height - paddingY}
                    className="analytics-chart-axis"
                />

                <line
                    x1={paddingX}
                    y1={paddingY}
                    x2={paddingX}
                    y2={height - paddingY}
                    className="analytics-chart-axis"
                />

                <polyline
                    points={polyline}
                    fill="none"
                    className="analytics-line"
                />

                {points.map((point, index) => (
                    <circle
                        key={index}
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        className="analytics-line-point"
                    />
                ))}
            </svg>

            <div className="analytics-line-labels">
                {points.map((point, index) => (
                    <div
                        className="analytics-line-label"
                        key={index}
                    >
                        <span>
                            {point.item[labelKey]}
                        </span>

                        <strong>
                            {money
                                ? formatMoney(
                                      Number(
                                          point.item[
                                              valueKey
                                          ]
                                      ) || 0
                                  )
                                : formatNumber(
                                      Number(
                                          point.item[
                                              valueKey
                                          ]
                                      ) || 0
                                  )}
                        </strong>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Main Analytics page
───────────────────────────────────────────── */

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

    async function loadFilters() {
        const [vehicleData, tripData] =
            await Promise.all([
                apiFetch("/vehicles"),
                apiFetch("/trips"),
            ]);

        setVehicles(
            Array.isArray(vehicleData)
                ? vehicleData
                : vehicleData?.vehicles || []
        );

        setTrips(
            Array.isArray(tripData)
                ? tripData
                : tripData?.trips || []
        );
    }

    async function loadAnalytics({
        showLoading = true,
    } = {}) {
        try {
            if (showLoading) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError("");

            const params = new URLSearchParams();

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

            const query = params.toString();

            const result = await apiFetch(
                `/analytics${query ? `?${query}` : ""}`
            );

            setData(result);
        } catch (err) {
            console.error("Analytics loading error:", err);

            setError(
                err?.message ||
                    "Unable to load analytics right now."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        async function initialise() {
            try {
                await loadFilters();
            } catch (err) {
                console.error(
                    "Analytics filters loading error:",
                    err
                );

                setError(
                    err?.message ||
                        "Unable to load analytics filters."
                );

                setLoading(false);
                return;
            }

            await loadAnalytics();
        }

        initialise();
    }, []);

    useEffect(() => {
        if (loading) {
            return;
        }

        loadAnalytics({
            showLoading: false,
        });
    }, [selectedVehicleId, selectedTripId]);

    const activeVehicles = useMemo(
        () =>
            vehicles.filter(
                (vehicle) =>
                    vehicle.active !== false
            ),
        [vehicles]
    );

    const availableTrips = useMemo(() => {
        if (!selectedVehicleId) {
            return trips;
        }

        return trips.filter(
            (trip) =>
                String(trip.vehicleId) ===
                String(selectedVehicleId)
        );
    }, [trips, selectedVehicleId]);

    useEffect(() => {
        if (!selectedTripId) {
            return;
        }

        const exists = availableTrips.some(
            (trip) =>
                String(trip.id) ===
                String(selectedTripId)
        );

        if (!exists) {
            setSelectedTripId("");
        }
    }, [availableTrips, selectedTripId]);

    const selectedVehicle = useMemo(
        () =>
            vehicles.find(
                (vehicle) =>
                    String(vehicle.id) ===
                    String(selectedVehicleId)
            ),
        [vehicles, selectedVehicleId]
    );

    const selectedTrip = useMemo(
        () =>
            trips.find(
                (trip) =>
                    String(trip.id) ===
                    String(selectedTripId)
            ),
        [trips, selectedTripId]
    );

    function clearFilters() {
        setSelectedVehicleId("");
        setSelectedTripId("");
    }

    const spendingByMonth =
        data?.spendingByMonth || [];

    const spendingByVehicle =
        data?.spendingByVehicle || [];

    const mileageByVehicle =
        data?.mileageByVehicle || [];

    const mileageTrend =
        data?.mileageTrend || [];

    const fuelPriceHistory =
        data?.fuelPriceHistory || [];

    const tripAnalytics =
        data?.tripAnalytics || [];

    const overview = data?.overview || {};

    const totalSpending =
        overview.totalSpending ??
        data?.summary?.totalSpending ??
        0;

    const totalFuel =
        overview.totalFuel ??
        data?.summary?.totalFuel ??
        0;

    const totalDistance =
        overview.totalDistance ??
        data?.summary?.totalDistance ??
        0;

    const averageMileage =
        overview.averageMileage ??
        data?.summary?.averageMileage ??
        0;

    const totalVehicles =
        overview.totalVehicles ??
        data?.summary?.totalVehicles ??
        activeVehicles.length;

    const totalTrips =
        overview.totalTrips ??
        data?.summary?.totalTrips ??
        trips.length;

    if (loading) {
        return (
            <main className="page analytics-page">
                <div className="analytics-loading">
                    <div className="analytics-loading-icon">
                        <ChartIcon size={28} />
                    </div>

                    <h2>Loading analytics</h2>

                    <p>
                        Preparing your fuel and vehicle
                        insights...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="page analytics-page">
            {/* Page header */}
            <header className="analytics-page-header">
                <div className="analytics-page-heading">
                    <span className="analytics-eyebrow">
                        Insights & reports
                    </span>

                    <div className="analytics-title-row">
                        <div className="analytics-title-icon">
                            <ChartIcon size={25} />
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

                <button
                    type="button"
                    className="analytics-refresh-button"
                    onClick={() =>
                        loadAnalytics({
                            showLoading: false,
                        })
                    }
                    disabled={refreshing}
                >
                    <span
                        className={
                            refreshing
                                ? "analytics-refresh-icon spinning"
                                : "analytics-refresh-icon"
                        }
                    >
                        <RefreshIcon size={17} />
                    </span>

                    <span>
                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </span>
                </button>
            </header>

            {error && (
                <div className="analytics-inline-error">
                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            loadAnalytics({
                                showLoading: false,
                            })
                        }
                    >
                        Try again
                    </button>
                </div>
            )}

            {/* Filters */}
            <div className="analytics-filter-card">
                <div className="analytics-filter-heading">
                    <div className="analytics-filter-icon">
                        <FilterIcon size={18} />
                    </div>

                    <div>
                        <strong>
                            Filter analytics
                        </strong>

                        <span>
                            Narrow your insights by
                            vehicle or trip.
                        </span>
                    </div>
                </div>

                <div className="analytics-filter-controls">
                    <label className="analytics-filter-field">
                        <span>Vehicle</span>

                        <div className="analytics-select-wrapper">
                            <select
                                className="analytics-select"
                                value={
                                    selectedVehicleId
                                }
                                onChange={(event) =>
                                    setSelectedVehicleId(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="">
                                    All vehicles
                                </option>

                                {activeVehicles.map(
                                    (vehicle) => (
                                        <option
                                            key={
                                                vehicle.id
                                            }
                                            value={
                                                vehicle.id
                                            }
                                        >
                                            {getVehicleName(
                                                vehicle
                                            )}
                                            {getVehicleRegistration(
                                                vehicle
                                            )
                                                ? ` — ${getVehicleRegistration(
                                                      vehicle
                                                  )}`
                                                : ""}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    </label>

                    <div className="analytics-filter-separator" />

                    <label className="analytics-filter-field">
                        <span>Trip</span>

                        <div className="analytics-select-wrapper">
                            <select
                                className="analytics-select"
                                value={
                                    selectedTripId
                                }
                                onChange={(event) =>
                                    setSelectedTripId(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="">
                                    All trips
                                </option>

                                {availableTrips.map(
                                    (trip) => (
                                        <option
                                            key={trip.id}
                                            value={trip.id}
                                        >
                                            {trip.name ||
                                                "Unnamed trip"}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    </label>

                    {(selectedVehicleId ||
                        selectedTripId) && (
                        <button
                            type="button"
                            className="analytics-clear-button"
                            onClick={clearFilters}
                        >
                            <CloseIcon size={14} />
                            Clear
                        </button>
                    )}
                </div>

                {(selectedVehicle ||
                    selectedTrip) && (
                    <div className="analytics-active-filter">
                        <span className="analytics-active-dot" />

                        <span>
                            Showing:
                        </span>

                        {selectedVehicle && (
                            <strong>
                                {getVehicleName(
                                    selectedVehicle
                                )}
                            </strong>
                        )}

                        {selectedTrip && (
                            <>
                                <span>
                                    /
                                </span>

                                <strong>
                                    {selectedTrip.name ||
                                        "Unnamed trip"}
                                </strong>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Overview */}
            <AnalyticsSection
                eyebrow="Overview"
                title="Your numbers at a glance"
                description="A quick snapshot of your fuel activity."
            >
                <div className="analytics-stat-grid">
                    <AnalyticsStatCard
                        icon={
                            <MoneyIcon size={21} />
                        }
                        label="Total fuel cost"
                        value={formatMoney(
                            totalSpending
                        )}
                        description="Total recorded fuel spending"
                    />

                    <AnalyticsStatCard
                        icon={
                            <FuelIcon size={21} />
                        }
                        label="Fuel consumed"
                        value={`${formatNumber(
                            totalFuel,
                            1
                        )} L`}
                        description="Total recorded litres"
                    />

                    <AnalyticsStatCard
                        icon={
                            <RouteIcon size={21} />
                        }
                        label="Distance covered"
                        value={`${formatNumber(
                            totalDistance,
                            0
                        )} km`}
                        description="Recorded driving distance"
                    />

                    <AnalyticsStatCard
                        icon={
                            <GaugeIcon size={21} />
                        }
                        label="Average mileage"
                        value={formatMileage(
                            averageMileage
                        )}
                        description="Across available mileage data"
                    />

                    <AnalyticsStatCard
                        icon={
                            <CarIcon size={21} />
                        }
                        label="Vehicles"
                        value={formatNumber(
                            totalVehicles
                        )}
                        description="Vehicles included in the data"
                    />

                    <AnalyticsStatCard
                        icon={
                            <CalendarIcon size={21} />
                        }
                        label="Trips"
                        value={formatNumber(
                            totalTrips
                        )}
                        description="Recorded trips"
                    />
                </div>
            </AnalyticsSection>

            {/* Spending */}
            <AnalyticsSection
                eyebrow="Fuel spending"
                title="Where your fuel budget goes"
                description="Track spending patterns across time and vehicles."
            >
                <div className="analytics-chart-grid">
                    <AnalyticsCard
                        title="Monthly spending"
                        description="Fuel cost grouped by month"
                        icon={
                            <MoneyIcon size={19} />
                        }
                    >
                        <div className="chart-container">
                            <BarChart
                                data={
                                    spendingByMonth
                                }
                                valueKey="totalSpending"
                                labelKey="month"
                                money
                            />
                        </div>
                    </AnalyticsCard>

                    <AnalyticsCard
                        title="Spending by vehicle"
                        description="Compare total fuel costs"
                        icon={
                            <CarIcon size={19} />
                        }
                    >
                        <div className="chart-container">
                            <BarChart
                                data={
                                    spendingByVehicle
                                }
                                valueKey="totalSpending"
                                labelKey="vehicle"
                                money
                            />
                        </div>
                    </AnalyticsCard>
                </div>
            </AnalyticsSection>

            {/* Mileage */}
            <AnalyticsSection
                eyebrow="Mileage"
                title="Track fuel efficiency"
                description="See how efficiently your vehicles are being driven."
            >
                <div className="analytics-chart-grid">
                    <AnalyticsCard
                        title="Mileage trend"
                        description="Fuel efficiency over time"
                        icon={
                            <TrendingUpIcon size={19} />
                        }
                        className="analytics-full-chart"
                    >
                        <div className="chart-container">
                            <LineChart
                                data={mileageTrend}
                                valueKey="mileage"
                                labelKey="month"
                            />
                        </div>
                    </AnalyticsCard>
                </div>

                <div className="vehicle-efficiency-card">
                    <div className="analytics-card-heading">
                        <div className="analytics-card-icon">
                            <GaugeIcon size={19} />
                        </div>

                        <div className="analytics-card-title-group">
                            <h3>
                                Vehicle efficiency
                            </h3>

                            <p>
                                Mileage comparison across
                                your vehicles.
                            </p>
                        </div>
                    </div>

                    {mileageByVehicle.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="vehicle-efficiency-grid">
                            {mileageByVehicle.map(
                                (vehicle, index) => {
                                    const mileage =
                                        Number(
                                            vehicle.mileage
                                        ) ||
                                        Number(
                                            vehicle.averageMileage
                                        ) ||
                                        0;

                                    const averageWidth =
                                        Math.min(
                                            100,
                                            Math.max(
                                                5,
                                                mileage *
                                                    5
                                            )
                                        );

                                    return (
                                        <div
                                            className="vehicle-efficiency-item"
                                            key={
                                                vehicle.vehicleId ||
                                                vehicle.id ||
                                                index
                                            }
                                        >
                                            <div className="vehicle-efficiency-top">
                                                <div className="vehicle-efficiency-identity">
                                                    <div className="vehicle-efficiency-avatar">
                                                        <CarIcon
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {vehicle.vehicle ||
                                                                vehicle.vehicleName ||
                                                                "Unknown vehicle"}
                                                        </strong>

                                                        {vehicle.registration && (
                                                            <span>
                                                                {
                                                                    vehicle.registration
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <strong className="vehicle-average">
                                                    {formatMileage(
                                                        mileage
                                                    )}
                                                </strong>
                                            </div>

                                            <div className="vehicle-efficiency-bar">
                                                <div
                                                    className="vehicle-efficiency-bar-fill"
                                                    style={{
                                                        width: `${averageWidth}%`,
                                                    }}
                                                />
                                            </div>

                                            <div className="vehicle-efficiency-comparison">
                                                <span>
                                                    Fuel
                                                    efficiency
                                                </span>

                                                <span>
                                                    {formatNumber(
                                                        mileage,
                                                        1
                                                    )}{" "}
                                                    km/L
                                                </span>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
                </div>
            </AnalyticsSection>

            {/* Trips */}
            <AnalyticsSection
                eyebrow="Trip performance"
                title="Understand your journeys"
                description="Review fuel use and mileage across recorded trips."
            >
                <div className="trip-performance-card">
                    {tripAnalytics.length === 0 ? (
                        <EmptyState message="No trip analytics are available for the selected filters." />
                    ) : (
                        <div className="trip-performance-list">
                            {tripAnalytics.map(
                                (trip, index) => (
                                    <div
                                        className="trip-performance-item"
                                        key={
                                            trip.tripId ||
                                            trip.id ||
                                            index
                                        }
                                    >
                                        <div className="trip-performance-main">
                                            <div className="trip-performance-icon">
                                                <RouteIcon
                                                    size={18}
                                                />
                                            </div>

                                            <div>
                                                <strong className="trip-performance-title">
                                                    {trip.trip ||
                                                        trip.name ||
                                                        "Unnamed trip"}
                                                </strong>

                                                {trip.vehicle && (
                                                    <span>
                                                        {
                                                            trip.vehicle
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="trip-performance-metrics">
                                            <div className="trip-metric">
                                                <span>
                                                    Distance
                                                </span>

                                                <strong>
                                                    {formatNumber(
                                                        trip.distance ||
                                                            0
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
                                                        trip.fuel ||
                                                            trip.totalFuel ||
                                                            0,
                                                        1
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
                                                        trip.cost ||
                                                            trip.totalSpending ||
                                                            0
                                                    )}
                                                </strong>
                                            </div>

                                            <div className="trip-metric trip-metric-highlight">
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
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </AnalyticsSection>

            {/* Fuel price */}
            <AnalyticsSection
                eyebrow="Fuel prices"
                title="Fuel price history"
                description="Monitor how recorded fuel prices have changed."
            >
                <AnalyticsCard
                    title="Price history"
                    description="Recorded price per litre"
                    icon={
                        <FuelIcon size={19} />
                    }
                >
                    <div className="chart-container">
                        {fuelPriceHistory.length ===
                        0 ? (
                            <EmptyState message="No fuel price history is available yet." />
                        ) : (
                            <LineChart
                                data={
                                    fuelPriceHistory
                                }
                                valueKey="price"
                                labelKey="date"
                                money
                            />
                        )}
                    </div>
                </AnalyticsCard>
            </AnalyticsSection>

            {/* Insights */}
            <AnalyticsSection
                eyebrow="Quick insights"
                title="A few things to keep an eye on"
                description="Use your recorded data to spot changes in spending and efficiency."
                last
            >
                <div className="analytics-insights-grid">
                    <div className="analytics-insight-card">
                        <div className="analytics-insight-icon">
                            <TrendingUpIcon
                                size={19}
                            />
                        </div>

                        <div>
                            <strong>
                                Fuel spending
                            </strong>

                            <p>
                                Compare your monthly
                                spending to identify
                                periods with unusually
                                high fuel costs.
                            </p>
                        </div>
                    </div>

                    <div className="analytics-insight-card">
                        <div className="analytics-insight-icon">
                            <GaugeIcon size={19} />
                        </div>

                        <div>
                            <strong>
                                Mileage
                            </strong>

                            <p>
                                Watch mileage trends
                                over time to identify
                                changes in vehicle fuel
                                efficiency.
                            </p>
                        </div>
                    </div>

                    <div className="analytics-insight-card">
                        <div className="analytics-insight-icon">
                            <FuelIcon size={19} />
                        </div>

                        <div>
                            <strong>
                                Fuel prices
                            </strong>

                            <p>
                                Use your price history
                                to understand how fuel
                                prices affect your total
                                spending.
                            </p>
                        </div>
                    </div>

                    <div className="analytics-insight-card">
                        <div className="analytics-insight-icon">
                            <RouteIcon size={19} />
                        </div>

                        <div>
                            <strong>
                                Trip performance
                            </strong>

                            <p>
                                Compare trip distance,
                                fuel consumption and
                                mileage to understand
                                your journeys better.
                            </p>
                        </div>
                    </div>
                </div>
            </AnalyticsSection>
        </main>
    );
}

export default Analytics;
