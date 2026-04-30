import { useEffect, useState } from 'react';
import { getTasks, deleteTask, updateTask } from './api';

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
    try {
      await deleteTask(id);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDueDateChange = async (task, newDate) => {
    try {
      await updateTask(task.id, {
        ...task,
        dueDate: newDate
      });
      load();
    } catch (err) {
      console.error(err);
    }
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

            <p>Due:</p>
            <input
              type="date"
              value={task.dueDate || ""}
              onChange={(e) => handleDueDateChange(task, e.target.value)}
            />

            <p>Status: {task.status}</p>

            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}