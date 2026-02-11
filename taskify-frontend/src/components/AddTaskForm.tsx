import React, { useState } from 'react';
import './AddTaskForm.css';
import { useTaskStore } from '../store/taskStore';

export const AddTaskForm: React.FC = () => {
  const { addTask } = useTaskStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || undefined,
        category: category.trim() || undefined,
        completed: false,
      });
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setCategory('');
      setIsExpanded(false);
    }
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <div className={`form-container ${isExpanded ? 'expanded' : ''}`}>
        {/* Main Input */}
        <div className="form-header">
          <input
            type="text"
            placeholder="✨ Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            className="main-input"
            autoComplete="off"
          />
          {title && (
            <button
              type="button"
              className="btn-collapse"
              onClick={() => setIsExpanded(false)}
            >
              ✕
            </button>
          )}
        </div>

        {/* Expanded Form */}
        {isExpanded && (
          <div className="form-expanded">
            {/* Description */}
            <textarea
              placeholder="📝 Add description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="form-textarea"
            />

            {/* Form Row */}
            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="form-select"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  placeholder="e.g., work"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsExpanded(false);
                  setTitle('');
                  setDescription('');
                  setPriority('medium');
                  setDueDate('');
                  setCategory('');
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!title.trim()}
              >
                ➕ Add Task
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export {};