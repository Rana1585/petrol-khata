import { useEffect, useState } from "react";

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

            const [tripsResponse, vehiclesResponse] =
                await Promise.all([
                    fetch("http://192.168.18.72:5000/trips"),
                    fetch("http://192.168.18.72:5000/vehicles"),
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

            const response = await fetch(
                "http://192.168.18.72:5000/trips",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
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
        const confirmed =
            window.confirm(
                "Delete this trip?"
            );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            const response = await fetch(
                `http://192.168.18.72:5000/trips/${id}`,
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
                    Loading trips...
                </div>
            </main>
        );
    }

    return (
        <main className="page">
            <div className="page-header">
                <div>
                    <h1>Trips</h1>
                    <p>
                        Track your longer journeys
                        and their fuel usage.
                    </p>
                </div>

                <div className="page-actions">
                    <button
                        className="primary-button"
                        onClick={() =>
                            setShowForm(
                                (current) =>
                                    !current
                            )
                        }
                    >
                        {showForm
                            ? "Close Form"
                            : "+ Add Trip"}
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
                            <h2>
                                Create Trip
                            </h2>

                            <p>
                                Record the basic
                                details of your
                                journey.
                            </p>
                        </div>
                    </div>

                    <form
                        className="entry-form"
                        onSubmit={
                            handleSubmit
                        }
                    >
                        <div className="form-grid">
                            <div className="form-group">
                                <label>
                                    Vehicle
                                </label>

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

                                    {vehicles
                                        .filter(
                                            (
                                                vehicle
                                            ) =>
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

                            <div className="form-group">
                                <label>
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

                            <div className="form-group">
                                <label>
                                    Start Odometer
                                </label>

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
                            </div>

                            <div className="form-group">
                                <label>
                                    End Odometer
                                </label>

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
                                    : "Save Trip"}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="table-card">
                <div className="card-header">
                    <div>
                        <h2>
                            Trip History
                        </h2>

                        <p>
                            {trips.length}{" "}
                            {trips.length === 1
                                ? "trip"
                                : "trips"}{" "}
                            recorded
                        </p>
                    </div>
                </div>

                {trips.length === 0 ? (
                    <div className="empty-state">
                        No trips yet.
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>
                                        Trip
                                    </th>

                                    <th>
                                        Route
                                    </th>

                                    <th>
                                        Vehicle
                                    </th>

                                    <th>
                                        Dates
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

                                    <th>
                                        Action
                                    </th>
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
                                                {
                                                    trip.vehicleName
                                                }

                                                {trip.vehicleRegistration && (
                                                    <div className="table-subtext">
                                                        {
                                                            trip.vehicleRegistration
                                                        }
                                                    </div>
                                                )}
                                            </td>

                                            <td>
                                                {
                                                    trip.startDate
                                                }

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
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            trip.id
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

export default Trips;