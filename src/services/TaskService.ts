import { Task } from '../types';

// Dummy tasks data for development
const DUMMY_TASKS: Task[] = [
  {
    id: '1',
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the To-Do app project',
    completed: false,
    createdAt: new Date('2024-01-15T10:00:00'),
    updatedAt: new Date('2024-01-15T10:00:00'),
    userId: '1'
  },
  {
    id: '2', 
    title: 'Review code changes',
    description: 'Review and approve pending pull requests',
    completed: true,
    createdAt: new Date('2024-01-14T14:30:00'),
    updatedAt: new Date('2024-01-15T09:00:00'),
    userId: '1'
  },
  {
    id: '3',
    title: 'Prepare presentation',
    description: 'Create slides for the client meeting next week',
    completed: false,
    createdAt: new Date('2024-01-13T16:45:00'),
    updatedAt: new Date('2024-01-13T16:45:00'),
    userId: '1'
  }
];

export class TaskService {
  private static readonly STORAGE_KEY = 'todo_tasks';
  
  private static getTasks(): Task[] {
    try {
      const tasksStr = localStorage.getItem(this.STORAGE_KEY);
      if (tasksStr) {
        const tasks = JSON.parse(tasksStr);
        return tasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        }));
      }
      // Initialize with dummy data if none exists
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(DUMMY_TASKS));
      return DUMMY_TASKS;
    } catch {
      return DUMMY_TASKS;
    }
  }

  private static saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }

  static getUserTasks(userId: string): Promise<Task[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allTasks = this.getTasks();
        const userTasks = allTasks.filter(task => task.userId === userId);
        resolve(userTasks);
      }, 300);
    });
  }

  static createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTask: Task = {
          ...taskData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const tasks = this.getTasks();
        tasks.push(newTask);
        this.saveTasks(tasks);
        
        resolve(newTask);
      }, 300);
    });
  }

  static updateTask(taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'userId'>>): Promise<Task> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tasks = this.getTasks();
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex === -1) {
          reject(new Error('Task not found'));
          return;
        }

        const updatedTask: Task = {
          ...tasks[taskIndex],
          ...updates,
          updatedAt: new Date()
        };

        tasks[taskIndex] = updatedTask;
        this.saveTasks(tasks);
        
        resolve(updatedTask);
      }, 300);
    });
  }

  static deleteTask(taskId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tasks = this.getTasks();
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex === -1) {
          reject(new Error('Task not found'));
          return;
        }

        tasks.splice(taskIndex, 1);
        this.saveTasks(tasks);
        
        resolve();
      }, 300);
    });
  }

  static toggleTaskStatus(taskId: string): Promise<Task> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tasks = this.getTasks();
        const task = tasks.find(t => t.id === taskId);
        
        if (!task) {
          reject(new Error('Task not found'));
          return;
        }

        const updatedTask = {
          ...task,
          completed: !task.completed,
          updatedAt: new Date()
        };

        const taskIndex = tasks.findIndex(t => t.id === taskId);
        tasks[taskIndex] = updatedTask;
        this.saveTasks(tasks);
        
        resolve(updatedTask);
      }, 300);
    });
  }
}