
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import Sidebar from "./Sidebar";
import Vehicles from "./pages/Vehicles";
import FuelEntries from "./pages/FuelEntries";
import Trips from "./pages/Trips";
import VehicleDetails from "./pages/VehicleDetails";
import Analytics from "./pages/Analytics";

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

function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <Sidebar />

                <div className="main-content">
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
                            path="*"
                            element={<NotFound />}
                        />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
