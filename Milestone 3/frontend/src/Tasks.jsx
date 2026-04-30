import { useEffect, useState } from 'react';
import { getTasks, deleteTask, updateTask } from './api';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  const load = () => {
    getTasks()
      .then((res) => setTasks(res.data))
      .catch((err) => console.error('Load failed:', err));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    await deleteTask(id);
    load();
  };

  const handleDateChange = async (task, newDate) => {
    await updateTask(task.id, {
      title: task.title,
      description: task.description,
      dueDate: newDate,
      status: task.status
    });

    load();
  };

  return (
    <div>
      <h2>Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        tasks.map((task) => (
          <div className="task-card" key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>

            <label>Due Date:</label>
            <input
              type="date"
              value={task.dueDate || ''}
              onChange={(e) => handleDateChange(task, e.target.value)}
            />

            <p>Status: {task.status}</p>

            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}