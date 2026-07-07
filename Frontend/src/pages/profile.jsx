import { useState } from 'react'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [form, setForm] = useState({
    username: user?.username || '',
    password: '',
    confirmPassword: '',
    currentPassword: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (form.password && form.password !== form.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (!form.currentPassword) {
      setError('Enter your current password to confirm changes')
      return
    }

    const usernameChanged = form.username && form.username !== user.username
    if (!usernameChanged && !form.password) {
      setError('Change your username or password before submitting')
      return
    }

    setSubmitting(true)
    try {
      const payload = { current_password: form.currentPassword }
      if (usernameChanged) payload.username = form.username
      if (form.password) payload.password = form.password

      await api.put('/users/me', payload)
      await refreshUser()
      setSuccess('Profile updated')
      setForm({ ...form, password: '', confirmPassword: '', currentPassword: '' })
    } catch (err) {
      const detail = err?.response?.data?.detail
      setError(Array.isArray(detail) ? detail.map((d) => d.msg).join(' ') : detail || 'Could not update profile')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page page--narrow">
      <div className="page__header">
        <h1>Profile</h1>
        <p>Update your username and password. Your email is fixed and can&apos;t be changed here.</p>
      </div>

      <form className="panel profile-form" onSubmit={handleSubmit}>
        {error && <div className="alert alert--error">{error}</div>}
        {success && <div className="alert alert--success">{success}</div>}

        <label className="field">
          <span className="field__label">Email</span>
          <input type="email" value={user?.email || ''} disabled readOnly />
          <span className="field__hint">Locked — contact an admin if this needs to change.</span>
        </label>

        <label className="field">
          <span className="field__label">Username</span>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            minLength={3}
            maxLength={30}
          />
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field__label">New password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              autoComplete="new-password"
            />
          </label>
          <label className="field">
            <span className="field__label">Confirm new password</span>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </label>
        </div>

        <label className="field">
          <span className="field__label">Current password</span>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            placeholder="Required to confirm any change"
            autoComplete="current-password"
            required
          />
        </label>

        <button className="btn btn--primary" type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}
