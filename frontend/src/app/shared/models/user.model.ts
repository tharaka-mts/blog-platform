export interface User {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
  is_active: number;
  is_deleted: number;
  created_at: string;
}

export interface AuthUser {
  id: number;
  email: string;
  username?: string;
  role: 'ADMIN' | 'USER';
}
