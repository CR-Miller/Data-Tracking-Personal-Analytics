import { useEffect, useState } from 'react';
import { getTasks, deleteTask } from './api';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  const load = () =>
    getTasks()
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    await deleteTask(id);
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
            <p>Due: {task.dueDate}</p>
            <p>Status: {task.status}</p>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}