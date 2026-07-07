export default function DashboardCard({ title, value, subtitle }) {
    return (
      <div className="dash-card">
        <h4>{title}</h4>
        <p style={{ fontSize: '1.6rem', margin: '0.3rem 0' }}>{value}</p>
        {subtitle && <small>{subtitle}</small>}
      </div>
    );
  }
  