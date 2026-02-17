import React, { useState } from 'react';
import './TaskList.css';
import { useTaskStore } from '../store/taskStore';
import { TaskCard } from './TaskCard';

export const TaskList: React.FC = () => {
  const getTasks = useTaskStore((state) => state.getTasks);
  const filter = useTaskStore((state) => state.filter);
  const reorderTasks = useTaskStore((state) => state.reorderTasks);
  const tasks = getTasks();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      reorderTasks(draggedIndex, index);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

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
        <div
          key={task.id}
          className={`task-item ${dragOverIndex === index ? 'drag-over' : ''}`}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <TaskCard
            task={task}
            isDragging={draggedIndex === index}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
          />
        </div>
      ))}
    </div>
  );
};

export {};