import { useState } from 'react';
import './global.css';

import Tasks from './Tasks';
import AddTask from './AddTask';

export default function App() {
  const [page, setPage] = useState('tasks');
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>StudySync</h1>
        <p>Personal Analytics Dashboard</p>

        <button className={page === 'tasks' ? 'active' : ''} onClick={() => setPage('tasks')}>
          📋 Tasks
        </button>

        <button className={page === 'add' ? 'active' : ''} onClick={() => setPage('add')}>
          ➕ Add Task
        </button>
      </aside>

      <main className="content">
        {page === 'tasks' && <Tasks key={refreshKey} />}
        {page === 'add' && (
          <AddTask
            onDone={() => {
              setRefreshKey((k) => k + 1);
              setPage('tasks');
            }}
          />
        )}
      </main>
    </div>
  );
}