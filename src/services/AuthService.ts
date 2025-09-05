import Navigate from '@/controllers/service/navigator';
import { User, LoginCredentials, RegisterCredentials } from '../types';
import Path from './PathRoutes';
import Session from '@/controllers/service/session';
const DUMMY_USERS = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    email: 'jane@example.com', 
    password: 'password123',
    name: 'Jane Smith',
    createdAt: new Date('2024-01-02')
  }
];

export class AuthService {
  private static readonly STORAGE_KEY = 'todo_user';
  
  static login(credentials: LoginCredentials): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = DUMMY_USERS.find(u => 
          u.email === credentials.email && u.password === credentials.password
        );
        
        if (user) {
          const userWithoutPassword = {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt
          };
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userWithoutPassword));
          resolve(userWithoutPassword);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  }

  static register(credentials: RegisterCredentials): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = DUMMY_USERS.find(u => u.email === credentials.email);
        if (existingUser) {
          reject(new Error('User already exists with this email'));
          return;
        }

        const newUser = {
          id: Date.now().toString(),
          email: credentials.email,
          name: credentials.name,
          createdAt: new Date()
        };

        DUMMY_USERS.push({
          ...newUser,
          password: credentials.password
        });

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newUser));
        resolve(newUser);
      }, 500);
    });
  }

  static logout(): void {
    Session.removeToken()
    Navigate.Replace(Path.SIGN_IN_ROUTE)
  }

  static getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem(this.STORAGE_KEY);
      if (userStr) {
        const user = JSON.parse(userStr);
        return {
          ...user,
          createdAt: new Date(user.createdAt)
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  static isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }
}