import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000,
  auth: {
    username: 'user',
    password: 'e3abf0f4-5975-498c-904d-c8a95d93ff29'
  }
});

// =======================
// TASKS (CRUD)
// =======================

// Get all tasks
export const getTasks = () => api.get('/tasks');

// Create new task
export const createTask = (data) => api.post('/tasks', data);

// Update task (used for due date change)
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);

// Delete task
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// =======================
// OPTIONAL (if you use later)
// =======================

// Mark complete (only works if backend has this endpoint)
export const completeTask = (id) => api.patch(`/tasks/${id}/complete`);

// =======================
// EXPORT INSTANCE
// =======================

export default api;