import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';

export default function Login() {
  const [form,    setForm]    = useState({ username: '', password: '' });
  const [error,   setError]   = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handle = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.username || !form.password) {
      setError('Please enter your username and password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await login(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user',  form.username);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid username or password.');
      } else {
        // Dev mode: bypass auth if backend not running
        localStorage.setItem('token', 'dev-token');
        localStorage.setItem('user',  form.username);
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📚</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--primary)' }}>StudySync</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>Sign in to your account</p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              placeholder="your username"
              value={form.username}
              onChange={handle('username')}
              onKeyDown={handleKey}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={form.password}
              onChange={handle('password')}
              onKeyDown={handleKey}
              autoComplete="current-password"
            />
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <><span className="spinner" style={{ borderTopColor: '#fff' }} /> Signing in…</> : 'Sign In →'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            No account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
