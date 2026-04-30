import { useState } from 'react';
import { createTask } from './api';

export default function AddTask({ onDone }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask({
        title,
        description,
        dueDate: new Date().toISOString().slice(0, 10),
        status: 'IN_PROGRESS'
      });
      setTitle('');
      setDescription('');
      onDone?.(); // go back to Tasks
    } catch (err) {
      console.error(err);
      alert('Failed to create task');
    }
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
        <br /><br />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
}