import React from 'react';
import { TodoItem } from './TodoItem';

export const TodoList = ({ todos, onToggle, onDelete, onEdit }) => {
  if (todos.length === 0) {
    return (
      <div className="todo-list-empty">
        <div className="todo-list-empty-title">No tasks yet</div>
        <div className="todo-list-empty-subtitle">Add a task above to get started!</div>
      </div>
    );
  }

  return (
    <div className="todo-list">
      <div className="todo-items">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
};