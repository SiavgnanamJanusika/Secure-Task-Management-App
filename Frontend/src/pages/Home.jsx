import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__bg" aria-hidden="true" />
        <div className="hero__content">
          <span className="eyebrow">Welcome back, {user?.username}</span>
          <h1 className="hero__title">J2A Secure Task</h1>
          <p className="hero__subtitle">
            A locked-down workspace for planning, tracking, and closing out work — built on
            role-based access, hashed credentials, and an audit-ready task history.
          </p>
          <div className="hero__actions">
            <Link to="/task" className="btn btn--primary">Log a task</Link>
            <Link to="/dashboard" className="btn btn--ghost-inverse">View dashboard</Link>
          </div>
        </div>
      </section>

      <section className="feature-grid">
        <div className="feature-card">
          <div className="feature-card__bg feature-card__bg--teal" aria-hidden="true" />
          <h3>Task tracking</h3>
          <p>Log a task with a name, description, and duration, then move it through pending, in progress, and completed.</p>
          <Link to="/task" className="feature-card__link">Open Task →</Link>
        </div>
        <div className="feature-card">
          <div className="feature-card__bg feature-card__bg--violet" aria-hidden="true" />
          <h3>Role-based dashboards</h3>
          <p>Regular users see their own completed work and durations. Admins see task creation tools and full user history.</p>
          <Link to="/dashboard" className="feature-card__link">Open Dashboard →</Link>
        </div>
        <div className="feature-card">
          <div className="feature-card__bg feature-card__bg--amber" aria-hidden="true" />
          <h3>Account control</h3>
          <p>Update your username and password at any time. Your email stays fixed as your permanent identifier.</p>
          <Link to="/profile" className="feature-card__link">Open Profile →</Link>
        </div>
      </section>
    </div>
  )
}
