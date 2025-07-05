import React, { useState } from 'react';
import { Plus, Calendar, Clock, Flag } from 'lucide-react';

export const TodoForm = ({ onAddTodo }) => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTodo({
        text: text.trim(),
        dueDate: dueDate || null,
        priority,
        status
      });
      setText('');
      setDueDate('');
      setPriority('medium');
      setStatus('todo');
      setShowAdvanced(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const statusOptions = [
    { value: 'todo', label: 'To Do', emoji: '📝', color: '#6b7280' },
    { value: 'pending', label: 'Pending', emoji: '⏳', color: '#f97316' },
    { value: 'in-progress', label: 'In Progress', emoji: '🔄', color: '#3b82f6' },
    { value: 'review', label: 'Review', emoji: '👀', color: '#f59e0b' },
    { value: 'blocked', label: 'Blocked', emoji: '🚫', color: '#dc2626' },
    { value: 'done', label: 'Done', emoji: '✅', color: '#10b981' }
  ];

  return (
    <div className="todo-form-container">
      <form onSubmit={handleSubmit} className="todo-form">
        <div className="todo-input-group">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs to be done?"
            className="todo-input"
          />
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="advanced-toggle"
          >
            <Calendar size={18} />
          </button>
          <button
            type="submit"
            disabled={!text.trim()}
            className="todo-submit"
          >
            <Plus size={20} />
          </button>
        </div>

        {showAdvanced && (
          <div className="advanced-options">
            <div className="option-group">
              <label className="option-label">
                <Clock size={16} />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={today}
                className="date-input"
              />
            </div>
            
            <div className="option-group">
              <label className="option-label">
                <Flag size={16} />
                Priority
              </label>
              <div className="priority-buttons">
                {['low', 'medium', 'high'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`priority-btn ${priority === p ? 'active' : ''} ${p}`}
                  >
                    {p === 'low' && '🟢'}
                    {p === 'medium' && '🟡'}
                    {p === 'high' && '🔴'}
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="option-group">
              <label className="option-label">
                <Flag size={16} />
                Status
              </label>
              <div className="status-buttons">
                {statusOptions.map((statusOption) => (
                  <button
                    key={statusOption.value}
                    type="button"
                    onClick={() => setStatus(statusOption.value)}
                    className={`status-btn ${status === statusOption.value ? 'active' : ''}`}
                    style={{
                      '--status-color': statusOption.color
                    }}
                  >
                    <span className="status-emoji">{statusOption.emoji}</span>
                    {statusOption.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};