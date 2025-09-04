import { makeAutoObservable } from 'mobx';
import { authController } from '../data/AuthController';
import { taskController } from '../data/TaskController';
import { quoteController } from '../data/QuoteController';
import { TaskStatus } from '../../types';

export class DashboardPageController {
  isCreateTaskModalOpen: boolean = false;
  selectedTaskId: string | null = null;
  isEditModalOpen: boolean = false;
  
  newTaskForm = {
    title: '',
    description: ''
  };

  editTaskForm = {
    title: '',
    description: ''
  };
  
  constructor() {
    makeAutoObservable(this);
  }

  async initialize(): Promise<void> {
    const user = authController.user;
    if (user) {
      // Load user tasks and daily quote in parallel
      await Promise.all([
        taskController.loadTasks(user.id),
        quoteController.loadDailyQuote()
      ]);
    }
  }

  // Create Task Modal Management
  openCreateTaskModal(): void {
    this.isCreateTaskModalOpen = true;
    this.newTaskForm = { title: '', description: '' };
  }

  closeCreateTaskModal(): void {
    this.isCreateTaskModalOpen = false;
    this.newTaskForm = { title: '', description: '' };
  }

  updateNewTaskField(field: 'title' | 'description', value: string): void {
    this.newTaskForm[field] = value;
  }

  async handleCreateTask(): Promise<boolean> {
    const user = authController.user;
    if (!user || !this.newTaskForm.title.trim()) {
      return false;
    }

    const success = await taskController.createTask({
      title: this.newTaskForm.title.trim(),
      description: this.newTaskForm.description.trim(),
      userId: user.id
    });

    if (success) {
      this.closeCreateTaskModal();
    }

    return success;
  }

  // Edit Task Modal Management
  openEditTaskModal(taskId: string): void {
    const task = taskController.tasks.find(t => t.id === taskId);
    if (task) {
      this.selectedTaskId = taskId;
      this.editTaskForm = {
        title: task.title,
        description: task.description
      };
      this.isEditModalOpen = true;
    }
  }

  closeEditTaskModal(): void {
    this.isEditModalOpen = false;
    this.selectedTaskId = null;
    this.editTaskForm = { title: '', description: '' };
  }

  updateEditTaskField(field: 'title' | 'description', value: string): void {
    this.editTaskForm[field] = value;
  }

  async handleUpdateTask(): Promise<boolean> {
    if (!this.selectedTaskId || !this.editTaskForm.title.trim()) {
      return false;
    }

    const success = await taskController.updateTask(this.selectedTaskId, {
      title: this.editTaskForm.title.trim(),
      description: this.editTaskForm.description.trim()
    });

    if (success) {
      this.closeEditTaskModal();
    }

    return success;
  }

  // Task Actions
  async toggleTaskStatus(taskId: string): Promise<void> {
    await taskController.toggleTaskStatus(taskId);
  }

  async deleteTask(taskId: string): Promise<void> {
    await taskController.deleteTask(taskId);
  }

  // Filter Management
  setTaskFilter(filter: TaskStatus): void {
    taskController.setFilter(filter);
  }

  // Quote Actions
  async refreshQuote(): Promise<void> {
    await quoteController.refreshQuote();
  }

  // Logout
  handleLogout(): void {
    authController.logout();
  }

  // Getters
  get user() {
    return authController.user;
  }

  get tasks() {
    return taskController.filteredTasks;
  }

  get taskStats() {
    return taskController.taskStats;
  }

  get currentFilter() {
    return taskController.filter;
  }

  get currentQuote() {
    return quoteController.currentQuote;
  }

  get isTasksLoading() {
    return taskController.isLoading;
  }

  get isQuoteLoading() {
    return quoteController.isLoading;
  }

  get taskError() {
    return taskController.error;
  }

  get quoteError() {
    return quoteController.error;
  }

  get isNewTaskFormValid() {
    return this.newTaskForm.title.trim() !== '';
  }

  get isEditTaskFormValid() {
    return this.editTaskForm.title.trim() !== '';
  }
}

export const dashboardPageController = new DashboardPageController();