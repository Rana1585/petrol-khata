const db = require("./database");

function validateEntryData(data) {
    const {
        date,
        vehicleId,
        pumpName,
        price,
        litres,
        odometer,
        tripId
    } = data;

    if (!date) {
        throw new Error("Date is required");
    }

    if (!vehicleId) {
        throw new Error("Vehicle is required");
    }

    if (!pumpName || !pumpName.trim()) {
        throw new Error("Pump name is required");
    }

    if (price === undefined || price === null || Number(price) <= 0) {
        throw new Error("Price must be greater than 0");
    }

    if (litres === undefined || litres === null || Number(litres) <= 0) {
        throw new Error("Litres must be greater than 0");
    }

    if (
        odometer === undefined ||
        odometer === null ||
        Number(odometer) < 0
    ) {
        throw new Error("Odometer reading is required");
    }

    if (tripId !== undefined && tripId !== null && tripId !== "") {
        if (Number(tripId) <= 0) {
            throw new Error("Invalid trip");
        }
    }
}

async function verifyVehicleOwnership(vehicleId, userId) {
    const rows = await db`
        SELECT id
        FROM vehicles
        WHERE id = ${Number(vehicleId)}
          AND "userId" = ${userId}
    `;

    return rows.length > 0;
}

async function verifyTripOwnership(tripId, vehicleId, userId) {
    if (
        tripId === undefined ||
        tripId === null ||
        tripId === ""
    ) {
        return true;
    }

    const rows = await db`
        SELECT t.id
        FROM trips t
        JOIN vehicles v
            ON v.id = t."vehicleId"
        WHERE t.id = ${Number(tripId)}
          AND t."vehicleId" = ${Number(vehicleId)}
          AND v."userId" = ${userId}
    `;

    return rows.length > 0;
}

async function getPreviousEntry(
    vehicleId,
    userId,
    currentEntryId = null
) {
    if (currentEntryId) {
        const rows = await db`
            SELECT
                e.id,
                e.odometer,
                e.litres,
                e.date
            FROM entries e
            JOIN vehicles v
                ON v.id = e."vehicleId"
            WHERE e."vehicleId" = ${Number(vehicleId)}
              AND e.id < ${Number(currentEntryId)}
              AND v."userId" = ${userId}
            ORDER BY e.id DESC
            LIMIT 1
        `;

        return rows[0] || null;
    }

    const rows = await db`
        SELECT
            e.id,
            e.odometer,
            e.litres,
            e.date
        FROM entries e
        JOIN vehicles v
            ON v.id = e."vehicleId"
        WHERE e."vehicleId" = ${Number(vehicleId)}
          AND v."userId" = ${userId}
        ORDER BY e.id DESC
        LIMIT 1
    `;

    return rows[0] || null;
}

async function createEntry(data, userId) {
    validateEntryData(data);

    const {
        date,
        vehicleId,
        pumpName,
        price,
        litres,
        odometer,
        tripId
    } = data;

    const vehicleOwned = await verifyVehicleOwnership(
        vehicleId,
        userId
    );

    if (!vehicleOwned) {
        throw new Error("Vehicle not found");
    }

    const tripOwned = await verifyTripOwnership(
        tripId,
        vehicleId,
        userId
    );

    if (!tripOwned) {
        throw new Error("Trip not found");
    }

    const numericPrice = Number(price);
    const numericLitres = Number(litres);
    const numericOdometer = Number(odometer);

    const totalPrice = numericPrice * numericLitres;

    const previousEntry = await getPreviousEntry(
        vehicleId,
        userId
    );

    let distance = null;
    let mileage = null;

    if (previousEntry) {
        distance =
            numericOdometer -
            Number(previousEntry.odometer);

        if (distance < 0) {
            throw new Error(
                "Odometer reading cannot be lower than the previous reading"
            );
        }

        if (numericLitres > 0 && distance > 0) {
            mileage = distance / numericLitres;
        }
    }

    const rows = await db`
        INSERT INTO entries (
            "vehicleId",
            date,
            "pumpName",
            price,
            "totalPrice",
            odometer,
            litres,
            "tripId"
        )
        VALUES (
            ${Number(vehicleId)},
            ${date},
            ${pumpName.trim()},
            ${numericPrice},
            ${totalPrice},
            ${numericOdometer},
            ${numericLitres},
            ${
                tripId === undefined ||
                tripId === null ||
                tripId === ""
                    ? null
                    : Number(tripId)
            }
        )
        RETURNING *
    `;

    return {
        ...rows[0],
        distance,
        mileage
    };
}

async function getAllEntries(userId) {
    const entries = await db`
        SELECT
            e.id,
            e."vehicleId",
            v.name AS "vehicleName",
            v.registration AS "vehicleRegistration",
            e.date,
            e."pumpName",
            e.price,
            e."totalPrice",
            e.odometer,
            e.litres,
            e."tripId",
            t.name AS "tripName"
        FROM entries e
        JOIN vehicles v
            ON v.id = e."vehicleId"
        LEFT JOIN trips t
            ON t.id = e."tripId"
        WHERE v."userId" = ${userId}
        ORDER BY e.date ASC, e.id ASC
    `;

    const processedEntries = [];

    for (const entry of entries) {
        const previousEntry = await db`
            SELECT e.odometer
            FROM entries e
            JOIN vehicles v
                ON v.id = e."vehicleId"
            WHERE e."vehicleId" = ${entry.vehicleId}
              AND v."userId" = ${userId}
              AND (
                    e.date < ${entry.date}
                    OR (
                        e.date = ${entry.date}
                        AND e.id < ${entry.id}
                    )
                  )
            ORDER BY e.date DESC, e.id DESC
            LIMIT 1
        `;

        let distance = null;
        let mileage = null;

        if (previousEntry.length > 0) {
            distance =
                Number(entry.odometer) -
                Number(previousEntry[0].odometer);

            if (distance > 0 && Number(entry.litres) > 0) {
                mileage =
                    distance /
                    Number(entry.litres);
            }
        }

        processedEntries.push({
            ...entry,
            distance,
            mileage
        });
    }

    const summaryRows = await db`
        SELECT
            COUNT(*) AS "totalEntries",
            COALESCE(SUM(e."totalPrice"), 0) AS "totalSpending",
            COALESCE(SUM(e.litres), 0) AS "totalFuel"
        FROM entries e
        JOIN vehicles v
            ON v.id = e."vehicleId"
        WHERE v."userId" = ${userId}
    `;

    const mileageValues = processedEntries
        .map((entry) => entry.mileage)
        .filter(
            (value) =>
                value !== null &&
                Number.isFinite(value)
        );

    const averageMileage =
        mileageValues.length > 0
            ? mileageValues.reduce(
                  (sum, value) => sum + value,
                  0
              ) / mileageValues.length
            : 0;

    return {
        entries: processedEntries,
        summary: {
            totalEntries: Number(
                summaryRows[0].totalEntries
            ),
            totalSpending: Number(
                summaryRows[0].totalSpending
            ),
            totalFuel: Number(
                summaryRows[0].totalFuel
            ),
            averageMileage
        }
    };
}

async function getEntryById(id, userId) {
    const rows = await db`
        SELECT
            e.id,
            e."vehicleId",
            v.name AS "vehicleName",
            v.registration AS "vehicleRegistration",
            e.date,
            e."pumpName",
            e.price,
            e."totalPrice",
            e.odometer,
            e.litres,
            e."tripId",
            t.name AS "tripName"
        FROM entries e
        JOIN vehicles v
            ON v.id = e."vehicleId"
        LEFT JOIN trips t
            ON t.id = e."tripId"
        WHERE e.id = ${Number(id)}
          AND v."userId" = ${userId}
    `;

    if (rows.length === 0) {
        return null;
    }

    const entry = rows[0];

    const previousEntry = await db`
        SELECT e.odometer
        FROM entries e
        JOIN vehicles v
            ON v.id = e."vehicleId"
        WHERE e."vehicleId" = ${entry.vehicleId}
          AND v."userId" = ${userId}
          AND (
                e.date < ${entry.date}
                OR (
                    e.date = ${entry.date}
                    AND e.id < ${entry.id}
                )
              )
        ORDER BY e.date DESC, e.id DESC
        LIMIT 1
    `;

    let distance = null;
    let mileage = null;

    if (previousEntry.length > 0) {
        distance =
            Number(entry.odometer) -
            Number(previousEntry[0].odometer);

        if (distance > 0 && Number(entry.litres) > 0) {
            mileage =
                distance /
                Number(entry.litres);
        }
    }

    return {
        ...entry,
        distance,
        mileage
    };
}

async function updateEntry(id, data, userId) {
    validateEntryData(data);

    const {
        date,
        vehicleId,
        pumpName,
        price,
        litres,
        odometer,
        tripId
    } = data;

    const existingEntry = await getEntryById(
        id,
        userId
    );

    if (!existingEntry) {
        return null;
    }

    const vehicleOwned = await verifyVehicleOwnership(
        vehicleId,
        userId
    );

    if (!vehicleOwned) {
        throw new Error("Vehicle not found");
    }

    const tripOwned = await verifyTripOwnership(
        tripId,
        vehicleId,
        userId
    );

    if (!tripOwned) {
        throw new Error("Trip not found");
    }

    const numericPrice = Number(price);
    const numericLitres = Number(litres);
    const numericOdometer = Number(odometer);

    const totalPrice = numericPrice * numericLitres;

    const previousEntry = await getPreviousEntry(
        vehicleId,
        userId,
        Number(id)
    );

    let distance = null;
    let mileage = null;

    if (previousEntry) {
        distance =
            numericOdometer -
            Number(previousEntry.odometer);

        if (distance < 0) {
            throw new Error(
                "Odometer reading cannot be lower than the previous reading"
            );
        }

        if (distance > 0 && numericLitres > 0) {
            mileage =
                distance / numericLitres;
        }
    }

    const rows = await db`
        UPDATE entries
        SET
            "vehicleId" = ${Number(vehicleId)},
            date = ${date},
            "pumpName" = ${pumpName.trim()},
            price = ${numericPrice},
            "totalPrice" = ${totalPrice},
            odometer = ${numericOdometer},
            litres = ${numericLitres},
            "tripId" = ${
                tripId === undefined ||
                tripId === null ||
                tripId === ""
                    ? null
                    : Number(tripId)
            }
        WHERE id = ${Number(id)}
          AND EXISTS (
              SELECT 1
              FROM vehicles v
              WHERE v.id = entries."vehicleId"
                AND v."userId" = ${userId}
          )
        RETURNING *
    `;

    if (rows.length === 0) {
        return null;
    }

    return {
        ...rows[0],
        distance,
        mileage
    };
}

async function deleteEntry(id, userId) {
    const rows = await db`
        DELETE FROM entries e
        USING vehicles v
        WHERE e.id = ${Number(id)}
          AND v.id = e."vehicleId"
          AND v."userId" = ${userId}
        RETURNING e.id
    `;

    return rows.length > 0;
}

module.exports = {
    createEntry,
    getAllEntries,
    getEntryById,
    updateEntry,
    deleteEntry
};