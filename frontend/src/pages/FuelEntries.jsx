import { useEffect, useState } from "react";
import { apiFetch } from "../api";

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

function PlusIcon({ size = 18 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
        >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
        </svg>
    );
}

function CalendarIcon({ size = 17 }) {
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
            <rect x="3" y="4" width="18" height="17" rx="2" />
            <path d="M16 2v4" />
            <path d="M8 2v4" />
            <path d="M3 9h18" />
        </svg>
    );
}

function VehicleIcon({ size = 17 }) {
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

function RouteIcon({ size = 17 }) {
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

function TrashIcon({ size = 16 }) {
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
            <path d="M4 7h16" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M6 7l1 14h10l1-14" />
            <path d="M9 7V4h6v3" />
        </svg>
    );
}

function ChevronDownIcon({ size = 16 }) {
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
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

function FuelEntries() {
    const [entries, setEntries] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [trips, setTrips] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        vehicleId: "",
        date: "",
        pumpName: "",
        price: "",
        litres: "",
        odometer: "",
        tripId: "",
    });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            setError("");

            const [
                entriesResponse,
                vehiclesResponse,
                tripsResponse,
            ] = await Promise.all([
                apiFetch("/entries"),
                apiFetch("/vehicles"),
                apiFetch("/trips"),
            ]);

            if (
                !entriesResponse.ok ||
                !vehiclesResponse.ok ||
                !tripsResponse.ok
            ) {
                throw new Error(
                    "Failed to load fuel data"
                );
            }

            const entriesData =
                await entriesResponse.json();

            const vehiclesData =
                await vehiclesResponse.json();

            const tripsData =
                await tripsResponse.json();

            setEntries(
                entriesData.entries ||
                    entriesData ||
                    []
            );

            setVehicles(
                vehiclesData.vehicles ||
                    vehiclesData ||
                    []
            );

            setTrips(
                tripsData.trips ||
                    tripsData ||
                    []
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    function resetForm() {
        setForm({
            vehicleId: "",
            date: "",
            pumpName: "",
            price: "",
            litres: "",
            odometer: "",
            tripId: "",
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            const response = await apiFetch(
                "/entries",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        vehicleId:
                            Number(form.vehicleId),
                        date: form.date,
                        pumpName: form.pumpName,
                        price: Number(form.price),
                        litres: Number(form.litres),
                        odometer:
                            Number(form.odometer),
                        tripId: form.tripId
                            ? Number(form.tripId)
                            : null,
                    }),
                }
            );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error ||
                        "Failed to add fuel entry"
                );
            }

            resetForm();
            setShowForm(false);

            await loadData();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id) {
        const confirmed = window.confirm(
            "Delete this fuel entry?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            const response = await apiFetch(
                `/entries/${id}`,
                {
                    method: "DELETE",
                }
            );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error ||
                        "Failed to delete entry"
                );
            }

            await loadData();
        } catch (err) {
            setError(err.message);
        }
    }

    if (loading) {
        return (
            <main className="page">
                <div className="loading-state">
                    <div className="loading-spinner" />
                    <span>
                        Loading fuel entries...
                    </span>
                </div>
            </main>
        );
    }

    const activeVehicles = vehicles.filter(
        (vehicle) => vehicle.active !== 0
    );

    return (
        <main className="page fuel-entries-page">
            <div className="page-header fuel-page-header">
                <div className="page-title-block">
                    <div className="eyebrow">
                        <span className="eyebrow-icon">
                            <FuelIcon size={14} />
                        </span>
                        Fuel management
                    </div>

                    <h1>Fuel Entries</h1>

                    <p>
                        Record and manage every fuel
                        purchase in one place.
                    </p>
                </div>

                <div className="page-actions">
                    <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                            setShowForm(
                                (current) => !current
                            )
                        }
                    >
                        {showForm ? (
                            <>
                                <span>Close Form</span>
                            </>
                        ) : (
                            <>
                                <PlusIcon size={18} />
                                <span>
                                    Add Fuel Entry
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <section className="fuel-entry-summary">
                <div className="fuel-summary-card">
                    <div className="fuel-summary-icon">
                        <FuelIcon size={20} />
                    </div>

                    <div>
                        <span>
                            Total Entries
                        </span>

                        <strong>
                            {entries.length}
                        </strong>
                    </div>
                </div>

                <div className="fuel-summary-card">
                    <div className="fuel-summary-icon">
                        <VehicleIcon size={20} />
                    </div>

                    <div>
                        <span>
                            Active Vehicles
                        </span>

                        <strong>
                            {activeVehicles.length}
                        </strong>
                    </div>
                </div>

                <div className="fuel-summary-card">
                    <div className="fuel-summary-icon">
                        <RouteIcon size={20} />
                    </div>

                    <div>
                        <span>
                            Trip-linked Entries
                        </span>

                        <strong>
                            {
                                entries.filter(
                                    (entry) =>
                                        entry.tripId !=
                                        null
                                ).length
                            }
                        </strong>
                    </div>
                </div>
            </section>

            {error && (
                <div className="error-state fuel-error">
                    <div>
                        <strong>
                            Something went wrong
                        </strong>
                        <span>{error}</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setError("")}
                        aria-label="Dismiss error"
                    >
                        ×
                    </button>
                </div>
            )}

            {showForm && (
                <section className="form-card fuel-form-card">
                    <div className="form-card-heading">
                        <div className="form-card-icon">
                            <PlusIcon size={20} />
                        </div>

                        <div>
                            <span className="section-kicker">
                                New record
                            </span>

                            <h2>
                                Add Fuel Entry
                            </h2>

                            <p>
                                Enter the fuel purchase
                                and odometer information.
                                Your totals and mileage
                                calculations remain
                                handled by the backend.
                            </p>
                        </div>
                    </div>

                    <form
                        className="entry-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-section">
                            <div className="form-section-title">
                                <span>
                                    Purchase details
                                </span>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="vehicleId">
                                        <VehicleIcon
                                            size={15}
                                        />
                                        Vehicle
                                    </label>

                                    <div className="select-wrapper">
                                        <select
                                            id="vehicleId"
                                            name="vehicleId"
                                            value={
                                                form.vehicleId
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select vehicle
                                            </option>

                                            {activeVehicles.map(
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
                                                            ? ` (${vehicle.registration})`
                                                            : ""}
                                                    </option>
                                                )
                                            )}
                                        </select>

                                        <ChevronDownIcon />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="date">
                                        <CalendarIcon
                                            size={15}
                                        />
                                        Date
                                    </label>

                                    <input
                                        id="date"
                                        type="date"
                                        name="date"
                                        value={
                                            form.date
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group form-group-wide">
                                    <label htmlFor="pumpName">
                                        Petrol Pump
                                    </label>

                                    <input
                                        id="pumpName"
                                        type="text"
                                        name="pumpName"
                                        placeholder="e.g. PSO Canal Road"
                                        value={
                                            form.pumpName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="price">
                                        Price / Litre
                                    </label>

                                    <div className="input-with-prefix">
                                        <span>Rs</span>

                                        <input
                                            id="price"
                                            type="number"
                                            name="price"
                                            min="0"
                                            step="0.01"
                                            placeholder="275"
                                            value={
                                                form.price
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="litres">
                                        Litres
                                    </label>

                                    <div className="input-with-suffix">
                                        <input
                                            id="litres"
                                            type="number"
                                            name="litres"
                                            min="0"
                                            step="0.01"
                                            placeholder="30"
                                            value={
                                                form.litres
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                        <span>L</span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="odometer">
                                        Odometer
                                    </label>

                                    <div className="input-with-suffix">
                                        <input
                                            id="odometer"
                                            type="number"
                                            name="odometer"
                                            min="0"
                                            step="0.1"
                                            placeholder="50000"
                                            value={
                                                form.odometer
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                        <span>km</span>
                                    </div>
                                </div>

                                <div className="form-group form-group-wide">
                                    <label htmlFor="tripId">
                                        <RouteIcon
                                            size={15}
                                        />
                                        Trip
                                    </label>

                                    <div className="select-wrapper">
                                        <select
                                            id="tripId"
                                            name="tripId"
                                            value={
                                                form.tripId
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        >
                                            <option value="">
                                                No trip
                                            </option>

                                            {trips.map(
                                                (
                                                    trip
                                                ) => (
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
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>

                                        <ChevronDownIcon />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() => {
                                    resetForm();
                                    setShowForm(
                                        false
                                    );
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="primary-button"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <span className="button-spinner" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <PlusIcon
                                            size={17}
                                        />
                                        Save Entry
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="table-card fuel-history-card">
                <div className="card-header fuel-history-header">
                    <div>
                        <div className="section-kicker">
                            Records
                        </div>

                        <h2>Fuel History</h2>

                        <p>
                            {entries.length}{" "}
                            {entries.length === 1
                                ? "entry"
                                : "entries"}{" "}
                            recorded
                        </p>
                    </div>

                    {entries.length > 0 && (
                        <div className="history-count">
                            {entries.length}
                            <span>
                                total
                            </span>
                        </div>
                    )}
                </div>

                {entries.length === 0 ? (
                    <div className="empty-state fuel-empty-state">
                        <div className="empty-state-icon">
                            <FuelIcon size={25} />
                        </div>

                        <strong>
                            No fuel entries yet
                        </strong>

                        <span>
                            Add your first fuel purchase
                            to start tracking your
                            expenses.
                        </span>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={() =>
                                setShowForm(true)
                            }
                        >
                            <PlusIcon size={17} />
                            Add Fuel Entry
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="table-wrapper fuel-desktop-table">
                            <table className="data-table fuel-data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Vehicle</th>
                                        <th>
                                            Petrol Pump
                                        </th>
                                        <th>Price / L</th>
                                        <th>Litres</th>
                                        <th>Total</th>
                                        <th>Odometer</th>
                                        <th>Distance</th>
                                        <th>Mileage</th>
                                        <th>Trip</th>
                                        <th>Action</th>
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
                                                    <div className="table-vehicle">
                                                        <strong>
                                                            {entry.vehicleName ||
                                                                "—"}
                                                        </strong>

                                                        {entry.vehicleRegistration && (
                                                            <span className="table-subtext">
                                                                {
                                                                    entry.vehicleRegistration
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="table-pump-name">
                                                        {
                                                            entry.pumpName
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    Rs{" "}
                                                    {Number(
                                                        entry.price ||
                                                            0
                                                    ).toLocaleString()}
                                                </td>

                                                <td>
                                                    {Number(
                                                        entry.litres ||
                                                            0
                                                    ).toFixed(
                                                        2
                                                    )}{" "}
                                                    L
                                                </td>

                                                <td>
                                                    <strong className="table-total">
                                                        Rs{" "}
                                                        {Number(
                                                            entry.totalPrice ||
                                                                0
                                                        ).toLocaleString()}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {Number(
                                                        entry.odometer ||
                                                            0
                                                    ).toLocaleString()}
                                                </td>

                                                <td>
                                                    {entry.distance !=
                                                    null
                                                        ? `${Number(
                                                              entry.distance
                                                          ).toFixed(
                                                              0
                                                          )} km`
                                                        : "—"}
                                                </td>

                                                <td>
                                                    {entry.mileage !=
                                                    null
                                                        ? `${Number(
                                                              entry.mileage
                                                          ).toFixed(
                                                              2
                                                          )} km/L`
                                                        : "—"}
                                                </td>

                                                <td>
                                                    {entry.tripName ? (
                                                        <span className="trip-badge">
                                                            {
                                                                entry.tripName
                                                            }
                                                        </span>
                                                    ) : (
                                                        <span className="muted-value">
                                                            —
                                                        </span>
                                                    )}
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        className="delete-button table-delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                entry.id
                                                            )
                                                        }
                                                        title="Delete fuel entry"
                                                    >
                                                        <TrashIcon
                                                            size={
                                                                15
                                                            }
                                                        />
                                                        <span>
                                                            Delete
                                                        </span>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="fuel-mobile-list">
                            {entries.map((entry) => (
                                <article
                                    className="mobile-data-card fuel-mobile-card"
                                    key={entry.id}
                                >
                                    <div className="mobile-card-top">
                                        <div className="mobile-vehicle-heading">
                                            <div className="mobile-vehicle-icon">
                                                <VehicleIcon
                                                    size={
                                                        17
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <strong>
                                                    {entry.vehicleName ||
                                                        "Unknown vehicle"}
                                                </strong>

                                                {entry.vehicleRegistration && (
                                                    <span className="mobile-card-muted">
                                                        {
                                                            entry.vehicleRegistration
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <span className="mobile-card-date">
                                            {
                                                entry.date
                                            }
                                        </span>
                                    </div>

                                    <div className="mobile-card-main">
                                        <div>
                                            <span>
                                                Petrol Pump
                                            </span>

                                            <strong>
                                                {entry.pumpName ||
                                                    "—"}
                                            </strong>
                                        </div>

                                        <div className="mobile-total-block">
                                            <span>
                                                Total
                                            </span>

                                            <strong className="mobile-card-total">
                                                Rs{" "}
                                                {Number(
                                                    entry.totalPrice ||
                                                        0
                                                ).toLocaleString()}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="mobile-card-divider" />

                                    <div className="mobile-card-grid">
                                        <div>
                                            <span>
                                                Price / L
                                            </span>

                                            <strong>
                                                Rs{" "}
                                                {Number(
                                                    entry.price ||
                                                        0
                                                ).toLocaleString()}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Litres
                                            </span>

                                            <strong>
                                                {Number(
                                                    entry.litres ||
                                                        0
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
                                                    entry.odometer ||
                                                        0
                                                ).toLocaleString()}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Distance
                                            </span>

                                            <strong>
                                                {entry.distance !=
                                                null
                                                    ? `${Number(
                                                          entry.distance
                                                      ).toFixed(
                                                          0
                                                      )} km`
                                                    : "—"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Mileage
                                            </span>

                                            <strong>
                                                {entry.mileage !=
                                                null
                                                    ? `${Number(
                                                          entry.mileage
                                                      ).toFixed(
                                                          2
                                                      )} km/L`
                                                    : "—"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Trip
                                            </span>

                                            <strong>
                                                {entry.tripName ||
                                                    "No trip"}
                                            </strong>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="delete-button mobile-delete-button"
                                        onClick={() =>
                                            handleDelete(
                                                entry.id
                                            )
                                        }
                                    >
                                        <TrashIcon
                                            size={16}
                                        />
                                        Delete Entry
                                    </button>
                                </article>
                            ))}
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}

export default FuelEntries;