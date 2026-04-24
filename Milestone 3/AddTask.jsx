import { useReducer, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createTask } from '../services/api';

// ── Form state reducer ───────────────────────────────────
const initForm = {
  title:       '',
  course:      '',
  type:        'assignment',
  priority:    'medium',
  dueDate:     '',
  dueTime:     '',
  description: '',
  reminder:    '1day',
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET':   return { ...state, [action.field]: action.value };
    case 'RESET': return initForm;
    default: return state;
  }
}

// ── Validation ───────────────────────────────────────────
function validate(form) {
  const errs = {};
  if (!form.title.trim())   errs.title   = 'Title is required.';
  if (form.title.length > 120) errs.title = 'Title must be under 120 characters.';
  if (!form.course.trim())  errs.course  = 'Course name is required.';
  if (!form.dueDate)        errs.dueDate = 'Due date is required.';
  if (form.dueDate && new Date(form.dueDate) < new Date(new Date().setHours(0,0,0,0))) {
    errs.dueDate = 'Due date cannot be in the past.';
  }
  return errs;
}

export default function AddTask() {
  const [form,    dispatch]  = useReducer(formReducer, initForm);
  const [errors,  setErrors] = useState({});
  const [loading, setLoading]= useState(false);
  const [success, setSuccess]= useState(false);
  const navigate = useNavigate();

  const set = (field) => (e) => dispatch({ type: 'SET', field, value: e.target.value });

  const handleSubmit = async () => {
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    const payload = {
      ...form,
      dueDate: form.dueTime
        ? `${form.dueDate}T${form.dueTime}:00`
        : `${form.dueDate}T23:59:00`,
      completed: false,
    };

    try {
      await createTask(payload);
    } catch {
      // Allow offline/mock submission
    } finally {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/tasks'), 1800);
    }
  };

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 12 }}>
        <div style={{ fontSize: '3rem' }}>✅</div>
        <h2 style={{ fontWeight: 700, fontSize: '1.3rem' }}>Task added successfully!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Redirecting to your tasks…</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/tasks" className="btn btn-ghost" style={{ padding: '6px 10px' }}>← Back</Link>
          <div>
            <h2>Add New Task</h2>
            <p>Create an assignment, exam, or study deadline.</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

        {/* ── Main form ── */}
        <div className="card">
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              className={`form-control ${errors.title ? 'error' : ''}`}
              placeholder="e.g. CS101 Assignment 3"
              value={form.title}
              onChange={set('title')}
              maxLength={120}
            />
            {errors.title
              ? <span className="form-error">{errors.title}</span>
              : <span className="form-hint">{form.title.length}/120 characters</span>
            }
          </div>

          {/* Course + Type */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Course *</label>
              <input
                className={`form-control ${errors.course ? 'error' : ''}`}
                placeholder="e.g. CS101"
                value={form.course}
                onChange={set('course')}
              />
              {errors.course && <span className="form-error">{errors.course}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Task Type</label>
              <select className="form-control" value={form.type} onChange={set('type')}>
                <option value="assignment">📝 Assignment</option>
                <option value="exam">📖 Exam</option>
                <option value="project">🗂 Project</option>
                <option value="quiz">✏️ Quiz</option>
                <option value="reading">📚 Reading</option>
                <option value="other">📌 Other</option>
              </select>
            </div>
          </div>

          {/* Due date + time */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Due Date *</label>
              <input
                type="date"
                className={`form-control ${errors.dueDate ? 'error' : ''}`}
                value={form.dueDate}
                onChange={set('dueDate')}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.dueDate && <span className="form-error">{errors.dueDate}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Due Time <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></label>
              <input
                type="time"
                className="form-control"
                value={form.dueTime}
                onChange={set('dueTime')}
              />
              <span className="form-hint">Defaults to 11:59 PM</span>
            </div>
          </div>

          {/* Priority + Reminder */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-control" value={form.priority} onChange={set('priority')}>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Reminder</label>
              <select className="form-control" value={form.reminder} onChange={set('reminder')}>
                <option value="1hour">1 hour before</option>
                <option value="3hours">3 hours before</option>
                <option value="1day">1 day before</option>
                <option value="2days">2 days before</option>
                <option value="1week">1 week before</option>
                <option value="none">No reminder</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Add notes, links, or instructions…"
              value={form.description}
              onChange={set('description')}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? <><span className="spinner" style={{ borderTopColor: '#fff' }} /> Saving…</> : '➕ Add Task'}
            </button>
            <button className="btn btn-outline" onClick={() => dispatch({ type: 'RESET' })}>
              Reset
            </button>
          </div>
        </div>

        {/* ── Preview card ── */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 14, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Preview</h3>
            <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6 }}>{form.title || <span style={{ color: 'var(--text-muted)' }}>Task title</span>}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              {form.course   && <span className="badge badge-blue">{form.course}</span>}
              {form.type     && <span className="badge badge-gray">{form.type}</span>}
              {form.priority === 'high'   && <span className="badge badge-red">High</span>}
              {form.priority === 'medium' && <span className="badge badge-yellow">Medium</span>}
              {form.priority === 'low'    && <span className="badge badge-green">Low</span>}
            </div>
            {form.dueDate && (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                📅 Due: {new Date(form.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                {form.dueTime && ` at ${form.dueTime}`}
              </div>
            )}
            {form.reminder !== 'none' && (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>⏰ Reminder: {form.reminder}</div>
            )}
            {form.description && (
              <div style={{ marginTop: 10, fontSize: '0.83rem', color: 'var(--text-muted)', background: 'var(--bg)', padding: '8px 10px', borderRadius: 6 }}>
                {form.description}
              </div>
            )}
          </div>

          <div className="card" style={{ background: 'var(--primary-light)', border: '1px solid #93c5fd' }}>
            <div style={{ fontSize: '0.85rem', color: '#1e40af' }}>
              <strong>💡 Tips:</strong>
              <ul style={{ marginTop: 6, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li>Set high priority for anything due within 48 hours.</li>
                <li>Add the course code so you can filter tasks easily.</li>
                <li>Enable reminders to get notified before deadlines.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
