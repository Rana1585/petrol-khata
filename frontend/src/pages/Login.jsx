import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Fuel,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import supabase from "../supabase";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    navigate("/vehicles");
  }

  return (
    <div className="pk-login-page">
      <div className="pk-login-decoration pk-login-decoration-one" />
      <div className="pk-login-decoration pk-login-decoration-two" />

      <main className="pk-login-shell">
        <section className="pk-login-card">
          <Link to="/" className="pk-login-brand">
            <span className="pk-login-brand-icon">
              <Fuel />
            </span>

            <span className="pk-login-brand-copy">
              <strong>Petrol Khata</strong>
              <small>Fuel management</small>
            </span>
          </Link>

          <header className="pk-login-heading">
            <span className="pk-login-eyebrow">
              WELCOME BACK
            </span>

            <h1>Sign in to your account</h1>

            <p>
              Manage your vehicles, fuel records, trips,
              and expenses from one place.
            </p>
          </header>

          <form
            className="pk-login-form"
            onSubmit={handleLogin}
          >
            <div className="pk-login-field">
              <label htmlFor="login-email">
                Email address
              </label>

              <div className="pk-login-input">
                <Mail className="pk-login-input-icon" />

                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="pk-login-field">
              <label htmlFor="login-password">
                Password
              </label>

              <div className="pk-login-input">
                <LockKeyhole className="pk-login-input-icon" />

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="pk-login-password-toggle"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="pk-login-error"
                role="alert"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="pk-login-submit"
              disabled={loading}
            >
              <span>
                {loading ? "Signing in..." : "Sign in"}
              </span>

              {!loading && <ArrowRight />}
            </button>
          </form>

          <div className="pk-login-divider">
            <span>New to Petrol Khata?</span>
          </div>

          <Link
            to="/signup"
            className="pk-login-create"
          >
            Create an account
          </Link>

          <div className="pk-login-security">
            <ShieldCheck />

            <span>
              Your account is securely authenticated.
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}