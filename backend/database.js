const Database = require("better-sqlite3");

const db = new Database("petrol-khata.db");

db.pragma("foreign_keys = ON");

db.exec(`
    CREATE TABLE IF NOT EXISTS vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        registration TEXT,
        active INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS trips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicleId INTEGER NOT NULL,
        name TEXT NOT NULL,
        startLocation TEXT NOT NULL,
        destination TEXT NOT NULL,
        startDate TEXT NOT NULL,
        endDate TEXT,
        startOdometer REAL NOT NULL,
        endOdometer REAL,

        FOREIGN KEY (vehicleId)
            REFERENCES vehicles(id)
            ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicleId INTEGER NOT NULL,
        date TEXT NOT NULL,
        pumpName TEXT NOT NULL,
        price REAL NOT NULL,
        totalPrice REAL NOT NULL,
        odometer REAL NOT NULL,
        litres REAL NOT NULL,
        tripId INTEGER,
        createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (vehicleId)
            REFERENCES vehicles(id)
            ON DELETE RESTRICT,

        FOREIGN KEY (tripId)
            REFERENCES trips(id)
            ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS vehicle_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicleId INTEGER NOT NULL,
        date TEXT NOT NULL,
        price REAL NOT NULL,
        meterReading REAL NOT NULL,

        FOREIGN KEY (vehicleId)
            REFERENCES vehicles(id)
            ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS vehicle_maintenance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicleId INTEGER NOT NULL,
        date TEXT NOT NULL,
        meterReading REAL NOT NULL,

        mobileOil TEXT,
        mobileOilCost REAL NOT NULL DEFAULT 0,

        oilFilter TEXT,
        oilFilterCost REAL NOT NULL DEFAULT 0,

        airFilter TEXT,
        airFilterCost REAL NOT NULL DEFAULT 0,

        otherMaintenance TEXT,
        otherMaintenanceCost REAL NOT NULL DEFAULT 0,

        notes TEXT,

        FOREIGN KEY (vehicleId)
            REFERENCES vehicles(id)
            ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS fuel_price_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        price REAL NOT NULL,
        effectiveDate TEXT NOT NULL,
        recordedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
`);


/* =========================================================
   DUMMY DATA
   ========================================================= */

const vehicleCount = db
    .prepare("SELECT COUNT(*) AS count FROM vehicles")
    .get().count;

if (vehicleCount === 0) {

    // -------------------------
    // VEHICLES
    // -------------------------

    const insertVehicle = db.prepare(`
        INSERT INTO vehicles (name, registration)
        VALUES (?, ?)
    `);

    const civic = insertVehicle.run(
        "Honda Civic",
        "ABC-123"
    ).lastInsertRowid;

    const corolla = insertVehicle.run(
        "Toyota Corolla",
        "LEA-456"
    ).lastInsertRowid;


    // -------------------------
    // TRIPS
    // -------------------------

    const insertTrip = db.prepare(`
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
    `);

    const lahoreIslamabad = insertTrip.run(
        civic,
        "Lahore - Islamabad Trip",
        "Lahore",
        "Islamabad",
        "2026-09-05",
        "2026-09-07",
        45210,
        45685
    ).lastInsertRowid;

    const faisalabadLahore = insertTrip.run(
        civic,
        "Faisalabad - Lahore Trip",
        "Faisalabad",
        "Lahore",
        "2026-09-12",
        "2026-09-13",
        45720,
        45905
    ).lastInsertRowid;

    const multanTrip = insertTrip.run(
        corolla,
        "Lahore - Multan Trip",
        "Lahore",
        "Multan",
        "2026-09-08",
        "2026-09-09",
        78150,
        78540
    ).lastInsertRowid;


    // -------------------------
    // FUEL ENTRIES
    // -------------------------

    const insertEntry = db.prepare(`
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
    `);

    // Honda Civic - normal fuel entries

    insertEntry.run(
        civic,
        "2026-09-01",
        "PSO Canal Road",
        272.50,
        8500,
        44980,
        31.19,
        null
    );

    insertEntry.run(
        civic,
        "2026-09-05",
        "Shell Thokar Niaz Baig",
        272.50,
        9200,
        45210,
        33.76,
        lahoreIslamabad
    );

    insertEntry.run(
        civic,
        "2026-09-06",
        "Total PARCO M2",
        273.00,
        7800,
        45425,
        28.57,
        lahoreIslamabad
    );

    insertEntry.run(
        civic,
        "2026-09-07",
        "PSO Islamabad",
        273.00,
        8100,
        45685,
        29.67,
        lahoreIslamabad
    );

    insertEntry.run(
        civic,
        "2026-09-12",
        "Shell Faisalabad",
        274.00,
        6500,
        45720,
        23.72,
        faisalabadLahore
    );

    insertEntry.run(
        civic,
        "2026-09-13",
        "Total PARCO Lahore",
        274.00,
        7200,
        45905,
        26.28,
        faisalabadLahore
    );


    // Toyota Corolla - fuel entries

    insertEntry.run(
        corolla,
        "2026-09-02",
        "PSO Main Boulevard",
        272.50,
        9000,
        78150,
        33.03,
        null
    );

    insertEntry.run(
        corolla,
        "2026-09-08",
        "Shell Lahore",
        273.00,
        8500,
        78150,
        31.14,
        multanTrip
    );

    insertEntry.run(
        corolla,
        "2026-09-09",
        "PSO Multan Road",
        273.00,
        9200,
        78540,
        33.70,
        multanTrip
    );


    // -------------------------
    // VEHICLE RECORDS
    // Mobile change / meter records
    // -------------------------

    const insertVehicleRecord = db.prepare(`
        INSERT INTO vehicle_records (
            vehicleId,
            date,
            price,
            meterReading
        )
        VALUES (?, ?, ?, ?)
    `);

    insertVehicleRecord.run(
        civic,
        "2026-06-15",
        18500,
        41200
    );

    insertVehicleRecord.run(
        civic,
        "2026-08-10",
        19200,
        43850
    );

    insertVehicleRecord.run(
        civic,
        "2026-09-15",
        19800,
        45950
    );

    insertVehicleRecord.run(
        corolla,
        "2026-05-20",
        17500,
        73500
    );

    insertVehicleRecord.run(
        corolla,
        "2026-08-05",
        18900,
        76500
    );


    // -------------------------
    // VEHICLE MAINTENANCE
    // -------------------------

    const insertMaintenance = db.prepare(`
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
    `);

    insertMaintenance.run(
        civic,
        "2026-07-10",
        42500,
        "Shell Helix HX7 5W-30",
        8500,
        "Honda Genuine",
        1800,
        "Honda Genuine",
        2500,
        "Brake service",
        4500,
        "Regular maintenance"
    );

    insertMaintenance.run(
        civic,
        "2026-09-01",
        44980,
        "Shell Helix Ultra 5W-40",
        11500,
        "Honda Genuine",
        2200,
        "Honda Genuine",
        2800,
        "AC service",
        3500,
        "Oil and filter replacement"
    );

    insertMaintenance.run(
        corolla,
        "2026-06-20",
        74800,
        "Toyota Genuine 5W-30",
        9000,
        "Toyota Genuine",
        1900,
        "Toyota Genuine",
        2300,
        "Wheel alignment",
        2500,
        "Routine maintenance"
    );


    // -------------------------
    // FUEL PRICE HISTORY
    // -------------------------

    const insertFuelPrice = db.prepare(`
        INSERT INTO fuel_price_history (
            price,
            effectiveDate
        )
        VALUES (?, ?)
    `);

    insertFuelPrice.run(260.50, "2026-06-01");
    insertFuelPrice.run(264.75, "2026-07-01");
    insertFuelPrice.run(268.50, "2026-08-01");
    insertFuelPrice.run(272.50, "2026-09-01");
    insertFuelPrice.run(274.00, "2026-09-15");
}


module.exports = db;