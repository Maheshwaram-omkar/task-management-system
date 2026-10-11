import React, { useState } from 'react';
import Icon from './Icon.jsx';

export const STATUSES = ['Pending', 'In Progress', 'Completed'];
const EMPTY = { title: '', description: '', status: 'Pending', dueDate: '' };

export function validate({ title, description }) {
  const t = title.trim();
  if (!t) return 'Title is required';
  if (t.length < 3) return 'Title must be at least 3 characters';
  if (t.length > 100) return 'Title must be at most 100 characters';
  if (description.trim().length > 500) return 'Description must be at most 500 characters';
  return '';
}

export default function TaskForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const problem = validate(form);
    if (problem) return setError(problem);
    setBusy(true);
    setError('');
    try {
      await onAdd({ ...form, title: form.title.trim(), description: form.description.trim() });
      setForm(EMPTY);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const clear = () => {
    setForm(EMPTY);
    setError('');
  };

  return (
    <form className="card add-card" onSubmit={submit} noValidate>
      <h2>Add New Task</h2>
      <div className="add-grid">
        <div className="field">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={change}
            placeholder="Enter task title"
            maxLength={100}
          />
          <div className="btn-row">
            <button type="submit" className="btn primary" disabled={busy}>
              <Icon name="plus" size={16} /> {busy ? 'Adding…' : 'Add Task'}
            </button>
            <button type="button" className="btn ghost" onClick={clear}>
              Clear
            </button>
          </div>
        </div>

        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={change}
            placeholder="Enter task description"
            rows={4}
            maxLength={500}
          />
        </div>

        <div className="field">
          <label htmlFor="status">Status</label>
          <div className="select-wrap">
            <select id="status" name="status" value={form.status} onChange={change}>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <Icon name="chevron" size={16} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="dueDate">Due date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={change}
          />
        </div>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
  );
}
