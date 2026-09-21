require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./database");

const {
    createEntry,
    getAllEntries,
    getEntryById,
    updateEntry,
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

app.get("/vehicles", async (req, res) => {
    try {
        const vehicles = await db`
            SELECT
                id,
                name,
                registration,
                active,
                "createdAt"
            FROM vehicles
            ORDER BY id ASC
        `;

        res.json(vehicles);
    } catch (error) {
        console.error("Failed to fetch vehicles:", error);

        res.status(500).json({
            error: "Failed to fetch vehicles"
        });
    }
});

app.get("/vehicle-summaries", async (req, res) => {
    try {
        const vehicles = await db`
            SELECT
                id,
                name,
                registration,
                active,
                "createdAt"
            FROM vehicles
            ORDER BY id ASC
        `;

        const entriesData = await getAllEntries();
        const entries = entriesData.entries || [];

        const maintenanceRecords = await db`
            SELECT
                id,
                "vehicleId",
                "mobileOilCost",
                "oilFilterCost",
                "airFilterCost",
                "otherMaintenanceCost"
            FROM vehicle_maintenance
        `;

        const summaries = vehicles.map((vehicle) => {
            const vehicleEntries = entries
                .filter(
                    (entry) =>
                        Number(entry.vehicleId) ===
                        Number(vehicle.id)
                )
                .sort(
                    (a, b) =>
                        Number(a.id) - Number(b.id)
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
                        Number(entry.totalPrice || 0),
                    0
                );

            const totalFuel =
                vehicleEntries.reduce(
                    (total, entry) =>
                        total +
                        Number(entry.litres || 0),
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
                        vehicleEntries[index - 1].odometer
                    );

                const currentOdometer =
                    Number(
                        vehicleEntries[index].odometer
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
                          (total, mileage) =>
                              total + mileage,
                          0
                      ) / mileageValues.length
                    : null;

            const maintenanceCost =
                vehicleMaintenance.reduce(
                    (total, record) =>
                        total +
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
                        ),
                    0
                );

            const currentOdometer =
                vehicleEntries.length > 0
                    ? Math.max(
                          ...vehicleEntries.map(
                              (entry) =>
                                  Number(entry.odometer)
                          )
                      )
                    : null;

            return {
                id: vehicle.id,
                name: vehicle.name,
                registration: vehicle.registration,
                active: vehicle.active,
                createdAt: vehicle.createdAt,

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
                              averageMileage.toFixed(2)
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

app.post("/vehicles", async (req, res) => {
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

        const rows = await db`
            INSERT INTO vehicles (
                name,
                registration
            )
            VALUES (
                ${name},
                ${registration || null}
            )
            RETURNING
                id,
                name,
                registration,
                active,
                "createdAt"
        `;

        res.status(201).json(rows[0]);
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

app.put("/vehicles/:id", async (req, res) => {
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

        const rows = await db`
            UPDATE vehicles
            SET
                name = ${name},
                registration = ${
                    registration || null
                }
            WHERE id = ${id}
            RETURNING
                id,
                name,
                registration,
                active,
                "createdAt"
        `;

        if (rows.length === 0) {
            return res.status(404).json({
                error: "Vehicle not found"
            });
        }

        res.json(rows[0]);
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

app.delete("/vehicles/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "Invalid vehicle ID"
            });
        }

        const rows = await db`
            UPDATE vehicles
            SET active = 0
            WHERE id = ${id}
            RETURNING id
        `;

        if (rows.length === 0) {
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

app.delete("/vehicles/:id/permanent", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "Invalid vehicle ID"
            });
        }

        const result = await db.begin(async (tx) => {
            const vehicleRows = await tx`
                SELECT
                    id,
                    name,
                    registration
                FROM vehicles
                WHERE id = ${id}
                FOR UPDATE
            `;

            if (vehicleRows.length === 0) {
                return null;
            }

            const vehicle = vehicleRows[0];

            // Delete fuel entries first because
            // entries can reference trips.
            const deletedEntries = await tx`
                DELETE FROM entries
                WHERE "vehicleId" = ${id}
                RETURNING id
            `;

            // Delete trips after their fuel entries.
            const deletedTrips = await tx`
                DELETE FROM trips
                WHERE "vehicleId" = ${id}
                RETURNING id
            `;

            // Delete other vehicle-specific records.
            const deletedVehicleRecords = await tx`
                DELETE FROM vehicle_records
                WHERE "vehicleId" = ${id}
                RETURNING id
            `;

            const deletedMaintenance = await tx`
                DELETE FROM vehicle_maintenance
                WHERE "vehicleId" = ${id}
                RETURNING id
            `;

            // Finally delete the vehicle itself.
            const deletedVehicle = await tx`
                DELETE FROM vehicles
                WHERE id = ${id}
                RETURNING id
            `;

            return {
                vehicle,
                deletedEntries: deletedEntries.length,
                deletedTrips: deletedTrips.length,
                deletedVehicleRecords:
                    deletedVehicleRecords.length,
                deletedMaintenance:
                    deletedMaintenance.length,
                deletedVehicle:
                    deletedVehicle.length
            };
        });

        if (!result) {
            return res.status(404).json({
                error: "Vehicle not found"
            });
        }

        res.json({
            message:
                "Vehicle and all related records permanently deleted",
            vehicle: result.vehicle,
            deleted: {
                entries:
                    result.deletedEntries,
                trips:
                    result.deletedTrips,
                vehicleRecords:
                    result.deletedVehicleRecords,
                maintenance:
                    result.deletedMaintenance,
                vehicle:
                    result.deletedVehicle
            }
        });
    } catch (error) {
        console.error(
            "Failed to permanently delete vehicle:",
            error
        );

        res.status(500).json({
            error:
                "Failed to permanently delete vehicle"
        });
    }
});

/* =========================
   FUEL ENTRIES
========================= */

app.post("/entries", async (req, res) => {
    try {
        const savedEntry =
            await createEntry(req.body);

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

app.get("/entries", async (req, res) => {
    try {
        const data =
            await getAllEntries();

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

app.get("/entries/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "Invalid entry ID"
            });
        }

        const entry =
            await getEntryById(id);

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

app.put("/entries/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "Invalid entry ID"
            });
        }

        const updatedEntry =
            await updateEntry(
                id,
                req.body
            );

        if (!updatedEntry) {
            return res.status(404).json({
                error: "Entry not found"
            });
        }

        res.json(updatedEntry);
    } catch (error) {
        console.error(
            "Failed to update entry:",
            error
        );

        res.status(400).json({
            error: error.message
        });
    }
});

app.delete("/entries/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "Invalid entry ID"
            });
        }

        const deleted =
            await deleteEntry(id);

        if (!deleted) {
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

app.get("/trips", async (req, res) => {
    try {
        const trips = await db`
            SELECT
                trips.id,
                trips."vehicleId",
                vehicles.name AS "vehicleName",
                vehicles.registration AS
                    "vehicleRegistration",
                trips.name,
                trips."startLocation",
                trips.destination,
                trips."startDate",
                trips."endDate",
                trips."startOdometer",
                trips."endOdometer"
            FROM trips
            INNER JOIN vehicles
                ON vehicles.id =
                   trips."vehicleId"
            ORDER BY trips.id DESC
        `;

        const enrichedTrips = [];

        for (const trip of trips) {
            const fuel = await db`
                SELECT
                    COALESCE(
                        SUM(litres),
                        0
                    ) AS "totalFuel",

                    COALESCE(
                        SUM("totalPrice"),
                        0
                    ) AS "totalCost",

                    COUNT(*) AS "fuelEntries"

                FROM entries

                WHERE "tripId" = ${trip.id}
            `;

            const fuelData = fuel[0];

            let distance = null;

            if (
                trip.endOdometer !== null &&
                trip.endOdometer !== undefined
            ) {
                distance =
                    Number(trip.endOdometer) -
                    Number(trip.startOdometer);
            }

            const mileage =
                distance !== null &&
                distance > 0 &&
                Number(fuelData.totalFuel) > 0
                    ? Number(
                          (
                              distance /
                              Number(
                                  fuelData.totalFuel
                              )
                          ).toFixed(2)
                      )
                    : null;

            enrichedTrips.push({
                ...trip,

                distance,

                totalFuel:
                    Number(
                        Number(
                            fuelData.totalFuel
                        ).toFixed(2)
                    ),

                totalCost:
                    Number(
                        Number(
                            fuelData.totalCost
                        ).toFixed(2)
                    ),

                fuelEntries:
                    Number(
                        fuelData.fuelEntries
                    ),

                mileage
            });
        }

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

app.get("/trips/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "Invalid trip ID"
            });
        }

        const tripRows = await db`
            SELECT
                trips.id,
                trips."vehicleId",
                vehicles.name AS "vehicleName",
                vehicles.registration AS
                    "vehicleRegistration",
                trips.name,
                trips."startLocation",
                trips.destination,
                trips."startDate",
                trips."endDate",
                trips."startOdometer",
                trips."endOdometer"
            FROM trips
            INNER JOIN vehicles
                ON vehicles.id =
                   trips."vehicleId"
            WHERE trips.id = ${id}
        `;

        if (tripRows.length === 0) {
            return res.status(404).json({
                error: "Trip not found"
            });
        }

        const trip = tripRows[0];

        const fuelEntries =
            await db`
                SELECT
                    id,
                    "vehicleId",
                    date,
                    "pumpName",
                    price,
                    "totalPrice",
                    odometer,
                    litres,
                    "tripId"
                FROM entries
                WHERE "tripId" = ${id}
                ORDER BY id ASC
            `;

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
                Number(trip.endOdometer) -
                Number(trip.startOdometer);
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

app.post("/trips", async (req, res) => {
    try {
        const vehicleId =
            Number(req.body.vehicleId);

        const name =
            typeof req.body.name === "string"
                ? req.body.name.trim()
                : "";

        const startLocation =
            typeof req.body.startLocation === "string"
                ? req.body.startLocation.trim()
                : "";

        const destination =
            typeof req.body.destination === "string"
                ? req.body.destination.trim()
                : "";

        const startDate =
            typeof req.body.startDate === "string"
                ? req.body.startDate
                : "";

        const endDate =
            typeof req.body.endDate === "string" &&
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
                : Number(req.body.endOdometer);

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
                error:
                    "Invalid end date"
            });
        }

        if (
            !Number.isFinite(startOdometer) ||
            startOdometer < 0
        ) {
            return res.status(400).json({
                error:
                    "Valid starting odometer is required"
            });
        }

        if (
            endOdometer !== null &&
            (
                !Number.isFinite(endOdometer) ||
                endOdometer < startOdometer
            )
        ) {
            return res.status(400).json({
                error:
                    "Ending odometer must be greater than or equal to starting odometer"
            });
        }

        const vehicleRows = await db`
            SELECT id
            FROM vehicles
            WHERE id = ${vehicleId}
              AND active = 1
        `;

        if (vehicleRows.length === 0) {
            return res.status(404).json({
                error: "Vehicle not found"
            });
        }

        const rows = await db`
            INSERT INTO trips (
                "vehicleId",
                name,
                "startLocation",
                destination,
                "startDate",
                "endDate",
                "startOdometer",
                "endOdometer"
            )
            VALUES (
                ${vehicleId},
                ${name},
                ${startLocation},
                ${destination},
                ${startDate},
                ${endDate},
                ${startOdometer},
                ${endOdometer}
            )
            RETURNING *
        `;

        res.status(201).json(rows[0]);
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

app.put("/trips/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const endDate =
            typeof req.body.endDate === "string" &&
            req.body.endDate.trim() !== ""
                ? req.body.endDate
                : null;

        const endOdometer =
            req.body.endOdometer === null ||
            req.body.endOdometer === undefined ||
            req.body.endOdometer === ""
                ? null
                : Number(req.body.endOdometer);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "Invalid trip ID"
            });
        }

        const tripRows = await db`
            SELECT "startOdometer"
            FROM trips
            WHERE id = ${id}
        `;

        if (tripRows.length === 0) {
            return res.status(404).json({
                error: "Trip not found"
            });
        }

        const trip = tripRows[0];

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
            (
                !Number.isFinite(endOdometer) ||
                endOdometer <
                    Number(trip.startOdometer)
            )
        ) {
            return res.status(400).json({
                error:
                    "Invalid ending odometer"
            });
        }

        const rows = await db`
            UPDATE trips
            SET
                "endDate" = ${endDate},
                "endOdometer" = ${endOdometer}
            WHERE id = ${id}
            RETURNING *
        `;

        res.json(rows[0]);
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

app.delete("/trips/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "Invalid trip ID"
            });
        }

        const rows = await db`
            DELETE FROM trips
            WHERE id = ${id}
            RETURNING id
        `;

        if (rows.length === 0) {
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

app.get(
    "/vehicle-records",
    async (req, res) => {
        try {
            const records = await db`
                SELECT
                    vehicle_records.id,
                    vehicle_records."vehicleId",
                    vehicles.name AS "vehicleName",
                    vehicles.registration AS
                        "vehicleRegistration",
                    vehicle_records.date,
                    vehicle_records.price,
                    vehicle_records."meterReading"
                FROM vehicle_records
                INNER JOIN vehicles
                    ON vehicles.id =
                       vehicle_records."vehicleId"
                ORDER BY
                    vehicle_records.date DESC,
                    vehicle_records.id DESC
            `;

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
    }
);

app.post(
    "/vehicle-records",
    async (req, res) => {
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
                !Number.isFinite(meterReading) ||
                meterReading < 0
            ) {
                return res.status(400).json({
                    error:
                        "Meter reading must be valid"
                });
            }

            const vehicleRows = await db`
                SELECT id
                FROM vehicles
                WHERE id = ${vehicleId}
                  AND active = 1
            `;

            if (vehicleRows.length === 0) {
                return res.status(404).json({
                    error:
                        "Vehicle not found"
                });
            }

            const rows = await db`
                INSERT INTO vehicle_records (
                    "vehicleId",
                    date,
                    price,
                    "meterReading"
                )
                VALUES (
                    ${vehicleId},
                    ${date},
                    ${price},
                    ${meterReading}
                )
                RETURNING id
            `;

            const recordRows = await db`
                SELECT
                    vehicle_records.id,
                    vehicle_records."vehicleId",
                    vehicles.name AS "vehicleName",
                    vehicles.registration AS
                        "vehicleRegistration",
                    vehicle_records.date,
                    vehicle_records.price,
                    vehicle_records."meterReading"
                FROM vehicle_records
                INNER JOIN vehicles
                    ON vehicles.id =
                       vehicle_records."vehicleId"
                WHERE vehicle_records.id =
                    ${rows[0].id}
            `;

            res.status(201).json(
                recordRows[0]
            );
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
    }
);

app.delete(
    "/vehicle-records/:id",
    async (req, res) => {
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

            const rows = await db`
                DELETE FROM vehicle_records
                WHERE id = ${id}
                RETURNING id
            `;

            if (rows.length === 0) {
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
    async (req, res) => {
        try {
            const records = await db`
                SELECT
                    vehicle_maintenance.id,
                    vehicle_maintenance."vehicleId",
                    vehicles.name AS "vehicleName",
                    vehicles.registration AS
                        "vehicleRegistration",
                    vehicle_maintenance.date,
                    vehicle_maintenance."meterReading",

                    vehicle_maintenance."mobileOil",
                    vehicle_maintenance."mobileOilCost",

                    vehicle_maintenance."oilFilter",
                    vehicle_maintenance."oilFilterCost",

                    vehicle_maintenance."airFilter",
                    vehicle_maintenance."airFilterCost",

                    vehicle_maintenance."otherMaintenance",
                    vehicle_maintenance."otherMaintenanceCost",

                    vehicle_maintenance.notes

                FROM vehicle_maintenance

                INNER JOIN vehicles
                    ON vehicles.id =
                       vehicle_maintenance."vehicleId"

                ORDER BY
                    vehicle_maintenance.date DESC,
                    vehicle_maintenance.id DESC
            `;

            const enrichedRecords =
                records.map((record) => {
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
                                totalCost.toFixed(2)
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
    async (req, res) => {
        try {
            const vehicleId =
                Number(req.body.vehicleId);

            const date =
                typeof req.body.date === "string"
                    ? req.body.date
                    : "";

            const meterReading =
                Number(req.body.meterReading);

            const mobileOil =
                typeof req.body.mobileOil ===
                "string"
                    ? req.body.mobileOil.trim()
                    : "";

            const mobileOilCost =
                req.body.mobileOilCost === "" ||
                req.body.mobileOilCost === null ||
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
                req.body.oilFilterCost === "" ||
                req.body.oilFilterCost === null ||
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
                req.body.airFilterCost === "" ||
                req.body.airFilterCost === null ||
                req.body.airFilterCost ===
                    undefined
                    ? 0
                    : Number(
                          req.body.airFilterCost
                      );

            const otherMaintenance =
                typeof req.body.otherMaintenance ===
                "string"
                    ? req.body.otherMaintenance.trim()
                    : "";

            const otherMaintenanceCost =
                req.body.otherMaintenanceCost ===
                    "" ||
                req.body.otherMaintenanceCost ===
                    null ||
                req.body.otherMaintenanceCost ===
                    undefined
                    ? 0
                    : Number(
                          req.body.otherMaintenanceCost
                      );

            const notes =
                typeof req.body.notes === "string"
                    ? req.body.notes.trim()
                    : "";

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
                !Number.isFinite(meterReading) ||
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
                        !Number.isFinite(cost) ||
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

            const vehicleRows = await db`
                SELECT
                    id,
                    name,
                    registration
                FROM vehicles
                WHERE id = ${vehicleId}
                  AND active = 1
            `;

            if (vehicleRows.length === 0) {
                return res.status(404).json({
                    error:
                        "Vehicle not found"
                });
            }

            const rows = await db`
                INSERT INTO vehicle_maintenance (
                    "vehicleId",
                    date,
                    "meterReading",
                    "mobileOil",
                    "mobileOilCost",
                    "oilFilter",
                    "oilFilterCost",
                    "airFilter",
                    "airFilterCost",
                    "otherMaintenance",
                    "otherMaintenanceCost",
                    notes
                )
                VALUES (
                    ${vehicleId},
                    ${date},
                    ${meterReading},
                    ${mobileOil || null},
                    ${mobileOilCost},
                    ${oilFilter || null},
                    ${oilFilterCost},
                    ${airFilter || null},
                    ${airFilterCost},
                    ${otherMaintenance || null},
                    ${otherMaintenanceCost},
                    ${notes || null}
                )
                RETURNING id
            `;

            const recordRows = await db`
                SELECT
                    vehicle_maintenance.id,
                    vehicle_maintenance."vehicleId",
                    vehicles.name AS "vehicleName",
                    vehicles.registration AS
                        "vehicleRegistration",
                    vehicle_maintenance.date,
                    vehicle_maintenance."meterReading",

                    vehicle_maintenance."mobileOil",
                    vehicle_maintenance."mobileOilCost",

                    vehicle_maintenance."oilFilter",
                    vehicle_maintenance."oilFilterCost",

                    vehicle_maintenance."airFilter",
                    vehicle_maintenance."airFilterCost",

                    vehicle_maintenance."otherMaintenance",
                    vehicle_maintenance."otherMaintenanceCost",

                    vehicle_maintenance.notes

                FROM vehicle_maintenance

                INNER JOIN vehicles
                    ON vehicles.id =
                       vehicle_maintenance."vehicleId"

                WHERE vehicle_maintenance.id =
                    ${rows[0].id}
            `;

            const record =
                recordRows[0];

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
    async (req, res) => {
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

            const rows = await db`
                DELETE FROM vehicle_maintenance
                WHERE id = ${id}
                RETURNING id
            `;

            if (rows.length === 0) {
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

    const data =
        await response.json();

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

            await db`
                INSERT INTO fuel_price_history (
                    price,
                    "effectiveDate"
                )
                SELECT
                    ${fuelPrice.price},
                    ${fuelPrice.effectiveDate}
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM fuel_price_history
                    WHERE price =
                        ${fuelPrice.price}
                    AND "effectiveDate" =
                        ${fuelPrice.effectiveDate}
                )
            `;

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
    async (req, res) => {
        try {
            const history = await db`
                SELECT
                    id,
                    price,
                    "effectiveDate",
                    "recordedAt"
                FROM fuel_price_history
                ORDER BY
                    "effectiveDate" ASC,
                    id ASC
            `;

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
            const totalsRows = await db`
                SELECT
                    COUNT(*) AS "totalEntries",

                    COALESCE(
                        SUM("totalPrice"),
                        0
                    ) AS "totalSpending",

                    COALESCE(
                        SUM(litres),
                        0
                    ) AS "totalFuel"

                FROM entries
            `;

            const totals =
                totalsRows[0];

            const activeVehiclesRows =
                await db`
                    SELECT
                        COUNT(*) AS count
                    FROM vehicles
                    WHERE active = 1
                `;

            const totalTripsRows =
                await db`
                    SELECT
                        COUNT(*) AS count
                    FROM trips
                `;

            const completedTripsRows =
                await db`
                    SELECT
                        COUNT(*) AS count
                    FROM trips
                    WHERE "endOdometer" IS NOT NULL
                `;

            const mileageData =
                await getAllEntries();

            const averageMileage =
                mileageData.summary
                    .averageMileage;

            const recentEntries =
                await db`
                    SELECT
                        entries.id,
                        entries.date,
                        entries."pumpName",
                        entries.price,
                        entries."totalPrice",
                        entries.litres,
                        entries.odometer,
                        vehicles.id AS "vehicleId",
                        vehicles.name AS "vehicleName",
                        vehicles.registration AS
                            "vehicleRegistration",
                        entries."tripId"
                    FROM entries
                    INNER JOIN vehicles
                        ON vehicles.id =
                           entries."vehicleId"
                    ORDER BY
                        entries.date DESC,
                        entries.id DESC
                    LIMIT 5
                `;

            const recentTrips =
                await db`
                    SELECT
                        trips.id,
                        trips.name,
                        trips."startLocation",
                        trips.destination,
                        trips."startDate",
                        trips."endDate",
                        trips."startOdometer",
                        trips."endOdometer",
                        vehicles.id AS "vehicleId",
                        vehicles.name AS "vehicleName",
                        vehicles.registration AS
                            "vehicleRegistration"
                    FROM trips
                    INNER JOIN vehicles
                        ON vehicles.id =
                           trips."vehicleId"
                    ORDER BY
                        trips."startDate" DESC,
                        trips.id DESC
                    LIMIT 5
                `;

            let fuelPrice = null;

            try {
                fuelPrice =
                    await fetchCurrentFuelPrice();

                await db`
                    INSERT INTO fuel_price_history (
                        price,
                        "effectiveDate"
                    )
                    SELECT
                        ${fuelPrice.price},
                        ${fuelPrice.effectiveDate}
                    WHERE NOT EXISTS (
                        SELECT 1
                        FROM fuel_price_history
                        WHERE price =
                            ${fuelPrice.price}
                        AND "effectiveDate" =
                            ${fuelPrice.effectiveDate}
                    )
                `;
            } catch (fuelPriceError) {
                console.error(
                    "Dashboard fuel price fetch failed:",
                    fuelPriceError
                );

                const latestPriceRows =
                    await db`
                        SELECT
                            price,
                            "effectiveDate"
                        FROM fuel_price_history
                        ORDER BY
                            "effectiveDate" DESC,
                            id DESC
                        LIMIT 1
                    `;

                if (
                    latestPriceRows.length > 0
                ) {
                    const latestPrice =
                        latestPriceRows[0];

                    fuelPrice = {
                        price:
                            Number(
                                latestPrice.price
                            ),
                        unit: "litre",
                        effectiveDate:
                            latestPrice.effectiveDate,
                        fromHistory: true
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
                            activeVehiclesRows[0]
                                .count
                        ),

                    totalTrips:
                        Number(
                            totalTripsRows[0]
                                .count
                        ),

                    completedTrips:
                        Number(
                            completedTripsRows[0]
                                .count
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
    async (req, res) => {
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

            if (
                vehicleId !== null &&
                (
                    !Number.isInteger(
                        vehicleId
                    ) ||
                    vehicleId <= 0
                )
            ) {
                return res.status(400).json({
                    error:
                        "Invalid vehicle filter"
                });
            }

            if (
                tripId !== null &&
                (
                    !Number.isInteger(
                        tripId
                    ) ||
                    tripId <= 0
                )
            ) {
                return res.status(400).json({
                    error:
                        "Invalid trip filter"
                });
            }

            let selectedTrip = null;

            if (tripId !== null) {
                const tripRows =
                    await db`
                        SELECT
                            id,
                            "vehicleId"
                        FROM trips
                        WHERE id = ${tripId}
                    `;

                if (tripRows.length === 0) {
                    return res.status(404).json({
                        error:
                            "Trip not found"
                    });
                }

                selectedTrip =
                    tripRows[0];

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

            const entriesData =
                await getAllEntries();

            let entries =
                entriesData.entries || [];

            if (vehicleId !== null) {
                entries =
                    entries.filter(
                        (entry) =>
                            Number(
                                entry.vehicleId
                            ) ===
                            vehicleId
                    );
            }

            if (tripId !== null) {
                entries =
                    entries.filter(
                        (entry) =>
                            Number(
                                entry.tripId
                            ) ===
                            tripId
                    );
            }

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
                const id =
                    Number(
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

                const id =
                    Number(
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
            ========================= */

            const fuelPriceHistoryRows =
                await db`
                    SELECT
                        id,
                        price,
                        "effectiveDate"
                    FROM fuel_price_history
                    ORDER BY
                        "effectiveDate" ASC,
                        id ASC
                `;

            const fuelPriceHistory =
                fuelPriceHistoryRows.map(
                    (item) => ({
                        ...item,

                        price:
                            Number(
                                Number(
                                    item.price
                                ).toFixed(
                                    2
                                )
                            )
                    })
                );

            /* =========================
               TRIP ANALYTICS
            ========================= */

            let trips;

            if (vehicleId !== null) {
                if (tripId !== null) {
                    trips = await db`
                        SELECT
                            trips.id,
                            trips.name,
                            trips."startLocation",
                            trips.destination,
                            trips."startDate",
                            trips."endDate",
                            trips."vehicleId",

                            vehicles.name AS
                                "vehicleName",

                            vehicles.registration AS
                                "vehicleRegistration",

                            trips."startOdometer",
                            trips."endOdometer"

                        FROM trips

                        INNER JOIN vehicles
                            ON vehicles.id =
                               trips."vehicleId"

                        WHERE trips."vehicleId" =
                            ${vehicleId}
                          AND trips.id =
                            ${tripId}

                        ORDER BY
                            trips."startDate" ASC,
                            trips.id ASC
                    `;
                } else {
                    trips = await db`
                        SELECT
                            trips.id,
                            trips.name,
                            trips."startLocation",
                            trips.destination,
                            trips."startDate",
                            trips."endDate",
                            trips."vehicleId",

                            vehicles.name AS
                                "vehicleName",

                            vehicles.registration AS
                                "vehicleRegistration",

                            trips."startOdometer",
                            trips."endOdometer"

                        FROM trips

                        INNER JOIN vehicles
                            ON vehicles.id =
                               trips."vehicleId"

                        WHERE trips."vehicleId" =
                            ${vehicleId}

                        ORDER BY
                            trips."startDate" ASC,
                            trips.id ASC
                    `;
                }
            } else if (tripId !== null) {
                trips = await db`
                    SELECT
                        trips.id,
                        trips.name,
                        trips."startLocation",
                        trips.destination,
                        trips."startDate",
                        trips."endDate",
                        trips."vehicleId",

                        vehicles.name AS
                            "vehicleName",

                        vehicles.registration AS
                            "vehicleRegistration",

                        trips."startOdometer",
                        trips."endOdometer"

                    FROM trips

                    INNER JOIN vehicles
                        ON vehicles.id =
                           trips."vehicleId"

                    WHERE trips.id =
                        ${tripId}

                    ORDER BY
                        trips."startDate" ASC,
                        trips.id ASC
                `;
            } else {
                trips = await db`
                    SELECT
                        trips.id,
                        trips.name,
                        trips."startLocation",
                        trips.destination,
                        trips."startDate",
                        trips."endDate",
                        trips."vehicleId",

                        vehicles.name AS
                            "vehicleName",

                        vehicles.registration AS
                            "vehicleRegistration",

                        trips."startOdometer",
                        trips."endOdometer"

                    FROM trips

                    INNER JOIN vehicles
                        ON vehicles.id =
                           trips."vehicleId"

                    ORDER BY
                        trips."startDate" ASC,
                        trips.id ASC
                `;
            }

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