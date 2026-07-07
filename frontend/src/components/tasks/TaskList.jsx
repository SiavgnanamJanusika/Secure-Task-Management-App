import { useEffect, useState } from "react";
import TaskCard from "./TaskCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  listTasksRequest,
  createTaskRequest,
  updateTaskRequest,
  deleteTaskRequest,
  listUsersRequest,
} from "../../api/taskApi.js";

const emptyTask = { title: "", description: "", assigned_to: "" };

export default function TaskList() {
  const { user } = useAuth();
  const isAdmin = String(user?.role || "").trim().toLowerCase() === "admin";

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState(emptyTask);
  const [isCreating, setIsCreating] = useState(false);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const data = await listTasksRequest();
      setTasks(data);
      setError("");
    } catch (err) {
      setError("Could not load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await listUsersRequest();
      setUsers(data);
    } catch (err) {
      // Non-fatal: assignee dropdown just stays empty.
    }
  };

  useEffect(() => {
    loadTasks();
    if (isAdmin) loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.assigned_to) return;

    setIsCreating(true);
    try {
      const created = await createTaskRequest(newTask);
      setTasks((prev) => [created, ...prev]);
      setNewTask(emptyTask);
      setError("");
    } catch (err) {
      setError("Could not create the task.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      const updated = await updateTaskRequest(taskId, { status });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    } catch (err) {
      setError("Could not update the task's status.");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTaskRequest(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      setError("Could not delete the task.");
    }
  };

  return (
    <>
      {isAdmin && (
        <form className="task-form" onSubmit={handleCreate}>
          <div className="task-form-row">
            <div className="field">
              <label htmlFor="title">Task title</label>
              <input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Write the quarterly report"
              />
            </div>
            <div className="field">
              <label htmlFor="description">Notes (optional)</label>
              <input
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Due Friday, needs sign-off"
              />
            </div>
            <div className="field">
              <label htmlFor="assigned_to">Assign to</label>
              <select
                id="assigned_to"
                value={newTask.assigned_to}
                onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
              >
                <option value="">Select a user…</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.full_name || u.email} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button className="primary-btn" type="submit" disabled={isCreating}>
            {isCreating ? "Assigning…" : "Assign task"}
          </button>
        </form>
      )}

      {error && <div className="banner-error">{error}</div>}

      {isLoading ? (
        <p className="loading-line">Loading tasks…</p>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <strong>No tasks yet</strong>
          {isAdmin ? "Assign your first task above." : "Nothing has been assigned to you yet."}
        </div>
      ) : (
        <div className="ledger">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isAdmin={isAdmin}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}



