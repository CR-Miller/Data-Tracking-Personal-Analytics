import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/global.css';

import Sidebar        from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

import Dashboard from './pages/Dashboard';
import Tasks     from './pages/Tasks';
import Sessions  from './pages/Sessions';
import AddTask   from './pages/AddTask';
import Login     from './pages/Login';
import Register  from './pages/Register';

function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppShell><Dashboard /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute>
            <AppShell><Tasks /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/sessions" element={
          <ProtectedRoute>
            <AppShell><Sessions /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/add-task" element={
          <ProtectedRoute>
            <AppShell><AddTask /></AppShell>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
