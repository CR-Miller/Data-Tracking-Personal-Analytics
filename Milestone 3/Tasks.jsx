import { useState, useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { getTasks, completeTask, deleteTask } from '../services/api';

// ── Reducer for filter/sort state ────────────────────────
const initFilters = { search: '', priority: 'all', status: 'all', sort: 'dueDate' };

function filtersReducer(state, action) {
  switch (action.type) {
    case 'SET': return { ...state, [action.field]: action.value };
    case 'RESET': return initFilters;
    default: return state;
  }
}

// ── Fallback mock data ───────────────────────────────────
const MOCK_TASKS = [
  { id: 1, title: 'CS101 Assignment 3',   course: 'CS101',   dueDate: new Date(Date.now() + 86400000).toISOString(),      priority: 'high',   completed: false, type: 'assignment', description: 'Complete programming exercises 4.1–4.5' },
  { id: 2, title: 'Midterm Exam Prep',    course: 'MATH201', dueDate: new Date(Date.now() + 3 * 86400000).toISOString(), priority: 'high',   completed: false, type: 'exam',       description: 'Review chapters 1–6, practice problems' },
  { id: 3, title: 'Lab Report Draft',     course: 'BIO110',  dueDate: new Date(Date.now() - 86400000).toISOString(),      priority: 'medium', completed: false, type: 'assignment', description: 'Write up experiment results' },
  { id: 4, title: 'Weekly Reading',       course: 'ENG220',  dueDate: new Date(Date.now() + 5 * 86400000).toISOString(), priority: 'low',    completed: true,  type: 'reading',    description: 'Chapters 9–11 of the textbook' },
  { id: 5, title: 'Group Project Slides', course: 'MKT303', dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),  priority: 'medium', completed: false, type: 'project',    description: 'Prepare final presentation deck' },
];

function daysLabel(dateStr, completed) {
  if (completed) return { text: 'Done', cls: 'badge-green' };
  const d = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
  if (d < 0)  return { text: `${Math.abs(d)}d overdue`, cls: 'badge-red' };
  if (d === 0) return { text: 'Due today', cls: 'badge-yellow' };
  if (d <= 2) return { text: `${d}d left`, cls: 'badge-yellow' };
  return { text: `${d}d left`, cls: 'badge-gray' };
}

export default function Tasks() {
  const [tasks,   setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [success, setSuccess] = useState(null);
  const [filters, dispatch]   = useReducer(filtersReducer, initFilters);

  const load = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
      setError(null);
    } catch {
      setTasks(MOCK_TASKS);
      setError('Using demo data — backend not connected.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleComplete = async (id) => {
    try {
      await completeTask(id);
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: true } : t));
      setSuccess('Task marked complete!');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: true } : t));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
    } catch { /* allow mock delete */ }
    setTasks(prev => prev.filter(t => t.id !== id));
    setSuccess('Task deleted.');
    setTimeout(() => setSuccess(null), 3000);
  };

  // ── Filter + sort ──────────────────────────────────────
  const visible = tasks
    .filter(t => {
      const q = filters.search.toLowerCase();
      if (q && !t.title.toLowerCase().includes(q) && !t.course?.toLowerCase().includes(q)) return false;
      if (filters.priority !== 'all' && t.priority !== filters.priority) return false;
      if (filters.status === 'active'    && t.completed) return false;
      if (filters.status === 'completed' && !t.completed) return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sort === 'dueDate')  return new Date(a.dueDate) - new Date(b.dueDate);
      if (filters.sort === 'priority') {
        const p = { high: 0, medium: 1, low: 2 };
        return (p[a.priority] ?? 3) - (p[b.priority] ?? 3);
      }
      return a.title.localeCompare(b.title);
    });

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2>Tasks &amp; Deadlines</h2>
            <p>All your assignments, exams, and study tasks in one place.</p>
          </div>
          <Link to="/add-task" className="btn btn-primary">➕ Add Task</Link>
        </div>
      </div>

      {success && <div className="alert alert-success">✅ {success}</div>}
      {error   && <div className="alert alert-info">ℹ️ {error}</div>}

      {/* ── Filters ── */}
      <div className="card" style={{ marginBottom: 20, padding: '14px 20px' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            className="form-control"
            style={{ maxWidth: 220 }}
            placeholder="🔍 Search tasks…"
            value={filters.search}
            onChange={e => dispatch({ type: 'SET', field: 'search', value: e.target.value })}
          />
          <select
            className="form-control"
            style={{ maxWidth: 150 }}
            value={filters.priority}
            onChange={e => dispatch({ type: 'SET', field: 'priority', value: e.target.value })}
          >
            <option value="all">All priorities</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
          <select
            className="form-control"
            style={{ maxWidth: 150 }}
            value={filters.status}
            onChange={e => dispatch({ type: 'SET', field: 'status', value: e.target.value })}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <select
            className="form-control"
            style={{ maxWidth: 150 }}
            value={filters.sort}
            onChange={e => dispatch({ type: 'SET', field: 'sort', value: e.target.value })}
          >
            <option value="dueDate">Sort: Due date</option>
            <option value="priority">Sort: Priority</option>
            <option value="title">Sort: Title A–Z</option>
          </select>
          <button className="btn btn-ghost" onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner" /><span>Loading tasks…</span></div>
      ) : visible.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No tasks found</h3>
          <p>Try adjusting filters or <Link to="/add-task">add a new task</Link>.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Course</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(task => {
                const dl = daysLabel(task.dueDate, task.completed);
                return (
                  <tr key={task.id} style={{ opacity: task.completed ? 0.6 : 1 }}>
                    <td>
                      <div style={{ fontWeight: 600, textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</div>
                      {task.description && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{task.description}</div>}
                    </td>
                    <td><span className="badge badge-blue">{task.course}</span></td>
                    <td><span className="badge badge-gray">{task.type || 'task'}</span></td>
                    <td>
                      <span className={`badge ${task.priority === 'high' ? 'badge-red' : task.priority === 'medium' ? 'badge-yellow' : 'badge-green'}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td><span className={`badge ${dl.cls}`}>{dl.text}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {!task.completed && (
                          <button className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '0.78rem' }} onClick={() => handleComplete(task.id)}>
                            ✓ Done
                          </button>
                        )}
                        <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: '0.78rem' }} onClick={() => handleDelete(task.id)}>
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Showing {visible.length} of {tasks.length} tasks
      </div>
    </div>
  );
}
