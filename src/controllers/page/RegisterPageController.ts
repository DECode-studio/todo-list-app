import { makeAutoObservable } from 'mobx';
import { authController } from '../data/AuthController';
import { RegisterCredentials } from '../../types';

export class RegisterPageController {
  formData: RegisterCredentials = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  
  constructor() {
    makeAutoObservable(this);
  }

  updateFormField(field: keyof RegisterCredentials, value: string): void {
    this.formData[field] = value;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async handleSubmit(): Promise<boolean> {
    const success = await authController.register(this.formData);
    
    if (success) {
      this.resetForm();
    }
    
    return success;
  }

  resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    this.showPassword = false;
    this.showConfirmPassword = false;
  }

  get isFormValid(): boolean {
    return this.formData.name.trim() !== '' && 
           this.formData.email.trim() !== '' &&
           this.formData.email.includes('@') &&
           this.formData.password.length >= 6 &&
           this.formData.password === this.formData.confirmPassword;
  }

  get passwordsMatch(): boolean {
    return this.formData.password === this.formData.confirmPassword;
  }

  get isLoading(): boolean {
    return authController.isLoading;
  }

  get error(): string | null {
    return authController.error;
  }
}

export const registerPageController = new RegisterPageController();