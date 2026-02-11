import { create } from 'zustand';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  category?: string;
  tags?: string[];
}

interface TaskStore {
  tasks: Task[];
  filter: 'all' | 'active' | 'completed';
  sortBy: 'date' | 'priority' | 'title';
  searchQuery: string;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
  setSortBy: (sortBy: 'date' | 'priority' | 'title') => void;
  setSearchQuery: (query: string) => void;
  getTasks: () => Task[];
}

const generateId = () => `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [
    {
      id: generateId(),
      title: '🎯 Complete project proposal',
      description: 'Finish the Q1 project proposal and send to stakeholders for review.',
      completed: false,
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      category: 'work',
      tags: ['urgent', 'client'],
    },
    {
      id: generateId(),
      title: '📚 Review React documentation',
      description: 'Study the new features in React 18',
      completed: false,
      priority: 'medium',
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      category: 'learning',
      tags: ['development'],
    },
    {
      id: generateId(),
      title: '🏃 Morning workout',
      description: 'Run 5km at the park',
      completed: true,
      priority: 'medium',
      createdAt: new Date().toISOString(),
      category: 'personal',
      tags: ['health'],
    },
  ],
  filter: 'all',
  sortBy: 'date',
  searchQuery: '',

  addTask: (task) =>
    set((state) => ({
      tasks: [
        {
          ...task,
          id: generateId(),
          createdAt: new Date().toISOString(),
        },
        ...state.tasks,
      ],
    })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),

  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    })),

  setFilter: (filter) => set({ filter }),

  setSortBy: (sortBy) => set({ sortBy }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  getTasks: () => {
    const state = get();
    let filtered = state.tasks;

    // Apply filter
    if (state.filter === 'active') {
      filtered = filtered.filter((task) => !task.completed);
    } else if (state.filter === 'completed') {
      filtered = filtered.filter((task) => task.completed);
    }

    // Apply search
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.category?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      if (state.sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (state.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else {
        // date
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return sorted;
  },
}));

export {};