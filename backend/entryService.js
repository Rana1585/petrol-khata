const db = require("./database");

function validateEntry(entry) {
    const price = Number(entry.price);
    const litres = Number(entry.litres);
    const odometer = Number(entry.odometer);
    const vehicleId = Number(entry.vehicleId);
    const tripId =
        entry.tripId === null ||
        entry.tripId === undefined ||
        entry.tripId === ""
            ? null
            : Number(entry.tripId);

    if (
        typeof entry.date !== "string" ||
        entry.date.trim() === ""
    ) {
        throw new Error("Date is required");
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) {
        throw new Error("Invalid date format");
    }

    if (!Number.isInteger(vehicleId) || vehicleId <= 0) {
        throw new Error("Valid vehicle is required");
    }

    if (
        typeof entry.pumpName !== "string" ||
        entry.pumpName.trim() === ""
    ) {
        throw new Error("Petrol pump name is required");
    }

    if (!Number.isFinite(price) || price <= 0) {
        throw new Error("Price must be greater than zero");
    }

    if (!Number.isFinite(litres) || litres <= 0) {
        throw new Error("Litres must be greater than zero");
    }

    if (!Number.isFinite(odometer) || odometer < 0) {
        throw new Error("Odometer cannot be negative");
    }

    if (
        tripId !== null &&
        (!Number.isInteger(tripId) || tripId <= 0)
    ) {
        throw new Error("Invalid trip");
    }

    return {
        price,
        litres,
        odometer,
        vehicleId,
        tripId
    };
}

function calculateMileage(distance, litres) {
    if (
        distance === null ||
        distance <= 0 ||
        litres <= 0
    ) {
        return null;
    }

    return Number(
        (distance / litres).toFixed(2)
    );
}

function getPreviousEntry(vehicleId, entryId = null) {
    if (entryId !== null) {
        return db
            .prepare(`
                SELECT
                    odometer,
                    date
                FROM entries
                WHERE vehicleId = ?
                  AND id < ?
                ORDER BY id DESC
                LIMIT 1
            `)
            .get(vehicleId, entryId);
    }

    return db
        .prepare(`
            SELECT
                odometer,
                date
            FROM entries
            WHERE vehicleId = ?
            ORDER BY id DESC
            LIMIT 1
        `)
        .get(vehicleId);
}

function calculateEntryMetrics(entries) {
    const previousOdometers = {};

    const calculatedEntries = entries.map((entry) => {
        const vehicleId = entry.vehicleId;

        let distance = null;

        if (
            previousOdometers[vehicleId] !==
            undefined
        ) {
            distance =
                Number(entry.odometer) -
                previousOdometers[vehicleId];

            if (distance <= 0) {
                distance = null;
            }
        }

        const mileage = calculateMileage(
            distance,
            Number(entry.litres)
        );

        previousOdometers[vehicleId] =
            Number(entry.odometer);

        return {
            ...entry,
            distance,
            mileage
        };
    });

    return calculatedEntries;
}

function createEntry(entry) {
    const {
        price,
        litres,
        odometer,
        vehicleId,
        tripId
    } = validateEntry(entry);

    const vehicle = db
        .prepare(`
            SELECT id, name, registration
            FROM vehicles
            WHERE id = ?
              AND active = 1
        `)
        .get(vehicleId);

    if (!vehicle) {
        throw new Error("Vehicle not found");
    }

    if (tripId !== null) {
        const trip = db
            .prepare(`
                SELECT id, vehicleId
                FROM trips
                WHERE id = ?
            `)
            .get(tripId);

        if (!trip) {
            throw new Error("Trip not found");
        }

        if (trip.vehicleId !== vehicleId) {
            throw new Error(
                "Trip does not belong to this vehicle"
            );
        }
    }

    const previousEntry =
        getPreviousEntry(vehicleId);

    let distance = null;

    if (previousEntry) {
        distance =
            odometer -
            Number(previousEntry.odometer);

        if (distance <= 0) {
            throw new Error(
                "Odometer must be greater than the previous reading for this vehicle"
            );
        }
    }

    const totalPrice = Number(
        (price * litres).toFixed(2)
    );

    const mileage = calculateMileage(
        distance,
        litres
    );

    const result = db
        .prepare(`
            INSERT INTO entries (
                vehicleId,
                date,
                pumpName,
                price,
                totalPrice,
                odometer,
                litres,
                tripId
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .run(
            vehicleId,
            entry.date,
            entry.pumpName.trim(),
            price,
            totalPrice,
            odometer,
            litres,
            tripId
        );

    return {
        id: result.lastInsertRowid,
        vehicleId,
        vehicleName: vehicle.name,
        vehicleRegistration:
            vehicle.registration,
        date: entry.date,
        pumpName: entry.pumpName.trim(),
        price,
        totalPrice,
        odometer,
        litres,
        tripId,
        distance,
        mileage
    };
}

function getAllEntries() {
    const entries = db
        .prepare(`
            SELECT
                entries.id,
                entries.vehicleId,
                vehicles.name AS vehicleName,
                vehicles.registration AS vehicleRegistration,
                entries.date,
                entries.pumpName,
                entries.price,
                entries.totalPrice,
                entries.odometer,
                entries.litres,
                entries.tripId
            FROM entries
            INNER JOIN vehicles
                ON vehicles.id = entries.vehicleId
            ORDER BY entries.id ASC
        `)
        .all();

    const calculatedEntries =
        calculateEntryMetrics(entries);

    const totalSpending =
        calculatedEntries.reduce(
            (total, entry) =>
                total +
                Number(entry.totalPrice),
            0
        );

    const totalFuel =
        calculatedEntries.reduce(
            (total, entry) =>
                total +
                Number(entry.litres),
            0
        );

    const mileageValues =
        calculatedEntries
            .filter(
                (entry) =>
                    entry.mileage !== null
            )
            .map(
                (entry) =>
                    Number(entry.mileage)
            );

    const averageMileage =
        mileageValues.length > 0
            ? Number(
                  (
                      mileageValues.reduce(
                          (total, value) =>
                              total + value,
                          0
                      ) /
                      mileageValues.length
                  ).toFixed(2)
              )
            : null;

    const summary = {
        totalEntries:
            calculatedEntries.length,
        totalSpending: Number(
            totalSpending.toFixed(2)
        ),
        totalFuel: Number(
            totalFuel.toFixed(2)
        ),
        averageMileage
    };

    return {
        entries: calculatedEntries,
        summary
    };
}

function getEntryById(id) {
    const entry = db
        .prepare(`
            SELECT
                entries.id,
                entries.vehicleId,
                vehicles.name AS vehicleName,
                vehicles.registration AS vehicleRegistration,
                entries.date,
                entries.pumpName,
                entries.price,
                entries.totalPrice,
                entries.odometer,
                entries.litres,
                entries.tripId
            FROM entries
            INNER JOIN vehicles
                ON vehicles.id = entries.vehicleId
            WHERE entries.id = ?
        `)
        .get(id);

    if (!entry) {
        return null;
    }

    const previousEntry =
        getPreviousEntry(
            entry.vehicleId,
            entry.id
        );

    let distance = null;

    if (previousEntry) {
        distance =
            Number(entry.odometer) -
            Number(previousEntry.odometer);

        if (distance <= 0) {
            distance = null;
        }
    }

    return {
        ...entry,
        distance,
        mileage: calculateMileage(
            distance,
            Number(entry.litres)
        )
    };
}

function deleteEntry(id) {
    return db
        .prepare(
            "DELETE FROM entries WHERE id = ?"
        )
        .run(id);
}

module.exports = {
    createEntry,
    getAllEntries,
    getEntryById,
    deleteEntry
};