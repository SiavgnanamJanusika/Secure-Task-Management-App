export default function TaskCard({ task, isAdmin, onStatusChange, onDelete }) {
  const formatSriLankaTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-LK", {
      timeZone: "Asia/Colombo",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="ledger-row">
      <span
        className={`tick status-${task.status}`}
        aria-hidden="true"
      />

      <div className="ledger-content">
        <div className="ledger-title">{task.title}</div>

        {task.description && (
          <div className="ledger-desc">
            {task.description}
          </div>
        )}

        {isAdmin && task.assigned_to_name && (
          <div className="ledger-assignee">
            Assigned to: <strong>{task.assigned_to_name}</strong>
          </div>
        )}

        {isAdmin && (
          <div className="ledger-meta">
            {task.created_by && (
              <div>
                <strong>Created By:</strong> {task.created_by}
              </div>
            )}

            {task.created_at && (
              <div>
                <strong>Created At:</strong>{" "}
                {formatSriLankaTime(task.created_at)}
              </div>
            )}

            {task.updated_at && (
              <div>
                <strong>Updated At:</strong>{" "}
                {formatSriLankaTime(task.updated_at)}
              </div>
            )}
          </div>
        )}
      </div>

      <select
        className="status-select"
        value={task.status}
        onChange={(e) => onStatusChange(task.id, e.target.value)}
        aria-label={`Status for ${task.title}`}
      >
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      {isAdmin && (
        <button
          className="delete-btn"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      )}
    </div>
  );
}