import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

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
            const [
                vehiclesResponse,
                entriesResponse,
                maintenanceResponse,
            ] = await Promise.all([
                fetch("http://192.168.18.72:5000/vehicles"),
                fetch("http://192.168.18.72:5000/entries"),
                fetch(
                    "http://192.168.18.72:5000/vehicle-maintenance"
                ),
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
        return `Rs ${Number(value || 0).toLocaleString(
            undefined,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`;
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

    const averageMileage =
        entries.filter(
            (entry) =>
                Number(entry.mileage) > 0
        ).length > 0
            ? entries
                  .filter(
                      (entry) =>
                          Number(entry.mileage) > 0
                  )
                  .reduce(
                      (total, entry) =>
                          total +
                          Number(entry.mileage),
                      0
                  ) /
              entries.filter(
                  (entry) =>
                      Number(entry.mileage) > 0
              ).length
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
                    Loading vehicle...
                </div>
            </main>
        );
    }

    if (!vehicle) {
        return (
            <main className="page">
                <div className="page-header">
                    <div>
                        <h1>Vehicle Not Found</h1>
                        <p>
                            The selected vehicle does not
                            exist.
                        </p>
                    </div>
                </div>

                <Link
                    to="/vehicles"
                    className="secondary-button"
                >
                    ← Back to Vehicles
                </Link>
            </main>
        );
    }

    return (
        <main className="page">
            <div className="page-header">
                <div>
                    <Link
                        to="/vehicles"
                        className="back-link"
                    >
                        ← Back to Vehicles
                    </Link>

                    <h1>{vehicle.name}</h1>

                    <p>
                        {vehicle.registration ||
                            "No registration number"}
                    </p>
                </div>

                <span
                    className={
                        vehicle.active !== 0
                            ? "status-badge active"
                            : "status-badge"
                    }
                >
                    {vehicle.active !== 0
                        ? "Active"
                        : "Inactive"}
                </span>
            </div>

            <section className="stats-grid">
                <div className="stat-card">
                    <span>Total Spending</span>
                    <strong>
                        {formatMoney(totalSpending)}
                    </strong>
                </div>

                <div className="stat-card">
                    <span>Total Fuel</span>
                    <strong>
                        {totalFuel.toFixed(2)} L
                    </strong>
                </div>

                <div className="stat-card">
                    <span>Total Distance</span>
                    <strong>
                        {totalDistance.toLocaleString()} km
                    </strong>
                </div>

                <div className="stat-card">
                    <span>Average Mileage</span>
                    <strong>
                        {averageMileage
                            ? `${averageMileage.toFixed(
                                  2
                              )} km/L`
                            : "—"}
                    </strong>
                </div>

                <div className="stat-card">
                    <span>Maintenance Cost</span>
                    <strong>
                        {formatMoney(
                            totalMaintenanceCost
                        )}
                    </strong>
                </div>

                <div className="stat-card">
                    <span>Maintenance Records</span>
                    <strong>
                        {maintenance.length}
                    </strong>
                </div>
            </section>

            <section className="table-card">
                <div className="card-header">
                    <div>
                        <h2>Fuel History</h2>
                        <p>
                            Fuel entries recorded for this
                            vehicle
                        </p>
                    </div>
                </div>

                {entries.length === 0 ? (
                    <div className="empty-state">
                        No fuel entries for this vehicle yet.
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Petrol Pump</th>
                                    <th>Price/L</th>
                                    <th>Litres</th>
                                    <th>Total</th>
                                    <th>Odometer</th>
                                    <th>Distance</th>
                                    <th>Mileage</th>
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
                                                {
                                                    entry.pumpName
                                                }
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
                                                {formatMoney(
                                                    entry.totalPrice
                                                )}
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
                )}
            </section>

            <section className="table-card">
                <div className="card-header">
                    <div>
                        <h2>Maintenance History</h2>
                        <p>
                            Maintenance work and expenses
                        </p>
                    </div>

                    <strong>
                        Total:{" "}
                        {formatMoney(
                            totalMaintenanceCost
                        )}
                    </strong>
                </div>

                {maintenance.length === 0 ? (
                    <div className="empty-state">
                        No maintenance records for this
                        vehicle yet.
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Meter</th>
                                    <th>Maintenance</th>
                                    <th>Total Cost</th>
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
                                                {
                                                    item.date
                                                }
                                            </td>

                                            <td>
                                                {Number(
                                                    item.meterReading
                                                ).toLocaleString()}
                                            </td>

                                            <td>
                                                <div>
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
                                                </div>
                                            </td>

                                            <td>
                                                <strong>
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
                )}
            </section>
        </main>
    );
}

export default VehicleDetails;
