import { useEffect, useState } from "react";

function AddEntry({ setEntries, setShowAddEntry }) {
    const [date, setDate] = useState("");
    const [carName, setCarName] = useState("");
    const [pumpName, setPumpName] = useState("");
    const [price, setPrice] = useState("");
    const [totalPrice, setTotalPrice] = useState("");
    const [odometer, setOdometer] = useState("");
    const [litres, setLitres] = useState("");

    const [priceMode, setPriceMode] = useState("live");
    const [livePrice, setLivePrice] = useState(null);

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (priceMode !== "live") {
            return;
        }

        fetch("https://petrol-khata.onrender.com/fuel-price")
            .then((response) => response.json())
            .then((data) => {
                setLivePrice(data.price);
                setPrice(String(data.price));
            })
            .catch((error) => {
                console.error(
                    "Failed to fetch live price:",
                    error
                );
            });
    }, [priceMode]);

    async function addEntry() {
        setError("");

        if (
            date.trim() === "" ||
            carName.trim() === "" ||
            pumpName.trim() === "" ||
            price.trim() === "" ||
            odometer.trim() === "" ||
            litres.trim() === ""
        ) {
            setError("Please fill in all fields.");
            return;
        }

        setIsSubmitting(true);

        const newEntry = {
            date,
            carName,
            pumpName,
            price,
            odometer,
            litres
        };

        try {
            const response = await fetch(
                "https://petrol-khata.onrender.com/entries",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newEntry)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                        "Failed to add fuel entry."
                );
            }

            setEntries((entries) => [
                ...entries,
                data
            ]);

            setDate("");
            setCarName("");
            setPumpName("");
            setPrice("");
            setTotalPrice("");
            setOdometer("");
            setLitres("");
            setPriceMode("live");
            setLivePrice(null);

            setShowAddEntry(false);
        } catch (error) {
            console.error(
                "Failed to add entry:",
                error
            );

            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="overlay">
            <section className="add-entry">

                <div className="add-entry-header">
                    <h2>Add Fuel Entry</h2>

                    <button
                        className="close-button"
                        onClick={() =>
                            setShowAddEntry(false)
                        }
                    >
                        ✕
                    </button>
                </div>

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                <div className="form-group">
                    <label>Date</label>

                    <input
                        type="date"
                        value={date}
                        onChange={(event) =>
                            setDate(
                                event.target.value
                            )
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Car</label>

                    <input
                        type="text"
                        placeholder="Enter car name"
                        value={carName}
                        onChange={(event) =>
                            setCarName(
                                event.target.value
                            )
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Petrol Pump</label>

                    <input
                        type="text"
                        placeholder="Enter petrol pump name"
                        value={pumpName}
                        onChange={(event) =>
                            setPumpName(
                                event.target.value
                            )
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Price per litre</label>

                    <div className="price-options">

                        <button
                            type="button"
                            className={`price-option ${
                                priceMode === "live"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                setPriceMode("live")
                            }
                        >
                            <span className="price-option-title">
                                Live Price
                            </span>

                            <span className="price-option-description">
                                {livePrice !== null
                                    ? `Rs ${Number(
                                          livePrice
                                      ).toFixed(2)} / L`
                                    : "Loading current price..."}
                            </span>
                        </button>

                        <button
                            type="button"
                            className={`price-option ${
                                priceMode === "manual"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() => {
                                setPriceMode(
                                    "manual"
                                );
                                setPrice("");
                            }}
                        >
                            <span className="price-option-title">
                                Manual Price
                            </span>

                            <span className="price-option-description">
                                Enter your own price
                            </span>
                        </button>

                    </div>

                    {priceMode === "manual" && (
                        <input
                            type="number"
                            placeholder="Enter price per litre"
                            value={price}
                            onChange={(event) =>
                                setPrice(
                                    event.target.value
                                )
                            }
                        />
                    )}
                </div>

                <div className="form-group">
                    <label>Litres Filled</label>

                    <input
                        type="number"
                        step="0.01"
                        placeholder="Enter litres filled"
                        value={litres}
                        onChange={(event) =>
                            setLitres(
                                event.target.value
                            )
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Total Price</label>

                    <input
                        type="text"
                        value="Calculated by backend"
                        readOnly
                    />
                </div>

                <div className="form-group">
                    <label>
                        Odometer Reading (km)
                    </label>

                    <input
                        type="number"
                        placeholder="Enter current odometer reading"
                        value={odometer}
                        onChange={(event) =>
                            setOdometer(
                                event.target.value
                            )
                        }
                    />
                </div>

                <button
                    className="submit-button"
                    onClick={addEntry}
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? "Adding..."
                        : "Add Entry"}
                </button>

            </section>
        </div>
    );
}

export default AddEntry;