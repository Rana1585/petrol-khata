const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

app.get("/", (req, res) => {
    res.send("Hello from Petrol Khata API!");
});

app.post("/entries", (req, res) => {
    const entry = req.body;

    const previousEntry = db
        .prepare(`
            SELECT odometer
            FROM entries
            ORDER BY id DESC
            LIMIT 1
        `)
        .get();

    let distance = null;
    let mileage = null;

    if (previousEntry) {
        distance = Number(entry.odometer) - Number(previousEntry.odometer);

        if (distance > 0 && Number(entry.litres) > 0) {
            mileage = distance / Number(entry.litres);
        }
    }

    const result = db
        .prepare(`
            INSERT INTO entries (
                date,
                pumpName,
                price,
                totalPrice,
                odometer,
                litres
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `)
        .run(
            entry.date,
            entry.pumpName,
            entry.price,
            entry.totalPrice,
            entry.odometer,
            entry.litres
        );

    res.json({
        id: result.lastInsertRowid,
        ...entry,
        distance,
        mileage
    });
});

app.get("/entries", (req, res) => {
    const entries = db
        .prepare(`
            SELECT *
            FROM entries
            ORDER BY id ASC
        `)
        .all();

    let previousOdometer = null;

    const calculatedEntries = entries.map((entry) => {
        let distance = null;
        let mileage = null;

        if (previousOdometer !== null) {
            distance = Number(entry.odometer) - Number(previousOdometer);

            if (distance > 0 && Number(entry.litres) > 0) {
                mileage = distance / Number(entry.litres);
            }
        }

        previousOdometer = Number(entry.odometer);

        return {
            ...entry,
            distance,
            mileage
        };
    });

    const mileageValues = calculatedEntries
        .filter((entry) => entry.mileage !== null)
        .map((entry) => Number(entry.mileage));

    const averageMileage =
        mileageValues.length > 0
            ? mileageValues.reduce((total, value) => total + value, 0) /
              mileageValues.length
            : null;

    const bestMileage =
        mileageValues.length > 0
            ? Math.max(...mileageValues)
            : null;

    res.json({
        entries: calculatedEntries,
        analytics: {
            averageMileage,
            bestMileage
        }
    });
});

app.delete("/entries/:id", (req, res) => {
    const id = req.params.id;

    db.prepare("DELETE FROM entries WHERE id = ?").run(id);

    res.json({
        message: "Entry deleted successfully"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});