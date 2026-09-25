import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "./supabase";

function Sidebar() {
    const navigate = useNavigate();

    async function handleLogout() {
        await supabase.auth.signOut();
        navigate("/login");
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="sidebar-logo">
                    ⛽
                </div>

                <div>
                    <h2>Petrol Khata</h2>
                    <span>Vehicle manager</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="sidebar-section">
                    <span className="sidebar-section-title">
                        MAIN
                    </span>

                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            isActive
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                    >
                        <span className="sidebar-icon">
                            🚗
                        </span>

                        <span>Vehicles</span>
                    </NavLink>

                    <NavLink
                        to="/entries"
                        className={({ isActive }) =>
                            isActive
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                    >
                        <span className="sidebar-icon">
                            ⛽
                        </span>

                        <span>Fuel Entries</span>
                    </NavLink>

                    <NavLink
                        to="/trips"
                        className={({ isActive }) =>
                            isActive
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                    >
                        <span className="sidebar-icon">
                            🛣️
                        </span>

                        <span>Trips</span>
                    </NavLink>

                    <NavLink
                        to="/analytics"
                        className={({ isActive }) =>
                            isActive
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                    >
                        <span className="sidebar-icon">
                            📊
                        </span>

                        <span>Analytics</span>
                    </NavLink>
                </div>
            </nav>

            <div className="sidebar-footer">
                <span>Petrol Khata</span>

                <small>
                    Personal vehicle manager
                </small>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="logout-button"
                >
                    Log out
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;