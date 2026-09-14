const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();


app.use(cors());
app.use(express.json());

const PORT = 5000;

const entries = [];

app.get("/", (req, res) => {
    res.send("Hello from Petrol Khata API!");
});

app.post("/entries", (req, res) => {
    const entry = req.body;

    const result = db.prepare(`
        INSERT INTO entries (date, pumpName, price, totalPrice)
        VALUES (?, ?, ?, ?)
    `).run(
        entry.date,
        entry.pumpName,
        entry.price,
        entry.totalPrice
    );

    res.json({
        id: result.lastInsertRowid,
        ...entry
    });
});


app.get("/entries", (req, res) => {
    const entries = db.prepare("SELECT * FROM entries").all();

    res.json(entries);
});
app.delete("/entries/:id", (req, res) => {
    const id = req.params.id;

    db.prepare("DELETE FROM entries WHERE id = ?").run(id);

    res.json({ message: "Entry deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
