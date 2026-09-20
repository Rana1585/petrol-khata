import { useState } from "react";

function Settings() {
    const [confirmClear, setConfirmClear] = useState(false);

    return (
        <main className="page">
            <div className="page-header">
                <div>
                    <h1>Settings</h1>
                    <p>
                        Manage your Petrol Khata preferences
                    </p>
                </div>
            </div>

            <section className="settings-grid">
                <div className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-icon">
                            ⛽
                        </div>

                        <div>
                            <h2>Fuel Price</h2>
                            <p>
                                Petrol price is automatically
                                fetched from the backend.
                            </p>
                        </div>
                    </div>

                    <div className="settings-info">
                        <span>Price source</span>
                        <strong>
                            Automatic
                        </strong>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-icon">
                            🚗
                        </div>

                        <div>
                            <h2>Vehicles</h2>
                            <p>
                                Add and manage your vehicles
                                from the Vehicles section.
                            </p>
                        </div>
                    </div>

                    <a
                        href="/vehicles"
                        className="settings-link"
                    >
                        Manage Vehicles →
                    </a>
                </div>

                <div className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-icon">
                            📊
                        </div>

                        <div>
                            <h2>Analytics</h2>
                            <p>
                                View spending, fuel consumption
                                and mileage trends.
                            </p>
                        </div>
                    </div>

                    <a
                        href="/analytics"
                        className="settings-link"
                    >
                        View Analytics →
                    </a>
                </div>

                <div className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-icon">
                            💾
                        </div>

                        <div>
                            <h2>Data Management</h2>
                            <p>
                                Your Petrol Khata data is stored
                                in the local database.
                            </p>
                        </div>
                    </div>

                    <div className="settings-warning">
                        <strong>Be careful</strong>
                        <span>
                            Data deletion controls will be
                            added after the application is
                            fully tested.
                        </span>
                    </div>

                    {!confirmClear ? (
                        <button
                            className="secondary-button"
                            onClick={() =>
                                setConfirmClear(true)
                            }
                        >
                            Data Management
                        </button>
                    ) : (
                        <div className="settings-confirm">
                            <p>
                                Data deletion is currently
                                disabled while the application
                                is under development.
                            </p>

                            <button
                                className="secondary-button"
                                onClick={() =>
                                    setConfirmClear(false)
                                }
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <section className="settings-about">
                <div>
                    <h2>Petrol Khata</h2>
                    <p>
                        Personal fuel expense and vehicle
                        management system.
                    </p>
                </div>

                <span>Version 1.0</span>
            </section>
        </main>
    );
}

export default Settings;
