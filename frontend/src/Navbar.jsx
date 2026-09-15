import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">
                <h2>⛽ Petrol Khata</h2>
            </div>

            <div className="menu">
                <Link to="/">Dashboard</Link>
                <Link to="/analytics">Analytics</Link>
                <Link to="/graphs">Graphs</Link>
            </div>
        </nav>
    );
}

export default Navbar;