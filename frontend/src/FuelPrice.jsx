import { useEffect, useState } from "react";

function FuelPrice() {
    const [price, setPrice] = useState(null);
    const [effectiveDate, setEffectiveDate] = useState(null);

    useEffect(() => {
        const fetchFuelPrice = () => {
            fetch("https://petrol-khata.onrender.com/fuel-price")
                .then((response) => response.json())
                .then((data) => {
                    setPrice(data.price);
                    setEffectiveDate(data.effectiveDate);
                })
                .catch((error) => {
                    console.error(
                        "Failed to fetch fuel price:",
                        error
                    );
                });
        };

        fetchFuelPrice();

        const interval = setInterval(
            fetchFuelPrice,
            60 * 60 * 1000
        );

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="fuel-price-card">
            <div>
                <p>⛽ Current Petrol Price</p>

                <h2>
                    {price !== null
                        ? `Rs ${Number(price).toFixed(2)} / L`
                        : "Loading..."}
                </h2>

                <span>
                    ● Live price
                </span>

                {effectiveDate && (
                    <small>
                        Updated: {effectiveDate}
                    </small>
                )}
            </div>
        </section>
    );
}

export default FuelPrice;