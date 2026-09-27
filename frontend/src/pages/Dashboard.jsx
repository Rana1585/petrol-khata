
import { useEffect, useState } from "react";
import { apiFetch } from "../api";

/* ─────────────────────────────────────────────
   Icons
───────────────────────────────────────────── */

function CalendarIcon({ size = 19 }) {
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

function CheckIcon({ size = 20 }) {
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
            <path d="m5 12 4 4L19 6" />
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

function AlertIcon({ size = 22 }) {
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
            <path d="M10.3 4.5 3.7 17a2 2 0 0 0 1.8 3h13a2 2 0 0 0 1.8-3L13.7 4.5a2 2 0 0 0-3.4 0Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
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

/* ─────────────────────────────────────────────
   Main Dashboard
───────────────────────────────────────────── */

function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard(showInitialLoading = true) {
        try {
            if (showInitialLoading) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError("");

            const result = await apiFetch("/dashboard");

            setData(result);
        } catch (err) {
            console.error(
                "Dashboard loading error:",
                err
            );

            setError(
                err?.message ||
                    "Unable to load dashboard."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    if (loading) {
        return (
            <main className="page dashboard-page">
                <div className="dashboard-loading">
                    <div className="dashboard-loading-icon">
                        <ChartLoadingIcon />
                    </div>

                    <div>
                        <strong>
                            Loading dashboard
                        </strong>

                        <span>
                            Fetching your latest vehicle
                            data...
                        </span>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="page dashboard-page">
                <div className="dashboard-error">
                    <div className="dashboard-error-icon">
                        <AlertIcon size={22} />
                    </div>

                    <div className="dashboard-error-content">
                        <strong>
                            Unable to load dashboard
                        </strong>

                        <span>
                            {error}
                        </span>
                    </div>

                    <button
                        type="button"
                        className="dashboard-retry-button"
                        onClick={() =>
                            loadDashboard(false)
                        }
                    >
                        Try again
                    </button>
                </div>
            </main>
        );
    }

    const summary = data?.summary || {};

    const currentPrice =
        data?.currentFuelPrice?.price || 0;

    const activeVehicles =
        summary.activeVehicles || 0;

    const totalTrips =
        summary.totalTrips || 0;

    const completedTrips =
        summary.completedTrips || 0;

    const recentEntries =
        data?.recentEntries || [];

    const recentTrips =
        data?.recentTrips || [];

    return (
        <main className="page dashboard-page">
            {/* Page header */}

            <header className="dashboard-page-header">
                <div className="dashboard-page-heading">
                    <span className="dashboard-eyebrow">
                        Overview
                    </span>

                    <h1>Dashboard</h1>

                    <p>
                        A clear overview of your vehicles,
                        fuel spending and recent activity.
                    </p>
                </div>

                <button
                    type="button"
                    className="dashboard-refresh-button"
                    onClick={() =>
                        loadDashboard(false)
                    }
                    disabled={refreshing}
                >
                    <span
                        className={
                            refreshing
                                ? "dashboard-refresh-icon spinning"
                                : "dashboard-refresh-icon"
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

            {/* Petrol price */}

            <section className="fuel-price-card">
                <div className="fuel-price-main">
                    <div className="fuel-price-icon">
                        <FuelIcon size={23} />
                    </div>

                    <div className="fuel-price-info">
                        <span className="fuel-price-label">
                            Current petrol price
                        </span>

                        <div className="fuel-price-value">
                            <strong>
                                {formatMoney(
                                    currentPrice
                                )}
                            </strong>

                            <span>
                                / litre
                            </span>
                        </div>

                        {data?.currentFuelPrice
                            ?.effectiveDate && (
                            <small>
                                Effective from{" "}
                                {
                                    data.currentFuelPrice
                                        .effectiveDate
                                }
                            </small>
                        )}
                    </div>
                </div>

                <div className="fuel-price-status">
                    <span className="status-dot" />
                    <span>Latest price</span>
                </div>
            </section>

            {/* Stats */}

            <section className="dashboard-stat-grid">
                <DashboardStatCard
                    label="Total spending"
                    value={formatMoney(
                        summary.totalSpending || 0
                    )}
                    description="Total fuel expenses"
                    icon={
                        <MoneyIcon size={21} />
                    }
                />

                <DashboardStatCard
                    label="Total fuel"
                    value={`${formatNumber(
                        summary.totalFuel || 0,
                        1
                    )} L`}
                    description="Fuel purchased"
                    icon={
                        <FuelIcon size={21} />
                    }
                />

                <DashboardStatCard
                    label="Total distance"
                    value={`${formatNumber(
                        summary.totalDistance || 0
                    )} km`}
                    description="Distance tracked"
                    icon={
                        <RouteIcon size={21} />
                    }
                />

                <DashboardStatCard
                    label="Average mileage"
                    value={`${formatNumber(
                        summary.averageMileage || 0,
                        2
                    )} km/L`}
                    description="Overall average"
                    icon={
                        <GaugeIcon size={21} />
                    }
                />

                <DashboardStatCard
                    label="Active vehicles"
                    value={formatNumber(
                        activeVehicles
                    )}
                    description="Currently active"
                    icon={
                        <CarIcon size={21} />
                    }
                />

                <DashboardStatCard
                    label="Total trips"
                    value={formatNumber(totalTrips)}
                    description={`${formatNumber(
                        completedTrips
                    )} completed`}
                    icon={
                        <RouteIcon size={21} />
                    }
                />
            </section>

            {/* Recent activity */}

            <section className="dashboard-section">
                <div className="dashboard-section-header">
                    <div>
                        <span className="dashboard-section-eyebrow">
                            Activity
                        </span>

                        <h2>
                            Recent activity
                        </h2>

                        <p>
                            Your latest fuel purchases and
                            journeys.
                        </p>
                    </div>
                </div>

                <div className="dashboard-activity-grid">
                    {/* Recent fuel */}

                    <DashboardActivityCard
                        title="Recent fuel entries"
                        description="Your latest fuel purchases"
                        count={recentEntries.length}
                        icon={
                            <FuelIcon size={19} />
                        }
                    >
                        {recentEntries.length > 0 ? (
                            <div className="dashboard-activity-list">
                                {recentEntries.map(
                                    (entry) => (
                                        <FuelActivityItem
                                            key={entry.id}
                                            entry={entry}
                                        />
                                    )
                                )}
                            </div>
                        ) : (
                            <DashboardEmpty
                                icon={
                                    <FuelIcon
                                        size={22}
                                    />
                                }
                                title="No fuel entries yet"
                                description="Your latest fuel purchases will appear here."
                            />
                        )}
                    </DashboardActivityCard>

                    {/* Recent trips */}

                    <DashboardActivityCard
                        title="Recent trips"
                        description="Your latest journeys"
                        count={recentTrips.length}
                        icon={
                            <RouteIcon size={19} />
                        }
                    >
                        {recentTrips.length > 0 ? (
                            <div className="dashboard-activity-list">
                                {recentTrips.map(
                                    (trip) => (
                                        <TripActivityItem
                                            key={trip.id}
                                            trip={trip}
                                        />
                                    )
                                )}
                            </div>
                        ) : (
                            <DashboardEmpty
                                icon={
                                    <RouteIcon
                                        size={22}
                                    />
                                }
                                title="No trips yet"
                                description="Your latest journeys will appear here."
                            />
                        )}
                    </DashboardActivityCard>
                </div>
            </section>

            {/* Quick overview */}

            <section className="dashboard-overview-card">
                <div className="dashboard-overview-heading">
                    <div>
                        <span className="dashboard-section-eyebrow">
                            Quick overview
                        </span>

                        <h2>
                            Your vehicle activity
                        </h2>

                        <p>
                            A quick look at your current
                            activity levels.
                        </p>
                    </div>
                </div>

                <div className="dashboard-overview-grid">
                    <OverviewItem
                        icon={
                            <CarIcon size={20} />
                        }
                        label="Active vehicles"
                        value={activeVehicles}
                    />

                    <OverviewItem
                        icon={
                            <RouteIcon size={20} />
                        }
                        label="Total trips"
                        value={totalTrips}
                    />

                    <OverviewItem
                        icon={
                            <CheckIcon size={20} />
                        }
                        label="Completed trips"
                        value={completedTrips}
                    />
                </div>
            </section>
        </main>
    );
}

/* ─────────────────────────────────────────────
   Dashboard stat
───────────────────────────────────────────── */

function DashboardStatCard({
    label,
    value,
    description,
    icon,
}) {
    return (
        <article className="dashboard-stat-card">
            <div className="dashboard-stat-top">
                <div className="dashboard-stat-icon">
                    {icon}
                </div>
            </div>

            <span className="dashboard-stat-label">
                {label}
            </span>

            <strong className="dashboard-stat-value">
                {value}
            </strong>

            <span className="dashboard-stat-description">
                {description}
            </span>
        </article>
    );
}

/* ─────────────────────────────────────────────
   Activity card
───────────────────────────────────────────── */

function DashboardActivityCard({
    title,
    description,
    count,
    icon,
    children,
}) {
    return (
        <article className="dashboard-activity-card">
            <div className="dashboard-activity-header">
                <div className="dashboard-activity-title">
                    <div className="dashboard-activity-icon">
                        {icon}
                    </div>

                    <div>
                        <h3>{title}</h3>

                        <p>{description}</p>
                    </div>
                </div>

                <span className="dashboard-activity-count">
                    {count}
                </span>
            </div>

            {children}
        </article>
    );
}

/* ─────────────────────────────────────────────
   Fuel activity
───────────────────────────────────────────── */

function FuelActivityItem({ entry }) {
    return (
        <div className="dashboard-activity-item">
            <div className="dashboard-activity-item-icon">
                <FuelIcon size={18} />
            </div>

            <div className="dashboard-activity-item-main">
                <strong>
                    {entry.pumpName ||
                        "Fuel purchase"}
                </strong>

                <span>
                    {entry.vehicleName ||
                        "Unknown vehicle"}

                    <i>•</i>

                    {entry.date || "—"}
                </span>
            </div>

            <div className="dashboard-activity-item-side">
                <strong>
                    {formatMoney(
                        entry.totalPrice || 0
                    )}
                </strong>

                <span>
                    {formatNumber(
                        entry.litres || 0,
                        1
                    )}{" "}
                    L
                </span>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Trip activity
───────────────────────────────────────────── */

function TripActivityItem({ trip }) {
    return (
        <div className="dashboard-activity-item">
            <div className="dashboard-activity-item-icon trip">
                <RouteIcon size={18} />
            </div>

            <div className="dashboard-activity-item-main">
                <strong>
                    {trip.name ||
                        "Unnamed trip"}
                </strong>

                <span>
                    {trip.startLocation ||
                        "Start"}

                    <i>→</i>

                    {trip.destination ||
                        "Destination"}
                </span>
            </div>

            <div className="dashboard-activity-item-side">
                <strong>
                    {trip.vehicleName ||
                        "Unknown vehicle"}
                </strong>

                <span>
                    {trip.startDate || "—"}
                </span>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Empty activity
───────────────────────────────────────────── */

function DashboardEmpty({
    icon,
    title,
    description,
}) {
    return (
        <div className="dashboard-empty">
            <div className="dashboard-empty-icon">
                {icon}
            </div>

            <strong>{title}</strong>

            <span>{description}</span>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Overview item
───────────────────────────────────────────── */

function OverviewItem({
    icon,
    label,
    value,
}) {
    return (
        <div className="dashboard-overview-item">
            <div className="dashboard-overview-icon">
                {icon}
            </div>

            <div>
                <span>{label}</span>

                <strong>{formatNumber(value)}</strong>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Loading icon
───────────────────────────────────────────── */

function ChartLoadingIcon() {
    return (
        <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 19V5" />
            <path d="M4 19h16" />
            <path d="m7 15 3-4 3 2 5-7" />
        </svg>
    );
}

export default Dashboard;
