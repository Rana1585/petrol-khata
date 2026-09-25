import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";

function ProfileMenu() {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadUser() {
            const {
                data: { user }
            } = await supabase.auth.getUser();

            if (user?.email) {
                setEmail(user.email);
            }
        }

        loadUser();
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
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

    async function handleLogout() {
        await supabase.auth.signOut();
        navigate("/login");
    }

    function handleManageVehicles() {
        setOpen(false);
        navigate("/");
    }

    return (
        <div className="profile-menu" ref={menuRef}>
            <button
                type="button"
                className="profile-button"
                onClick={() => setOpen(!open)}
            >
                <span className="profile-avatar">
                    👤
                </span>

                <span className="profile-email">
                    {email || "Account"}
                </span>

                <span className="profile-arrow">
                    {open ? "▲" : "▼"}
                </span>
            </button>

            {open && (
                <div className="profile-dropdown">
                    <button
                        type="button"
                        onClick={handleManageVehicles}
                    >
                        🚗
                        <span>Manage Vehicles</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleLogout}
                    >
                        ↪
                        <span>Log out</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProfileMenu;