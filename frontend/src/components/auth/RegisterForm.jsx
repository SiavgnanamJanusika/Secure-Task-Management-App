import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { isValidEmail, isValidPassword, PASSWORD_HINT, EMAIL_HINT } from "../../utils/validators.js";

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [banner, setBanner] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.full_name.trim()) errs.full_name = "Full name is required.";
    if (!isValidEmail(form.email)) errs.email = EMAIL_HINT;
    if (!isValidPassword(form.password)) errs.password = PASSWORD_HINT;
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register(form);
      navigate("/login", { state: { justRegistered: true } });
    } catch (err) {
      setBanner(err.response?.data?.detail || "Registration failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-eyebrow">Get started</div>
      <h1 className="auth-title">Create your account</h1>
      <p className="auth-sub">Track your work, your way.</p>

      {banner && <div className="banner-error">{banner}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="full_name">Full name</label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Jane Doe"
          />
          {fieldErrors.full_name && <div className="field-error">{fieldErrors.full_name}</div>}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="name@example.com"
          />
          {fieldErrors.email ? (
            <div className="field-error">{fieldErrors.email}</div>
          ) : (
            <div className="field-hint">{EMAIL_HINT}</div>
          )}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
          {fieldErrors.password ? (
            <div className="field-error">{fieldErrors.password}</div>
          ) : (
            <div className="field-hint">{PASSWORD_HINT}</div>
          )}
        </div>

        <button className="primary-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <div className="auth-switch">
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </div>
  );
}
