export type UserRole = 'root' | 'admin' | 'recognizer' | 'viewer';

export interface User {
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
}