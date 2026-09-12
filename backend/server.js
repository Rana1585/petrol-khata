const express = require("express");
const cors = require("cors");

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

    entries.push(entry);

    console.log(entry);

    res.json(entry);
});

app.get("/entries", (req, res) => {
    res.json(entries);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
