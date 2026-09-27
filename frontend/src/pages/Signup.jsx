import { useState } from "react";
import {
    Link,
    useNavigate,
} from "react-router-dom";

import supabase from "../supabase";


function SignupLogoIcon() {
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


function CheckIcon() {
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
            <path d="m5 12 4 4L19 6" />
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


function Signup() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSignup(event) {
        event.preventDefault();

        setError("");
        setMessage("");

        if (password !== confirmPassword) {
            setError(
                "Passwords do not match."
            );
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );
            return;
        }

        setLoading(true);

        const {
            data,
            error: signupError,
        } = await supabase.auth.signUp({
            email,
            password,
        });

        if (signupError) {
            setError(signupError.message);
            setLoading(false);
            return;
        }

        if (data.session) {
            navigate("/dashboard");
            return;
        }

        setMessage(
            "Account created. Please check your email and click the confirmation link to verify your account."
        );

        setLoading(false);
    }

    return (
        <div className="auth-page">
            <div className="auth-background-decoration auth-decoration-one" />
            <div className="auth-background-decoration auth-decoration-two" />

            <main className="auth-container">
                <section className="auth-card auth-signup-card">
                    <Link
                        to="/"
                        className="auth-brand"
                    >
                        <span className="auth-brand-icon">
                            <SignupLogoIcon />
                        </span>

                        <span>
                            Petrol Khata
                        </span>
                    </Link>

                    <div className="auth-heading">
                        <span className="auth-eyebrow">
                            GET STARTED
                        </span>

                        <h1>
                            Create your account
                        </h1>

                        <p>
                            Start organizing your vehicles,
                            fuel expenses, trips, and
                            performance today.
                        </p>
                    </div>

                    <form
                        className="auth-form"
                        onSubmit={handleSignup}
                    >
                        <div className="auth-form-group">
                            <label htmlFor="signup-email">
                                Email address
                            </label>

                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">
                                    <MailIcon />
                                </span>

                                <input
                                    id="signup-email"
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
                            <label htmlFor="signup-password">
                                Password
                            </label>

                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">
                                    <LockIcon />
                                </span>

                                <input
                                    id="signup-password"
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
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                    minLength={6}
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

                        <div className="auth-form-group">
                            <label htmlFor="signup-confirm-password">
                                Confirm password
                            </label>

                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">
                                    <LockIcon />
                                </span>

                                <input
                                    id="signup-confirm-password"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        confirmPassword
                                    }
                                    onChange={(event) =>
                                        setConfirmPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                    minLength={6}
                                    required
                                />

                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (value) =>
                                                !value
                                        )
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    <EyeIcon
                                        hidden={
                                            showConfirmPassword
                                        }
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="auth-password-note">
                            <span className="auth-password-note-icon">
                                <CheckIcon />
                            </span>

                            <span>
                                Password must contain at
                                least 6 characters.
                            </span>
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

                        {message && (
                            <div
                                className="auth-message auth-success"
                                role="status"
                            >
                                <span className="auth-message-icon">
                                    <SuccessIcon />
                                </span>

                                <span>
                                    {message}
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
                                    ? "Creating account..."
                                    : "Create account"}
                            </span>

                            {!loading && (
                                <ArrowIcon />
                            )}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>
                            Already have an account?
                        </span>
                    </div>

                    <Link
                        to="/login"
                        className="auth-secondary-button"
                    >
                        Sign in
                    </Link>

                    <p className="auth-footer">
                        You will receive a confirmation
                        email if email verification is
                        enabled for your account.
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


function SuccessIcon() {
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
            <path d="m8 12 2.5 2.5L16 9" />
        </svg>
    );
}


export default Signup;