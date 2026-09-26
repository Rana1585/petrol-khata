import {
    NavLink,
    useLocation,
} from "react-router-dom";


const navigationGroups = [
    {
        title: "OVERVIEW",
        items: [
            {
                label: "Dashboard",
                path: "/dashboard",
                icon: DashboardIcon,
            },
        ],
    },
    {
        title: "MANAGEMENT",
        items: [
            {
                label: "Vehicles",
                path: "/vehicles",
                icon: VehicleIcon,
            },
            {
                label: "Fuel Entries",
                path: "/entries",
                icon: FuelIcon,
            },
            {
                label: "Trips",
                path: "/trips",
                icon: RouteIcon,
            },
            {
                label: "Analytics",
                path: "/analytics",
                icon: AnalyticsIcon,
            },
        ],
    },
];


function Sidebar({
    isOpen = false,
    onClose = () => {},
}) {
    const location = useLocation();

    return (
        <aside
            className={`sidebar ${
                isOpen ? "sidebar-open" : ""
            }`}
            aria-label="Main navigation"
        >
            <div className="sidebar-inner">
                <div className="sidebar-header">
                    <NavLink
                        to="/dashboard"
                        className="sidebar-brand"
                        onClick={onClose}
                    >
                        <span className="sidebar-logo">
                            <LogoIcon />
                        </span>

                        <span className="sidebar-brand-text">
                            <strong>Petrol Khata</strong>
                            <small>
                                Fuel management
                            </small>
                        </span>
                    </NavLink>

                    <button
                        type="button"
                        className="sidebar-close-button"
                        onClick={onClose}
                        aria-label="Close navigation"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className="sidebar-divider" />

                <nav className="sidebar-nav">
                    {navigationGroups.map((group) => (
                        <div
                            className="sidebar-section"
                            key={group.title}
                        >
                            <span className="sidebar-section-title">
                                {group.title}
                            </span>

                            <div className="sidebar-section-links">
                                {group.items.map((item) => {
                                    const Icon = item.icon;

                                    const isVehicleDetailsPage =
                                        item.path ===
                                            "/vehicles" &&
                                        location.pathname.startsWith(
                                            "/vehicles/"
                                        );

                                    return (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            end={
                                                item.path ===
                                                "/dashboard"
                                            }
                                            onClick={onClose}
                                            className={({ isActive }) =>
                                                isActive ||
                                                isVehicleDetailsPage
                                                    ? "sidebar-link active"
                                                    : "sidebar-link"
                                            }
                                        >
                                            <span className="sidebar-icon">
                                                <Icon />
                                            </span>

                                            <span className="sidebar-link-label">
                                                {item.label}
                                            </span>

                                            <span className="sidebar-link-indicator">
                                                <ChevronIcon />
                                            </span>
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="sidebar-spacer" />

                <div className="sidebar-footer">
                    <div className="sidebar-footer-card">
                        <span className="sidebar-footer-icon">
                            <ClockIcon />
                        </span>

                        <span className="sidebar-footer-content">
                            <strong>
                                Stay organized
                            </strong>

                            <small>
                                Track every journey.
                            </small>
                        </span>
                    </div>

                    <div className="sidebar-footer-brand">
                        <strong>Petrol Khata</strong>
                        <small>
                            Personal vehicle manager
                        </small>
                    </div>
                </div>
            </div>
        </aside>
    );
}


function LogoIcon() {
    return (
        <svg
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


function DashboardIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect
                x="3"
                y="3"
                width="7"
                height="7"
                rx="1"
            />
            <rect
                x="14"
                y="3"
                width="7"
                height="7"
                rx="1"
            />
            <rect
                x="3"
                y="14"
                width="7"
                height="7"
                rx="1"
            />
            <rect
                x="14"
                y="14"
                width="7"
                height="7"
                rx="1"
            />
        </svg>
    );
}


function VehicleIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M5 17h14" />
            <path d="M6 17v-5l1.5-5h9L18 12v5" />
            <path d="M4 12h16" />
            <circle
                cx="7"
                cy="17"
                r="1.5"
            />
            <circle
                cx="17"
                cy="17"
                r="1.5"
            />
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
            aria-hidden="true"
        >
            <path d="M6 3h8v18H6z" />
            <path d="M8.5 6h3" />
            <path d="M14 7h2l3 3v7" />
            <path d="M19 17h1" />
            <circle
                cx="18"
                cy="19"
                r="1"
            />
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
            aria-hidden="true"
        >
            <circle
                cx="6"
                cy="19"
                r="2"
            />
            <circle
                cx="18"
                cy="5"
                r="2"
            />
            <path d="M8 18c4-1 6-3 6-7V7" />
            <path d="M14 7l2-2 2 2" />
        </svg>
    );
}


function AnalyticsIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M4 19V5" />
            <path d="M4 19h16" />
            <path d="M7 15l3-4 3 2 5-7" />
            <path d="M15 6h3v3" />
        </svg>
    );
}


function ChevronIcon() {
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
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}


function ClockIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle
                cx="12"
                cy="12"
                r="9"
            />
            <path d="M12 8v4l2.5 2.5" />
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


export default Sidebar;