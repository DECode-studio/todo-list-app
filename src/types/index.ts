// Global types for the To-Do application

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface MotivationalQuote {
  id: number;
  text: string;
  author: string;
}

export enum TaskStatus {
  ALL = 'all',
  PENDING = 'pending',
  COMPLETED = 'completed'
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

export interface TaskState {
  tasks: Task[];
  filter: TaskStatus;
  isLoading: boolean;
}

export interface QuoteState {
  currentQuote: MotivationalQuote | null;
  isLoading: boolean;
}