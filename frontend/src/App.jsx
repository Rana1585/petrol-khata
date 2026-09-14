
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import AddEntry from "./AddEntry";
import EntriesTable from "./EntriesTable";

function App() {
    const [entries, setEntries] = useState([]);
    useEffect(() => {
    fetch("http://localhost:5000/entries")
        .then((response) => response.json())
        .then((data) => {
            setEntries(data);
        });
}, []);

    const totalSpending = entries.reduce(
        (total, entry) => total + Number(entry.totalPrice),
        0
    );

    return (
        <div className="app">
            <Navbar />

            <main id="dashboard">

                <div className="dashboard-header">
                    <div>
                        <h1>Petrol Khata Dashboard</h1>
                        <p>Track and manage your fuel expenses</p>
                    </div>
                </div>

                <div className="top-section">

                    <div className="summary-cards">
                        <div className="summary-card">
                           <p>📋 Total Entries</p>
                            <h2>{entries.length}</h2>
                        </div>

                        <div className="summary-card">
                            <p>💰 Total Spending</p>
                            <h2>Rs {totalSpending}</h2>
                        </div>

                        <div className="summary-card">
                            <p>⛽ Total Fuel</p>
                            <h2>0 L</h2>
                        </div>
                    </div>

                    <AddEntry setEntries={setEntries} />

                </div>

                <EntriesTable
                    entries={entries}
                    setEntries={setEntries}
                />

            </main>
        </div>
    );
}

export default App;
