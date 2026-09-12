import { useState } from "react";

function AddEntry({ setEntries }) {
    const [date, setDate] = useState("");
    const [pumpName, setPumpName] = useState("");
    const [price, setPrice] = useState("");
    const [totalPrice, setTotalPrice] = useState("");

   async function addEntry() {
    const newEntry = {
        date: date,
        pumpName: pumpName,
        price: price,
        totalPrice: totalPrice
    };

    const response = await fetch("http://localhost:5000/entries", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(newEntry)
}); 


    setEntries((entries) => [...entries, newEntry]);

    setDate("");
    setPumpName("");
    setPrice("");
    setTotalPrice("");
}
    

    return (
        <section className="add-entry" id="add-entry">
            <h2>Add Fuel Entry</h2>

            <label>Date</label>
            <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
            />

            <label>Petrol Pump</label>
            <input
                type="text"
                value={pumpName}
                onChange={(event) => setPumpName(event.target.value)}
            />

            <label>Price per litre</label>
            <input
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
            />

            <label>Total Price</label>
            <input
                type="number"
                value={totalPrice}
                onChange={(event) => setTotalPrice(event.target.value)}
            />

            <button onClick={addEntry}>Add Entry</button>
        </section>
    );
}

export default AddEntry;