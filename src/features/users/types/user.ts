export interface UserProfile {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  isActive: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  roleId: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  roleId?: string;
  isActive?: boolean;
}
