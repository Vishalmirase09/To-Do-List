import React, { useState } from 'react';
import { Check, X, Edit2, Save, Calendar, AlertTriangle, Flag } from 'lucide-react';

export const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editStatus, setEditStatus] = useState(todo.status || 'todo');

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(todo.id, { 
        ...todo, 
        text: editText.trim(),
        status: editStatus,
        completed: editStatus === 'done'
      });
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setEditStatus(todo.status || 'todo');
      setIsEditing(false);
    }
  };

  const getDaysLeft = () => {
    if (!todo.dueDate) return null;
    const now = new Date();
    const due = new Date(todo.dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysLeft();
  const isOverdue = daysLeft !== null && daysLeft < 0;
  const isDueToday = daysLeft === 0;
  const isDueTomorrow = daysLeft === 1;

  const getPriorityColor = () => {
    switch (todo.priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const getStatusInfo = () => {
    const statusMap = {
      'todo': { emoji: '📝', label: 'To Do', color: '#6b7280', bgColor: '#f3f4f6' },
      'pending': { emoji: '⏳', label: 'Pending', color: '#f97316', bgColor: '#fff7ed' },
      'in-progress': { emoji: '🔄', label: 'In Progress', color: '#3b82f6', bgColor: '#eff6ff' },
      'review': { emoji: '👀', label: 'Review', color: '#f59e0b', bgColor: '#fffbeb' },
      'blocked': { emoji: '🚫', label: 'Blocked', color: '#dc2626', bgColor: '#fef2f2' },
      'done': { emoji: '✅', label: 'Done', color: '#10b981', bgColor: '#f0fdf4' }
    };
    return statusMap[todo.status] || statusMap['todo'];
  };

  const getDueDateStatus = () => {
    if (!todo.dueDate) return null;
    
    if (isOverdue) {
      return {
        text: `${Math.abs(daysLeft)} days overdue`,
        class: 'overdue',
        icon: <AlertTriangle size={14} />
      };
    } else if (isDueToday) {
      return {
        text: 'Due today',
        class: 'due-today',
        icon: <Calendar size={14} />
      };
    } else if (isDueTomorrow) {
      return {
        text: 'Due tomorrow',
        class: 'due-tomorrow',
        icon: <Calendar size={14} />
      };
    } else if (daysLeft <= 7) {
      return {
        text: `${daysLeft} days left`,
        class: 'due-soon',
        icon: <Calendar size={14} />
      };
    } else {
      return {
        text: `${daysLeft} days left`,
        class: 'due-later',
        icon: <Calendar size={14} />
      };
    }
  };

  const statusInfo = getStatusInfo();
  const dueDateStatus = getDueDateStatus();

  const statusOptions = [
    { value: 'todo', label: 'To Do', emoji: '📝' },
    { value: 'pending', label: 'Pending', emoji: '⏳' },
    { value: 'in-progress', label: 'In Progress', emoji: '🔄' },
    { value: 'review', label: 'Review', emoji: '👀' },
    { value: 'blocked', label: 'Blocked', emoji: '🚫' },
    { value: 'done', label: 'Done', emoji: '✅' }
  ];

  return (
    <div className={`todo-item ${todo.completed || todo.status === 'done' ? 'completed' : ''} ${getPriorityColor()} ${isOverdue ? 'overdue-item' : ''} ${todo.status === 'pending' ? 'pending-item' : ''}`}>
      <div className="todo-item-content">
        <button
          onClick={() => onToggle(todo.id)}
          className={`todo-checkbox ${todo.completed || todo.status === 'done' ? 'completed' : ''}`}
        >
          {(todo.completed || todo.status === 'done') && <Check size={16} />}
        </button>

        <div className="todo-text-container">
          {isEditing ? (
            <div className="todo-edit-container">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleSave}
                className="todo-edit-input"
                autoFocus
              />
              <div className="edit-status-selector">
                <label className="edit-status-label">Status:</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="edit-status-select"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.emoji} {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="todo-content">
              <div className="todo-main-content">
                <span className={`todo-text ${todo.completed || todo.status === 'done' ? 'completed' : ''}`}>
                  {todo.text}
                </span>
                <div className="todo-badges">
                  <div 
                    className="status-badge"
                    style={{
                      backgroundColor: statusInfo.bgColor,
                      color: statusInfo.color,
                      border: `1px solid ${statusInfo.color}20`
                    }}
                  >
                    <span className="status-emoji">{statusInfo.emoji}</span>
                    <span className="status-text">{statusInfo.label}</span>
                  </div>
                  {dueDateStatus && (
                    <div className={`due-date-badge ${dueDateStatus.class}`}>
                      {dueDateStatus.icon}
                      <span>{dueDateStatus.text}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="todo-actions">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="todo-action save"
            >
              <Save size={16} />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="todo-action edit"
            >
              <Edit2 size={16} />
            </button>
          )}
          <button
            onClick={() => onDelete(todo.id)}
            className="todo-action delete"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};