export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user';
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
