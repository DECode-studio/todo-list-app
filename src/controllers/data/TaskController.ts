import { makeAutoObservable } from 'mobx';
import { TaskService } from '../../services/TaskService';
import { Task, TaskStatus, TaskState } from '../../types';
import { ApiResponse } from '@/types/api';
import Api from '@/services/ApiRoutes';
import { DELETE, GET, PATCH, POST } from '../service/http-request';

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
        return this.tasks.filter(task => !(task.status == TaskStatus.COMPLETED));
      case TaskStatus.COMPLETED:
        return this.tasks.filter(task => (task.status == TaskStatus.COMPLETED));
      default:
        return this.tasks;
    }
  }

  get taskStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(task => (task.status == TaskStatus.COMPLETED)).length;
    const pending = total - completed;

    return {
      total,
      completed,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }

  async loadTasks(): Promise<void> {
    try {
      this.isLoading = true;
      this.error = null;

      const url = `${Api.BASE_URL}${Api.TASK_GET}`
      const res = await GET<ApiResponse<Task[]>>(url)
      const data = res?.data ?? {}

      if (data?.status?.code == 200) {
        const tasks = data.data ?? []
        this.tasks = tasks.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      this.error = data?.status?.message ?? ''
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to load tasks';
    } finally {
      this.isLoading = false;
    }
  }

  async createTask(
    taskData: { title: string; description: string; }
  ): Promise<boolean> {
    try {
      this.isLoading = true;
      this.error = null;

      const url = `${Api.BASE_URL}${Api.TASK_ADD}`
      const res = await POST<ApiResponse<any>>(url, taskData)
      const data = res?.data ?? {}

      if (data?.status?.code == 200) {
        return true
      }

      this.error = data?.status?.message ?? ''
      return false
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to create task';
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  async updateTask(
    taskId: string,
    updates: { title?: string; description?: string, status?: TaskStatus }
  ): Promise<boolean> {
    try {
      this.isLoading = true;
      this.error = null;

      const url = `${Api.BASE_URL}${Api.TASK_EDIT}?id=${taskId}`
      const res = await PATCH<ApiResponse<Task>>(url, updates)
      const data = res?.data ?? {}

      if (data?.status?.code == 200) {
        const index = this.tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
          this.tasks[index] = data.data;
        }

        return true;
      }

      this.error = data?.status?.message ?? ''
      return false;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to update task';
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  async toggleTaskStatus(task: Task): Promise<void> {
    try {
      if (task.status == TaskStatus.COMPLETED) {
        task.status = TaskStatus.PENDING
      } else if (task.status == TaskStatus.PENDING) {
        task.status = TaskStatus.COMPLETED
      }

      const req = {
        title: task.title,
        description: task.description,
        status: task.status
      }

      const url = `${Api.BASE_URL}${Api.TASK_EDIT}?id=${task.id}`
      const res = await PATCH<ApiResponse<Task>>(url, req)
      const data = res?.data ?? {}

      if (data?.status?.code != 200) {
        this.error = data?.status?.message ?? ''
      }

      const index = this.tasks.findIndex(task => task.id === data.data?.id);
      if (index !== -1) {
        this.tasks[index] = data.data;
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to toggle task status';
    }
  }

  async deleteTask(taskId: string): Promise<boolean> {
    try {
      this.isLoading = true;
      this.error = null;

      const url = `${Api.BASE_URL}${Api.TASK_DELETE}?id=${taskId}`
      const res = await DELETE<ApiResponse<Task>>(url)
      const data = res?.data ?? {}

      if (data?.status?.code == 200) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        return true;
      }

      this.error = data?.status?.message ?? ''
      return false
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

export const taskController = new TaskController();