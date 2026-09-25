import { useEffect, useState } from "react";
import { apiFetch } from "../api";

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
                    Loading fuel entries...
                </div>
            </main>
        );
    }

    return (
        <main className="page">
            <div className="page-header">
                <div>
                    <h1>Fuel Entries</h1>
                    <p>
                        Record and manage every fuel
                        purchase.
                    </p>
                </div>

                <div className="page-actions">
                    <button
                        className="primary-button"
                        onClick={() =>
                            setShowForm(
                                (current) => !current
                            )
                        }
                    >
                        {showForm
                            ? "Close Form"
                            : "+ Add Fuel Entry"}
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-state">
                    {error}
                </div>
            )}

            {showForm && (
                <section className="form-card">
                    <div className="card-header">
                        <div>
                            <h2>Add Fuel Entry</h2>
                            <p>
                                Enter the raw fuel and
                                odometer information.
                            </p>
                        </div>
                    </div>

                    <form
                        className="entry-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="vehicleId">
                                    Vehicle
                                </label>

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

                                    {vehicles
                                        .filter(
                                            (vehicle) =>
                                                vehicle.active !==
                                                0
                                        )
                                        .map(
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
                            </div>

                            <div className="form-group">
                                <label htmlFor="date">
                                    Date
                                </label>

                                <input
                                    id="date"
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
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

                                <input
                                    id="price"
                                    type="number"
                                    name="price"
                                    min="0"
                                    step="0.01"
                                    placeholder="275"
                                    value={form.price}
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="litres">
                                    Litres
                                </label>

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
                            </div>

                            <div className="form-group">
                                <label htmlFor="odometer">
                                    Odometer
                                </label>

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
                            </div>

                            <div className="form-group">
                                <label htmlFor="tripId">
                                    Trip
                                </label>

                                <select
                                    id="tripId"
                                    name="tripId"
                                    value={form.tripId}
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="">
                                        No trip
                                    </option>

                                    {trips.map(
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
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
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
                                {saving
                                    ? "Saving..."
                                    : "Save Entry"}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="table-card">
                <div className="card-header">
                    <div>
                        <h2>Fuel History</h2>
                        <p>
                            {entries.length}{" "}
                            {entries.length === 1
                                ? "entry"
                                : "entries"}{" "}
                            recorded
                        </p>
                    </div>
                </div>

                {entries.length === 0 ? (
                    <div className="empty-state">
                        No fuel entries yet.
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
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
                                                {
                                                    entry.date
                                                }
                                            </td>

                                            <td>
                                                <strong>
                                                    {entry.vehicleName ||
                                                        "—"}
                                                </strong>

                                                {entry.vehicleRegistration && (
                                                    <div className="table-subtext">
                                                        {
                                                            entry.vehicleRegistration
                                                        }
                                                    </div>
                                                )}
                                            </td>

                                            <td>
                                                {
                                                    entry.pumpName
                                                }
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
                                                )}
                                            </td>

                                            <td>
                                                <strong>
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
                                                {entry.tripName ||
                                                    "—"}
                                            </td>

                                            <td>
                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            entry.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
}

export default FuelEntries;