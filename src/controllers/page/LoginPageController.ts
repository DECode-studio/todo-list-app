import { makeAutoObservable } from 'mobx';
import { authController } from '../data/AuthController';
import { LoginCredentials } from '../../types';
import Navigate from '../service/navigator';
import Path from '@/services/PathRoutes';

export class LoginPageController {
  formData: LoginCredentials = {
    email: '',
    password: ''
  };
  
  showPassword: boolean = false;
  
  constructor() {
    makeAutoObservable(this);
  }

  updateFormField(field: keyof LoginCredentials, value: string): void {
    this.formData[field] = value;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async handleSubmit(): Promise<boolean> {
    if (!this.formData.email || !this.formData.password) {
      return false;
    }

    const success = await authController.login(this.formData);
    
    if (success) {
      this.resetForm();
      Navigate.Replace(Path.DASHBOARD_ROUTE)
    }
    
    return success;
  }

  resetForm(): void {
    this.formData = {
      email: '',
      password: ''
    };
    this.showPassword = false;
  }

  get isFormValid(): boolean {
    return this.formData.email.trim() !== '' && 
           this.formData.password.trim() !== '' &&
           this.formData.email.includes('@');
  }

  get isLoading(): boolean {
    return authController.isLoading;
  }

  get error(): string | null {
    return authController.error;
  }
}

export const loginPageController = new LoginPageController();