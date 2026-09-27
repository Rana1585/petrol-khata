import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../api";

function VehicleIcon({ size = 20 }) {
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
            aria-hidden="true"
        >
            <path d="M5 17h14" />
            <path d="M6 17H4a1 1 0 0 1-1-1v-4l2-6h14l2 6v4a1 1 0 0 1-1 1h-2" />
            <path d="M5 6l1.5-3h11L19 6" />
            <path d="M6 12h12" />
            <circle cx="7" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />
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
            aria-hidden="true"
        >
            <path d="M3 22V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17" />
            <path d="M3 8h12" />
            <path d="M7 5h4" />
            <path d="M17 7l2 2v8.5a2.5 2.5 0 0 0 5 0V11l-3-3" />
            <path d="M17 11h4" />
            <path d="M7 13h4" />
        </svg>
    );
}

function WrenchIcon({ size = 20 }) {
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
            aria-hidden="true"
        >
            <path d="M14.7 6.3a5 5 0 0 0-6.4 6.4l-5 5a2.1 2.1 0 0 0 3 3l5-5a5 5 0 0 0 6.4-6.4l-3.2 3.2-3-3 3.2-3.2Z" />
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
            aria-hidden="true"
        >
            <path d="M4 14a8 8 0 1 1 16 0" />
            <path d="M12 14l4-5" />
            <path d="M7 18h10" />
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
            aria-hidden="true"
        >
            <circle cx="6" cy="18" r="2.5" />
            <circle cx="18" cy="6" r="2.5" />
            <path d="M8.5 18c4 0 2-8 7-8" />
        </svg>
    );
}

function ArrowLeftIcon({ size = 16 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
        </svg>
    );
}

function VehicleDetails() {
    const { id } = useParams();

    const [vehicle, setVehicle] = useState(null);
    const [entries, setEntries] = useState([]);
    const [maintenance, setMaintenance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    async function loadData() {
        try {
            setLoading(true);

            const [
                vehiclesResponse,
                entriesResponse,
                maintenanceResponse,
            ] = await Promise.all([
                apiFetch("/vehicles"),
                apiFetch("/entries"),
                apiFetch("/vehicle-maintenance"),
            ]);

            const vehiclesData =
                await vehiclesResponse.json();

            const entriesData =
                await entriesResponse.json();

            const maintenanceData =
                await maintenanceResponse.json();

            const vehicles =
                vehiclesData.vehicles ||
                vehiclesData ||
                [];

            const allEntries =
                entriesData.entries ||
                entriesData ||
                [];

            const allMaintenance =
                maintenanceData.maintenance ||
                maintenanceData.records ||
                maintenanceData ||
                [];

            const selectedVehicle = vehicles.find(
                (item) =>
                    Number(item.id) === Number(id)
            );

            setVehicle(selectedVehicle || null);

            setEntries(
                allEntries.filter(
                    (entry) =>
                        Number(entry.vehicleId) ===
                        Number(id)
                )
            );

            setMaintenance(
                allMaintenance.filter(
                    (item) =>
                        Number(item.vehicleId) ===
                        Number(id)
                )
            );
        } catch (error) {
            console.error(
                "Failed to load vehicle details:",
                error
            );
        } finally {
            setLoading(false);
        }
    }

    function formatMoney(value) {
        return `Rs ${Number(
            value || 0
        ).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }

    const totalSpending = entries.reduce(
        (total, entry) =>
            total + Number(entry.totalPrice || 0),
        0
    );

    const totalFuel = entries.reduce(
        (total, entry) =>
            total + Number(entry.litres || 0),
        0
    );

    const totalDistance = entries.reduce(
        (total, entry) =>
            total + Number(entry.distance || 0),
        0
    );

    const mileageEntries = entries.filter(
        (entry) =>
            Number(entry.mileage) > 0
    );

    const averageMileage =
        mileageEntries.length > 0
            ? mileageEntries.reduce(
                  (total, entry) =>
                      total +
                      Number(entry.mileage),
                  0
              ) / mileageEntries.length
            : 0;

    const totalMaintenanceCost =
        maintenance.reduce(
            (total, item) =>
                total +
                Number(item.totalCost || 0),
            0
        );

    if (loading) {
        return (
            <main className="page">
                <div className="loading-state">
                    <div className="loading-spinner" />

                    <span>
                        Loading vehicle...
                    </span>
                </div>
            </main>
        );
    }

    if (!vehicle) {
        return (
            <main className="page vehicle-details-page">
                <div className="not-found-card">
                    <div className="not-found-icon">
                        <VehicleIcon size={28} />
                    </div>

                    <span className="section-kicker">
                        Vehicle
                    </span>

                    <h1>Vehicle Not Found</h1>

                    <p>
                        The selected vehicle does not
                        exist or is no longer available.
                    </p>

                    <Link
                        to="/vehicles"
                        className="secondary-button"
                    >
                        <ArrowLeftIcon size={16} />
                        Back to Vehicles
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="page vehicle-details-page">
            <div className="vehicle-detail-topbar">
                <Link
                    to="/vehicles"
                    className="back-link"
                >
                    <ArrowLeftIcon size={16} />
                    Back to Vehicles
                </Link>
            </div>

            <section className="vehicle-detail-hero">
                <div className="vehicle-detail-identity">
                    <div className="vehicle-detail-icon">
                        <VehicleIcon size={28} />
                    </div>

                    <div>
                        <div className="eyebrow">
                            Vehicle overview
                        </div>

                        <h1>{vehicle.name}</h1>

                        <div className="vehicle-detail-meta">
                            <span>
                                {vehicle.registration ||
                                    "No registration number"}
                            </span>

                            <span className="meta-separator">
                                •
                            </span>

                            <span>
                                {entries.length} fuel{" "}
                                {entries.length === 1
                                    ? "entry"
                                    : "entries"}
                            </span>
                        </div>
                    </div>
                </div>

                <span
                    className={
                        vehicle.active !== 0
                            ? "status-badge active"
                            : "status-badge"
                    }
                >
                    <span className="status-dot" />
                    {vehicle.active !== 0
                        ? "Active"
                        : "Inactive"}
                </span>
            </section>

            <section className="vehicle-detail-stats">
                <div className="detail-stat-card">
                    <div className="detail-stat-icon">
                        <FuelIcon size={20} />
                    </div>

                    <div>
                        <span>
                            Total Spending
                        </span>

                        <strong>
                            {formatMoney(
                                totalSpending
                            )}
                        </strong>
                    </div>
                </div>

                <div className="detail-stat-card">
                    <div className="detail-stat-icon">
                        <FuelIcon size={20} />
                    </div>

                    <div>
                        <span>Total Fuel</span>

                        <strong>
                            {totalFuel.toFixed(2)} L
                        </strong>
                    </div>
                </div>

                <div className="detail-stat-card">
                    <div className="detail-stat-icon">
                        <RouteIcon size={20} />
                    </div>

                    <div>
                        <span>
                            Total Distance
                        </span>

                        <strong>
                            {totalDistance.toLocaleString()}{" "}
                            km
                        </strong>
                    </div>
                </div>

                <div className="detail-stat-card">
                    <div className="detail-stat-icon">
                        <GaugeIcon size={20} />
                    </div>

                    <div>
                        <span>
                            Average Mileage
                        </span>

                        <strong>
                            {averageMileage
                                ? `${averageMileage.toFixed(
                                      2
                                  )} km/L`
                                : "—"}
                        </strong>
                    </div>
                </div>

                <div className="detail-stat-card">
                    <div className="detail-stat-icon">
                        <WrenchIcon size={20} />
                    </div>

                    <div>
                        <span>
                            Maintenance Cost
                        </span>

                        <strong>
                            {formatMoney(
                                totalMaintenanceCost
                            )}
                        </strong>
                    </div>
                </div>

                <div className="detail-stat-card">
                    <div className="detail-stat-icon">
                        <WrenchIcon size={20} />
                    </div>

                    <div>
                        <span>
                            Maintenance Records
                        </span>

                        <strong>
                            {maintenance.length}
                        </strong>
                    </div>
                </div>
            </section>

            <section className="table-card vehicle-history-card">
                <div className="card-header">
                    <div>
                        <span className="section-kicker">
                            Fuel records
                        </span>

                        <h2>Fuel History</h2>

                        <p>
                            Fuel entries recorded for{" "}
                            {vehicle.name}.
                        </p>
                    </div>

                    {entries.length > 0 && (
                        <div className="history-count">
                            {entries.length}
                            <span>
                                {entries.length === 1
                                    ? "entry"
                                    : "entries"}
                            </span>
                        </div>
                    )}
                </div>

                {entries.length === 0 ? (
                    <div className="empty-state vehicle-empty-state">
                        <div className="empty-state-icon">
                            <FuelIcon size={25} />
                        </div>

                        <strong>
                            No fuel entries yet
                        </strong>

                        <span>
                            There are no fuel records for
                            this vehicle.
                        </span>
                    </div>
                ) : (
                    <>
                        <div className="table-wrapper vehicle-desktop-table">
                            <table className="data-table vehicle-detail-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>
                                            Petrol Pump
                                        </th>
                                        <th>
                                            Price / L
                                        </th>
                                        <th>
                                            Litres
                                        </th>
                                        <th>Total</th>
                                        <th>
                                            Odometer
                                        </th>
                                        <th>
                                            Distance
                                        </th>
                                        <th>
                                            Mileage
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {entries.map(
                                        (entry) => (
                                            <tr
                                                key={
                                                    entry.id
                                                }
                                            >
                                                <td>
                                                    <span className="table-date">
                                                        {
                                                            entry.date
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            entry.pumpName
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    {formatMoney(
                                                        entry.price
                                                    )}
                                                </td>

                                                <td>
                                                    {Number(
                                                        entry.litres
                                                    ).toFixed(
                                                        2
                                                    )}{" "}
                                                    L
                                                </td>

                                                <td>
                                                    <strong className="table-total">
                                                        {formatMoney(
                                                            entry.totalPrice
                                                        )}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {Number(
                                                        entry.odometer
                                                    ).toLocaleString()}
                                                </td>

                                                <td>
                                                    {entry.distance
                                                        ? `${Number(
                                                              entry.distance
                                                          ).toLocaleString()} km`
                                                        : "—"}
                                                </td>

                                                <td>
                                                    {entry.mileage
                                                        ? `${Number(
                                                              entry.mileage
                                                          ).toFixed(
                                                              2
                                                          )} km/L`
                                                        : "—"}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="vehicle-mobile-list">
                            {entries.map((entry) => (
                                <article
                                    className="mobile-data-card vehicle-entry-mobile-card"
                                    key={entry.id}
                                >
                                    <div className="mobile-card-top">
                                        <div>
                                            <strong>
                                                {
                                                    entry.pumpName
                                                }
                                            </strong>

                                            <span className="mobile-card-muted">
                                                {
                                                    entry.date
                                                }
                                            </span>
                                        </div>

                                        <strong className="mobile-card-total">
                                            {formatMoney(
                                                entry.totalPrice
                                            )}
                                        </strong>
                                    </div>

                                    <div className="mobile-card-divider" />

                                    <div className="mobile-card-grid">
                                        <div>
                                            <span>
                                                Price / L
                                            </span>

                                            <strong>
                                                {formatMoney(
                                                    entry.price
                                                )}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Litres
                                            </span>

                                            <strong>
                                                {Number(
                                                    entry.litres
                                                ).toFixed(
                                                    2
                                                )}{" "}
                                                L
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Odometer
                                            </span>

                                            <strong>
                                                {Number(
                                                    entry.odometer
                                                ).toLocaleString()}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Distance
                                            </span>

                                            <strong>
                                                {entry.distance
                                                    ? `${Number(
                                                          entry.distance
                                                      ).toLocaleString()} km`
                                                    : "—"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Mileage
                                            </span>

                                            <strong>
                                                {entry.mileage
                                                    ? `${Number(
                                                          entry.mileage
                                                      ).toFixed(
                                                          2
                                                      )} km/L`
                                                    : "—"}
                                            </strong>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </>
                )}
            </section>

            <section className="table-card vehicle-maintenance-card">
                <div className="card-header">
                    <div>
                        <span className="section-kicker">
                            Vehicle care
                        </span>

                        <h2>
                            Maintenance History
                        </h2>

                        <p>
                            Maintenance work and
                            expenses for this vehicle.
                        </p>
                    </div>

                    <div className="maintenance-total">
                        <span>
                            Total maintenance
                        </span>

                        <strong>
                            {formatMoney(
                                totalMaintenanceCost
                            )}
                        </strong>
                    </div>
                </div>

                {maintenance.length === 0 ? (
                    <div className="empty-state vehicle-empty-state">
                        <div className="empty-state-icon">
                            <WrenchIcon size={25} />
                        </div>

                        <strong>
                            No maintenance records yet
                        </strong>

                        <span>
                            Maintenance history for this
                            vehicle will appear here.
                        </span>
                    </div>
                ) : (
                    <>
                        <div className="table-wrapper vehicle-desktop-table">
                            <table className="data-table maintenance-detail-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Meter</th>
                                        <th>
                                            Maintenance
                                        </th>
                                        <th>
                                            Total Cost
                                        </th>
                                        <th>Notes</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {maintenance.map(
                                        (item) => (
                                            <tr
                                                key={
                                                    item.id
                                                }
                                            >
                                                <td>
                                                    <span className="table-date">
                                                        {
                                                            item.date
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    {Number(
                                                        item.meterReading
                                                    ).toLocaleString()}
                                                </td>

                                                <td>
                                                    <div className="maintenance-items">
                                                        {item.mobileOil && (
                                                            <div>
                                                                <strong>
                                                                    Oil:
                                                                </strong>{" "}
                                                                {
                                                                    item.mobileOil
                                                                }
                                                            </div>
                                                        )}

                                                        {item.oilFilter && (
                                                            <div>
                                                                <strong>
                                                                    Oil Filter:
                                                                </strong>{" "}
                                                                {
                                                                    item.oilFilter
                                                                }
                                                            </div>
                                                        )}

                                                        {item.airFilter && (
                                                            <div>
                                                                <strong>
                                                                    Air Filter:
                                                                </strong>{" "}
                                                                {
                                                                    item.airFilter
                                                                }
                                                            </div>
                                                        )}

                                                        {item.otherMaintenance && (
                                                            <div>
                                                                <strong>
                                                                    Other:
                                                                </strong>{" "}
                                                                {
                                                                    item.otherMaintenance
                                                                }
                                                            </div>
                                                        )}

                                                        {!item.mobileOil &&
                                                            !item.oilFilter &&
                                                            !item.airFilter &&
                                                            !item.otherMaintenance && (
                                                                <span className="muted-value">
                                                                    No item
                                                                    details
                                                                </span>
                                                            )}
                                                    </div>
                                                </td>

                                                <td>
                                                    <strong className="table-total">
                                                        {formatMoney(
                                                            item.totalCost
                                                        )}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {item.notes ||
                                                        "—"}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="vehicle-mobile-list">
                            {maintenance.map((item) => (
                                <article
                                    className="mobile-data-card maintenance-mobile-card"
                                    key={item.id}
                                >
                                    <div className="mobile-card-top">
                                        <div>
                                            <strong>
                                                Maintenance
                                            </strong>

                                            <span className="mobile-card-muted">
                                                {
                                                    item.date
                                                }
                                            </span>
                                        </div>

                                        <strong className="mobile-card-total">
                                            {formatMoney(
                                                item.totalCost
                                            )}
                                        </strong>
                                    </div>

                                    <div className="mobile-maintenance-meter">
                                        <GaugeIcon
                                            size={15}
                                        />

                                        <span>
                                            Meter reading
                                        </span>

                                        <strong>
                                            {Number(
                                                item.meterReading
                                            ).toLocaleString()}{" "}
                                            km
                                        </strong>
                                    </div>

                                    <div className="mobile-card-divider" />

                                    <div className="mobile-maintenance-items">
                                        {item.mobileOil && (
                                            <div>
                                                <span>
                                                    Oil
                                                </span>

                                                <strong>
                                                    {
                                                        item.mobileOil
                                                    }
                                                </strong>
                                            </div>
                                        )}

                                        {item.oilFilter && (
                                            <div>
                                                <span>
                                                    Oil Filter
                                                </span>

                                                <strong>
                                                    {
                                                        item.oilFilter
                                                    }
                                                </strong>
                                            </div>
                                        )}

                                        {item.airFilter && (
                                            <div>
                                                <span>
                                                    Air Filter
                                                </span>

                                                <strong>
                                                    {
                                                        item.airFilter
                                                    }
                                                </strong>
                                            </div>
                                        )}

                                        {item.otherMaintenance && (
                                            <div>
                                                <span>
                                                    Other
                                                </span>

                                                <strong>
                                                    {
                                                        item.otherMaintenance
                                                    }
                                                </strong>
                                            </div>
                                        )}
                                    </div>

                                    {item.notes && (
                                        <div className="mobile-maintenance-notes">
                                            <span>
                                                Notes
                                            </span>

                                            <p>
                                                {
                                                    item.notes
                                                }
                                            </p>
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}

export default VehicleDetails;