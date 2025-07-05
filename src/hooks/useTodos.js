import { useState, useEffect } from 'react';

const STORAGE_KEY = 'beautiful-todos';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');

  // Load todos from localStorage on mount
  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem(STORAGE_KEY);
      if (savedTodos) {
        const parsedTodos = JSON.parse(savedTodos).map((todo) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
          dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
          status: todo.status || 'todo', // Default status
        }));
        setTodos(parsedTodos);
      }
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  }, [todos]);

  const addTodo = (todoData) => {
    const newTodo = {
      id: crypto.randomUUID(),
      text: typeof todoData === 'string' ? todoData : todoData.text,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: todoData.dueDate || null,
      priority: todoData.priority || 'medium',
      status: todoData.status || 'todo',
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          const newCompleted = !todo.completed;
          return {
            ...todo,
            completed: newCompleted,
            status: newCompleted ? 'done' : (todo.status === 'done' ? 'todo' : todo.status),
            updatedAt: new Date()
          };
        }
        return todo;
      })
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const editTodo = (id, updatedTodo) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, ...updatedTodo, updatedAt: new Date() }
          : todo
      )
    );
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed && todo.status !== 'done'));
  };

  const getOverdueTodos = () => {
    const now = new Date();
    return todos.filter(todo => {
      if (!todo.dueDate || todo.completed || todo.status === 'done') return false;
      return new Date(todo.dueDate) < now;
    });
  };

  const getStatusCounts = () => {
    const counts = {
      'todo': 0,
      'pending': 0,
      'in-progress': 0,
      'review': 0,
      'blocked': 0,
      'done': 0
    };
    
    todos.forEach(todo => {
      const status = todo.status || 'todo';
      if (counts.hasOwnProperty(status)) {
        counts[status]++;
      }
    });
    
    return counts;
  };

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case 'active':
        return !todo.completed && todo.status !== 'done';
      case 'completed':
        return todo.completed || todo.status === 'done';
      case 'overdue':
        return !todo.completed && todo.status !== 'done' && todo.dueDate && new Date(todo.dueDate) < new Date();
      case 'todo':
        return todo.status === 'todo';
      case 'pending':
        return todo.status === 'pending';
      case 'in-progress':
        return todo.status === 'in-progress';
      case 'review':
        return todo.status === 'review';
      case 'blocked':
        return todo.status === 'blocked';
      case 'done':
        return todo.status === 'done' || todo.completed;
      default:
        return true;
    }
  });

  const stats = {
    total: todos.length,
    active: todos.filter((todo) => !todo.completed && todo.status !== 'done').length,
    completed: todos.filter((todo) => todo.completed || todo.status === 'done').length,
    overdue: getOverdueTodos().length,
  };

  return {
    todos: filteredTodos,
    filter,
    stats,
    statusCounts: getStatusCounts(),
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    setFilter,
    clearCompleted,
  };
};