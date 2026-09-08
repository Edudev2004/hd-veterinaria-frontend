export interface UserSession {
  id: string;
  email: string;
  name?: string;
  role?: string;
  token?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserSession | null;
  loading: boolean;
  error: string | null;
  failedAttempts: number;
  isLocked: boolean;
}
