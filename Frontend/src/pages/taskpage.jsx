import { useEffect, useState } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'

const TaskPage = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    duration: '',
    status: 'pending',
    assigned_to: ''
  })

  const fetchData = async () => {
    const [tasksRes] = await Promise.all([
      api.get('/tasks'),
      isAdmin ? api.get('/users') : Promise.resolve({ data: [] }),
    ])
    setTasks(tasksRes.data)
    if (isAdmin) {
      const usersRes = await api.get('/users')
      setUsers(usersRes.data)
    }
  }

  useEffect(() => {
    fetchData().catch(() => setMessage('Failed to load tasks'))
  }, [isAdmin])

  const createTask = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      await api.post('/tasks', {
        title: form.title,
        description: form.description,
        duration: form.duration,
        status: form.status,
        assigned_to: form.assigned_to || null,
      })
      setMessage('Task created successfully')
      setForm({ title: '', description: '', duration: '', status: 'pending', assigned_to: '' })
      fetchData()
    } catch (err) {
      setMessage(err?.response?.data?.detail || 'Failed to create task')
    }
  }

  const completeTask = async (taskId) => {
    setMessage('')
    try {
      await api.post(`/tasks/${taskId}/complete`, { status: 'completed' })
      setMessage('Task marked completed')
      fetchData()
    } catch (err) {
      setMessage(err?.response?.data?.detail || 'Failed to complete task')
    }
  }

  return (
    <section className="page">
      <div className="page-head">
        <h1>Task</h1>
        <p>{isAdmin ? 'Admin can create and assign tasks here.' : 'Your assigned tasks are shown below.'}</p>
      </div>

      {isAdmin && (
        <form className="panel form-grid" onSubmit={createTask}>
          <h2>Create Task</h2>
          <input placeholder="Task Name" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input placeholder="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="pending">pending</option>
            <option value="in_progress">in_progress</option>
            <option value="completed">completed</option>
          </select>
          <select value={form.assigned_to} onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}>
            <option value="">Assign later / Unassigned</option>
            {users.filter(u => u.role === 'user').map((u) => (
              <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
            ))}
          </select>
          <button className="btn btn-primary">Submit</button>
        </form>
      )}

      {message && <div className="alert">{message}</div>}

      <div className="panel">
        <h2>{isAdmin ? 'All Tasks' : 'Assigned Tasks'}</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Description</th>
                <th>Duration</th>
                <th>Status</th>
                {isAdmin && <th>Assigned To</th>}
                {!isAdmin && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.duration}</td>
                  <td><span className={`badge ${task.status}`}>{task.status}</span></td>
                  {isAdmin && <td>{task.assigned_to_username || '—'}</td>}
                  {!isAdmin && (
                    <td>
                      <button className="btn btn-small" onClick={() => completeTask(task.id)}>Mark Completed</button>
                    </td>
                  )}
                </tr>
              ))}
              {!tasks.length && (
                <tr>
                  <td colSpan={isAdmin ? 5 : 5}>No tasks found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default TaskPage
