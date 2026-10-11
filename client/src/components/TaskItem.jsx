import React from 'react';
import Icon from './Icon.jsx';

const badgeClass = { Pending: 'pending', 'In Progress': 'progress', Completed: 'done' };

const fmt = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function TaskItem({ task, onEdit, onDelete }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdue = task.dueDate
    && task.status !== 'Completed'
    && new Date(`${task.dueDate}T00:00:00`) < today;

  return (
    <li className="card task">
      <div className="task-main">
        <h3>{task.title}</h3>
        {task.description && <p className="task-desc">{task.description}</p>}
        <p className="task-date">
          <Icon name="calendar" size={14} /> Created on: {fmt(task.createdAt)}
        </p>
        {task.dueDate && (
          <p className={`task-date due-date ${overdue ? 'overdue' : ''}`}>
            <Icon name="calendar" size={14} />
            Due {fmt(`${task.dueDate}T00:00:00`)}{overdue ? ' · Overdue' : ''}
          </p>
        )}
      </div>

      <div className="task-status">
        <span className={`badge ${badgeClass[task.status]}`}>{task.status}</span>
      </div>

      <div className="task-actions">
        <button className="btn outline-blue" onClick={() => onEdit(task)}>
          <Icon name="edit" size={16} /> Edit
        </button>
        <button className="btn outline-red" onClick={() => onDelete(task)}>
          <Icon name="trash" size={16} /> Delete
        </button>
      </div>
    </li>
  );
}
