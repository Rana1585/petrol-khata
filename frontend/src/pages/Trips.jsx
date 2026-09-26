import { useEffect, useState } from "react";
import { apiFetch } from "../api";

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

function FuelIcon({ size = 17 }) {
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

function GaugeIcon({ size = 17 }) {
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

function Trips() {
    const [trips, setTrips] = useState([]);
    const [vehicles, setVehicles] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        vehicleId: "",
        name: "",
        startLocation: "",
        destination: "",
        startDate: "",
        endDate: "",
        startOdometer: "",
        endOdometer: "",
    });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            setError("");

            const [
                tripsResponse,
                vehiclesResponse,
            ] = await Promise.all([
                apiFetch("/trips"),
                apiFetch("/vehicles"),
            ]);

            if (
                !tripsResponse.ok ||
                !vehiclesResponse.ok
            ) {
                throw new Error(
                    "Failed to load trip data"
                );
            }

            const tripsData =
                await tripsResponse.json();

            const vehiclesData =
                await vehiclesResponse.json();

            setTrips(
                tripsData.trips ||
                    tripsData ||
                    []
            );

            setVehicles(
                vehiclesData.vehicles ||
                    vehiclesData ||
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
            name: "",
            startLocation: "",
            destination: "",
            startDate: "",
            endDate: "",
            startOdometer: "",
            endOdometer: "",
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            const response = await apiFetch(
                "/trips",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        vehicleId: Number(
                            form.vehicleId
                        ),
                        name: form.name,
                        startLocation:
                            form.startLocation,
                        destination:
                            form.destination,
                        startDate:
                            form.startDate,
                        endDate:
                            form.endDate || null,
                        startOdometer: Number(
                            form.startOdometer
                        ),
                        endOdometer:
                            form.endOdometer
                                ? Number(
                                      form.endOdometer
                                  )
                                : null,
                    }),
                }
            );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error ||
                        "Failed to create trip"
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
            "Delete this trip?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            const response = await apiFetch(
                `/trips/${id}`,
                {
                    method: "DELETE",
                }
            );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error ||
                        "Failed to delete trip"
                );
            }

            await loadData();
        } catch (err) {
            setError(err.message);
        }
    }

    function formatNumber(value) {
        if (value == null) {
            return "—";
        }

        return Number(value).toLocaleString();
    }

    if (loading) {
        return (
            <main className="page">
                <div className="loading-state">
                    <div className="loading-spinner" />
                    <span>
                        Loading trips...
                    </span>
                </div>
            </main>
        );
    }

    const activeVehicles = vehicles.filter(
        (vehicle) => vehicle.active !== 0
    );

    return (
        <main className="page trips-page">
            <div className="page-header trips-page-header">
                <div className="page-title-block">
                    <div className="eyebrow">
                        <span className="eyebrow-icon">
                            <RouteIcon size={14} />
                        </span>
                        Journey management
                    </div>

                    <h1>Trips</h1>

                    <p>
                        Track your longer journeys
                        and understand their fuel
                        usage and costs.
                    </p>
                </div>

                <div className="page-actions">
                    <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                            setShowForm(
                                (current) =>
                                    !current
                            )
                        }
                    >
                        {showForm ? (
                            <span>
                                Close Form
                            </span>
                        ) : (
                            <>
                                <PlusIcon size={18} />
                                <span>
                                    Add Trip
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <section className="trip-summary-grid">
                <div className="trip-summary-card">
                    <div className="trip-summary-icon">
                        <RouteIcon size={20} />
                    </div>

                    <div>
                        <span>
                            Total Trips
                        </span>

                        <strong>
                            {trips.length}
                        </strong>
                    </div>
                </div>

                <div className="trip-summary-card">
                    <div className="trip-summary-icon">
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

                <div className="trip-summary-card">
                    <div className="trip-summary-icon">
                        <GaugeIcon size={20} />
                    </div>

                    <div>
                        <span>
                            Completed Trips
                        </span>

                        <strong>
                            {
                                trips.filter(
                                    (trip) =>
                                        trip.endDate
                                ).length
                            }
                        </strong>
                    </div>
                </div>
            </section>

            {error && (
                <div className="error-state trip-error">
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
                <section className="form-card trip-form-card">
                    <div className="form-card-heading">
                        <div className="form-card-icon">
                            <RouteIcon size={21} />
                        </div>

                        <div>
                            <span className="section-kicker">
                                New journey
                            </span>

                            <h2>Create Trip</h2>

                            <p>
                                Record the route,
                                vehicle, dates and
                                odometer readings for
                                your journey.
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
                                    Trip details
                                </span>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>
                                        <VehicleIcon
                                            size={15}
                                        />
                                        Vehicle
                                    </label>

                                    <div className="select-wrapper">
                                        <select
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
                                    <label>
                                        Trip Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Lahore to Islamabad"
                                        value={
                                            form.name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Starting Location
                                    </label>

                                    <input
                                        type="text"
                                        name="startLocation"
                                        placeholder="Lahore"
                                        value={
                                            form.startLocation
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Destination
                                    </label>

                                    <input
                                        type="text"
                                        name="destination"
                                        placeholder="Islamabad"
                                        value={
                                            form.destination
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <div className="form-section-title">
                                <span>
                                    Journey timeline
                                </span>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>
                                        <CalendarIcon
                                            size={15}
                                        />
                                        Start Date
                                    </label>

                                    <input
                                        type="date"
                                        name="startDate"
                                        value={
                                            form.startDate
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        <CalendarIcon
                                            size={15}
                                        />
                                        End Date
                                    </label>

                                    <input
                                        type="date"
                                        name="endDate"
                                        value={
                                            form.endDate
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <div className="form-section-title">
                                <span>
                                    Odometer readings
                                </span>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>
                                        <GaugeIcon
                                            size={15}
                                        />
                                        Start Odometer
                                    </label>

                                    <div className="input-with-suffix">
                                        <input
                                            type="number"
                                            name="startOdometer"
                                            min="0"
                                            step="0.1"
                                            placeholder="50300"
                                            value={
                                                form.startOdometer
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                        <span>
                                            km
                                        </span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>
                                        <GaugeIcon
                                            size={15}
                                        />
                                        End Odometer
                                    </label>

                                    <div className="input-with-suffix">
                                        <input
                                            type="number"
                                            name="endOdometer"
                                            min="0"
                                            step="0.1"
                                            placeholder="51050"
                                            value={
                                                form.endOdometer
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                        <span>
                                            km
                                        </span>
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
                                        Save Trip
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="table-card trip-history-card">
                <div className="card-header trip-history-header">
                    <div>
                        <div className="section-kicker">
                            Journey records
                        </div>

                        <h2>Trip History</h2>

                        <p>
                            {trips.length}{" "}
                            {trips.length === 1
                                ? "trip"
                                : "trips"}{" "}
                            recorded
                        </p>
                    </div>

                    {trips.length > 0 && (
                        <div className="history-count">
                            {trips.length}
                            <span>
                                total
                            </span>
                        </div>
                    )}
                </div>

                {trips.length === 0 ? (
                    <div className="empty-state trip-empty-state">
                        <div className="empty-state-icon">
                            <RouteIcon size={26} />
                        </div>

                        <strong>
                            No trips yet
                        </strong>

                        <span>
                            Create your first trip to
                            start tracking journeys,
                            distance and fuel costs.
                        </span>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={() =>
                                setShowForm(true)
                            }
                        >
                            <PlusIcon size={17} />
                            Add Trip
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="table-wrapper trips-desktop-table">
                            <table className="data-table trips-data-table">
                                <thead>
                                    <tr>
                                        <th>Trip</th>
                                        <th>Route</th>
                                        <th>Vehicle</th>
                                        <th>Dates</th>
                                        <th>Distance</th>
                                        <th>Fuel</th>
                                        <th>Cost</th>
                                        <th>Mileage</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {trips.map(
                                        (trip) => (
                                            <tr
                                                key={
                                                    trip.id
                                                }
                                            >
                                                <td>
                                                    <div className="trip-table-name">
                                                        <strong>
                                                            {
                                                                trip.name
                                                            }
                                                        </strong>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="trip-table-route">
                                                        <span>
                                                            {
                                                                trip.startLocation
                                                            }
                                                        </span>

                                                        <span className="route-arrow">
                                                            →
                                                        </span>

                                                        <span>
                                                            {
                                                                trip.destination
                                                            }
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="table-vehicle">
                                                        <strong>
                                                            {
                                                                trip.vehicleName
                                                            }
                                                        </strong>

                                                        {trip.vehicleRegistration && (
                                                            <span className="table-subtext">
                                                                {
                                                                    trip.vehicleRegistration
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="table-date">
                                                        {
                                                            trip.startDate
                                                        }
                                                    </span>

                                                    {trip.endDate && (
                                                        <div className="table-subtext">
                                                            to{" "}
                                                            {
                                                                trip.endDate
                                                            }
                                                        </div>
                                                    )}
                                                </td>

                                                <td>
                                                    {trip.distance !=
                                                    null
                                                        ? `${formatNumber(
                                                              trip.distance
                                                          )} km`
                                                        : "—"}
                                                </td>

                                                <td>
                                                    {trip.totalFuel !=
                                                    null
                                                        ? `${Number(
                                                              trip.totalFuel
                                                          ).toFixed(
                                                              1
                                                          )} L`
                                                        : "—"}
                                                </td>

                                                <td>
                                                    {trip.totalCost !=
                                                    null
                                                        ? `Rs ${Number(
                                                              trip.totalCost
                                                          ).toLocaleString()}`
                                                        : "—"}
                                                </td>

                                                <td>
                                                    {trip.mileage !=
                                                    null
                                                        ? `${Number(
                                                              trip.mileage
                                                          ).toFixed(
                                                              2
                                                          )} km/L`
                                                        : "—"}
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        className="delete-button table-delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                trip.id
                                                            )
                                                        }
                                                        title="Delete trip"
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

                        <div className="trips-mobile-list">
                            {trips.map((trip) => (
                                <article
                                    className="mobile-data-card trip-mobile-card"
                                    key={trip.id}
                                >
                                    <div className="mobile-card-top">
                                        <div className="mobile-vehicle-heading">
                                            <div className="mobile-vehicle-icon trip-icon">
                                                <RouteIcon
                                                    size={
                                                        17
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <strong className="mobile-trip-name">
                                                    {trip.name ||
                                                        "Unnamed trip"}
                                                </strong>

                                                <span className="mobile-card-muted">
                                                    {
                                                        trip.vehicleName
                                                    }

                                                    {trip.vehicleRegistration
                                                        ? ` • ${trip.vehicleRegistration}`
                                                        : ""}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mobile-trip-route">
                                        <div className="route-location">
                                            <span className="route-label">
                                                FROM
                                            </span>

                                            <strong>
                                                {trip.startLocation ||
                                                    "—"}
                                            </strong>
                                        </div>

                                        <span className="route-arrow">
                                            →
                                        </span>

                                        <div className="route-location route-destination">
                                            <span className="route-label">
                                                TO
                                            </span>

                                            <strong>
                                                {trip.destination ||
                                                    "—"}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="mobile-trip-dates">
                                        <CalendarIcon
                                            size={15}
                                        />

                                        <span>
                                            {trip.startDate ||
                                                "—"}
                                        </span>

                                        {trip.endDate && (
                                            <>
                                                <span>
                                                    →
                                                </span>

                                                <span>
                                                    {
                                                        trip.endDate
                                                    }
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    <div className="mobile-card-divider" />

                                    <div className="mobile-card-grid">
                                        <div>
                                            <span>
                                                Distance
                                            </span>

                                            <strong>
                                                {trip.distance !=
                                                null
                                                    ? `${formatNumber(
                                                          trip.distance
                                                      )} km`
                                                    : "—"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Fuel
                                            </span>

                                            <strong>
                                                {trip.totalFuel !=
                                                null
                                                    ? `${Number(
                                                          trip.totalFuel
                                                      ).toFixed(
                                                          1
                                                      )} L`
                                                    : "—"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Cost
                                            </span>

                                            <strong className="mobile-card-total">
                                                {trip.totalCost !=
                                                null
                                                    ? `Rs ${Number(
                                                          trip.totalCost
                                                      ).toLocaleString()}`
                                                    : "—"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Mileage
                                            </span>

                                            <strong>
                                                {trip.mileage !=
                                                null
                                                    ? `${Number(
                                                          trip.mileage
                                                      ).toFixed(
                                                          2
                                                      )} km/L`
                                                    : "—"}
                                            </strong>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="delete-button mobile-delete-button"
                                        onClick={() =>
                                            handleDelete(
                                                trip.id
                                            )
                                        }
                                    >
                                        <TrashIcon
                                            size={16}
                                        />
                                        Delete Trip
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

export default Trips;