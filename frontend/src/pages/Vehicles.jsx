import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Vehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [maintenance, setMaintenance] = useState([]);

    const [showVehicleForm, setShowVehicleForm] =
        useState(false);

    const [showMaintenanceForm, setShowMaintenanceForm] =
        useState(false);

    const [selectedVehicle, setSelectedVehicle] =
        useState(null);

    const [loading, setLoading] = useState(true);

    const [vehicleForm, setVehicleForm] = useState({
        name: "",
        registration: "",
    });

    const [maintenanceForm, setMaintenanceForm] = useState({
        vehicleId: "",
        date: "",
        meterReading: "",
        mobileOil: "",
        mobileOilCost: "",
        oilFilter: "",
        oilFilterCost: "",
        airFilter: "",
        airFilterCost: "",
        otherMaintenance: "",
        otherMaintenanceCost: "",
        notes: "",
    });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [vehiclesResponse, maintenanceResponse] =
                await Promise.all([
                    fetch("http://192.168.18.72:5000/vehicles"),
                    fetch(
                        "http://192.168.18.72:5000/vehicle-maintenance"
                    ),
                ]);

            const vehiclesData =
                await vehiclesResponse.json();

            const maintenanceData =
                await maintenanceResponse.json();

            setVehicles(
                vehiclesData.vehicles ||
                    vehiclesData ||
                    []
            );

            setMaintenance(
                maintenanceData.maintenance ||
                    maintenanceData.records ||
                    maintenanceData ||
                    []
            );
        } catch (error) {
            console.error(
                "Failed to load vehicles:",
                error
            );
        } finally {
            setLoading(false);
        }
    }

    function handleVehicleChange(event) {
        setVehicleForm({
            ...vehicleForm,
            [event.target.name]: event.target.value,
        });
    }

    function handleMaintenanceChange(event) {
        setMaintenanceForm({
            ...maintenanceForm,
            [event.target.name]: event.target.value,
        });
    }

    async function handleAddVehicle(event) {
        event.preventDefault();

        if (!vehicleForm.name.trim()) {
            return;
        }

        try {
            const response = await fetch(
                "http://192.168.18.72:5000/vehicles",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: vehicleForm.name,
                        registration:
                            vehicleForm.registration,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to create vehicle"
                );
            }

            setVehicleForm({
                name: "",
                registration: "",
            });

            setShowVehicleForm(false);

            await loadData();
        } catch (error) {
            console.error(
                "Failed to add vehicle:",
                error
            );
        }
    }

    async function handleAddMaintenance(event) {
        event.preventDefault();

        if (
            !maintenanceForm.vehicleId ||
            !maintenanceForm.date ||
            !maintenanceForm.meterReading
        ) {
            return;
        }

        try {
            const response = await fetch(
                "http://192.168.18.72:5000/vehicle-maintenance",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        vehicleId: Number(
                            maintenanceForm.vehicleId
                        ),
                        date: maintenanceForm.date,
                        meterReading: Number(
                            maintenanceForm.meterReading
                        ),

                        mobileOil:
                            maintenanceForm.mobileOil,
                        mobileOilCost: Number(
                            maintenanceForm.mobileOilCost ||
                                0
                        ),

                        oilFilter:
                            maintenanceForm.oilFilter,
                        oilFilterCost: Number(
                            maintenanceForm.oilFilterCost ||
                                0
                        ),

                        airFilter:
                            maintenanceForm.airFilter,
                        airFilterCost: Number(
                            maintenanceForm.airFilterCost ||
                                0
                        ),

                        otherMaintenance:
                            maintenanceForm.otherMaintenance,
                        otherMaintenanceCost: Number(
                            maintenanceForm.otherMaintenanceCost ||
                                0
                        ),

                        notes: maintenanceForm.notes,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to create maintenance record"
                );
            }

            setMaintenanceForm({
                vehicleId: "",
                date: "",
                meterReading: "",
                mobileOil: "",
                mobileOilCost: "",
                oilFilter: "",
                oilFilterCost: "",
                airFilter: "",
                airFilterCost: "",
                otherMaintenance: "",
                otherMaintenanceCost: "",
                notes: "",
            });

            setSelectedVehicle(null);
            setShowMaintenanceForm(false);

            await loadData();
        } catch (error) {
            console.error(
                "Failed to add maintenance:",
                error
            );
        }
    }

    async function handleDeactivate(vehicleId) {
        const confirmed = window.confirm(
            "Are you sure you want to deactivate this vehicle?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `http://192.168.18.72:5000/vehicles/${vehicleId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to deactivate vehicle"
                );
            }

            await loadData();
        } catch (error) {
            console.error(
                "Failed to deactivate vehicle:",
                error
            );
        }
    }

    function formatMoney(value) {
        return `Rs ${Number(value || 0).toLocaleString(
            undefined,
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            }
        )}`;
    }

    function getMaintenanceForVehicle(vehicleId) {
        return maintenance.filter(
            (item) =>
                Number(item.vehicleId) ===
                Number(vehicleId)
        );
    }

    function getMaintenanceCost(vehicleId) {
        return getMaintenanceForVehicle(vehicleId).reduce(
            (total, item) => {
                return (
                    total +
                    Number(item.totalCost || 0) +
                    Number(item.mobileOilCost || 0) +
                    Number(item.oilFilterCost || 0) +
                    Number(item.airFilterCost || 0) +
                    Number(
                        item.otherMaintenanceCost || 0
                    )
                );
            },
            0
        );
    }

    if (loading) {
        return (
            <main className="page">
                <div className="loading-state">
                    Loading vehicles...
                </div>
            </main>
        );
    }

    return (
        <main className="page">
            <div className="page-header">
                <div>
                    <h1>Vehicles</h1>

                    <p>
                        Manage your vehicles and keep track
                        of their maintenance.
                    </p>
                </div>

                <div className="page-header-actions">
                    <button
                        className="secondary-button"
                        onClick={() => {
                            setSelectedVehicle(null);
                            setShowMaintenanceForm(true);
                        }}
                    >
                        + Add Maintenance
                    </button>

                    <button
                        className="primary-button"
                        onClick={() =>
                            setShowVehicleForm(true)
                        }
                    >
                        + Add Vehicle
                    </button>
                </div>
            </div>

            {showVehicleForm && (
                <section className="form-card">
                    <div className="card-header">
                        <div>
                            <h2>Add Vehicle</h2>

                            <p>
                                Add a vehicle to your Petrol
                                Khata.
                            </p>
                        </div>
                    </div>

                    <form
                        className="entry-form"
                        onSubmit={handleAddVehicle}
                    >
                        <div className="form-grid">
                            <div className="form-group">
                                <label>
                                    Vehicle Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={
                                        vehicleForm.name
                                    }
                                    onChange={
                                        handleVehicleChange
                                    }
                                    placeholder="e.g. Toyota Corolla"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Registration Number
                                </label>

                                <input
                                    type="text"
                                    name="registration"
                                    value={
                                        vehicleForm.registration
                                    }
                                    onChange={
                                        handleVehicleChange
                                    }
                                    placeholder="e.g. ABC-123"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                    setShowVehicleForm(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="primary-button"
                            >
                                Add Vehicle
                            </button>
                        </div>
                    </form>
                </section>
            )}

            {showMaintenanceForm && (
                <section className="form-card">
                    <div className="card-header">
                        <div>
                            <h2>Add Maintenance</h2>

                            <p>
                                Record maintenance work and
                                expenses for a vehicle.
                            </p>
                        </div>
                    </div>

                    <form
                        className="entry-form"
                        onSubmit={handleAddMaintenance}
                    >
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Vehicle</label>

                                <select
                                    name="vehicleId"
                                    value={
                                        maintenanceForm.vehicleId
                                    }
                                    onChange={
                                        handleMaintenanceChange
                                    }
                                    required
                                >
                                    <option value="">
                                        Select vehicle
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
                                                    ? ` - ${vehicle.registration}`
                                                    : ""}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Date</label>

                                <input
                                    type="date"
                                    name="date"
                                    value={
                                        maintenanceForm.date
                                    }
                                    onChange={
                                        handleMaintenanceChange
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Meter Reading
                                </label>

                                <input
                                    type="number"
                                    name="meterReading"
                                    value={
                                        maintenanceForm.meterReading
                                    }
                                    onChange={
                                        handleMaintenanceChange
                                    }
                                    placeholder="e.g. 50000"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Mobile Oil
                                </label>

                                <input
                                    type="text"
                                    name="mobileOil"
                                    value={
                                        maintenanceForm.mobileOil
                                    }
                                    onChange={
                                        handleMaintenanceChange
                                    }
                                    placeholder="e.g. Shell 10W-40"
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Mobile Oil Cost
                                </label>

                                <input
                                    type="number"
                                    name="mobileOilCost"
                                    value={
                                        maintenanceForm.mobileOilCost
                                    }
                                    onChange={
                                        handleMaintenanceChange
                                    }
                                    placeholder="Rs"
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Oil Filter
                                </label>

                                <input
                                    type="text"
                                    name="oilFilter"
                                    value={
                                        maintenanceForm.oilFilter
                                    }
                                    onChange={
                                        handleMaintenanceChange
                                    }
                                    placeholder="Filter details"
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Oil Filter Cost
                                </label>

                                <input
                                    type="number"
                                    name="oilFilterCost"
                                    value={
                                        maintenanceForm.oilFilterCost
                                    }
                                    onChange={
                                        handleMaintenanceChange
                                    }
                                    placeholder="Rs"
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Air Filter
                                </label>

                                <input
                                    type="text"
                                    name="airFilter"
                                    value={
                                        maintenanceForm.airFilter
                                    }
                                    onChange={
                                        handleMaintenanceChange
                                    }
                                    placeholder="Filter details"
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Air Filter Cost
                                </label>

                                <input
                                    type="number"
                                    name="airFilterCost"
                                    value={
                                        maintenanceForm.airFilterCost
                                    }
                                    onChange={
                                        handleMaintenanceChange
                                    }
                                    placeholder="Rs"
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Other Maintenance
                                </label>

                                <input
                                    type="text"
                                    name="otherMaintenance"
                                    value={
                                        maintenanceForm.otherMaintenance
                                    }
                                    onChange={
                                        handleMaintenanceChange
                                    }
                                    placeholder="e.g. Brake service"
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Other Cost
                                </label>

                                <input
                                    type="number"
                                    name="otherMaintenanceCost"
                                    value={
                                        maintenanceForm.otherMaintenanceCost
                                    }
                                    onChange={
                                        handleMaintenanceChange
                                    }
                                    placeholder="Rs"
                                />
                            </div>

                            <div className="form-group form-group-full">
                                <label>Notes</label>

                                <textarea
                                    name="notes"
                                    value={
                                        maintenanceForm.notes
                                    }
                                    onChange={
                                        handleMaintenanceChange
                                    }
                                    placeholder="Additional notes..."
                                    rows="3"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                    setShowMaintenanceForm(
                                        false
                                    )
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="primary-button"
                            >
                                Save Maintenance
                            </button>
                        </div>
                    </form>
                </section>
            )}

            {vehicles.length === 0 ? (
                <div className="empty-state">
                    <h2>No vehicles yet</h2>

                    <p>
                        Add your first vehicle to start
                        tracking fuel and maintenance.
                    </p>

                    <button
                        className="primary-button"
                        onClick={() =>
                            setShowVehicleForm(true)
                        }
                    >
                        + Add Vehicle
                    </button>
                </div>
            ) : (
                <section className="vehicle-grid">
                    {vehicles.map((vehicle) => {
                        const vehicleMaintenance =
                            getMaintenanceForVehicle(
                                vehicle.id
                            );

                        const maintenanceCost =
                            getMaintenanceCost(
                                vehicle.id
                            );

                        return (
                            <div
                                className="vehicle-card"
                                key={vehicle.id}
                            >
                                <Link
                                    to={`/vehicles/${vehicle.id}`}
                                    className="vehicle-card-link"
                                >
                                    <div className="vehicle-card-top">
                                        <div className="vehicle-icon">
                                            🚗
                                        </div>

                                        <span
                                            className={
                                                vehicle.active !==
                                                0
                                                    ? "status-badge active"
                                                    : "status-badge"
                                            }
                                        >
                                            {vehicle.active !==
                                            0
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </div>

                                    <div className="vehicle-card-info">
                                        <h2>
                                            {vehicle.name}
                                        </h2>

                                        <p>
                                            {vehicle.registration ||
                                                "No registration number"}
                                        </p>
                                    </div>

                                    <div className="vehicle-card-stats">
                                        <div>
                                            <span>
                                                Maintenance
                                            </span>

                                            <strong>
                                                {
                                                    vehicleMaintenance.length
                                                }
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Maintenance Cost
                                            </span>

                                            <strong>
                                                {formatMoney(
                                                    maintenanceCost
                                                )}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="vehicle-card-footer">
                                        <span>
                                            View Details →
                                        </span>
                                    </div>
                                </Link>

                                {vehicle.active !== 0 && (
                                    <div className="vehicle-card-actions">
                                        <button
                                            type="button"
                                            className="danger-button"
                                            onClick={() =>
                                                handleDeactivate(
                                                    vehicle.id
                                                )
                                            }
                                        >
                                            Deactivate
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </section>
            )}
        </main>
    );
}

export default Vehicles;