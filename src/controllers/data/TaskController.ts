import { makeAutoObservable } from 'mobx';
import { TaskService } from '../../services/TaskService';
import { Task, TaskStatus, TaskState } from '../../types';

export class TaskController {
  tasks: Task[] = [];
  filter: TaskStatus = TaskStatus.ALL;
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get taskState(): TaskState {
    return {
      tasks: this.tasks,
      filter: this.filter,
      isLoading: this.isLoading
    };
  }

  get filteredTasks(): Task[] {
    switch (this.filter) {
      case TaskStatus.PENDING:
        return this.tasks.filter(task => !task.completed);
      case TaskStatus.COMPLETED:
        return this.tasks.filter(task => task.completed);
      default:
        return this.tasks;
    }
  }

  get taskStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    return {
      total,
      completed,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }

  async loadTasks(userId: string): Promise<void> {
    try {
      this.isLoading = true;
      this.error = null;
      
      const tasks = await TaskService.getUserTasks(userId);
      this.tasks = tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to load tasks';
    } finally {
      this.isLoading = false;
    }
  }

  async createTask(taskData: { title: string; description: string; userId: string }): Promise<boolean> {
    try {
      this.isLoading = true;
      this.error = null;
      
      const newTask = await TaskService.createTask({
        ...taskData,
        completed: false
      });
      
      this.tasks.unshift(newTask);
      return true;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to create task';
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  async updateTask(taskId: string, updates: { title?: string; description?: string }): Promise<boolean> {
    try {
      this.isLoading = true;
      this.error = null;
      
      const updatedTask = await TaskService.updateTask(taskId, updates);
      
      const index = this.tasks.findIndex(task => task.id === taskId);
      if (index !== -1) {
        this.tasks[index] = updatedTask;
      }
      
      return true;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to update task';
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  async toggleTaskStatus(taskId: string): Promise<void> {
    try {
      const updatedTask = await TaskService.toggleTaskStatus(taskId);
      
      const index = this.tasks.findIndex(task => task.id === taskId);
      if (index !== -1) {
        this.tasks[index] = updatedTask;
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to toggle task status';
    }
  }

  async deleteTask(taskId: string): Promise<boolean> {
    try {
      this.isLoading = true;
      this.error = null;
      
      await TaskService.deleteTask(taskId);
      
      this.tasks = this.tasks.filter(task => task.id !== taskId);
      return true;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to delete task';
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  setFilter(filter: TaskStatus): void {
    this.filter = filter;
  }

  clearError(): void {
    this.error = null;
  }
}

// Create a singleton instance
export const taskController = new TaskController();