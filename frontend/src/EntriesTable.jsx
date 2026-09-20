
function EntriesTable({ entries, setEntries, setShowAddEntry }) {
    return (
        <section className="entries">
            <div className="entries-header">
                <h2>Fuel Entries</h2>

                <button
                    className="add-button"
                    onClick={() => setShowAddEntry(true)}
                >
                    +
                </button>
            </div>

            {entries.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">⛽</div>

                    <h3>No fuel entries yet</h3>

                    <p>
                        Click the + button to add your first entry.
                    </p>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Car</th>
                                <th>Petrol Pump</th>
                                <th>Price/Litre</th>
                                <th>Litres</th>
                                <th>Total Price</th>
                                <th>Odometer</th>
                                <th>Distance</th>
                                <th>Mileage</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {entries.map((entry) => (
                                <tr key={entry.id}>
                                    <td>{entry.date}</td>

                                    <td>{entry.carName}</td>

                                    <td>{entry.pumpName}</td>

                                    <td>
                                        Rs {entry.price}
                                    </td>

                                    <td>
                                        {entry.litres} L
                                    </td>

                                    <td>
                                        Rs {entry.totalPrice}
                                    </td>

                                    <td>
                                        {entry.odometer} km
                                    </td>

                                    <td>
                                        {entry.distance !== null
                                            ? `${entry.distance} km`
                                            : "—"}
                                    </td>

                                    <td>
                                        {entry.mileage !== null
                                            ? `${Number(entry.mileage).toFixed(2)} km/L`
                                            : "—"}
                                    </td>

                                    <td>
                                        <button
                                            className="delete-button"
                                            onClick={async () => {
                                                await fetch(
                                                    `https://petrol-khata.onrender.com/entries/${entry.id}`,
                                                    {
                                                        method: "DELETE"
                                                    }
                                                );

                                                setEntries(
                                                    entries.filter(
                                                        (item) =>
                                                            item.id !== entry.id
                                                    )
                                                );
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default EntriesTable;
