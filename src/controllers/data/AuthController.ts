import { makeAutoObservable } from 'mobx';
import { AuthService } from '../../services/AuthService';
import { User, LoginCredentials, RegisterCredentials, AuthState } from '../../types';
import Api from '@/services/ApiRoutes';
import { ApiResponse } from '@/types/api';
import { POST } from '../service/http-request';
import Session from '../service/session';

export class AuthController {
  user: User | null = null;
  isLoggedIn: boolean = false;
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.initializeAuth();
  }

  private initializeAuth() {
    const user = AuthService.getCurrentUser();
    if (user) {
      this.user = user;
      this.isLoggedIn = true;
    }
  }

  get authState(): AuthState {
    return {
      user: this.user,
      isLoggedIn: this.isLoggedIn,
      isLoading: this.isLoading
    };
  }

  async login(credentials: LoginCredentials): Promise<boolean> {
    try {
      this.isLoading = true;
      this.error = null;

      const url = `${Api.BASE_URL}${Api.AUTH_SIGN_IN}`
      const res = await POST<ApiResponse<any>>(url, credentials)
      const data = res?.data ?? {}

      if (data?.status?.code == 200) {
        Session.setToken(data.data?.token)

        this.user = data.data?.user;
        this.isLoggedIn = true;

        return true
      }

      this.error = data?.status?.message ?? ''
      return false;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Login failed';
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  async register(credentials: RegisterCredentials): Promise<boolean> {
    try {
      this.isLoading = true;
      this.error = null;

      const url = `${Api.BASE_URL}${Api.AUTH_REGISTER}`
      const res = await POST<ApiResponse<any>>(url, credentials)
      const data = res?.data ?? {}

      if (data?.status?.code == 200) {
        Session.setToken(data.data?.token)

        this.user = data.data?.user;
        this.isLoggedIn = true;

        return true
      }

      this.error = data?.status?.message ?? ''
      return true;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Registration failed';
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  logout(): void {
    AuthService.logout();
    this.user = null;
    this.isLoggedIn = false;
    this.error = null;
  }

  clearError(): void {
    this.error = null;
  }

  isUserLoggedIn(): boolean {
    return this.isLoggedIn && this.user !== null;
  }
}

// Create a singleton instance
export const authController = new AuthController();