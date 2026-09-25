import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import { useEffect, useState } from "react";

import Sidebar from "./Sidebar";
import ProfileMenu from "./ProfileMenu";

import Vehicles from "./pages/Vehicles";
import FuelEntries from "./pages/FuelEntries";
import Trips from "./pages/Trips";
import VehicleDetails from "./pages/VehicleDetails";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import { supabase } from "./supabase";

function NotFound() {
    return (
        <main className="page">
            <div className="page-header">
                <div>
                    <h1>404</h1>
                    <p>Page not found</p>
                </div>
            </div>

            <div className="empty-state">
                The page you're looking for doesn't exist.
            </div>
        </main>
    );
}

function ProtectedApp() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="app">
                <main className="main-content">
                    <div className="empty-state">
                        Loading...
                    </div>
                </main>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="app">
            <Sidebar />

            <div className="main-content">
                <header className="top-header">
                    <div></div>

                    <ProfileMenu />
                </header>

                <Routes>
                    <Route
                        path="/"
                        element={<Vehicles />}
                    />

                    <Route
                        path="/vehicles"
                        element={<Vehicles />}
                    />

                    <Route
                        path="/vehicles/:id"
                        element={
                            <VehicleDetails />
                        }
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
                        path="*"
                        element={<NotFound />}
                    />
                </Routes>
            </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
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