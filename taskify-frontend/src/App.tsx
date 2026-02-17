import React, { useEffect } from 'react';
import './App.css';
import { AddTaskForm } from './components/AddTaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { useTaskStore, applyTheme } from './store/taskStore';

function App() {
  const tasks = useTaskStore((state) => state.tasks);
  const theme = useTaskStore((state) => state.theme);
  const setTheme = useTaskStore((state) => state.setTheme);
  const completedTasks = tasks.filter((t) => t.completed).length;

  // Apply theme on mount and when it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Check system preference on first load
  useEffect(() => {
    const savedTheme = localStorage.getItem('taskify-theme') as 'light' | 'dark' | 'auto' | null;
    if (!savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  const handleThemeToggle = () => {
    const themes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const getThemeIcon = () => {
    if (theme === 'light') return '☀️';
    if (theme === 'dark') return '🌙';
    return '🔄';
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <div className="app-logo">✨</div>
            <div>
              <h1 className="app-title">Taskify</h1>
              <p className="app-subtitle">Stay productive, stay organized</p>
            </div>
          </div>
          <div className="header-right">
            <div className="header-stats">
              <span className="stat-badge">
                {completedTasks}/{tasks.length} Done
              </span>
            </div>
            {/* Theme Toggle Button */}
            <button
              className="btn-theme"
              onClick={handleThemeToggle}
              title={`Theme: ${theme} (click to cycle)`}
              aria-label="Toggle theme"
            >
              <span className="theme-icon">{getThemeIcon()}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className="container">
          {/* Hero Section */}
          <section className="hero-section">
            <h2 className="section-title">
              What's on your mind?
            </h2>
            <p className="section-subtitle">
              Create tasks, organize your day, and achieve your goals
            </p>
          </section>

          {/* Add Task Form */}
          <AddTaskForm />

          {/* Filters */}
          <TaskFilters />

          {/* Task List */}
          <TaskList />
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Made with ❤️ • Taskify v2.0 • {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

export default App;