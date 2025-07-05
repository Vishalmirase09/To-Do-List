import React, { useEffect } from 'react';
import { CheckSquare, Bell } from 'lucide-react';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoFilters } from './components/TodoFilters';
import { NotificationCenter } from './components/NotificationCenter';
import { useTodos } from './hooks/useTodos';
import { useNotifications } from './hooks/useNotifications';

function App() {
  const {
    todos,
    filter,
    stats,
    statusCounts,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    setFilter,
    clearCompleted,
  } = useTodos();

  const { notifications, addNotification, removeNotification } = useNotifications();

  // Check for due tasks and pending reminders
  useEffect(() => {
    const checkDueTasks = () => {
      const now = new Date();
      todos.forEach(todo => {
        if ((!todo.completed && todo.status !== 'done')) {
          
          // Special reminders for PENDING status
          if (todo.status === 'pending') {
            addNotification({
              type: 'pending',
              title: '⏳ Pending Task Reminder!',
              message: `"${todo.text}" is still PENDING - needs attention!`,
              taskId: todo.id,
              persistent: false
            });
          }
          
          // Due date reminders
          if (todo.dueDate) {
            const dueDate = new Date(todo.dueDate);
            const timeDiff = dueDate.getTime() - now.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            
            if (daysDiff === 1) {
              addNotification({
                type: 'warning',
                title: 'Task Due Tomorrow!',
                message: `"${todo.text}" (${todo.status?.toUpperCase() || 'TODO'}) is due tomorrow`,
                taskId: todo.id
              });
            } else if (daysDiff === 0) {
              addNotification({
                type: 'urgent',
                title: 'Task Due Today!',
                message: `"${todo.text}" (${todo.status?.toUpperCase() || 'TODO'}) is due today`,
                taskId: todo.id
              });
            } else if (daysDiff < 0) {
              addNotification({
                type: 'overdue',
                title: 'Task Overdue!',
                message: `"${todo.text}" (${todo.status?.toUpperCase() || 'TODO'}) is ${Math.abs(daysDiff)} days overdue`,
                taskId: todo.id
              });
            }
          }
        }
      });
    };

    checkDueTasks();
    const interval = setInterval(checkDueTasks, 30000); // Check every 30 seconds for pending reminders
    
    return () => clearInterval(interval);
  }, [todos, addNotification]);

  return (
    <div className="app">
      <div className="container">
        {/* Notification Center */}
        <NotificationCenter 
          notifications={notifications}
          onRemoveNotification={removeNotification}
        />

        {/* Header */}
        <header className="header">
          <div className="header-icon-wrapper">
            <div className="header-icon">
              <CheckSquare size={32} />
            </div>
            <h1 className="header-title">TaskFlow</h1>
            <div className="notification-bell">
              <Bell size={24} />
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </div>
          </div>
          <p className="header-subtitle">
            Your personal task manager for better productivity
          </p>
        </header>

        {/* Add Todo Form */}
        <TodoForm onAddTodo={addTodo} />

        {/* Stats Overview */}
        {stats.total > 0 && (
          <div className="stats">
            <div className="stat-card total">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
            </div>
            <div className="stat-card active">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <div className="stat-number">{stats.active}</div>
                <div className="stat-label">Active</div>
              </div>
            </div>
            <div className="stat-card completed">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-number">{stats.completed}</div>
                <div className="stat-label">Completed</div>
              </div>
            </div>
            <div className="stat-card overdue">
              <div className="stat-icon">⏰</div>
              <div className="stat-content">
                <div className="stat-number">{stats.overdue}</div>
                <div className="stat-label">Overdue</div>
              </div>
            </div>
          </div>
        )}

        {/* Status Stats */}
        {stats.total > 0 && (
          <div className="status-stats">
            <div className="status-stat-card todo">
              <div className="status-stat-icon">📝</div>
              <div className="status-stat-content">
                <div className="status-stat-number">{statusCounts.todo}</div>
                <div className="status-stat-label">To Do</div>
              </div>
            </div>
            <div className="status-stat-card pending">
              <div className="status-stat-icon">⏳</div>
              <div className="status-stat-content">
                <div className="status-stat-number">{statusCounts.pending}</div>
                <div className="status-stat-label">Pending</div>
              </div>
            </div>
            <div className="status-stat-card in-progress">
              <div className="status-stat-icon">🔄</div>
              <div className="status-stat-content">
                <div className="status-stat-number">{statusCounts['in-progress']}</div>
                <div className="status-stat-label">In Progress</div>
              </div>
            </div>
            <div className="status-stat-card review">
              <div className="status-stat-icon">👀</div>
              <div className="status-stat-content">
                <div className="status-stat-number">{statusCounts.review}</div>
                <div className="status-stat-label">Review</div>
              </div>
            </div>
            <div className="status-stat-card blocked">
              <div className="status-stat-icon">🚫</div>
              <div className="status-stat-content">
                <div className="status-stat-number">{statusCounts.blocked}</div>
                <div className="status-stat-label">Blocked</div>
              </div>
            </div>
            <div className="status-stat-card done">
              <div className="status-stat-icon">✅</div>
              <div className="status-stat-content">
                <div className="status-stat-number">{statusCounts.done}</div>
                <div className="status-stat-label">Done</div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        {stats.total > 0 && (
          <TodoFilters
            currentFilter={filter}
            onFilterChange={setFilter}
            activeCount={stats.active}
            completedCount={stats.completed}
            overdueCount={stats.overdue}
            statusCounts={statusCounts}
            onClearCompleted={clearCompleted}
          />
        )}

        {/* Todo List */}
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />

      </div>
    </div>
  );
}

export default App;