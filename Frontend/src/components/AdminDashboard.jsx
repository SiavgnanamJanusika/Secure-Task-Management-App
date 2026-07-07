import { useEffect, useState } from 'react';
import { adminListUsers, adminTasksHistory, adminCreateTaskForUser } from '../services/dashboardService';
import TaskForm from '../components/TaskForm';
import '../styles/Dashboard.css';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  const load = async () => {
    setUsers(await adminListUsers());
    setHistory(await adminTasksHistory());
  };

  useEffect(() => { load(); }, []);

  const handleAssign = async (payload) => {
    if (!selectedUser) return;
    await adminCreateTaskForUser(selectedUser, payload);
    await load();
  };

  return (
    <div className="dashboard-page">
      <h2>Admin Dashboard</h2>
      <div className="admin-assign">
        <h3>Create Task for User</h3>
        <label>Choose User
          <select value={selectedUser} onChange={e=>setSelectedUser(e.target.value)}>
            <option value="">-- select --</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.username} ({u.email})</option>)}
          </select>
        </label>
        <TaskForm onSubmit={handleAssign} submitLabel="Assign Task" />
      </div>
      <h3>Tasks History</h3>
      <ul className="task-table">
        {history.map(h => (
          <li key={h.id}>
            <span>{h.name}</span>
            <span>{h.duration} min</span>
            <span className={`badge ${h.status}`}>{h.status}</span>
            <span>User ID: {h.owner_id}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
