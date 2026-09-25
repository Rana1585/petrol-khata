
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../supabase";

function Signup() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSignup(event) {
        event.preventDefault();

        setError("");
        setMessage("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );
            return;
        }

        setLoading(true);

        const { data, error } =
            await supabase.auth.signUp({
                email,
                password,
            });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        if (data.session) {
            navigate("/");
            return;
        }

        setMessage(
            "Account created. Please check your email and click the confirmation link to verify your account."
        );

        setLoading(false);
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Create Account</h1>

                <p className="auth-subtitle">
                    Create your Petrol Khata account.
                </p>

                <form onSubmit={handleSignup}>
                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(
                                    event.target.value
                                )
                            }
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="auth-success">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="primary-button auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Create Account"}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
