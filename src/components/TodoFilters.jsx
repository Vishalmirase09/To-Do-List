import React from 'react';

export const TodoFilters = ({
  currentFilter,
  onFilterChange,
  activeCount,
  completedCount,
  overdueCount,
  statusCounts,
  onClearCompleted,
}) => {
  const filters = [
    { key: 'all', label: 'All', count: activeCount + completedCount, emoji: '📋' },
    { key: 'active', label: 'Active', count: activeCount, emoji: '⚡' },
    { key: 'completed', label: 'Completed', count: completedCount, emoji: '✅' },
    { key: 'overdue', label: 'Overdue', count: overdueCount, emoji: '⏰' },
  ];

  const statusFilters = [
    { key: 'todo', label: 'To Do', count: statusCounts?.todo || 0, emoji: '📝' },
    { key: 'pending', label: 'Pending', count: statusCounts?.pending || 0, emoji: '⏳' },
    { key: 'in-progress', label: 'In Progress', count: statusCounts?.['in-progress'] || 0, emoji: '🔄' },
    { key: 'review', label: 'Review', count: statusCounts?.review || 0, emoji: '👀' },
    { key: 'blocked', label: 'Blocked', count: statusCounts?.blocked || 0, emoji: '🚫' },
    { key: 'done', label: 'Done', count: statusCounts?.done || 0, emoji: '✅' },
  ];

  return (
    <div className="filters">
      <div className="filters-content">
        <div className="filter-section">
          <h3 className="filter-section-title">📊 General Filters</h3>
          <div className="filter-buttons">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => onFilterChange(filter.key)}
                className={`filter-button ${currentFilter === filter.key ? 'active' : ''}`}
              >
                <span className="filter-emoji">{filter.emoji}</span>
                {filter.label}
                {filter.count !== undefined && (
                  <span className="filter-count">
                    {filter.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3 className="filter-section-title">🏷️ Status Filters</h3>
          <div className="filter-buttons status-filters">
            {statusFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => onFilterChange(filter.key)}
                className={`filter-button status-filter ${currentFilter === filter.key ? 'active' : ''}`}
              >
                <span className="filter-emoji">{filter.emoji}</span>
                {filter.label}
                <span className="filter-count">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {completedCount > 0 && (
          <button
            onClick={onClearCompleted}
            className="clear-completed"
          >
            🗑️ Clear Completed ({completedCount})
          </button>
        )}
      </div>
    </div>
  );
};