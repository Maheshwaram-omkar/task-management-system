import React, { useEffect, useState } from 'react';
import Icon from './Icon.jsx';
import { STATUSES, validate } from './TaskForm.jsx';

export default function EditModal({ task, onSave, onClose }) {
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const problem = validate(form);
    if (problem) return setError(problem);
    setBusy(true);
    setError('');
    try {
      await onSave(task._id, {
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
      });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit} noValidate role="dialog" aria-modal="true">
        <div className="modal-head">
          <h2>Edit Task</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="x" />
          </button>
        </div>

        <div className="field">
          <label htmlFor="e-title">Title *</label>
          <input id="e-title" name="title" value={form.title} onChange={change} maxLength={100} autoFocus />
        </div>
        <div className="field">
          <label htmlFor="e-desc">Description</label>
          <textarea id="e-desc" name="description" rows={4} value={form.description} onChange={change} maxLength={500} />
        </div>
        <div className="field">
          <label htmlFor="e-status">Status</label>
          <div className="select-wrap">
            <select id="e-status" name="status" value={form.status} onChange={change}>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <Icon name="chevron" size={16} />
          </div>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="btn-row end">
          <button type="button" className="btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn primary" disabled={busy}>
            {busy ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
