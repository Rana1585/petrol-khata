import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";


const EMPTY_VEHICLE_FORM = {
    name: "",
    registration: "",
};


const EMPTY_MAINTENANCE_FORM = {
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
};


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

    const [vehicleForm, setVehicleForm] = useState(
        EMPTY_VEHICLE_FORM
    );

    const [maintenanceForm, setMaintenanceForm] =
        useState(EMPTY_MAINTENANCE_FORM);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);

            const [
                vehiclesResponse,
                maintenanceResponse,
            ] = await Promise.all([
                apiFetch("/vehicles"),
                apiFetch("/vehicle-maintenance"),
            ]);

            if (!vehiclesResponse.ok) {
                throw new Error(
                    "Failed to load vehicles"
                );
            }

            if (!maintenanceResponse.ok) {
                throw new Error(
                    "Failed to load maintenance records"
                );
            }

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
                "Failed to load vehicle data:",
                error
            );
        } finally {
            setLoading(false);
        }
    }


    async function handleAddVehicle(event) {
        event.preventDefault();

        try {
            const response = await apiFetch(
                "/vehicles",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(
                        vehicleForm
                    ),
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to add vehicle"
                );
            }

            setVehicleForm(
                EMPTY_VEHICLE_FORM
            );

            setShowVehicleForm(false);

            await loadData();
        } catch (error) {
            console.error(
                "Failed to add vehicle:",
                error
            );

            alert("Failed to add vehicle.");
        }
    }


    async function handleAddMaintenance(event) {
        event.preventDefault();

        try {
            const response = await apiFetch(
                "/vehicle-maintenance",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(
                        maintenanceForm
                    ),
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to add maintenance record"
                );
            }

            setMaintenanceForm(
                EMPTY_MAINTENANCE_FORM
            );

            setSelectedVehicle(null);

            setShowMaintenanceForm(false);

            await loadData();
        } catch (error) {
            console.error(
                "Failed to add maintenance:",
                error
            );

            alert(
                "Failed to add maintenance record."
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
            const response = await apiFetch(
                `/vehicles/${vehicleId}`,
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

            alert(
                "Failed to deactivate vehicle."
            );
        }
    }


    async function handleDeleteVehicle(vehicleId) {
        const confirmed = window.confirm(
            "This will permanently delete the vehicle and all of its related fuel entries, trips, maintenance records, and vehicle records. This action cannot be undone.\n\nAre you sure you want to permanently delete this vehicle?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await apiFetch(
                `/vehicles/${vehicleId}/permanent`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                const errorData =
                    await response
                        .json()
                        .catch(() => null);

                throw new Error(
                    errorData?.error ||
                        "Failed to permanently delete vehicle"
                );
            }

            await loadData();
        } catch (error) {
            console.error(
                "Failed to permanently delete vehicle:",
                error
            );

            alert(
                error.message ||
                    "Failed to permanently delete vehicle."
            );
        }
    }


    function getVehicleMaintenance(
        vehicleId
    ) {
        return maintenance.filter(
            (record) =>
                Number(record.vehicleId) ===
                Number(vehicleId)
        );
    }


    function getMaintenanceTotal(
        vehicleId
    ) {
        const records =
            getVehicleMaintenance(
                vehicleId
            );

        return records.reduce(
            (total, record) => {
                return (
                    total +
                    Number(
                        record.mobileOilCost ||
                            0
                    ) +
                    Number(
                        record.oilFilterCost ||
                            0
                    ) +
                    Number(
                        record.airFilterCost ||
                            0
                    ) +
                    Number(
                        record.otherMaintenanceCost ||
                            0
                    )
                );
            },
            0
        );
    }


    function openMaintenanceForm(vehicle) {
        setSelectedVehicle(vehicle);

        setMaintenanceForm({
            ...EMPTY_MAINTENANCE_FORM,
            vehicleId: vehicle.id,
            date: new Date()
                .toISOString()
                .split("T")[0],
        });

        setShowMaintenanceForm(true);
    }


    function openGeneralMaintenanceForm() {
        setSelectedVehicle(null);

        setMaintenanceForm({
            ...EMPTY_MAINTENANCE_FORM,
            date: new Date()
                .toISOString()
                .split("T")[0],
        });

        setShowMaintenanceForm(true);
    }


    function closeVehicleForm() {
        setShowVehicleForm(false);
        setVehicleForm(
            EMPTY_VEHICLE_FORM
        );
    }


    function closeMaintenanceForm() {
        setShowMaintenanceForm(false);
        setSelectedVehicle(null);
        setMaintenanceForm(
            EMPTY_MAINTENANCE_FORM
        );
    }


    if (loading) {
        return (
            <main className="page vehicles-page">
                <div className="dashboard-loading">
                    <div className="loading-spinner"></div>

                    <div>
                        <strong>
                            Loading vehicles
                        </strong>

                        <span>
                            Fetching your vehicle
                            records...
                        </span>
                    </div>
                </div>
            </main>
        );
    }


    const activeVehicleCount =
        vehicles.filter(
            (vehicle) =>
                Number(vehicle.active) !== 0
        ).length;


    const inactiveVehicleCount =
        vehicles.length -
        activeVehicleCount;


    return (
        <main className="page vehicles-page">

            {/* PAGE HEADER */}

            <section className="page-header vehicles-page-header">
                <div>
                    <span className="page-eyebrow">
                        VEHICLE MANAGEMENT
                    </span>

                    <h1>
                        Your Vehicles
                    </h1>

                    <p>
                        Manage your vehicles,
                        maintenance records, and
                        activity from one place.
                    </p>
                </div>

                <div className="page-header-actions">
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={
                            openGeneralMaintenanceForm
                        }
                    >
                        <PlusIcon />

                        Add Maintenance
                    </button>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                            setShowVehicleForm(
                                true
                            )
                        }
                    >
                        <PlusIcon />

                        Add Vehicle
                    </button>
                </div>
            </section>


            {/* SUMMARY */}

            <section className="vehicle-summary-grid">
                <div className="vehicle-summary-card">
                    <div className="vehicle-summary-icon">
                        <VehicleIcon />
                    </div>

                    <div>
                        <span>
                            Total Vehicles
                        </span>

                        <strong>
                            {vehicles.length}
                        </strong>
                    </div>
                </div>

                <div className="vehicle-summary-card">
                    <div className="vehicle-summary-icon active-summary-icon">
                        <CheckIcon />
                    </div>

                    <div>
                        <span>
                            Active
                        </span>

                        <strong>
                            {activeVehicleCount}
                        </strong>
                    </div>
                </div>

                <div className="vehicle-summary-card">
                    <div className="vehicle-summary-icon inactive-summary-icon">
                        <PauseIcon />
                    </div>

                    <div>
                        <span>
                            Inactive
                        </span>

                        <strong>
                            {inactiveVehicleCount}
                        </strong>
                    </div>
                </div>

                <div className="vehicle-summary-card">
                    <div className="vehicle-summary-icon maintenance-summary-icon">
                        <WrenchIcon />
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


            {/* ADD VEHICLE */}

            {showVehicleForm && (
                <section className="modern-form-card">
                    <div className="modern-form-header">
                        <div className="modern-form-heading">
                            <div className="form-heading-icon">
                                <VehicleIcon />
                            </div>

                            <div>
                                <span className="page-eyebrow">
                                    NEW VEHICLE
                                </span>

                                <h2>
                                    Add Vehicle
                                </h2>

                                <p>
                                    Add a vehicle to start
                                    tracking its fuel and
                                    maintenance.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="icon-button"
                            onClick={
                                closeVehicleForm
                            }
                            aria-label="Close"
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    <form
                        onSubmit={
                            handleAddVehicle
                        }
                    >
                        <div className="form-grid vehicle-form-grid">
                            <FormField
                                label="Vehicle Name"
                                htmlFor="vehicle-name"
                                required
                            >
                                <input
                                    id="vehicle-name"
                                    type="text"
                                    value={
                                        vehicleForm.name
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setVehicleForm(
                                            {
                                                ...vehicleForm,
                                                name: event
                                                    .target
                                                    .value,
                                            }
                                        )
                                    }
                                    placeholder="e.g. Honda Civic"
                                    required
                                />
                            </FormField>

                            <FormField
                                label="Registration"
                                htmlFor="vehicle-registration"
                                required
                            >
                                <input
                                    id="vehicle-registration"
                                    type="text"
                                    value={
                                        vehicleForm.registration
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setVehicleForm(
                                            {
                                                ...vehicleForm,
                                                registration:
                                                    event
                                                        .target
                                                        .value,
                                            }
                                        )
                                    }
                                    placeholder="e.g. ABC-123"
                                    required
                                />
                            </FormField>
                        </div>

                        <div className="modern-form-actions">
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={
                                    closeVehicleForm
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="primary-button"
                            >
                                <CheckIcon />

                                Save Vehicle
                            </button>
                        </div>
                    </form>
                </section>
            )}


            {/* MAINTENANCE FORM */}

            {showMaintenanceForm && (
                <section className="modern-form-card maintenance-form-card">
                    <div className="modern-form-header">
                        <div className="modern-form-heading">
                            <div className="form-heading-icon">
                                <WrenchIcon />
                            </div>

                            <div>
                                <span className="page-eyebrow">
                                    MAINTENANCE
                                </span>

                                <h2>
                                    Add Maintenance
                                    Record
                                </h2>

                                <p>
                                    Keep a record of oil,
                                    filters, and other
                                    maintenance expenses.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="icon-button"
                            onClick={
                                closeMaintenanceForm
                            }
                            aria-label="Close"
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    {selectedVehicle && (
                        <div className="selected-vehicle-banner">
                            <div className="selected-vehicle-icon">
                                <VehicleIcon />
                            </div>

                            <div>
                                <span>
                                    Selected vehicle
                                </span>

                                <strong>
                                    {
                                        selectedVehicle.name
                                    }
                                </strong>

                                <small>
                                    {
                                        selectedVehicle.registration
                                    }
                                </small>
                            </div>
                        </div>
                    )}

                    <form
                        onSubmit={
                            handleAddMaintenance
                        }
                    >
                        <div className="form-section">
                            <div className="form-section-heading">
                                <span className="form-section-number">
                                    01
                                </span>

                                <div>
                                    <h3>
                                        Basic Information
                                    </h3>

                                    <p>
                                        Select the vehicle
                                        and record date
                                        and meter reading.
                                    </p>
                                </div>
                            </div>

                            <div className="form-grid">
                                <FormField
                                    label="Vehicle"
                                    htmlFor="maintenance-vehicle"
                                    required
                                >
                                    <select
                                        id="maintenance-vehicle"
                                        value={
                                            maintenanceForm.vehicleId
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setMaintenanceForm(
                                                {
                                                    ...maintenanceForm,
                                                    vehicleId:
                                                        event
                                                            .target
                                                            .value,
                                                }
                                            )
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
                                                    Number(
                                                        vehicle.active
                                                    ) !==
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
                                                        }{" "}
                                                        —{" "}
                                                        {
                                                            vehicle.registration
                                                        }
                                                    </option>
                                                )
                                            )}
                                    </select>
                                </FormField>

                                <FormField
                                    label="Date"
                                    htmlFor="maintenance-date"
                                    required
                                >
                                    <input
                                        id="maintenance-date"
                                        type="date"
                                        value={
                                            maintenanceForm.date
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setMaintenanceForm(
                                                {
                                                    ...maintenanceForm,
                                                    date: event
                                                        .target
                                                        .value,
                                                }
                                            )
                                        }
                                        required
                                    />
                                </FormField>

                                <FormField
                                    label="Meter Reading"
                                    htmlFor="maintenance-meter"
                                >
                                    <input
                                        id="maintenance-meter"
                                        type="number"
                                        min="0"
                                        value={
                                            maintenanceForm.meterReading
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setMaintenanceForm(
                                                {
                                                    ...maintenanceForm,
                                                    meterReading:
                                                        event
                                                            .target
                                                            .value,
                                                }
                                            )
                                        }
                                        placeholder="e.g. 85420"
                                    />
                                </FormField>
                            </div>
                        </div>


                        <div className="form-section">
                            <div className="form-section-heading">
                                <span className="form-section-number">
                                    02
                                </span>

                                <div>
                                    <h3>
                                        Oil & Filters
                                    </h3>

                                    <p>
                                        Record the products
                                        used and their
                                        individual costs.
                                    </p>
                                </div>
                            </div>

                            <div className="maintenance-item-grid">
                                <MaintenanceField
                                    label="Mobile Oil"
                                    value={
                                        maintenanceForm.mobileOil
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        setMaintenanceForm(
                                            {
                                                ...maintenanceForm,
                                                mobileOil:
                                                    value,
                                            }
                                        )
                                    }
                                    placeholder="e.g. Total Quartz 9000"
                                />

                                <MaintenanceField
                                    label="Mobile Oil Cost"
                                    value={
                                        maintenanceForm.mobileOilCost
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        setMaintenanceForm(
                                            {
                                                ...maintenanceForm,
                                                mobileOilCost:
                                                    value,
                                            }
                                        )
                                    }
                                    type="number"
                                    prefix="Rs"
                                    placeholder="0"
                                />

                                <MaintenanceField
                                    label="Oil Filter"
                                    value={
                                        maintenanceForm.oilFilter
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        setMaintenanceForm(
                                            {
                                                ...maintenanceForm,
                                                oilFilter:
                                                    value,
                                            }
                                        )
                                    }
                                    placeholder="e.g. Genuine filter"
                                />

                                <MaintenanceField
                                    label="Oil Filter Cost"
                                    value={
                                        maintenanceForm.oilFilterCost
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        setMaintenanceForm(
                                            {
                                                ...maintenanceForm,
                                                oilFilterCost:
                                                    value,
                                            }
                                        )
                                    }
                                    type="number"
                                    prefix="Rs"
                                    placeholder="0"
                                />

                                <MaintenanceField
                                    label="Air Filter"
                                    value={
                                        maintenanceForm.airFilter
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        setMaintenanceForm(
                                            {
                                                ...maintenanceForm,
                                                airFilter:
                                                    value,
                                            }
                                        )
                                    }
                                    placeholder="e.g. Air filter"
                                />

                                <MaintenanceField
                                    label="Air Filter Cost"
                                    value={
                                        maintenanceForm.airFilterCost
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        setMaintenanceForm(
                                            {
                                                ...maintenanceForm,
                                                airFilterCost:
                                                    value,
                                            }
                                        )
                                    }
                                    type="number"
                                    prefix="Rs"
                                    placeholder="0"
                                />
                            </div>
                        </div>


                        <div className="form-section">
                            <div className="form-section-heading">
                                <span className="form-section-number">
                                    03
                                </span>

                                <div>
                                    <h3>
                                        Other Maintenance
                                    </h3>

                                    <p>
                                        Add any additional
                                        work or expenses.
                                    </p>
                                </div>
                            </div>

                            <div className="form-grid">
                                <FormField
                                    label="Other Maintenance"
                                    htmlFor="other-maintenance"
                                >
                                    <input
                                        id="other-maintenance"
                                        type="text"
                                        value={
                                            maintenanceForm.otherMaintenance
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setMaintenanceForm(
                                                {
                                                    ...maintenanceForm,
                                                    otherMaintenance:
                                                        event
                                                            .target
                                                            .value,
                                                }
                                            )
                                        }
                                        placeholder="e.g. Brake service"
                                    />
                                </FormField>

                                <FormField
                                    label="Other Maintenance Cost"
                                    htmlFor="other-maintenance-cost"
                                >
                                    <input
                                        id="other-maintenance-cost"
                                        type="number"
                                        min="0"
                                        value={
                                            maintenanceForm.otherMaintenanceCost
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setMaintenanceForm(
                                                {
                                                    ...maintenanceForm,
                                                    otherMaintenanceCost:
                                                        event
                                                            .target
                                                            .value,
                                                }
                                            )
                                        }
                                        placeholder="0"
                                    />
                                </FormField>

                                <FormField
                                    label="Notes"
                                    htmlFor="maintenance-notes"
                                    className="full-width"
                                >
                                    <textarea
                                        id="maintenance-notes"
                                        value={
                                            maintenanceForm.notes
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setMaintenanceForm(
                                                {
                                                    ...maintenanceForm,
                                                    notes: event
                                                        .target
                                                        .value,
                                                }
                                            )
                                        }
                                        placeholder="Any additional notes..."
                                        rows="4"
                                    />
                                </FormField>
                            </div>
                        </div>


                        <div className="modern-form-actions">
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={
                                    closeMaintenanceForm
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="primary-button"
                            >
                                <CheckIcon />

                                Save Maintenance
                            </button>
                        </div>
                    </form>
                </section>
            )}


            {/* VEHICLES */}

            <section className="vehicles-section">
                <div className="section-header vehicles-section-header">
                    <div>
                        <span className="page-eyebrow">
                            YOUR FLEET
                        </span>

                        <h2>
                            Vehicles
                        </h2>

                        <p>
                            {vehicles.length}{" "}
                            vehicle
                            {vehicles.length !==
                            1
                                ? "s"
                                : ""}{" "}
                            in your account
                        </p>
                    </div>
                </div>


                {vehicles.length === 0 ? (
                    <div className="vehicles-empty-state">
                        <div className="vehicles-empty-icon">
                            <VehicleIcon />
                        </div>

                        <h3>
                            No vehicles yet
                        </h3>

                        <p>
                            Add your first vehicle to
                            start tracking fuel,
                            trips, mileage, and
                            maintenance.
                        </p>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={() =>
                                setShowVehicleForm(
                                    true
                                )
                            }
                        >
                            <PlusIcon />

                            Add Your First Vehicle
                        </button>
                    </div>
                ) : (
                    <div className="vehicles-grid">
                        {vehicles.map(
                            (vehicle) => {
                                const vehicleMaintenance =
                                    getVehicleMaintenance(
                                        vehicle.id
                                    );

                                const maintenanceTotal =
                                    getMaintenanceTotal(
                                        vehicle.id
                                    );

                                const isActive =
                                    Number(
                                        vehicle.active
                                    ) !== 0;

                                return (
                                    <article
                                        className="vehicle-card"
                                        key={
                                            vehicle.id
                                        }
                                    >
                                        <div className="vehicle-card-header">
                                            <div className="vehicle-card-identity">
                                                <div className="vehicle-card-icon">
                                                    <VehicleIcon />
                                                </div>

                                                <div>
                                                    <h3>
                                                        {
                                                            vehicle.name
                                                        }
                                                    </h3>

                                                    <span className="vehicle-registration">
                                                        {
                                                            vehicle.registration
                                                        }
                                                    </span>
                                                </div>
                                            </div>

                                            <span
                                                className={`status-badge ${
                                                    isActive
                                                        ? "active"
                                                        : "inactive"
                                                }`}
                                            >
                                                <span></span>

                                                {isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </div>


                                        <div className="vehicle-card-divider"></div>


                                        <div className="vehicle-card-stats">
                                            <div className="vehicle-stat">
                                                <span>
                                                    Maintenance
                                                </span>

                                                <strong>
                                                    {
                                                        vehicleMaintenance.length
                                                    }
                                                </strong>

                                                <small>
                                                    records
                                                </small>
                                            </div>

                                            <div className="vehicle-stat">
                                                <span>
                                                    Maintenance
                                                    Cost
                                                </span>

                                                <strong>
                                                    Rs{" "}
                                                    {maintenanceTotal.toLocaleString()}
                                                </strong>

                                                <small>
                                                    total
                                                </small>
                                            </div>
                                        </div>


                                        <div className="vehicle-card-divider"></div>


                                        <div className="vehicle-card-actions">
                                            <Link
                                                to={`/vehicles/${vehicle.id}`}
                                                className="primary-outline-button"
                                            >
                                                View Details

                                                <ArrowIcon />
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
                                                <WrenchIcon />

                                                Maintenance
                                            </button>
                                        </div>


                                        <div className="vehicle-danger-actions">
                                            {isActive && (
                                                <button
                                                    type="button"
                                                    className="text-danger-button"
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
                                                className="text-danger-button"
                                                onClick={() =>
                                                    handleDeleteVehicle(
                                                        vehicle.id
                                                    )
                                                }
                                            >
                                                Delete permanently
                                            </button>
                                        </div>
                                    </article>
                                );
                            }
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}


function FormField({
    label,
    htmlFor,
    required = false,
    children,
    className = "",
}) {
    return (
        <div
            className={`form-group ${
                className
            }`}
        >
            <label htmlFor={htmlFor}>
                {label}

                {required && (
                    <span className="required-mark">
                        *
                    </span>
                )}
            </label>

            {children}
        </div>
    );
}


function MaintenanceField({
    label,
    value,
    onChange,
    type = "text",
    prefix,
    placeholder,
}) {
    return (
        <div className="form-group">
            <label>
                {label}
            </label>

            <div
                className={
                    prefix
                        ? "input-with-prefix"
                        : ""
                }
            >
                {prefix && (
                    <span>
                        {prefix}
                    </span>
                )}

                <input
                    type={type}
                    min={
                        type === "number"
                            ? "0"
                            : undefined
                    }
                    value={value}
                    onChange={(event) =>
                        onChange(
                            event.target.value
                        )
                    }
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
}


function PlusIcon() {
    return (
        <svg
            className="button-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
        </svg>
    );
}


function VehicleIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 17h14" />
            <path d="M6 17v-5l1.5-5h9L18 12v5" />
            <path d="M4 12h16" />
            <circle
                cx="7"
                cy="17"
                r="1.5"
            />
            <circle
                cx="17"
                cy="17"
                r="1.5"
            />
        </svg>
    );
}


function WrenchIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.6-.7-.7-2.6 2.7-2.1Z" />
        </svg>
    );
}


function CheckIcon() {
    return (
        <svg
            className="button-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m5 12 4 4L19 6" />
        </svg>
    );
}


function PauseIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
        >
            <rect
                x="5"
                y="4"
                width="4"
                height="16"
                rx="1"
            />

            <rect
                x="15"
                y="4"
                width="4"
                height="16"
                rx="1"
            />
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
        >
            <path d="M6 6l12 12" />
            <path d="M18 6 6 18" />
        </svg>
    );
}


function ArrowIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
        </svg>
    );
}


export default Vehicles;