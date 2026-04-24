import axios from 'axios';

// Base URL points to Spring Boot backend (proxied via package.json "proxy")
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Tasks ──────────────────────────────────────────────
export const getTasks = ()          => api.get('/tasks');
export const createTask = (data)    => api.post('/tasks', data);
export const updateTask = (id, data)=> api.put(`/tasks/${id}`, data);
export const deleteTask = (id)      => api.delete(`/tasks/${id}`);
export const completeTask = (id)    => api.patch(`/tasks/${id}/complete`);

// ── Study Sessions ─────────────────────────────────────
export const getSessions = ()           => api.get('/sessions');
export const createSession = (data)     => api.post('/sessions', data);
export const deleteSession = (id)       => api.delete(`/sessions/${id}`);

// ── Auth ───────────────────────────────────────────────
export const login = (credentials)  => api.post('/auth/login', credentials);
export const register = (userData)  => api.post('/auth/register', userData);
export const logout  = ()           => { localStorage.removeItem('token'); };

// ── External / Calendar API (Google Calendar or similar) ──
export const getUpcomingEvents = () => api.get('/calendar/events');

export default api;
