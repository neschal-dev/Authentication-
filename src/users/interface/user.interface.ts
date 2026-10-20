export interface CreateUserInput {
  fullname: string;
  email: string;
  passwordHash: string;
}

export interface SafeUser {
  id: string;
  fullname: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithPassword extends SafeUser {
  password: string;
}
