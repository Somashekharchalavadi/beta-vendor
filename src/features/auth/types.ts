export type UserRole = "admin" | "vendor";

export type AuthUser = {
  id: string;
  name: string;
  email?: string;
  mobileNumber?: string;
  role: UserRole;
  isActive: boolean;
  loginCount?: number;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};
