import { useState } from "react";

function AddEntry({ setEntries, setShowAddEntry }) {
    const [date, setDate] = useState("");
    const [pumpName, setPumpName] = useState("");
    const [price, setPrice] = useState("");
    const [totalPrice, setTotalPrice] = useState("");
    const [odometer, setOdometer] = useState("");
    const [litres, setLitres] = useState("");

    async function addEntry() {
        if (
            date.trim() === "" ||
            pumpName.trim() === "" ||
            price.trim() === "" ||
            totalPrice.trim() === "" ||
            odometer.trim() === "" ||
            litres.trim() === ""
        ) {
            alert("Please fill in all fields.");
            return;
        }

        const newEntry = {
            date,
            pumpName,
            price,
            totalPrice,
            odometer,
            litres
        };

        const response = await fetch("http://localhost:5000/entries", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newEntry)
        });

        const savedEntry = await response.json();

        setEntries((entries) => [...entries, savedEntry]);

        setDate("");
        setPumpName("");
        setPrice("");
        setTotalPrice("");
        setOdometer("");
        setLitres("");

        setShowAddEntry(false);
    }

    return (
        <div className="overlay">
            <section className="add-entry">

                <div className="add-entry-header">
                    <h2>Add Fuel Entry</h2>

                    <button
                        className="close-button"
                        onClick={() => setShowAddEntry(false)}
                    >
                        ✕
                    </button>
                </div>

                <div className="form-group">
                    <label>Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Petrol Pump</label>
                    <input
                        type="text"
                        placeholder="Enter petrol pump name"
                        value={pumpName}
                        onChange={(event) => setPumpName(event.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Price per litre</label>
                    <input
                        type="number"
                        placeholder="Enter price per litre"
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Total Price</label>
                    <input
                        type="number"
                        placeholder="Enter total amount"
                        value={totalPrice}
                        onChange={(event) => setTotalPrice(event.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Odometer Reading (km)</label>
                    <input
                        type="number"
                        placeholder="Enter current odometer reading"
                        value={odometer}
                        onChange={(event) => setOdometer(event.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Litres Filled</label>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Enter litres filled"
                        value={litres}
                        onChange={(event) => setLitres(event.target.value)}
                    />
                </div>

                <button
                    className="submit-button"
                    onClick={addEntry}
                >
                    Add Entry
                </button>

            </section>
        </div>
    );
}

export default AddEntry;