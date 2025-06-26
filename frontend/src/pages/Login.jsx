import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Login.css"; // استيراد ملف التنسيق الخارجي

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    const credentials = {
      admin: { email: "admin@eventpro.com", password: "admin123" },
      organizer: { email: "organizer@eventpro.com", password: "organizer123" },
      subscriber: { email: "user@eventpro.com", password: "user123" },
    };
    const creds = credentials[role];
    if (creds) setFormData(creds);
  };

  return (
    <main className="login-main">
      <section className="login-section">
        <h1>Sign In</h1>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>
          <input
            className="login-input"
            type="email"
            name="email"
            id="email"
            required
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />

          <label htmlFor="password">Password</label>
          <input
            className="login-input"
            type="password"
            name="password"
            id="password"
            required
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="lg-button"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="demo-container">
          <p className="demo-title">Demo Accounts (click to fill):</p>
          <div className="demo-buttons">
            <button
              type="button"
              className="demo-button"
              onClick={() => fillDemoCredentials("admin")}
            >
              Admin
            </button>
            <button
              type="button"
              className="demo-button"
              onClick={() => fillDemoCredentials("organizer")}
            >
              Organizer
            </button>
            <button
              type="button"
              className="demo-button"
              onClick={() => fillDemoCredentials("subscriber")}
            >
              Subscriber
            </button>
          </div>
        </div>

        <p className="signup-text">
          Don't have an account?{" "}
          <Link to="/signup">Sign up here</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
