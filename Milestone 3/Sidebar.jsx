import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/',         icon: '🏠', label: 'Dashboard'      },
  { to: '/tasks',    icon: '📋', label: 'Tasks & Deadlines' },
  { to: '/sessions', icon: '📅', label: 'Study Sessions'  },
  { to: '/add-task', icon: '➕', label: 'Add Task'        },
];

export default function Sidebar() {
  const user = localStorage.getItem('user') || 'Student';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>📚 StudySync</h1>
        <span>Personal Analytics</span>
      </div>

      <nav>
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <span className="icon">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ fontWeight: 600, marginBottom: 2 }}>👤 {user}</div>
        <button
          className="btn btn-ghost"
          style={{ padding: '4px 0', fontSize: '0.78rem' }}
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
        >
          Sign out →
        </button>
      </div>
    </aside>
  );
}
