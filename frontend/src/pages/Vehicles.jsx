import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = "https://petrol-khata.onrender.com";

function Vehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [maintenance, setMaintenance] = useState([]);

    const [showVehicleForm, setShowVehicleForm] = useState(false);
    const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);

    const [selectedVehicle, setSelectedVehicle] = useState(null);
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
            setLoading(true);

            const [vehiclesResponse, maintenanceResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/vehicles`),
                fetch(`${API_BASE_URL}/vehicle-maintenance`),
            ]);

            if (!vehiclesResponse.ok) {
                throw new Error("Failed to load vehicles");
            }

            if (!maintenanceResponse.ok) {
                throw new Error("Failed to load maintenance records");
            }

            const vehiclesData = await vehiclesResponse.json();
            const maintenanceData = await maintenanceResponse.json();

            setVehicles(vehiclesData.vehicles || vehiclesData || []);
            setMaintenance(
                maintenanceData.maintenance ||
                    maintenanceData ||
                    []
            );
        } catch (error) {
            console.error("Failed to load vehicle data:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddVehicle(event) {
        event.preventDefault();

        try {
            const response = await fetch(`${API_BASE_URL}/vehicles`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(vehicleForm),
            });

            if (!response.ok) {
                throw new Error("Failed to add vehicle");
            }

            setVehicleForm({
                name: "",
                registration: "",
            });

            setShowVehicleForm(false);

            await loadData();
        } catch (error) {
            console.error("Failed to add vehicle:", error);
            alert("Failed to add vehicle.");
        }
    }

    async function handleAddMaintenance(event) {
        event.preventDefault();

        try {
            const response = await fetch(
                `${API_BASE_URL}/vehicle-maintenance`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(maintenanceForm),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to add maintenance record");
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

            setShowMaintenanceForm(false);

            await loadData();
        } catch (error) {
            console.error("Failed to add maintenance:", error);
            alert("Failed to add maintenance record.");
        }
    }

    async function handleDeactivate(vehicleId) {
        const confirmed = window.confirm(
            "Are you sure you want to deactivate this vehicle?"
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `${API_BASE_URL}/vehicles/${vehicleId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to deactivate vehicle");
            }

            await loadData();
        } catch (error) {
            console.error("Failed to deactivate vehicle:", error);
            alert("Failed to deactivate vehicle.");
        }
    }

    async function handleDeleteVehicle(vehicleId) {
        const confirmed = window.confirm(
            "This will permanently delete the vehicle and all of its related fuel entries, trips, maintenance records, and vehicle records. This action cannot be undone.\n\nAre you sure you want to permanently delete this vehicle?"
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `${API_BASE_URL}/vehicles/${vehicleId}/permanent`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);

                throw new Error(
                    errorData?.error || "Failed to permanently delete vehicle"
                );
            }

            await loadData();
        } catch (error) {
            console.error("Failed to permanently delete vehicle:", error);
            alert(
                error.message ||
                    "Failed to permanently delete vehicle."
            );
        }
    }

    function getVehicleMaintenance(vehicleId) {
        return maintenance.filter(
            (record) => Number(record.vehicleId) === Number(vehicleId)
        );
    }

    function getMaintenanceTotal(vehicleId) {
        const records = getVehicleMaintenance(vehicleId);

        return records.reduce((total, record) => {
            return (
                total +
                Number(record.mobileOilCost || 0) +
                Number(record.oilFilterCost || 0) +
                Number(record.airFilterCost || 0) +
                Number(record.otherMaintenanceCost || 0)
            );
        }, 0);
    }

    function openMaintenanceForm(vehicle) {
        setSelectedVehicle(vehicle);

        setMaintenanceForm({
            vehicleId: vehicle.id,
            date: new Date().toISOString().split("T")[0],
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

        setShowMaintenanceForm(true);
    }

    if (loading) {
        return (
            <main className="page-container">
                <p>Loading vehicles...</p>
            </main>
        );
    }

    return (
        <main className="page-container">
            <div className="page-header">
                <div>
                    <h1>Vehicles</h1>
                    <p>
                        Manage your vehicles and keep track of their
                        maintenance.
                    </p>
                </div>

                <div className="page-header-actions">
                    <button
                        type="button"
                        className="primary-button"
                        onClick={() => setShowVehicleForm(true)}
                    >
                        Add Vehicle
                    </button>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() => {
                            setSelectedVehicle(null);
                            setShowMaintenanceForm(true);
                        }}
                    >
                        Add Maintenance
                    </button>
                </div>
            </div>

            {showVehicleForm && (
                <section className="form-card">
                    <div className="section-header">
                        <h2>Add Vehicle</h2>

                        <button
                            type="button"
                            className="close-button"
                            onClick={() => setShowVehicleForm(false)}
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleAddVehicle}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="vehicle-name">
                                    Vehicle Name
                                </label>

                                <input
                                    id="vehicle-name"
                                    type="text"
                                    value={vehicleForm.name}
                                    onChange={(event) =>
                                        setVehicleForm({
                                            ...vehicleForm,
                                            name: event.target.value,
                                        })
                                    }
                                    placeholder="e.g. Honda Civic"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="vehicle-registration">
                                    Registration
                                </label>

                                <input
                                    id="vehicle-registration"
                                    type="text"
                                    value={vehicleForm.registration}
                                    onChange={(event) =>
                                        setVehicleForm({
                                            ...vehicleForm,
                                            registration:
                                                event.target.value,
                                        })
                                    }
                                    placeholder="e.g. ABC-123"
                                    required
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
                                Save Vehicle
                            </button>
                        </div>
                    </form>
                </section>
            )}

            {showMaintenanceForm && (
                <section className="form-card">
                    <div className="section-header">
                        <div>
                            <h2>Add Maintenance Record</h2>

                            {selectedVehicle && (
                                <p>
                                    Vehicle: {selectedVehicle.name} (
                                    {selectedVehicle.registration})
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            className="close-button"
                            onClick={() =>
                                setShowMaintenanceForm(false)
                            }
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleAddMaintenance}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="maintenance-vehicle">
                                    Vehicle
                                </label>

                                <select
                                    id="maintenance-vehicle"
                                    value={maintenanceForm.vehicleId}
                                    onChange={(event) =>
                                        setMaintenanceForm({
                                            ...maintenanceForm,
                                            vehicleId:
                                                event.target.value,
                                        })
                                    }
                                    required
                                >
                                    <option value="">
                                        Select vehicle
                                    </option>

                                    {vehicles
                                        .filter(
                                            (vehicle) =>
                                                Number(vehicle.active) !==
                                                0
                                        )
                                        .map((vehicle) => (
                                            <option
                                                key={vehicle.id}
                                                value={vehicle.id}
                                            >
                                                {vehicle.name} -{" "}
                                                {vehicle.registration}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="maintenance-date">
                                    Date
                                </label>

                                <input
                                    id="maintenance-date"
                                    type="date"
                                    value={maintenanceForm.date}
                                    onChange={(event) =>
                                        setMaintenanceForm({
                                            ...maintenanceForm,
                                            date: event.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="maintenance-meter">
                                    Meter Reading
                                </label>

                                <input
                                    id="maintenance-meter"
                                    type="number"
                                    value={
                                        maintenanceForm.meterReading
                                    }
                                    onChange={(event) =>
                                        setMaintenanceForm({
                                            ...maintenanceForm,
                                            meterReading:
                                                event.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="mobile-oil">
                                    Mobile Oil
                                </label>

                                <input
                                    id="mobile-oil"
                                    type="text"
                                    value={maintenanceForm.mobileOil}
                                    onChange={(event) =>
                                        setMaintenanceForm({
                                            ...maintenanceForm,
                                            mobileOil:
                                                event.target.value,
                                        })
                                    }
                                    placeholder="e.g. Total Quartz 9000"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="mobile-oil-cost">
                                    Mobile Oil Cost
                                </label>

                                <input
                                    id="mobile-oil-cost"
                                    type="number"
                                    value={
                                        maintenanceForm.mobileOilCost
                                    }
                                    onChange={(event) =>
                                        setMaintenanceForm({
                                            ...maintenanceForm,
                                            mobileOilCost:
                                                event.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="oil-filter">
                                    Oil Filter
                                </label>

                                <input
                                    id="oil-filter"
                                    type="text"
                                    value={maintenanceForm.oilFilter}
                                    onChange={(event) =>
                                        setMaintenanceForm({
                                            ...maintenanceForm,
                                            oilFilter:
                                                event.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="oil-filter-cost">
                                    Oil Filter Cost
                                </label>

                                <input
                                    id="oil-filter-cost"
                                    type="number"
                                    value={
                                        maintenanceForm.oilFilterCost
                                    }
                                    onChange={(event) =>
                                        setMaintenanceForm({
                                            ...maintenanceForm,
                                            oilFilterCost:
                                                event.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="air-filter">
                                    Air Filter
                                </label>

                                <input
                                    id="air-filter"
                                    type="text"
                                    value={maintenanceForm.airFilter}
                                    onChange={(event) =>
                                        setMaintenanceForm({
                                            ...maintenanceForm,
                                            airFilter:
                                                event.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="air-filter-cost">
                                    Air Filter Cost
                                </label>

                                <input
                                    id="air-filter-cost"
                                    type="number"
                                    value={
                                        maintenanceForm.airFilterCost
                                    }
                                    onChange={(event) =>
                                        setMaintenanceForm({
                                            ...maintenanceForm,
                                            airFilterCost:
                                                event.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="other-maintenance">
                                    Other Maintenance
                                </label>

                                <input
                                    id="other-maintenance"
                                    type="text"
                                    value={
                                        maintenanceForm.otherMaintenance
                                    }
                                    onChange={(event) =>
                                        setMaintenanceForm({
                                            ...maintenanceForm,
                                            otherMaintenance:
                                                event.target.value,
                                        })
                                    }
                                    placeholder="e.g. Brake service"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="other-maintenance-cost">
                                    Other Maintenance Cost
                                </label>

                                <input
                                    id="other-maintenance-cost"
                                    type="number"
                                    value={
                                        maintenanceForm.otherMaintenanceCost
                                    }
                                    onChange={(event) =>
                                        setMaintenanceForm({
                                            ...maintenanceForm,
                                            otherMaintenanceCost:
                                                event.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="maintenance-notes">
                                    Notes
                                </label>

                                <textarea
                                    id="maintenance-notes"
                                    value={maintenanceForm.notes}
                                    onChange={(event) =>
                                        setMaintenanceForm({
                                            ...maintenanceForm,
                                            notes: event.target.value,
                                        })
                                    }
                                    placeholder="Any additional notes..."
                                    rows="3"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                    setShowMaintenanceForm(false)
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

            <section className="vehicles-section">
                <div className="section-header">
                    <div>
                        <h2>Your Vehicles</h2>
                        <p>
                            {vehicles.length} vehicle
                            {vehicles.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>

                {vehicles.length === 0 ? (
                    <div className="empty-state">
                        <h3>No vehicles yet</h3>
                        <p>
                            Add your first vehicle to start tracking fuel
                            and maintenance.
                        </p>
                    </div>
                ) : (
                    <div className="vehicles-grid">
                        {vehicles.map((vehicle) => {
                            const vehicleMaintenance =
                                getVehicleMaintenance(vehicle.id);

                            const maintenanceTotal =
                                getMaintenanceTotal(vehicle.id);

                            const isActive =
                                Number(vehicle.active) !== 0;

                            return (
                                <article
                                    className="vehicle-card"
                                    key={vehicle.id}
                                >
                                    <div className="vehicle-card-header">
                                        <div>
                                            <h3>{vehicle.name}</h3>

                                            <p>
                                                {vehicle.registration}
                                            </p>
                                        </div>

                                        <span
                                            className={`status-badge ${
                                                isActive
                                                    ? "active"
                                                    : "inactive"
                                            }`}
                                        >
                                            {isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </div>

                                    <div className="vehicle-card-stats">
                                        <div>
                                            <span>
                                                Maintenance Records
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
                                                Rs{" "}
                                                {maintenanceTotal.toLocaleString()}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="vehicle-card-actions">
                                        <Link
                                            to={`/vehicles/${vehicle.id}`}
                                            className="secondary-button"
                                        >
                                            View Details
                                        </Link>

                                        <button
                                            type="button"
                                            className="secondary-button"
                                            onClick={() =>
                                                openMaintenanceForm(
                                                    vehicle
                                                )
                                            }
                                        >
                                            Add Maintenance
                                        </button>

                                        {isActive && (
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
                                        )}

                                        <button
                                            type="button"
                                            className="danger-button"
                                            onClick={() =>
                                                handleDeleteVehicle(
                                                    vehicle.id
                                                )
                                            }
                                        >
                                            Delete Permanently
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Vehicles;