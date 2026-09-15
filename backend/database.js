const Database = require("better-sqlite3");

const db = new Database("petrol-khata.db");

db.prepare(`
    CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        pumpName TEXT NOT NULL,
        price REAL NOT NULL,
        totalPrice REAL NOT NULL,
        odometer REAL NOT NULL,
        litres REAL NOT NULL
    )
`).run();

module.exports = db;