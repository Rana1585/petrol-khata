function EntriesTable({ entries, setEntries }) {
    return (
        <section className="entries">
            <h2>Fuel Entries</h2>

            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Petrol Pump</th>
                        <th>Price/Litre</th>
                        <th>Total Price</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
    {entries.map((entry, index) => (
        <tr key={index}>
            <td>{entry.date}</td>
            <td>{entry.pumpName}</td>
            <td>{entry.price}</td>
            <td>{entry.totalPrice}</td>
            <td>
    <button
    className="delete-button"
    onClick={() => {
        setEntries(entries.filter((_, i) => i !== index));
    }}
>
    Delete
</button>
</td>
        </tr>
    ))}
</tbody>
            </table>
        </section>
    );
}

export default EntriesTable;