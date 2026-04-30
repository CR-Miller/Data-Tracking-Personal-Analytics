import { useState, useEffect, useReducer } from 'react';
import { getSessions, createSession, deleteSession } from './api';

const MOCK_SESSIONS = [
  { id: 1, subject: 'CS101',   date: new Date().toISOString(),                      duration: 90,  notes: 'Worked through recursion examples' },
  { id: 2, subject: 'MATH201', date: new Date(Date.now() - 86400000).toISOString(), duration: 60,  notes: 'Practice integrals' },
  { id: 3, subject: 'BIO110',  date: new Date(Date.now() - 2*86400000).toISOString(), duration: 120, notes: 'Read lab manual chapters 4–5' },
  { id: 4, subject: 'ENG220',  date: new Date(Date.now() - 3*86400000).toISOString(), duration: 45,  notes: 'Weekly reading summary' },
];

const initForm = { subject: '', date: '', duration: '', notes: '' };
function formReducer(state, action) {
  if (action.type === 'SET')   return { ...state, [action.field]: action.value };
  if (action.type === 'RESET') return initForm;
  return state;
}

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, dispatch] = useReducer(formReducer, initForm);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const load = async () => {
    try {
      const res = await getSessions();
      setSessions(res.data);
    } catch {
      setSessions(MOCK_SESSIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const validate = () => {
    const e = {};
    if (!form.subject.trim()) e.subject = 'Subject is required.';
    if (!form.date)           e.date    = 'Date is required.';
    if (!form.duration || form.duration <= 0) e.duration = 'Enter a valid duration (minutes).';
    return e;
  };

  const handleAdd = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSubmitting(true);
    const payload = { ...form, duration: parseInt(form.duration) };
    try {
      const res = await createSession(payload);
      setSessions(prev => [res.data, ...prev]);
    } catch {
      setSessions(prev => [{ ...payload, id: Date.now() }, ...prev]);
    } finally {
      setSubmitting(false);
      dispatch({ type: 'RESET' });
      setShowForm(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this session?')) return;
    try { await deleteSession(id); } catch { /* allow mock */ }
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const totalHours  = sessions.reduce((s, ss) => s + (ss.duration || 0), 0);
  const avgDuration = sessions.length ? Math.round(totalHours / sessions.length) : 0;
  const subjects    = [...new Set(sessions.map(s => s.subject))];

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2>Study Sessions</h2>
            <p>Track your study time and stay on top of your workload.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
            {showForm ? '✕ Cancel' : '➕ Log Session'}
          </button>
        </div>
      </div>

      {/* ── Inline log form ── */}
      {showForm && (
        <div className="card" style={{ marginBottom: 20, borderColor: 'var(--primary)', borderWidth: 1.5 }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 14 }}>Log a Study Session</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Subject / Course *</label>
              <input
                className={`form-control ${errors.subject ? 'error' : ''}`}
                placeholder="e.g. CS101"
                value={form.subject}
                onChange={e => dispatch({ type: 'SET', field: 'subject', value: e.target.value })}
              />
              {errors.subject && <span className="form-error">{errors.subject}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                className={`form-control ${errors.date ? 'error' : ''}`}
                value={form.date}
                max={new Date().toISOString().split('T')[0]}
                onChange={e => dispatch({ type: 'SET', field: 'date', value: e.target.value })}
              />
              {errors.date && <span className="form-error">{errors.date}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Duration (minutes) *</label>
              <input
                type="number"
                className={`form-control ${errors.duration ? 'error' : ''}`}
                placeholder="e.g. 90"
                min="1"
                value={form.duration}
                onChange={e => dispatch({ type: 'SET', field: 'duration', value: e.target.value })}
              />
              {errors.duration && <span className="form-error">{errors.duration}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Notes <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></label>
              <input
                className="form-control"
                placeholder="What did you cover?"
                value={form.notes}
                onChange={e => dispatch({ type: 'SET', field: 'notes', value: e.target.value })}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" onClick={handleAdd} disabled={submitting}>
              {submitting ? <><span className="spinner" style={{ borderTopColor: '#fff' }} /> Saving…</> : '💾 Save Session'}
            </button>
            <button className="btn btn-ghost" onClick={() => { setShowForm(false); dispatch({ type: 'RESET' }); }}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── Stats row ── */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-label">Total Study Time</div>
          <div className="stat-value">{Math.floor(totalHours / 60)}h {totalHours % 60}m</div>
          <div className="stat-sub">{sessions.length} sessions logged</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-label">Avg Session</div>
          <div className="stat-value">{avgDuration}m</div>
          <div className="stat-sub">per session</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-label">Subjects</div>
          <div className="stat-value">{subjects.length}</div>
          <div className="stat-sub">{subjects.join(', ') || '—'}</div>
        </div>
      </div>

      {/* ── Sessions table ── */}
      {loading ? (
        <div className="loading-container"><div className="spinner" /><span>Loading sessions…</span></div>
      ) : sessions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📖</div>
          <h3>No sessions logged yet</h3>
          <p>Click "Log Session" to record your first study session.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(s => (
                <tr key={s.id}>
                  <td><span className="badge badge-blue">{s.subject}</span></td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td>
                    <strong>{s.duration}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}> min</span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{s.notes || '—'}</td>
                  <td>
                    <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '0.78rem' }} onClick={() => handleDelete(s.id)}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
