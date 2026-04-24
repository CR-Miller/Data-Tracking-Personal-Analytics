import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTasks, getSessions } from '../services/api';

// ── Helpers ─────────────────────────────────────────────
function daysBetween(dateStr) {
  const now  = new Date();
  const due  = new Date(dateStr);
  const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  return diff;
}

function getUrgency(task) {
  if (task.completed) return 'done';
  const d = daysBetween(task.dueDate);
  if (d < 0)  return 'overdue';
  if (d <= 2) return 'due-soon';
  return 'normal';
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return {
    day: d.getDate(),
    mon: d.toLocaleString('default', { month: 'short' }),
  };
}

// ── Fallback mock data (used when backend isn't running) ─
const MOCK_TASKS = [
  { id: 1, title: 'CS101 Assignment 3',   course: 'CS101',   dueDate: new Date(Date.now() + 86400000).toISOString(),  priority: 'high',   completed: false, type: 'assignment' },
  { id: 2, title: 'Midterm Exam Prep',    course: 'MATH201', dueDate: new Date(Date.now() + 3 * 86400000).toISOString(), priority: 'high',   completed: false, type: 'exam'       },
  { id: 3, title: 'Lab Report Draft',     course: 'BIO110',  dueDate: new Date(Date.now() - 86400000).toISOString(),  priority: 'medium', completed: false, type: 'assignment' },
  { id: 4, title: 'Weekly Reading',       course: 'ENG220',  dueDate: new Date(Date.now() + 5 * 86400000).toISOString(), priority: 'low',    completed: true,  type: 'reading'    },
];

const MOCK_SESSIONS = [
  { id: 1, subject: 'CS101',   date: new Date().toISOString(), duration: 90  },
  { id: 2, subject: 'MATH201', date: new Date(Date.now() - 86400000).toISOString(), duration: 60  },
  { id: 3, subject: 'BIO110',  date: new Date(Date.now() - 2 * 86400000).toISOString(), duration: 120 },
];

// ── Component ────────────────────────────────────────────
export default function Dashboard() {
  const [tasks,    setTasks]    = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [tRes, sRes] = await Promise.all([getTasks(), getSessions()]);
        setTasks(tRes.data);
        setSessions(sRes.data);
      } catch {
        // Backend not yet running → use mock data for dev
        setTasks(MOCK_TASKS);
        setSessions(MOCK_SESSIONS);
        setError('Using demo data (backend not connected)');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Derived stats ──────────────────────────────────────
  const total       = tasks.length;
  const completed   = tasks.filter(t => t.completed).length;
  const overdue     = tasks.filter(t => !t.completed && daysBetween(t.dueDate) < 0).length;
  const dueSoon     = tasks.filter(t => !t.completed && daysBetween(t.dueDate) >= 0 && daysBetween(t.dueDate) <= 2).length;
  const studyHours  = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const upcoming    = [...tasks]
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <span>Loading your dashboard…</span>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Here's where you stand today — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      {error && <div className="alert alert-info">ℹ️ {error}</div>}

      {/* ── Stat cards ── */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-label">Total Tasks</div>
          <div className="stat-value">{total}</div>
          <div className="stat-sub">{completed} completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔴</div>
          <div className="stat-label">Overdue</div>
          <div className="stat-value" style={{ color: overdue > 0 ? 'var(--danger)' : 'var(--success)' }}>{overdue}</div>
          <div className="stat-sub">{overdue > 0 ? 'Needs attention' : 'All caught up!'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-label">Due Soon</div>
          <div className="stat-value" style={{ color: dueSoon > 0 ? 'var(--accent)' : 'var(--text)' }}>{dueSoon}</div>
          <div className="stat-sub">Within 48 hours</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-label">Study Time</div>
          <div className="stat-value">{Math.floor(studyHours / 60)}h</div>
          <div className="stat-sub">{studyHours} min total logged</div>
        </div>
      </div>

      {/* ── Two columns: upcoming + progress ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>

        {/* Upcoming deadlines */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Upcoming Deadlines</h3>
            <Link to="/tasks" className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>View all →</Link>
          </div>

          {upcoming.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <div className="empty-icon">🎉</div>
              <h3>No upcoming tasks!</h3>
              <p>Add a task to get started.</p>
            </div>
          ) : (
            <div className="timeline">
              {upcoming.map(task => {
                const { day, mon } = formatDate(task.dueDate);
                const urgency = getUrgency(task);
                const d = daysBetween(task.dueDate);
                return (
                  <div key={task.id} className={`timeline-item ${urgency}`}>
                    <div className="timeline-date">
                      <span className="day">{day}</span>
                      <span className="mon">{mon}</span>
                    </div>
                    <div className="timeline-body">
                      <div className="title">{task.title}</div>
                      <div className="sub">{task.course}</div>
                      <div className="tags">
                        {task.type && <span className="badge badge-blue">{task.type}</span>}
                        {urgency === 'overdue'  && <span className="badge badge-red">Overdue</span>}
                        {urgency === 'due-soon' && <span className="badge badge-yellow">Due in {d}d</span>}
                        {task.priority === 'high' && <span className="badge badge-red">High</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Progress + quick actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 14 }}>Completion Rate</h3>
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                <span>{completed} / {total} tasks</span>
                <span style={{ fontWeight: 700 }}>{total ? Math.round((completed / total) * 100) : 0}%</span>
              </div>
              <div style={{ height: 10, background: 'var(--bg)', borderRadius: 999, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div style={{
                  height: '100%',
                  width: `${total ? (completed / total) * 100 : 0}%`,
                  background: 'linear-gradient(90deg, var(--primary), var(--success))',
                  borderRadius: 999,
                  transition: 'width 0.6s ease',
                }} />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 14 }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/add-task"   className="btn btn-primary">➕ Add New Task</Link>
              <Link to="/sessions"   className="btn btn-outline">📅 Log Study Session</Link>
              <Link to="/tasks"      className="btn btn-ghost"  style={{ color: 'var(--text-muted)' }}>📋 View All Tasks</Link>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 12 }}>Recent Sessions</h3>
            {sessions.slice(0, 3).map(s => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600 }}>{s.subject}</span>
                <span style={{ color: 'var(--text-muted)' }}>{s.duration} min</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
