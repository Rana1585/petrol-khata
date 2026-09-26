import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import { useEffect, useState } from "react";

import Sidebar from "./Sidebar";
import ProfileMenu from "./ProfileMenu";

import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import FuelEntries from "./pages/FuelEntries";
import Trips from "./pages/Trips";
import VehicleDetails from "./pages/VehicleDetails";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import { supabase } from "./supabase";


function LandingLogoIcon({ size = 22 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M7 4h8v7.5a4 4 0 0 1-8 0V4Z" />
            <path d="M9 4V2h4v2" />
            <path d="M9 15.5V19" />
            <path d="M13 15.5V19" />
            <path d="M7 19h8" />
        </svg>
    );
}


function MenuIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
        </svg>
    );
}


function CloseIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M6 6l12 12" />
            <path d="M18 6 6 18" />
        </svg>
    );
}


function LandingPage() {
    return (
        <div className="landing-page">
            <header className="landing-header">
                <div className="landing-brand">
                    <div className="landing-logo">
                        <LandingLogoIcon size={22} />
                    </div>

                    <span>Petrol Khata</span>
                </div>

                <div className="landing-actions">
                    <a
                        href="/login"
                        className="landing-login"
                    >
                        Login
                    </a>

                    <a
                        href="/signup"
                        className="landing-signup"
                    >
                        Get Started
                    </a>
                </div>
            </header>

            <main className="landing-main">
                <section className="landing-hero">
                    <div className="landing-hero-content">
                        <span className="landing-eyebrow">
                            SMART FUEL MANAGEMENT
                        </span>

                        <h1>
                            Track Your Fuel.
                            <br />
                            Understand Your Expenses.
                        </h1>

                        <p>
                            Petrol Khata helps you manage
                            vehicles, fuel expenses, trips,
                            maintenance, and analytics from
                            one simple dashboard.
                        </p>

                        <div className="landing-hero-actions">
                            <a
                                href="/signup"
                                className="landing-primary-button"
                            >
                                Get Started
                            </a>

                            <a
                                href="/login"
                                className="landing-secondary-button"
                            >
                                Go to Dashboard
                            </a>
                        </div>
                    </div>

                    <div className="landing-preview">
                        <div className="landing-preview-window">
                            <div className="landing-preview-top">
                                <div>
                                    <span>Petrol Khata</span>

                                    <strong>Dashboard</strong>
                                </div>

                                <div className="landing-preview-avatar">
                                    <LandingLogoIcon size={17} />
                                </div>
                            </div>

                            <div className="landing-preview-stats">
                                <div>
                                    <span>Total Fuel Cost</span>

                                    <strong>Rs 74,000</strong>
                                </div>

                                <div>
                                    <span>Total Litres</span>

                                    <strong>271 L</strong>
                                </div>

                                <div>
                                    <span>Vehicles</span>

                                    <strong>2</strong>
                                </div>
                            </div>

                            <div className="landing-preview-chart">
                                <div className="preview-chart-label">
                                    Fuel Expenses
                                </div>

                                <div className="preview-chart-bars">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="landing-features">
                    <div className="landing-section-heading">
                        <span>EVERYTHING IN ONE PLACE</span>

                        <h2>
                            Built for smarter vehicle
                            management.
                        </h2>

                        <p>
                            Keep your fuel records organized,
                            understand your spending, and
                            monitor every vehicle with ease.
                        </p>
                    </div>

                    <div className="landing-feature-grid">
                        <FeatureCard
                            icon={<CarIcon />}
                            title="Vehicle Management"
                            description="Keep all your vehicles, registrations, and related records organized."
                        />

                        <FeatureCard
                            icon={<FuelIcon />}
                            title="Fuel Expense Tracking"
                            description="Record fuel entries and keep a clear history of your fuel spending."
                        />

                        <FeatureCard
                            icon={<RouteIcon />}
                            title="Trip Management"
                            description="Track your trips and connect fuel activity with your journeys."
                        />

                        <FeatureCard
                            icon={<ChartIcon />}
                            title="Expense Analytics"
                            description="Understand your fuel expenses through useful statistics and charts."
                        />

                        <FeatureCard
                            icon={<VehicleStatsIcon />}
                            title="Vehicle Statistics"
                            description="See vehicle-wise fuel usage, expenses, mileage, and activity."
                        />

                        <FeatureCard
                            icon={<TripStatsIcon />}
                            title="Trip Statistics"
                            description="Analyze individual trips and understand their fuel performance."
                        />
                    </div>
                </section>
            </main>

            <footer className="landing-footer">
                <span>
                    © {new Date().getFullYear()} Petrol Khata
                </span>

                <span>
                    Simple. Organized. Smarter.
                </span>
            </footer>
        </div>
    );
}


function FeatureCard({
    icon,
    title,
    description,
}) {
    return (
        <div className="landing-feature-card">
            <div className="landing-feature-icon">
                {icon}
            </div>

            <h3>{title}</h3>

            <p>{description}</p>
        </div>
    );
}


function ProtectedApp() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        async function loadSession() {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            setSession(session);
            setLoading(false);
        }

        loadSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        function handleEscape(event) {
            if (event.key === "Escape") {
                setSidebarOpen(false);
            }
        }

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, []);

    useEffect(() => {
        if (!sidebarOpen) {
            document.body.classList.remove(
                "sidebar-drawer-open"
            );

            return;
        }

        document.body.classList.add(
            "sidebar-drawer-open"
        );

        return () => {
            document.body.classList.remove(
                "sidebar-drawer-open"
            );
        };
    }, [sidebarOpen]);

    if (loading) {
        return (
            <div className="app">
                <main className="main-content">
                    <div className="app-loading">
                        <div className="app-loading-spinner"></div>

                        <span>
                            Loading Petrol Khata...
                        </span>
                    </div>
                </main>
            </div>
        );
    }

    if (!session) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return (
        <div className="app">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {sidebarOpen && (
                <button
                    type="button"
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close navigation"
                />
            )}

            <div className="main-content">
                <header className="top-header">
                    <button
                        type="button"
                        className="mobile-menu-button"
                        onClick={() =>
                            setSidebarOpen(true)
                        }
                        aria-label="Open navigation"
                        aria-expanded={sidebarOpen}
                    >
                        <MenuIcon />
                    </button>

                    <div className="top-header-spacer"></div>

                    <ProfileMenu />
                </header>

                <Routes>
                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/vehicles"
                        element={<Vehicles />}
                    />

                    <Route
                        path="/vehicles/:id"
                        element={<VehicleDetails />}
                    />

                    <Route
                        path="/entries"
                        element={<FuelEntries />}
                    />

                    <Route
                        path="/trips"
                        element={<Trips />}
                    />

                    <Route
                        path="/analytics"
                        element={<Analytics />}
                    />

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />

                    <Route
                        path="*"
                        element={<NotFound />}
                    />
                </Routes>
            </div>
        </div>
    );
}


function NotFound() {
    return (
        <main className="page">
            <div className="page-header">
                <div>
                    <span className="page-eyebrow">
                        ERROR
                    </span>

                    <h1>404</h1>

                    <p>Page not found</p>
                </div>
            </div>

            <div className="empty-state">
                The page you're looking for doesn't
                exist.
            </div>
        </main>
    );
}


function CarIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 17h14" />
            <path d="M6 17v-5l1.5-5h9L18 12v5" />
            <path d="M4 12h16" />
            <circle cx="7" cy="17" r="1.5" />
            <circle cx="17" cy="17" r="1.5" />
        </svg>
    );
}


function FuelIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 3h8v18H6z" />
            <path d="M8.5 6h3" />
            <path d="M14 7h2l3 3v7" />
            <path d="M19 17h1" />
            <circle cx="18" cy="19" r="1" />
        </svg>
    );
}


function RouteIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="6" cy="19" r="2" />
            <circle cx="18" cy="5" r="2" />
            <path d="M8 18c4-1 6-3 6-7V7" />
            <path d="M14 7l2-2 2 2" />
        </svg>
    );
}


function ChartIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 19V5" />
            <path d="M4 19h16" />
            <path d="M7 15l3-4 3 2 5-7" />
            <path d="M15 6h3v3" />
        </svg>
    );
}


function VehicleStatsIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M8 16v-3" />
            <path d="M12 16V8" />
            <path d="M16 16v-5" />
        </svg>
    );
}


function TripStatsIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="6" cy="18" r="2" />
            <circle cx="18" cy="6" r="2" />
            <path d="M8 18h3a4 4 0 0 0 4-4v-2" />
            <path d="m13 9 2-2 2 2" />
        </svg>
    );
}


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<LandingPage />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />

                <Route
                    path="*"
                    element={<ProtectedApp />}
                />
            </Routes>
        </BrowserRouter>
    );
}


export default App;