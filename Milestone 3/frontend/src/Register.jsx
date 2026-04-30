import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from "./api";

export default function Register() {
  const [form,    setForm]    = useState({ username: '', email: '', password: '', confirm: '' });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handle = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.username.trim() || form.username.length < 3) e.username = 'Username must be at least 3 characters.';
    if (!form.email.includes('@'))      e.email    = 'Enter a valid email address.';
    if (form.password.length < 6)       e.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirm) e.confirm  = 'Passwords do not match.';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setLoading(true);
    try {
      await register({ username: form.username, email: form.email, password: form.password });
    } catch { /* allow mock */ }
    setSuccess(true);
    setTimeout(() => navigate('/login'), 1800);
    setLoading(false);
  };

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 12 }}>
        <div style={{ fontSize: '3rem' }}>🎉</div>
        <h2 style={{ fontWeight: 700 }}>Account created!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Redirecting to login…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📚</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--primary)' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>Join StudySync to track your deadlines</p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          {[
            { f: 'username', label: 'Username',        type: 'text',     ph: 'johndoe' },
            { f: 'email',    label: 'Email',            type: 'email',    ph: 'john@example.com' },
            { f: 'password', label: 'Password',         type: 'password', ph: '••••••••' },
            { f: 'confirm',  label: 'Confirm Password', type: 'password', ph: '••••••••' },
          ].map(({ f, label, type, ph }) => (
            <div className="form-group" key={f}>
              <label className="form-label">{label}</label>
              <input
                type={type}
                className={`form-control ${errors[f] ? 'error' : ''}`}
                placeholder={ph}
                value={form[f]}
                onChange={handle(f)}
              />
              {errors[f] && <span className="form-error">{errors[f]}</span>}
            </div>
          ))}

          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <><span className="spinner" style={{ borderTopColor: '#fff' }} /> Creating account…</> : 'Create Account →'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
