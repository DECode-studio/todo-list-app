import { makeAutoObservable } from 'mobx';
import { AuthService } from '../../services/AuthService';
import { User, LoginCredentials, RegisterCredentials, AuthState } from '../../types';

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
      
      const user = await AuthService.login(credentials);
      
      this.user = user;
      this.isLoggedIn = true;
      
      return true;
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

      // Validate passwords match
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const user = await AuthService.register(credentials);
      
      this.user = user;
      this.isLoggedIn = true;
      
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