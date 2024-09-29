export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id: number | null;
  username: string;
  role: UserRole
}

export interface UserCredentials extends User {
  password: string;
}
