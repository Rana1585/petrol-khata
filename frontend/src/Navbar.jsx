import { NavLink } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">
                <h2>⛽ Petrol Khata</h2>
            </div>

            <div className="menu">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                    end
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/analytics"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Analytics
                </NavLink>

                <NavLink
                    to="/graphs"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Graphs
                </NavLink>

                <NavLink
                    to="/pump-car-stats"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Pump & Car Stats
                </NavLink>
            </div>
        </nav>
    );
}

export default Navbar;