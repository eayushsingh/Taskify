import React from 'react';
import './App.css';
import { AddTaskForm } from './components/AddTaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { useTaskStore } from './store/taskStore';

function App() {
  const tasks = useTaskStore((state) => state.tasks);
  const completedTasks = tasks.filter((t) => t.completed).length;

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
          <div className="header-stats">
            <span className="stat-badge">
              {completedTasks}/{tasks.length} Done
            </span>
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
                Taskify v1.0 • {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

export default App;