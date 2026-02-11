import React from 'react';
import './TaskFilters.css';
import { useTaskStore } from '../store/taskStore';

export const TaskFilters: React.FC = () => {
  const {
    filter,
    sortBy,
    searchQuery,
    setFilter,
    setSortBy,
    setSearchQuery,
    getTasks,
    tasks,
  } = useTaskStore();

  const filteredTasks = getTasks();
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = totalTasks - activeTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="filters-container">
      {/* Search Bar */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button
            className="search-clear"
            onClick={() => setSearchQuery('')}
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter and Sort Controls */}
      <div className="controls-section">
        {/* Filter Buttons */}
        <div className="filter-group">
          <span className="group-label">Filter:</span>
          <div className="button-group">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' && '📋 All'}
                {f === 'active' && '⚡ Active'}
                {f === 'completed' && '✅ Completed'}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="sort-group">
          <label htmlFor="sort-select" className="group-label">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="sort-select"
          >
            <option value="date">📅 Most Recent</option>
            <option value="priority">🎯 Priority</option>
            <option value="title">🔤 Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-section">
        <div className="stat-item">
          <span className="stat-label">Total</span>
          <span className="stat-value">{totalTasks}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active</span>
          <span className="stat-value">{activeTasks}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Done</span>
          <span className="stat-value">{completedTasks}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Progress</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${completionRate}%` }}
            />
            <span className="progress-text">{completionRate}%</span>
          </div>
        </div>
      </div>

      {/* Results Info */}
      {(filter !== 'all' || searchQuery) && (
        <div className="results-info">
          Showing <strong>{filteredTasks.length}</strong> of{' '}
          <strong>{totalTasks}</strong> tasks
        </div>
      )}
    </div>
  );
};

export {};