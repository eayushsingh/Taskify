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
  order?: number; // For drag & drop ordering
}

interface TaskStore {
  tasks: Task[];
  filter: 'all' | 'active' | 'completed';
  sortBy: 'date' | 'priority' | 'title' | 'manual';
  searchQuery: string;
  theme: 'light' | 'dark' | 'auto';
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'order'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
  setSortBy: (sortBy: 'date' | 'priority' | 'title' | 'manual') => void;
  setSearchQuery: (query: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  getTasks: () => Task[];
  reorderTasks: (sourceIndex: number, destinationIndex: number) => void;
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
      order: 0,
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
      order: 1,
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
      order: 2,
    },
  ],
  filter: 'all',
  sortBy: 'date',
  searchQuery: '',
  theme: 'light',

  addTask: (task) =>
    set((state) => {
      const newTask = {
        ...task,
        id: generateId(),
        createdAt: new Date().toISOString(),
        order: state.tasks.length,
      };
      return {
        tasks: [newTask, ...state.tasks],
      };
    }),

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

  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem('taskify-theme', theme);
    applyTheme(theme);
  },

  reorderTasks: (sourceIndex, destinationIndex) =>
    set((state) => {
      const tasks = Array.from(state.tasks);
      const [removed] = tasks.splice(sourceIndex, 1);
      tasks.splice(destinationIndex, 0, removed);
      // Update order values
      return {
        tasks: tasks.map((task, index) => ({ ...task, order: index })),
      };
    }),

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
      } else if (state.sortBy === 'manual') {
        return (a.order || 0) - (b.order || 0);
      } else {
        // date
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return sorted;
  },
}));

// Apply theme to document
export const applyTheme = (theme: 'light' | 'dark' | 'auto') => {
  const html = document.documentElement;
  
  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    html.setAttribute('data-theme', theme);
  }
};

// Initialize theme on load
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('taskify-theme') as 'light' | 'dark' | 'auto' | null;
  if (savedTheme) {
    applyTheme(savedTheme);
  }
}

export {};