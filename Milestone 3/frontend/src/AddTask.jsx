import { useState } from 'react';
import { createTask } from './api';

export default function AddTask({ onDone }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('IN_PROGRESS');

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createTask({
      title,
      description,
      dueDate,
      status
    });

    setTitle('');
    setDescription('');
    setDueDate('');
    setStatus('IN_PROGRESS');

    onDone?.();
  };

  return (
    <div>
      <h2>Add Task</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
          <option value="NOT_STARTED">Not Started</option>
        </select>

        <button type="submit">Create Task</button>
      </form>
    </div>
  );
}