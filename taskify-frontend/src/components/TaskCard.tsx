import React, { useState } from 'react';
import './TaskCard.css';
import { Task, useTaskStore } from '../store/taskStore';
import EditTaskModal from './EditTaskModal';

interface TaskCardProps {
  task: Task;
}

const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981',
  };
  return colors[priority] || '#6b7280';
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { toggleTask, deleteTask } = useTaskStore();
  const [editOpen, setEditOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const isOverdue = 
    task.dueDate && 
    !task.completed && 
    new Date(task.dueDate) < new Date();

  const isToday = 
    task.dueDate && 
    new Date(task.dueDate).toDateString() === new Date().toDateString();

  return (
    <>
      <div className={`task-card ${task.completed ? 'completed' : ''}`}>
        <div className="task-card-content">
          {/* Checkbox */}
          <div className="task-checkbox-wrapper">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              className="task-checkbox"
            />
            <span className="checkbox-visual"></span>
          </div>

          {/* Task Main Content */}
          <div className="task-info" onClick={() => setShowDetails(!showDetails)}>
            <h3 className="task-title">
              {task.title}
            </h3>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}

            {/* Task Metadata */}
            <div className="task-metadata">
              {/* Priority Badge */}
              <span 
                className="badge priority-badge" 
                style={{ 
                  backgroundColor: `${getPriorityColor(task.priority)}15`,
                  color: getPriorityColor(task.priority),
                  borderColor: getPriorityColor(task.priority)
                }}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>

              {/* Due Date */}
              {task.dueDate && (
                <span 
                  className={`badge due-date-badge ${isOverdue ? 'overdue' : isToday ? 'today' : ''}`}
                >
                  📅 {formatDate(task.dueDate)}
                </span>
              )}

              {/* Category */}
              {task.category && (
                <span className="badge category-badge">
                  {task.category}
                </span>
              )}

              {/* Tags */}
              {task.tags && task.tags.map((tag) => (
                <span key={tag} className="badge tag-badge">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="task-actions">
            <button
              className="btn-action btn-edit"
              onClick={() => setEditOpen(true)}
              title="Edit task"
              aria-label="Edit"
            >
              ✏️
            </button>
            <button
              className="btn-action btn-delete"
              onClick={() => deleteTask(task.id)}
              title="Delete task"
              aria-label="Delete"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Visual Priority Indicator */}
        <div 
          className="priority-indicator" 
          style={{ backgroundColor: getPriorityColor(task.priority) }}
        ></div>
      </div>

      {editOpen && (
        <EditTaskModal
          task={task}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
};

export {};