import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
  auth: {
    username: 'user',
    password: 'e3abf0f4-5975-498c-904d-c8a95d93ff29'
  }
});

// Tasks
export const getTasks = () => api.get('/tasks');
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const completeTask = (id) => api.patch(`/tasks/${id}/complete`);

// Study Sessions (temporary placeholders)
export const getSessions = () => Promise.resolve({ data: [] });
export const createSession = (data) => Promise.resolve({ data });
export const deleteSession = (id) => Promise.resolve({ data: id });

// Auth (TEMP so app doesn’t crash)
export const login = () => Promise.resolve({ data: {} });
export const register = () => Promise.resolve({ data: {} });

// Users
export const getUsers = () => api.get('/users');
export const createUser = (data) => api.post('/users', data);

// Study Groups
export const getStudyGroups = () => api.get('/study-groups');
export const createStudyGroup = (data) => api.post('/study-groups', data);

export default api;