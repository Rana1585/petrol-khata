import { useState } from "react";
import {
    Link,
    useNavigate,
} from "react-router-dom";

import supabase from "../supabase";


function LoginLogoIcon() {
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


function MailIcon() {
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
                y="5"
                width="18"
                height="14"
                rx="2"
            />
            <path d="m3 7 9 6 9-6" />
        </svg>
    );
}


function LockIcon() {
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
                x="4"
                y="10"
                width="16"
                height="11"
                rx="2"
            />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
    );
}


function EyeIcon({ hidden = false }) {
    if (hidden) {
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
                <path d="m3 3 18 18" />
                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5 0 8.8 4 10 8a11.8 11.8 0 0 1-2.3 4.1" />
                <path d="M6.6 6.6C4.7 7.9 3.4 10 2 12c1.2 4 5 8 10 8a10.6 10.6 0 0 0 4.1-.8" />
            </svg>
        );
    }

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
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
            <circle
                cx="12"
                cy="12"
                r="2.5"
            />
        </svg>
    );
}


function ArrowIcon() {
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
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
        </svg>
    );
}


function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] =
        useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        const {
            error: loginError,
        } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (loginError) {
            setError(loginError.message);
            setLoading(false);
            return;
        }

        navigate("/dashboard");
    }

    return (
        <div className="auth-page">
            <div className="auth-background-decoration auth-decoration-one" />
            <div className="auth-background-decoration auth-decoration-two" />

            <main className="auth-container">
                <section className="auth-card">
                    <Link
                        to="/"
                        className="auth-brand"
                    >
                        <span className="auth-brand-icon">
                            <LoginLogoIcon />
                        </span>

                        <span>
                            Petrol Khata
                        </span>
                    </Link>

                    <div className="auth-heading">
                        <span className="auth-eyebrow">
                            WELCOME BACK
                        </span>

                        <h1>
                            Sign in to your account
                        </h1>

                        <p>
                            Manage your vehicles, fuel
                            records, trips, and expenses
                            from one place.
                        </p>
                    </div>

                    <form
                        className="auth-form"
                        onSubmit={handleLogin}
                    >
                        <div className="auth-form-group">
                            <label htmlFor="login-email">
                                Email address
                            </label>

                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">
                                    <MailIcon />
                                </span>

                                <input
                                    id="login-email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="auth-form-group">
                            <div className="auth-label-row">
                                <label htmlFor="login-password">
                                    Password
                                </label>
                            </div>

                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">
                                    <LockIcon />
                                </span>

                                <input
                                    id="login-password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            (value) =>
                                                !value
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    <EyeIcon
                                        hidden={
                                            showPassword
                                        }
                                    />
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div
                                className="auth-message auth-error"
                                role="alert"
                            >
                                <span className="auth-message-icon">
                                    <ErrorIcon />
                                </span>

                                <span>
                                    {error}
                                </span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="auth-submit-button"
                            disabled={loading}
                        >
                            <span>
                                {loading
                                    ? "Signing in..."
                                    : "Sign in"}
                            </span>

                            {!loading && (
                                <ArrowIcon />
                            )}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>
                            New to Petrol Khata?
                        </span>
                    </div>

                    <Link
                        to="/signup"
                        className="auth-secondary-button"
                    >
                        Create an account
                    </Link>

                    <p className="auth-footer">
                        By continuing, you agree to use
                        Petrol Khata for managing your
                        personal vehicle records.
                    </p>
                </section>
            </main>
        </div>
    );
}


function ErrorIcon() {
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
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
        </svg>
    );
}


export default Login;