import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import { supabase } from "./supabase";


function ProfileMenu() {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");

    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;

        async function loadUser() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (
                mounted &&
                user?.email
            ) {
                setEmail(user.email);
            }
        }

        loadUser();

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                menuRef.current &&
                !menuRef.current.contains(
                    event.target
                )
            ) {
                setOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    useEffect(() => {
        function handleEscape(event) {
            if (event.key === "Escape") {
                setOpen(false);
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

    async function handleLogout() {
        setOpen(false);

        await supabase.auth.signOut();

        navigate("/login", {
            replace: true,
        });
    }

    function handleManageVehicles() {
        setOpen(false);
        navigate("/vehicles");
    }

    function getInitial() {
        if (!email) {
            return "U";
        }

        return email
            .trim()
            .charAt(0)
            .toUpperCase();
    }

    return (
        <div
            className={`profile-menu ${
                open ? "is-open" : ""
            }`}
            ref={menuRef}
        >
            <button
                type="button"
                className="profile-button"
                onClick={() =>
                    setOpen((value) => !value)
                }
                aria-expanded={open}
                aria-haspopup="menu"
            >
                <span className="profile-avatar">
                    {getInitial()}
                </span>

                <span className="profile-details">
                    <span className="profile-account-label">
                        Account
                    </span>

                    <span className="profile-email">
                        {email || "Loading..."}
                    </span>
                </span>

                <span className="profile-arrow">
                    <ChevronDownIcon />
                </span>
            </button>

            {open && (
                <div
                    className="profile-dropdown"
                    role="menu"
                >
                    <div className="profile-dropdown-header">
                        <span className="profile-dropdown-avatar">
                            {getInitial()}
                        </span>

                        <div className="profile-dropdown-user">
                            <strong>
                                {email || "Account"}
                            </strong>

                            <span>
                                Personal account
                            </span>
                        </div>
                    </div>

                    <div className="profile-dropdown-divider" />

                    <button
                        type="button"
                        className="profile-dropdown-item"
                        onClick={handleManageVehicles}
                        role="menuitem"
                    >
                        <span className="profile-dropdown-icon">
                            <VehicleIcon />
                        </span>

                        <span className="profile-dropdown-text">
                            <strong>
                                Manage Vehicles
                            </strong>

                            <small>
                                View and manage your vehicles
                            </small>
                        </span>

                        <span className="profile-dropdown-chevron">
                            <ChevronRightIcon />
                        </span>
                    </button>

                    <button
                        type="button"
                        className="profile-dropdown-item logout"
                        onClick={handleLogout}
                        role="menuitem"
                    >
                        <span className="profile-dropdown-icon">
                            <LogoutIcon />
                        </span>

                        <span className="profile-dropdown-text">
                            <strong>
                                Log out
                            </strong>

                            <small>
                                Sign out of your account
                            </small>
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
}


function ChevronDownIcon() {
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
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}


function ChevronRightIcon() {
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


function LogoutIcon() {
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
            <path d="M10 17l5-5-5-5" />
            <path d="M15 12H3" />
            <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
        </svg>
    );
}


export default ProfileMenu;