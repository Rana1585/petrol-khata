const express = require("express");
const cors = require("cors");

const db = require("./database");

const {
    createEntry,
    getAllEntries,
    getEntryById,
    deleteEntry
} = require("./entryService");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

/* =========================
   BASIC
========================= */

app.get("/", (req, res) => {
    res.json({
        message: "Petrol Khata API is running!"
    });
});

/* =========================
   VEHICLES
========================= */

app.get("/vehicles", (req, res) => {
    try {
        const vehicles = db
            .prepare(`
                SELECT
                    id,
                    name,
                    registration,
                    active,
                    createdAt
                FROM vehicles
                ORDER BY id ASC
            `)
            .all();

        res.json(vehicles);
    } catch (error) {
        console.error("Failed to fetch vehicles:", error);

        res.status(500).json({
            error: "Failed to fetch vehicles"
        });
    }
});

app.get("/vehicle-summaries", (req, res) => {
    try {
        const vehicles = db
            .prepare(`
                SELECT
                    id,
                    name,
                    registration,
                    active,
                    createdAt
                FROM vehicles
                ORDER BY id ASC
            `)
            .all();

        const entriesData = getAllEntries();
        const entries = entriesData.entries || [];

        const maintenanceRecords = db
            .prepare(`
                SELECT
                    id,
                    vehicleId,
                    mobileOilCost,
                    oilFilterCost,
                    airFilterCost,
                    otherMaintenanceCost
                FROM vehicle_maintenance
            `)
            .all();

        const summaries = vehicles.map((vehicle) => {
            const vehicleEntries = entries
                .filter(
                    (entry) =>
                        Number(entry.vehicleId) ===
                        Number(vehicle.id)
                )
                .sort(
                    (a, b) =>
                        Number(a.id) -
                        Number(b.id)
                );

            const vehicleMaintenance =
                maintenanceRecords.filter(
                    (record) =>
                        Number(record.vehicleId) ===
                        Number(vehicle.id)
                );

            const totalSpending =
                vehicleEntries.reduce(
                    (total, entry) =>
                        total +
                        Number(
                            entry.totalPrice || 0
                        ),
                    0
                );

            const totalFuel =
                vehicleEntries.reduce(
                    (total, entry) =>
                        total +
                        Number(
                            entry.litres || 0
                        ),
                    0
                );

            let totalDistance = 0;

            for (
                let index = 1;
                index < vehicleEntries.length;
                index++
            ) {
                const previousOdometer =
                    Number(
                        vehicleEntries[
                            index - 1
                        ].odometer
                    );

                const currentOdometer =
                    Number(
                        vehicleEntries[index]
                            .odometer
                    );

                const distance =
                    currentOdometer -
                    previousOdometer;

                if (distance > 0) {
                    totalDistance += distance;
                }
            }

            const mileageValues =
                vehicleEntries
                    .filter(
                        (entry) =>
                            entry.mileage !== null &&
                            entry.mileage !== undefined &&
                            Number(entry.mileage) > 0
                    )
                    .map((entry) =>
                        Number(entry.mileage)
                    );

            const averageMileage =
                mileageValues.length > 0
                    ? mileageValues.reduce(
                          (
                              total,
                              mileage
                          ) =>
                              total +
                              mileage,
                          0
                      ) /
                      mileageValues.length
                    : null;

            const maintenanceCost =
                vehicleMaintenance.reduce(
                    (total, record) =>
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
                        ),
                    0
                );

            const currentOdometer =
                vehicleEntries.length > 0
                    ? Math.max(
                          ...vehicleEntries.map(
                              (entry) =>
                                  Number(
                                      entry.odometer
                                  )
                          )
                      )
                    : null;

            return {
                id: vehicle.id,
                name: vehicle.name,
                registration:
                    vehicle.registration,
                active: vehicle.active,
                createdAt:
                    vehicle.createdAt,

                currentOdometer,

                totalSpending:
                    Number(
                        totalSpending.toFixed(2)
                    ),

                totalFuel:
                    Number(
                        totalFuel.toFixed(2)
                    ),

                totalDistance:
                    Number(
                        totalDistance.toFixed(2)
                    ),

                averageMileage:
                    averageMileage !== null
                        ? Number(
                              averageMileage.toFixed(
                                  2
                              )
                          )
                        : null,

                maintenanceCost:
                    Number(
                        maintenanceCost.toFixed(2)
                    ),

                fuelEntries:
                    vehicleEntries.length,

                maintenanceRecords:
                    vehicleMaintenance.length
            };
        });

        res.json(summaries);
    } catch (error) {
        console.error(
            "Failed to fetch vehicle summaries:",
            error
        );

        res.status(500).json({
            error:
                "Failed to fetch vehicle summaries"
        });
    }
});

app.post("/vehicles", (req, res) => {
    try {
        const name =
            typeof req.body.name === "string"
                ? req.body.name.trim()
                : "";

        const registration =
            typeof req.body.registration === "string"
                ? req.body.registration.trim()
                : "";

        if (!name) {
            return res.status(400).json({
                error: "Vehicle name is required"
            });
        }

        const result = db
            .prepare(`
                INSERT INTO vehicles (
                    name,
                    registration
                )
                VALUES (?, ?)
            `)
            .run(
                name,
                registration || null
            );

        const vehicle = db
            .prepare(`
                SELECT
                    id,
                    name,
                    registration,
                    active,
                    createdAt
                FROM vehicles
                WHERE id = ?
            `)
            .get(result.lastInsertRowid);

        res.status(201).json(vehicle);
    } catch (error) {
        console.error(
            "Failed to create vehicle:",
            error
        );

        res.status(500).json({
            error: "Failed to create vehicle"
        });
    }
});

app.put("/vehicles/:id", (req, res) => {
    try {
        const id = Number(req.params.id);

        const name =
            typeof req.body.name === "string"
                ? req.body.name.trim()
                : "";

        const registration =
            typeof req.body.registration === "string"
                ? req.body.registration.trim()
                : "";

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "Invalid vehicle ID"
            });
        }

        if (!name) {
            return res.status(400).json({
                error: "Vehicle name is required"
            });
        }

        const result = db
            .prepare(`
                UPDATE vehicles
                SET
                    name = ?,
                    registration = ?
                WHERE id = ?
            `)
            .run(
                name,
                registration || null,
                id
            );

        if (result.changes === 0) {
            return res.status(404).json({
                error: "Vehicle not found"
            });
        }

        const vehicle = db
            .prepare(`
                SELECT
                    id,
                    name,
                    registration,
                    active,
                    createdAt
                FROM vehicles
                WHERE id = ?
            `)
            .get(id);

        res.json(vehicle);
    } catch (error) {
        console.error(
            "Failed to update vehicle:",
            error
        );

        res.status(500).json({
            error: "Failed to update vehicle"
        });
    }
});

app.delete("/vehicles/:id", (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "Invalid vehicle ID"
            });
        }

        const result = db
            .prepare(`
                UPDATE vehicles
                SET active = 0
                WHERE id = ?
            `)
            .run(id);

        if (result.changes === 0) {
            return res.status(404).json({
                error: "Vehicle not found"
            });
        }

        res.json({
            message:
                "Vehicle deactivated successfully"
        });
    } catch (error) {
        console.error(
            "Failed to deactivate vehicle:",
            error
        );

        res.status(500).json({
            error:
                "Failed to deactivate vehicle"
        });
    }
});

/* =========================
   FUEL ENTRIES
========================= */

app.post("/entries", (req, res) => {
    try {
        const savedEntry =
            createEntry(req.body);

        res.status(201).json(savedEntry);
    } catch (error) {
        console.error(
            "Failed to create entry:",
            error
        );

        res.status(400).json({
            error: error.message
        });
    }
});

app.get("/entries", (req, res) => {
    try {
        const data = getAllEntries();

        res.json(data);
    } catch (error) {
        console.error(
            "Failed to fetch entries:",
            error
        );

        res.status(500).json({
            error: "Failed to fetch entries"
        });
    }
});

app.get("/entries/:id", (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "Invalid entry ID"
            });
        }

        const entry = getEntryById(id);

        if (!entry) {
            return res.status(404).json({
                error: "Entry not found"
            });
        }

        res.json(entry);
    } catch (error) {
        console.error(
            "Failed to fetch entry:",
            error
        );

        res.status(500).json({
            error: "Failed to fetch entry"
        });
    }
});

app.delete("/entries/:id", (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "Invalid entry ID"
            });
        }

        const result = deleteEntry(id);

        if (result.changes === 0) {
            return res.status(404).json({
                error: "Entry not found"
            });
        }

        res.json({
            message:
                "Entry deleted successfully"
        });
    } catch (error) {
        console.error(
            "Failed to delete entry:",
            error
        );

        res.status(500).json({
            error:
                "Failed to delete entry"
        });
    }
});

/* =========================
   TRIPS
========================= */

app.get("/trips", (req, res) => {
    try {
        const trips = db
            .prepare(`
                SELECT
                    trips.id,
                    trips.vehicleId,
                    vehicles.name AS vehicleName,
                    vehicles.registration
                        AS vehicleRegistration,
                    trips.name,
                    trips.startLocation,
                    trips.destination,
                    trips.startDate,
                    trips.endDate,
                    trips.startOdometer,
                    trips.endOdometer
                FROM trips
                INNER JOIN vehicles
                    ON vehicles.id =
                       trips.vehicleId
                ORDER BY trips.id DESC
            `)
            .all();

        const enrichedTrips =
            trips.map((trip) => {
                const fuel = db
                    .prepare(`
                        SELECT
                            COALESCE(
                                SUM(litres),
                                0
                            ) AS totalFuel,

                            COALESCE(
                                SUM(totalPrice),
                                0
                            ) AS totalCost,

                            COUNT(*) AS fuelEntries

                        FROM entries

                        WHERE tripId = ?
                    `)
                    .get(trip.id);

                let distance = null;

                if (
                    trip.endOdometer !== null &&
                    trip.endOdometer !== undefined
                ) {
                    distance =
                        Number(
                            trip.endOdometer
                        ) -
                        Number(
                            trip.startOdometer
                        );
                }

                const mileage =
                    distance !== null &&
                    distance > 0 &&
                    Number(fuel.totalFuel) > 0
                        ? Number(
                              (
                                  distance /
                                  Number(
                                      fuel.totalFuel
                                  )
                              ).toFixed(2)
                          )
                        : null;

                return {
                    ...trip,

                    distance,

                    totalFuel:
                        Number(
                            Number(
                                fuel.totalFuel
                            ).toFixed(2)
                        ),

                    totalCost:
                        Number(
                            Number(
                                fuel.totalCost
                            ).toFixed(2)
                        ),

                    fuelEntries:
                        fuel.fuelEntries,

                    mileage
                };
            });

        res.json(enrichedTrips);
    } catch (error) {
        console.error(
            "Failed to fetch trips:",
            error
        );

        res.status(500).json({
            error: "Failed to fetch trips"
        });
    }
});

app.get("/trips/:id", (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "Invalid trip ID"
            });
        }

        const trip = db
            .prepare(`
                SELECT
                    trips.id,
                    trips.vehicleId,
                    vehicles.name AS vehicleName,
                    vehicles.registration
                        AS vehicleRegistration,
                    trips.name,
                    trips.startLocation,
                    trips.destination,
                    trips.startDate,
                    trips.endDate,
                    trips.startOdometer,
                    trips.endOdometer
                FROM trips
                INNER JOIN vehicles
                    ON vehicles.id =
                       trips.vehicleId
                WHERE trips.id = ?
            `)
            .get(id);

        if (!trip) {
            return res.status(404).json({
                error: "Trip not found"
            });
        }

        const fuelEntries = db
            .prepare(`
                SELECT
                    id,
                    vehicleId,
                    date,
                    pumpName,
                    price,
                    totalPrice,
                    odometer,
                    litres,
                    tripId
                FROM entries
                WHERE tripId = ?
                ORDER BY id ASC
            `)
            .all(id);

        const totalFuel =
            fuelEntries.reduce(
                (total, entry) =>
                    total +
                    Number(entry.litres),
                0
            );

        const totalCost =
            fuelEntries.reduce(
                (total, entry) =>
                    total +
                    Number(entry.totalPrice),
                0
            );

        let distance = null;

        if (
            trip.endOdometer !== null &&
            trip.endOdometer !== undefined
        ) {
            distance =
                Number(
                    trip.endOdometer
                ) -
                Number(
                    trip.startOdometer
                );
        }

        const mileage =
            distance !== null &&
            distance > 0 &&
            totalFuel > 0
                ? Number(
                      (
                          distance /
                          totalFuel
                      ).toFixed(2)
                  )
                : null;

        res.json({
            ...trip,

            distance,

            totalFuel:
                Number(
                    totalFuel.toFixed(2)
                ),

            totalCost:
                Number(
                    totalCost.toFixed(2)
                ),

            mileage,

            fuelEntries
        });
    } catch (error) {
        console.error(
            "Failed to fetch trip:",
            error
        );

        res.status(500).json({
            error: "Failed to fetch trip"
        });
    }
});

app.post("/trips", (req, res) => {
    try {
        const vehicleId =
            Number(req.body.vehicleId);

        const name =
            typeof req.body.name === "string"
                ? req.body.name.trim()
                : "";

        const startLocation =
            typeof req.body.startLocation ===
            "string"
                ? req.body.startLocation.trim()
                : "";

        const destination =
            typeof req.body.destination ===
            "string"
                ? req.body.destination.trim()
                : "";

        const startDate =
            typeof req.body.startDate ===
            "string"
                ? req.body.startDate
                : "";

        const endDate =
            typeof req.body.endDate ===
                "string" &&
            req.body.endDate.trim() !== ""
                ? req.body.endDate
                : null;

        const startOdometer =
            Number(req.body.startOdometer);

        const endOdometer =
            req.body.endOdometer === null ||
            req.body.endOdometer === undefined ||
            req.body.endOdometer === ""
                ? null
                : Number(
                      req.body.endOdometer
                  );

        if (
            !Number.isInteger(vehicleId) ||
            vehicleId <= 0
        ) {
            return res.status(400).json({
                error:
                    "Valid vehicle is required"
            });
        }

        if (!name) {
            return res.status(400).json({
                error:
                    "Trip name is required"
            });
        }

        if (!startLocation) {
            return res.status(400).json({
                error:
                    "Starting location is required"
            });
        }

        if (!destination) {
            return res.status(400).json({
                error:
                    "Destination is required"
            });
        }

        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(
                startDate
            )
        ) {
            return res.status(400).json({
                error:
                    "Valid start date is required"
            });
        }

        if (
            endDate !== null &&
            !/^\d{4}-\d{2}-\d{2}$/.test(
                endDate
            )
        ) {
            return res.status(400).json({
                error: "Invalid end date"
            });
        }

        if (
            !Number.isFinite(
                startOdometer
            ) ||
            startOdometer < 0
        ) {
            return res.status(400).json({
                error:
                    "Valid starting odometer is required"
            });
        }

        if (
            endOdometer !== null &&
            (!Number.isFinite(
                endOdometer
            ) ||
                endOdometer <
                    startOdometer)
        ) {
            return res.status(400).json({
                error:
                    "Ending odometer must be greater than or equal to starting odometer"
            });
        }

        const vehicle = db
            .prepare(`
                SELECT id
                FROM vehicles
                WHERE id = ?
                  AND active = 1
            `)
            .get(vehicleId);

        if (!vehicle) {
            return res.status(404).json({
                error: "Vehicle not found"
            });
        }

        const result = db
            .prepare(`
                INSERT INTO trips (
                    vehicleId,
                    name,
                    startLocation,
                    destination,
                    startDate,
                    endDate,
                    startOdometer,
                    endOdometer
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `)
            .run(
                vehicleId,
                name,
                startLocation,
                destination,
                startDate,
                endDate,
                startOdometer,
                endOdometer
            );

        const trip = db
            .prepare(`
                SELECT *
                FROM trips
                WHERE id = ?
            `)
            .get(result.lastInsertRowid);

        res.status(201).json(trip);
    } catch (error) {
        console.error(
            "Failed to create trip:",
            error
        );

        res.status(500).json({
            error: "Failed to create trip"
        });
    }
});

app.put("/trips/:id", (req, res) => {
    try {
        const id =
            Number(req.params.id);

        const endDate =
            typeof req.body.endDate ===
                "string" &&
            req.body.endDate.trim() !== ""
                ? req.body.endDate
                : null;

        const endOdometer =
            req.body.endOdometer === null ||
            req.body.endOdometer ===
                undefined ||
            req.body.endOdometer === ""
                ? null
                : Number(
                      req.body.endOdometer
                  );

        if (
            !Number.isInteger(id) ||
            id <= 0
        ) {
            return res.status(400).json({
                error: "Invalid trip ID"
            });
        }

        const trip = db
            .prepare(`
                SELECT startOdometer
                FROM trips
                WHERE id = ?
            `)
            .get(id);

        if (!trip) {
            return res.status(404).json({
                error: "Trip not found"
            });
        }

        if (
            endDate !== null &&
            !/^\d{4}-\d{2}-\d{2}$/.test(
                endDate
            )
        ) {
            return res.status(400).json({
                error: "Invalid end date"
            });
        }

        if (
            endOdometer !== null &&
            (!Number.isFinite(
                endOdometer
            ) ||
                endOdometer <
                    Number(
                        trip.startOdometer
                    ))
        ) {
            return res.status(400).json({
                error:
                    "Invalid ending odometer"
            });
        }

        db.prepare(`
            UPDATE trips
            SET
                endDate = ?,
                endOdometer = ?
            WHERE id = ?
        `).run(
            endDate,
            endOdometer,
            id
        );

        const updatedTrip = db
            .prepare(`
                SELECT *
                FROM trips
                WHERE id = ?
            `)
            .get(id);

        res.json(updatedTrip);
    } catch (error) {
        console.error(
            "Failed to update trip:",
            error
        );

        res.status(500).json({
            error: "Failed to update trip"
        });
    }
});

app.delete("/trips/:id", (req, res) => {
    try {
        const id =
            Number(req.params.id);

        if (
            !Number.isInteger(id) ||
            id <= 0
        ) {
            return res.status(400).json({
                error: "Invalid trip ID"
            });
        }

        const result = db
            .prepare(
                "DELETE FROM trips WHERE id = ?"
            )
            .run(id);

        if (result.changes === 0) {
            return res.status(404).json({
                error: "Trip not found"
            });
        }

        res.json({
            message:
                "Trip deleted successfully"
        });
    } catch (error) {
        console.error(
            "Failed to delete trip:",
            error
        );

        res.status(500).json({
            error:
                "Failed to delete trip"
        });
    }
});

/* =========================
   VEHICLE RECORDS
========================= */

app.get("/vehicle-records", (req, res) => {
    try {
        const records = db
            .prepare(`
                SELECT
                    vehicle_records.id,
                    vehicle_records.vehicleId,
                    vehicles.name AS vehicleName,
                    vehicles.registration
                        AS vehicleRegistration,
                    vehicle_records.date,
                    vehicle_records.price,
                    vehicle_records.meterReading
                FROM vehicle_records
                INNER JOIN vehicles
                    ON vehicles.id =
                       vehicle_records.vehicleId
                ORDER BY
                    vehicle_records.date DESC,
                    vehicle_records.id DESC
            `)
            .all();

        res.json(records);
    } catch (error) {
        console.error(
            "Failed to fetch vehicle records:",
            error
        );

        res.status(500).json({
            error:
                "Failed to fetch vehicle records"
        });
    }
});

app.post("/vehicle-records", (req, res) => {
    try {
        const vehicleId =
            Number(req.body.vehicleId);

        const date =
            typeof req.body.date === "string"
                ? req.body.date
                : "";

        const price =
            Number(req.body.price);

        const meterReading =
            Number(req.body.meterReading);

        if (
            !Number.isInteger(vehicleId) ||
            vehicleId <= 0
        ) {
            return res.status(400).json({
                error:
                    "Valid vehicle is required"
            });
        }

        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(
                date
            )
        ) {
            return res.status(400).json({
                error:
                    "Valid date is required"
            });
        }

        if (
            !Number.isFinite(price) ||
            price < 0
        ) {
            return res.status(400).json({
                error:
                    "Price must be valid"
            });
        }

        if (
            !Number.isFinite(
                meterReading
            ) ||
            meterReading < 0
        ) {
            return res.status(400).json({
                error:
                    "Meter reading must be valid"
            });
        }

        const vehicle = db
            .prepare(`
                SELECT id
                FROM vehicles
                WHERE id = ?
                  AND active = 1
            `)
            .get(vehicleId);

        if (!vehicle) {
            return res.status(404).json({
                error: "Vehicle not found"
            });
        }

        const result = db
            .prepare(`
                INSERT INTO vehicle_records (
                    vehicleId,
                    date,
                    price,
                    meterReading
                )
                VALUES (?, ?, ?, ?)
            `)
            .run(
                vehicleId,
                date,
                price,
                meterReading
            );

        const record = db
            .prepare(`
                SELECT
                    vehicle_records.id,
                    vehicle_records.vehicleId,
                    vehicles.name AS vehicleName,
                    vehicles.registration
                        AS vehicleRegistration,
                    vehicle_records.date,
                    vehicle_records.price,
                    vehicle_records.meterReading
                FROM vehicle_records
                INNER JOIN vehicles
                    ON vehicles.id =
                       vehicle_records.vehicleId
                WHERE vehicle_records.id = ?
            `)
            .get(
                result.lastInsertRowid
            );

        res.status(201).json(record);
    } catch (error) {
        console.error(
            "Failed to create vehicle record:",
            error
        );

        res.status(500).json({
            error:
                "Failed to create vehicle record"
        });
    }
});

app.delete(
    "/vehicle-records/:id",
    (req, res) => {
        try {
            const id =
                Number(req.params.id);

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {
                return res.status(400).json({
                    error:
                        "Invalid record ID"
                });
            }

            const result = db
                .prepare(
                    "DELETE FROM vehicle_records WHERE id = ?"
                )
                .run(id);

            if (result.changes === 0) {
                return res.status(404).json({
                    error:
                        "Vehicle record not found"
                });
            }

            res.json({
                message:
                    "Vehicle record deleted successfully"
            });
        } catch (error) {
            console.error(
                "Failed to delete vehicle record:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to delete vehicle record"
            });
        }
    }
);

/* =========================
   VEHICLE MAINTENANCE
========================= */

app.get(
    "/vehicle-maintenance",
    (req, res) => {
        try {
            const records = db
                .prepare(`
                    SELECT
                        vehicle_maintenance.id,
                        vehicle_maintenance.vehicleId,
                        vehicles.name AS vehicleName,
                        vehicles.registration
                            AS vehicleRegistration,
                        vehicle_maintenance.date,
                        vehicle_maintenance.meterReading,

                        vehicle_maintenance.mobileOil,
                        vehicle_maintenance.mobileOilCost,

                        vehicle_maintenance.oilFilter,
                        vehicle_maintenance.oilFilterCost,

                        vehicle_maintenance.airFilter,
                        vehicle_maintenance.airFilterCost,

                        vehicle_maintenance.otherMaintenance,
                        vehicle_maintenance.otherMaintenanceCost,

                        vehicle_maintenance.notes

                    FROM vehicle_maintenance

                    INNER JOIN vehicles
                        ON vehicles.id =
                           vehicle_maintenance.vehicleId

                    ORDER BY
                        vehicle_maintenance.date DESC,
                        vehicle_maintenance.id DESC
                `)
                .all();

            const enrichedRecords =
                records.map((record) => {
                    const totalCost =
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
                        );

                    return {
                        ...record,

                        mobileOilCost:
                            Number(
                                Number(
                                    record.mobileOilCost ||
                                        0
                                ).toFixed(2)
                            ),

                        oilFilterCost:
                            Number(
                                Number(
                                    record.oilFilterCost ||
                                        0
                                ).toFixed(2)
                            ),

                        airFilterCost:
                            Number(
                                Number(
                                    record.airFilterCost ||
                                        0
                                ).toFixed(2)
                            ),

                        otherMaintenanceCost:
                            Number(
                                Number(
                                    record.otherMaintenanceCost ||
                                        0
                                ).toFixed(2)
                            ),

                        totalCost:
                            Number(
                                totalCost.toFixed(
                                    2
                                )
                            )
                    };
                });

            res.json(enrichedRecords);
        } catch (error) {
            console.error(
                "Failed to fetch maintenance records:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to fetch maintenance records"
            });
        }
    }
);

app.post(
    "/vehicle-maintenance",
    (req, res) => {
        try {
            const vehicleId =
                Number(req.body.vehicleId);

            const date =
                typeof req.body.date ===
                "string"
                    ? req.body.date
                    : "";

            const meterReading =
                Number(
                    req.body.meterReading
                );

            const mobileOil =
                typeof req.body.mobileOil ===
                "string"
                    ? req.body.mobileOil.trim()
                    : "";

            const mobileOilCost =
                req.body.mobileOilCost ===
                    "" ||
                req.body.mobileOilCost ===
                    null ||
                req.body.mobileOilCost ===
                    undefined
                    ? 0
                    : Number(
                          req.body.mobileOilCost
                      );

            const oilFilter =
                typeof req.body.oilFilter ===
                "string"
                    ? req.body.oilFilter.trim()
                    : "";

            const oilFilterCost =
                req.body.oilFilterCost ===
                    "" ||
                req.body.oilFilterCost ===
                    null ||
                req.body.oilFilterCost ===
                    undefined
                    ? 0
                    : Number(
                          req.body.oilFilterCost
                      );

            const airFilter =
                typeof req.body.airFilter ===
                "string"
                    ? req.body.airFilter.trim()
                    : "";

            const airFilterCost =
                req.body.airFilterCost ===
                    "" ||
                req.body.airFilterCost ===
                    null ||
                req.body.airFilterCost ===
                    undefined
                    ? 0
                    : Number(
                          req.body.airFilterCost
                      );

            const otherMaintenance =
                typeof req.body
                    .otherMaintenance ===
                "string"
                    ? req.body.otherMaintenance.trim()
                    : "";

            const otherMaintenanceCost =
                req.body
                    .otherMaintenanceCost ===
                    "" ||
                req.body
                    .otherMaintenanceCost ===
                    null ||
                req.body
                    .otherMaintenanceCost ===
                    undefined
                    ? 0
                    : Number(
                          req.body
                              .otherMaintenanceCost
                      );

            const notes =
                typeof req.body.notes ===
                "string"
                    ? req.body.notes.trim()
                    : "";

            if (
                !Number.isInteger(
                    vehicleId
                ) ||
                vehicleId <= 0
            ) {
                return res.status(400).json({
                    error:
                        "Valid vehicle is required"
                });
            }

            if (
                !/^\d{4}-\d{2}-\d{2}$/.test(
                    date
                )
            ) {
                return res.status(400).json({
                    error:
                        "Valid date is required"
                });
            }

            if (
                !Number.isFinite(
                    meterReading
                ) ||
                meterReading < 0
            ) {
                return res.status(400).json({
                    error:
                        "Valid meter reading is required"
                });
            }

            const costs = [
                mobileOilCost,
                oilFilterCost,
                airFilterCost,
                otherMaintenanceCost
            ];

            if (
                costs.some(
                    (cost) =>
                        !Number.isFinite(
                            cost
                        ) ||
                        cost < 0
                )
            ) {
                return res.status(400).json({
                    error:
                        "Maintenance costs must be valid positive numbers"
                });
            }

            if (
                !mobileOil &&
                !oilFilter &&
                !airFilter &&
                !otherMaintenance
            ) {
                return res.status(400).json({
                    error:
                        "At least one maintenance item is required"
                });
            }

            const vehicle = db
                .prepare(`
                    SELECT
                        id,
                        name,
                        registration
                    FROM vehicles
                    WHERE id = ?
                      AND active = 1
                `)
                .get(vehicleId);

            if (!vehicle) {
                return res.status(404).json({
                    error:
                        "Vehicle not found"
                });
            }

            const result = db
                .prepare(`
                    INSERT INTO vehicle_maintenance (
                        vehicleId,
                        date,
                        meterReading,
                        mobileOil,
                        mobileOilCost,
                        oilFilter,
                        oilFilterCost,
                        airFilter,
                        airFilterCost,
                        otherMaintenance,
                        otherMaintenanceCost,
                        notes
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `)
                .run(
                    vehicleId,
                    date,
                    meterReading,
                    mobileOil || null,
                    mobileOilCost,
                    oilFilter || null,
                    oilFilterCost,
                    airFilter || null,
                    airFilterCost,
                    otherMaintenance ||
                        null,
                    otherMaintenanceCost,
                    notes || null
                );

            const record = db
                .prepare(`
                    SELECT
                        vehicle_maintenance.id,
                        vehicle_maintenance.vehicleId,
                        vehicles.name AS vehicleName,
                        vehicles.registration
                            AS vehicleRegistration,
                        vehicle_maintenance.date,
                        vehicle_maintenance.meterReading,

                        vehicle_maintenance.mobileOil,
                        vehicle_maintenance.mobileOilCost,

                        vehicle_maintenance.oilFilter,
                        vehicle_maintenance.oilFilterCost,

                        vehicle_maintenance.airFilter,
                        vehicle_maintenance.airFilterCost,

                        vehicle_maintenance.otherMaintenance,
                        vehicle_maintenance.otherMaintenanceCost,

                        vehicle_maintenance.notes

                    FROM vehicle_maintenance

                    INNER JOIN vehicles
                        ON vehicles.id =
                           vehicle_maintenance.vehicleId

                    WHERE vehicle_maintenance.id = ?
                `)
                .get(
                    result.lastInsertRowid
                );

            const totalCost =
                Number(
                    record.mobileOilCost || 0
                ) +
                Number(
                    record.oilFilterCost || 0
                ) +
                Number(
                    record.airFilterCost || 0
                ) +
                Number(
                    record.otherMaintenanceCost ||
                        0
                );

            res.status(201).json({
                ...record,

                totalCost:
                    Number(
                        totalCost.toFixed(2)
                    )
            });
        } catch (error) {
            console.error(
                "Failed to create maintenance record:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to create maintenance record"
            });
        }
    }
);

app.delete(
    "/vehicle-maintenance/:id",
    (req, res) => {
        try {
            const id =
                Number(req.params.id);

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {
                return res.status(400).json({
                    error:
                        "Invalid maintenance record ID"
                });
            }

            const result = db
                .prepare(`
                    DELETE FROM vehicle_maintenance
                    WHERE id = ?
                `)
                .run(id);

            if (result.changes === 0) {
                return res.status(404).json({
                    error:
                        "Maintenance record not found"
                });
            }

            res.json({
                message:
                    "Maintenance record deleted successfully"
            });
        } catch (error) {
            console.error(
                "Failed to delete maintenance record:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to delete maintenance record"
            });
        }
    }
);

/* =========================
   FUEL PRICE
========================= */

async function fetchCurrentFuelPrice() {
    const response = await fetch(
        "https://oilprices.pk/api/latest"
    );

    if (!response.ok) {
        throw new Error(
            "Fuel price API request failed"
        );
    }

    const data = await response.json();

    const petrol =
        data.products.find(
            (item) =>
                item.product ===
                "Motor Spirit (Petrol)"
        );

    if (!petrol) {
        throw new Error(
            "Petrol price not found"
        );
    }

    return {
        price: Number(petrol.pricePkr),
        unit: petrol.unit,
        effectiveDate:
            data.effectiveDate
    };
}

app.get(
    "/fuel-price",
    async (req, res) => {
        try {
            const fuelPrice =
                await fetchCurrentFuelPrice();

            db.prepare(`
                INSERT INTO fuel_price_history (
                    price,
                    effectiveDate
                )
                SELECT ?, ?
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM fuel_price_history
                    WHERE price = ?
                      AND effectiveDate = ?
                )
            `).run(
                fuelPrice.price,
                fuelPrice.effectiveDate,
                fuelPrice.price,
                fuelPrice.effectiveDate
            );

            res.json(fuelPrice);
        } catch (error) {
            console.error(
                "Failed to fetch fuel price:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to fetch fuel price"
            });
        }
    }
);

app.get(
    "/fuel-price/history",
    (req, res) => {
        try {
            const history = db
                .prepare(`
                    SELECT
                        id,
                        price,
                        effectiveDate,
                        recordedAt
                    FROM fuel_price_history
                    ORDER BY
                        effectiveDate ASC,
                        id ASC
                `)
                .all();

            res.json(history);
        } catch (error) {
            console.error(
                "Failed to fetch fuel price history:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to fetch fuel price history"
            });
        }
    }
);

/* =========================
   DASHBOARD
========================= */

app.get(
    "/dashboard",
    async (req, res) => {
        try {
            const totals = db
                .prepare(`
                    SELECT
                        COUNT(*) AS totalEntries,

                        COALESCE(
                            SUM(totalPrice),
                            0
                        ) AS totalSpending,

                        COALESCE(
                            SUM(litres),
                            0
                        ) AS totalFuel

                    FROM entries
                `)
                .get();

            const activeVehicles =
                db
                    .prepare(`
                        SELECT
                            COUNT(*) AS count
                        FROM vehicles
                        WHERE active = 1
                    `)
                    .get();

            const totalTrips =
                db
                    .prepare(`
                        SELECT
                            COUNT(*) AS count
                        FROM trips
                    `)
                    .get();

            const completedTrips =
                db
                    .prepare(`
                        SELECT
                            COUNT(*) AS count
                        FROM trips
                        WHERE endOdometer IS NOT NULL
                    `)
                    .get();

            const mileageData =
                getAllEntries();

            const averageMileage =
                mileageData.summary
                    .averageMileage;

            const recentEntries =
                db
                    .prepare(`
                        SELECT
                            entries.id,
                            entries.date,
                            entries.pumpName,
                            entries.price,
                            entries.totalPrice,
                            entries.litres,
                            entries.odometer,
                            vehicles.id AS vehicleId,
                            vehicles.name AS vehicleName,
                            vehicles.registration
                                AS vehicleRegistration,
                            entries.tripId
                        FROM entries
                        INNER JOIN vehicles
                            ON vehicles.id =
                               entries.vehicleId
                        ORDER BY
                            entries.date DESC,
                            entries.id DESC
                        LIMIT 5
                    `)
                    .all();

            const recentTrips =
                db
                    .prepare(`
                        SELECT
                            trips.id,
                            trips.name,
                            trips.startLocation,
                            trips.destination,
                            trips.startDate,
                            trips.endDate,
                            trips.startOdometer,
                            trips.endOdometer,
                            vehicles.id AS vehicleId,
                            vehicles.name AS vehicleName,
                            vehicles.registration
                                AS vehicleRegistration
                        FROM trips
                        INNER JOIN vehicles
                            ON vehicles.id =
                               trips.vehicleId
                        ORDER BY
                            trips.startDate DESC,
                            trips.id DESC
                        LIMIT 5
                    `)
                    .all();

            let fuelPrice = null;

            try {
                fuelPrice =
                    await fetchCurrentFuelPrice();

                db.prepare(`
                    INSERT INTO fuel_price_history (
                        price,
                        effectiveDate
                    )
                    SELECT ?, ?
                    WHERE NOT EXISTS (
                        SELECT 1
                        FROM fuel_price_history
                        WHERE price = ?
                          AND effectiveDate = ?
                    )
                `).run(
                    fuelPrice.price,
                    fuelPrice.effectiveDate,
                    fuelPrice.price,
                    fuelPrice.effectiveDate
                );
            } catch (fuelPriceError) {
                console.error(
                    "Dashboard fuel price fetch failed:",
                    fuelPriceError
                );

                const latestPrice =
                    db
                        .prepare(`
                            SELECT
                                price,
                                effectiveDate
                            FROM fuel_price_history
                            ORDER BY
                                effectiveDate DESC,
                                id DESC
                            LIMIT 1
                        `)
                        .get();

                if (latestPrice) {
                    fuelPrice = {
                        price:
                            Number(
                                latestPrice.price
                            ),
                        unit: "litre",
                        effectiveDate:
                            latestPrice.effectiveDate,
                        fromHistory:
                            true
                    };
                }
            }

            res.json({
                summary: {
                    totalEntries:
                        Number(
                            totals.totalEntries
                        ),

                    totalSpending:
                        Number(
                            Number(
                                totals.totalSpending
                            ).toFixed(2)
                        ),

                    totalFuel:
                        Number(
                            Number(
                                totals.totalFuel
                            ).toFixed(2)
                        ),

                    averageMileage,

                    activeVehicles:
                        Number(
                            activeVehicles.count
                        ),

                    totalTrips:
                        Number(
                            totalTrips.count
                        ),

                    completedTrips:
                        Number(
                            completedTrips.count
                        )
                },

                currentFuelPrice:
                    fuelPrice,

                recentEntries,

                recentTrips
            });
        } catch (error) {
            console.error(
                "Failed to fetch dashboard:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to fetch dashboard"
            });
        }
    }
);

/* =========================
   ANALYTICS
========================= */

app.get(
    "/analytics",
    (req, res) => {
        try {
            const vehicleId =
                req.query.vehicleId ===
                    undefined ||
                req.query.vehicleId === ""
                    ? null
                    : Number(
                          req.query.vehicleId
                      );

            const tripId =
                req.query.tripId ===
                    undefined ||
                req.query.tripId === ""
                    ? null
                    : Number(
                          req.query.tripId
                      );

            /* =========================
               VALIDATE VEHICLE FILTER
            ========================= */

            if (
                vehicleId !== null &&
                (!Number.isInteger(
                    vehicleId
                ) ||
                    vehicleId <= 0)
            ) {
                return res.status(400).json({
                    error:
                        "Invalid vehicle filter"
                });
            }

            /* =========================
               VALIDATE TRIP FILTER
            ========================= */

            if (
                tripId !== null &&
                (!Number.isInteger(
                    tripId
                ) ||
                    tripId <= 0)
            ) {
                return res.status(400).json({
                    error:
                        "Invalid trip filter"
                });
            }

            /* =========================
               VALIDATE SELECTED TRIP
            ========================= */

            let selectedTrip = null;

            if (tripId !== null) {
                selectedTrip = db
                    .prepare(`
                        SELECT
                            id,
                            vehicleId
                        FROM trips
                        WHERE id = ?
                    `)
                    .get(tripId);

                if (!selectedTrip) {
                    return res.status(404).json({
                        error:
                            "Trip not found"
                    });
                }

                if (
                    vehicleId !== null &&
                    Number(
                        selectedTrip.vehicleId
                    ) !==
                        Number(vehicleId)
                ) {
                    return res.status(400).json({
                        error:
                            "Selected trip does not belong to the selected vehicle"
                    });
                }
            }

            /* =========================
               GET ENTRIES
            ========================= */

            const entriesData =
                getAllEntries();

            let entries =
                entriesData.entries || [];

            /*
                Mileage is calculated by
                entryService before filtering.
                This means filtering does not
                destroy the vehicle's mileage
                history.
            */

            if (vehicleId !== null) {
                entries = entries.filter(
                    (entry) =>
                        Number(
                            entry.vehicleId
                        ) === vehicleId
                );
            }

            if (tripId !== null) {
                entries = entries.filter(
                    (entry) =>
                        Number(
                            entry.tripId
                        ) === tripId
                );
            }

            /* =========================
               SUMMARY
            ========================= */

            const totalSpending =
                entries.reduce(
                    (total, entry) =>
                        total +
                        Number(
                            entry.totalPrice ||
                                0
                        ),
                    0
                );

            const totalFuel =
                entries.reduce(
                    (total, entry) =>
                        total +
                        Number(
                            entry.litres || 0
                        ),
                    0
                );

            const totalDistance =
                entries.reduce(
                    (total, entry) =>
                        total +
                        (
                            entry.distance !==
                                null &&
                            entry.distance !==
                                undefined
                                ? Number(
                                      entry.distance
                                  )
                                : 0
                        ),
                    0
                );

            const mileageValues =
                entries
                    .filter(
                        (entry) =>
                            entry.mileage !==
                                null &&
                            entry.mileage !==
                                undefined &&
                            Number(
                                entry.mileage
                            ) > 0
                    )
                    .map((entry) =>
                        Number(
                            entry.mileage
                        )
                    );

            const averageMileage =
                mileageValues.length > 0
                    ? Number(
                          (
                              mileageValues.reduce(
                                  (
                                      total,
                                      value
                                  ) =>
                                      total +
                                      value,
                                  0
                              ) /
                              mileageValues.length
                          ).toFixed(2)
                      )
                    : null;

            const bestMileage =
                mileageValues.length > 0
                    ? Number(
                          Math.max(
                              ...mileageValues
                          ).toFixed(2)
                      )
                    : null;

            const worstMileage =
                mileageValues.length > 0
                    ? Number(
                          Math.min(
                              ...mileageValues
                          ).toFixed(2)
                      )
                    : null;

            const averageFuelCost =
                totalFuel > 0
                    ? Number(
                          (
                              totalSpending /
                              totalFuel
                          ).toFixed(2)
                      )
                    : null;

            /* =========================
               SPENDING BY MONTH
            ========================= */

            const monthlyData = {};

            entries.forEach((entry) => {
                const month =
                    entry.date.substring(
                        0,
                        7
                    );

                if (
                    !monthlyData[month]
                ) {
                    monthlyData[month] = {
                        month,
                        spending: 0,
                        litres: 0,
                        entries: 0
                    };
                }

                monthlyData[
                    month
                ].spending += Number(
                    entry.totalPrice || 0
                );

                monthlyData[
                    month
                ].litres += Number(
                    entry.litres || 0
                );

                monthlyData[
                    month
                ].entries += 1;
            });

            const spendingByMonth =
                Object.values(
                    monthlyData
                )
                    .sort((a, b) =>
                        a.month.localeCompare(
                            b.month
                        )
                    )
                    .map((item) => ({
                        month: item.month,

                        spending:
                            Number(
                                item.spending.toFixed(
                                    2
                                )
                            ),

                        litres:
                            Number(
                                item.litres.toFixed(
                                    2
                                )
                            ),

                        entries:
                            item.entries
                    }));

            /* =========================
               SPENDING BY VEHICLE
            ========================= */

            const vehicleData = {};

            entries.forEach((entry) => {
                const id = Number(
                    entry.vehicleId
                );

                if (
                    !vehicleData[id]
                ) {
                    vehicleData[id] = {
                        vehicleId: id,
                        vehicleName:
                            entry.vehicleName,
                        vehicleRegistration:
                            entry.vehicleRegistration,
                        entries: 0,
                        spending: 0,
                        litres: 0
                    };
                }

                vehicleData[id]
                    .entries += 1;

                vehicleData[id]
                    .spending += Number(
                    entry.totalPrice ||
                        0
                );

                vehicleData[id]
                    .litres += Number(
                    entry.litres || 0
                );
            });

            const spendingByVehicle =
                Object.values(
                    vehicleData
                )
                    .sort(
                        (a, b) =>
                            b.spending -
                            a.spending
                    )
                    .map((vehicle) => ({
                        ...vehicle,

                        spending:
                            Number(
                                vehicle.spending.toFixed(
                                    2
                                )
                            ),

                        litres:
                            Number(
                                vehicle.litres.toFixed(
                                    2
                                )
                            )
                    }));

            /* =========================
               MILEAGE BY VEHICLE
            ========================= */

            const mileageByVehicle = {};

            entries.forEach((entry) => {
                if (
                    entry.mileage ===
                        null ||
                    entry.mileage ===
                        undefined ||
                    Number(
                        entry.mileage
                    ) <= 0
                ) {
                    return;
                }

                const id = Number(
                    entry.vehicleId
                );

                if (
                    !mileageByVehicle[
                        id
                    ]
                ) {
                    mileageByVehicle[
                        id
                    ] = {
                        vehicleId: id,
                        vehicleName:
                            entry.vehicleName,
                        vehicleRegistration:
                            entry.vehicleRegistration,
                        mileageValues: []
                    };
                }

                mileageByVehicle[
                    id
                ].mileageValues.push(
                    Number(
                        entry.mileage
                    )
                );
            });

            const mileageByVehicleResult =
                Object.values(
                    mileageByVehicle
                ).map((vehicle) => {
                    const values =
                        vehicle.mileageValues;

                    const average =
                        values.reduce(
                            (
                                total,
                                value
                            ) =>
                                total +
                                value,
                            0
                        ) /
                        values.length;

                    return {
                        vehicleId:
                            vehicle.vehicleId,

                        vehicleName:
                            vehicle.vehicleName,

                        vehicleRegistration:
                            vehicle.vehicleRegistration,

                        averageMileage:
                            Number(
                                average.toFixed(
                                    2
                                )
                            ),

                        bestMileage:
                            Number(
                                Math.max(
                                    ...values
                                ).toFixed(
                                    2
                                )
                            ),

                        worstMileage:
                            Number(
                                Math.min(
                                    ...values
                                ).toFixed(
                                    2
                                )
                            )
                    };
                });

            /* =========================
               MILEAGE TREND
            ========================= */

            const mileageTrend =
                entries
                    .filter(
                        (entry) =>
                            entry.mileage !==
                                null &&
                            entry.mileage !==
                                undefined &&
                            Number(
                                entry.mileage
                            ) > 0
                    )
                    .map((entry) => ({
                        id: entry.id,

                        date: entry.date,

                        vehicleId:
                            entry.vehicleId,

                        vehicleName:
                            entry.vehicleName,

                        mileage:
                            Number(
                                entry.mileage
                            ),

                        distance:
                            entry.distance,

                        litres:
                            Number(
                                entry.litres
                            )
                    }));

            /* =========================
               FUEL PRICE HISTORY

               This remains global because
               fuel prices are not tied to
               a particular vehicle/trip.
            ========================= */

            const fuelPriceHistory =
                db
                    .prepare(`
                        SELECT
                            id,
                            price,
                            effectiveDate
                        FROM fuel_price_history
                        ORDER BY
                            effectiveDate ASC,
                            id ASC
                    `)
                    .all()
                    .map((item) => ({
                        ...item,

                        price:
                            Number(
                                Number(
                                    item.price
                                ).toFixed(
                                    2
                                )
                            )
                    }));

            /* =========================
               TRIP ANALYTICS
            ========================= */

            let tripQuery = `
                SELECT
                    trips.id,
                    trips.name,
                    trips.startLocation,
                    trips.destination,
                    trips.startDate,
                    trips.endDate,
                    trips.vehicleId,

                    vehicles.name
                        AS vehicleName,

                    vehicles.registration
                        AS vehicleRegistration,

                    trips.startOdometer,
                    trips.endOdometer

                FROM trips

                INNER JOIN vehicles
                    ON vehicles.id =
                       trips.vehicleId
            `;

            const tripConditions = [];
            const tripParameters = [];

            if (
                vehicleId !== null
            ) {
                tripConditions.push(
                    "trips.vehicleId = ?"
                );

                tripParameters.push(
                    vehicleId
                );
            }

            if (
                tripId !== null
            ) {
                tripConditions.push(
                    "trips.id = ?"
                );

                tripParameters.push(
                    tripId
                );
            }

            if (
                tripConditions.length >
                0
            ) {
                tripQuery +=
                    " WHERE " +
                    tripConditions.join(
                        " AND "
                    );
            }

            tripQuery += `
                ORDER BY
                    trips.startDate ASC,
                    trips.id ASC
            `;

            const trips = db
                .prepare(tripQuery)
                .all(
                    ...tripParameters
                );

            const tripAnalytics =
                trips.map((trip) => {
                    const tripEntries =
                        entries.filter(
                            (entry) =>
                                Number(
                                    entry.tripId
                                ) ===
                                Number(
                                    trip.id
                                )
                        );

                    const totalFuel =
                        tripEntries.reduce(
                            (
                                total,
                                entry
                            ) =>
                                total +
                                Number(
                                    entry.litres ||
                                        0
                                ),
                            0
                        );

                    const totalCost =
                        tripEntries.reduce(
                            (
                                total,
                                entry
                            ) =>
                                total +
                                Number(
                                    entry.totalPrice ||
                                        0
                                ),
                            0
                        );

                    let distance = null;

                    if (
                        trip.endOdometer !==
                            null &&
                        trip.endOdometer !==
                            undefined
                    ) {
                        distance =
                            Number(
                                trip.endOdometer
                            ) -
                            Number(
                                trip.startOdometer
                            );
                    }

                    const mileage =
                        distance !==
                            null &&
                        distance > 0 &&
                        totalFuel > 0
                            ? Number(
                                  (
                                      distance /
                                      totalFuel
                                  ).toFixed(
                                      2
                                  )
                              )
                            : null;

                    return {
                        id: trip.id,

                        name: trip.name,

                        startLocation:
                            trip.startLocation,

                        destination:
                            trip.destination,

                        startDate:
                            trip.startDate,

                        endDate:
                            trip.endDate,

                        vehicleId:
                            trip.vehicleId,

                        vehicleName:
                            trip.vehicleName,

                        vehicleRegistration:
                            trip.vehicleRegistration,

                        startOdometer:
                            trip.startOdometer,

                        endOdometer:
                            trip.endOdometer,

                        totalFuel:
                            Number(
                                totalFuel.toFixed(
                                    2
                                )
                            ),

                        totalCost:
                            Number(
                                totalCost.toFixed(
                                    2
                                )
                            ),

                        distance,

                        mileage
                    };
                });

            /* =========================
               FINAL RESPONSE
            ========================= */

            const analytics = {
                filters: {
                    vehicleId,
                    tripId
                },

                summary: {
                    totalEntries:
                        entries.length,

                    totalSpending:
                        Number(
                            totalSpending.toFixed(
                                2
                            )
                        ),

                    totalFuel:
                        Number(
                            totalFuel.toFixed(
                                2
                            )
                        ),

                    totalDistance:
                        Number(
                            totalDistance.toFixed(
                                2
                            )
                        ),

                    averageMileage,

                    averageFuelCost,

                    bestMileage,

                    worstMileage
                },

                spendingByMonth,

                spendingByVehicle,

                mileageByVehicle:
                    mileageByVehicleResult,

                mileageTrend,

                fuelPriceHistory,

                tripAnalytics
            };

            res.json(analytics);
        } catch (error) {
            console.error(
                "Failed to fetch analytics:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to fetch analytics"
            });
        }
    }
);

/* =========================
   SERVER
========================= */

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});