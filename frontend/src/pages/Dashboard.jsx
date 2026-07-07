import { useAuth } from "../context/AuthContext.jsx";
import TaskList from "../components/tasks/TaskList.jsx";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="page-body">
      <div className="section-heading">
        <h1>{String(user?.role || "").trim().toLowerCase() === "admin" ? "All tasks" : "Your tasks"}</h1>
        <span className="count">Signed in as {user?.email}</span>
      </div>
      <TaskList />
    </div>
  );
}
