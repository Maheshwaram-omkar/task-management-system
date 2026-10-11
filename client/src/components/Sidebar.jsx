import React from 'react';
import Icon from './Icon.jsx';

const NAV = [
  { key: 'All', label: 'All Tasks', icon: 'home' },
  { key: 'Pending', label: 'Pending', icon: 'clock' },
  { key: 'In Progress', label: 'In Progress', icon: 'dot' },
  { key: 'Completed', label: 'Completed', icon: 'checkCircle' },
];

export default function Sidebar({ active, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-logo">
          <Icon name="check" size={20} />
        </span>
        <span className="brand-name">TaskManager</span>
      </div>

      <nav className="nav">
        {NAV.map((item) => (
          <button
            key={item.key}
            className={`nav-item ${active === item.key ? 'active' : ''}`}
            onClick={() => onSelect(item.key)}
          >
            <Icon name={item.icon} size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <p className="sidebar-foot">
        Built with <span className="heart">♥</span> using React, Node.js and MongoDB
      </p>
    </aside>
  );
}
