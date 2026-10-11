import React, { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';
import Sidebar from './components/Sidebar.jsx';
import TaskForm from './components/TaskForm.jsx';
import TaskItem from './components/TaskItem.jsx';
import EditModal from './components/EditModal.jsx';
import Icon from './components/Icon.jsx';

const FILTERS = ['All', 'Pending', 'In Progress', 'Completed'];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState(''); // debounced search
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState('');

  // Debounce search input so we don't hit the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setTasks(await api.list({ status: filter, search: query }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter, query]);

  useEffect(() => {
    load();
  }, [load]);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // Form/modal handlers throw on failure so the form can show the message.
  const addTask = async (data) => {
    await api.create(data);
    flash('Task added');
    await load();
  };

  const saveTask = async (id, data) => {
    await api.update(id, data);
    setEditing(null);
    flash('Task updated');
    await load();
  };

  const deleteTask = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try {
      await api.remove(task._id);
      flash('Task deleted');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="layout">
      <Sidebar active={filter} onSelect={setFilter} />

      <main className="content">
        <header className="topbar">
          <div>
            <h1>Task Management</h1>
            <p className="subtitle">Organize your work, get things done.</p>
          </div>
          <div className="top-right">
            <div className="search">
              <Icon name="search" size={18} />
              <input
                type="search"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search tasks"
              />
            </div>
            <div className="avatar" title="Profile">MO</div>
          </div>
        </header>

        <TaskForm onAdd={addTask} />

        <div className="filter-row">
          <div className="pills">
            {FILTERS.map((f) => (
              <button key={f} className={`pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>
          <span className="count">Total Tasks: {tasks.length}</span>
        </div>

        {error && (
          <div className="banner error" role="alert">
            {error}
            <button className="link" onClick={load}>Retry</button>
          </div>
        )}

        {loading ? (
          <p className="empty">Loading tasks…</p>
        ) : tasks.length === 0 && !error ? (
          <p className="empty">No tasks found.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((t) => (
              <TaskItem key={t._id} task={t} onEdit={setEditing} onDelete={deleteTask} />
            ))}
          </ul>
        )}
      </main>

      {editing && <EditModal task={editing} onSave={saveTask} onClose={() => setEditing(null)} />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
