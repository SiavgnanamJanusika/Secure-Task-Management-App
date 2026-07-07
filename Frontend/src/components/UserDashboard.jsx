import { useEffect, useState } from 'react';
import { getUserSummary } from '../services/dashboardService';
import DashboardCard from '../components/DashboardCard';
import '../styles/Dashboard.css';

export default function UserDashboard() {
  const [data, setData] = useState({ summary: {}, tasks: [] });

  useEffect(() => {
    (async () => setData(await getUserSummary()))();
  }, []);

  const s = data.summary || {};
  const total = Object.values(s).reduce((acc, v) => acc + (v?.count || 0), 0);
  const totalDuration = Object.values(s).reduce((acc, v) => acc + (v?.total_duration || 0), 0);

  return (
    <div className="dashboard-page">
      <h2>User Dashboard</h2>
      <div className="dash-grid">
        <DashboardCard title="Total Tasks" value={total} />
        <DashboardCard title="Total Duration" value={`${totalDuration} min`} />
        <DashboardCard title="Completed" value={s['completed']?.count || 0} subtitle={`${s['completed']?.total_duration || 0} min`} />
      </div>
      <h3>My Tasks</h3>
      <ul className="task-table">
        {data.tasks.map(t => (
          <li key={t.id}>
            <span>{t.name}</span>
            <span>{t.duration} min</span>
            <span className={`badge ${t.status}`}>{t.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
