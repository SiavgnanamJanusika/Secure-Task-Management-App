import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const from = location.state?.from?.pathname || '/home'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(form.email, form.password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err?.response?.data?.detail || 'Invalid email or password')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-visual">
        <div className="auth-visual__scanline" />
        <div className="auth-visual__grid" />
        <div className="auth-visual__content">
          <span className="auth-visual__mark">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5l-8-3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              <path d="M9 12.2 11.2 14.4 15.4 9.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h1>J2A Secure Task</h1>
          <p className="auth-visual__tag">Encrypted access. Accountable work.</p>
          <div className="auth-visual__readout">
            <p><span className="dot dot--live" /> SESSION&nbsp;&nbsp;awaiting credentials</p>
            <p><span className="dot" /> ENCRYPTION&nbsp;&nbsp;TLS in transit · bcrypt at rest</p>
            <p><span className="dot" /> ACCESS&nbsp;&nbsp;role-scoped (admin / user)</p>
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Sign in</h2>
          <p className="auth-form__subtitle">Enter your credentials to access your dashboard.</p>

          {error && <div className="alert alert--error">{error}</div>}

          <label className="field">
            <span className="field__label">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="field">
            <span className="field__label">Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          <button className="btn btn--primary btn--block" type="submit" disabled={submitting}>
            {submitting ? 'Verifying…' : 'Access account'}
          </button>

          <p className="auth-form__switch">
            Don&apos;t have an account? <Link to="/register">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
