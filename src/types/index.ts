export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export type LoginCredentials = {
  email: string;
  password: string;
}

export type RegisterCredentials = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type MotivationalQuote = {
  id: number;
  text: string;
  author: string;
}

export enum TaskStatus {
  ALL = 'ALL',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED'
}

export type AuthState = {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

export type TaskState = {
  tasks: Task[];
  filter: TaskStatus;
  isLoading: boolean;
}

export type QuoteState = {
  currentQuote: MotivationalQuote | null;
  isLoading: boolean;
}