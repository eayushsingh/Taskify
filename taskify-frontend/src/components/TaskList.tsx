import React from 'react';
import './TaskList.css';
import { useTaskStore } from '../store/taskStore';
import { TaskCard } from './TaskCard';

export const TaskList: React.FC = () => {
  const getTasks = useTaskStore((state) => state.getTasks);
  const filter = useTaskStore((state) => state.filter);
  const tasks = getTasks();

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          {filter === 'completed' ? '✅' : filter === 'active' ? '🎉' : '📝'}
        </div>
        <h3 className="empty-title">
          {filter === 'completed'
            ? 'No completed tasks yet'
            : filter === 'active'
            ? 'All caught up!'
            : 'No tasks yet'}
        </h3>
        <p className="empty-message">
          {filter === 'completed'
            ? 'Complete your first task to see it here'
            : filter === 'active'
            ? 'You have no active tasks. Great job!'
            : 'Add a task above to get started. Let\'s make today productive!'}
        </p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <div key={task.id} style={{ animationDelay: `${index * 0.05}s` }}>
          <TaskCard task={task} />
        </div>
      ))}
    </div>
  );
};

export {};