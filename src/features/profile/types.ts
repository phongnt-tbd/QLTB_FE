// Types for Profile feature
import type { User } from '@/types';

export interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface PasswordFormData {
  current: string;
  next: string;
  confirm: string;
}

export type ProfileTab = 'info' | 'password';

export interface UpdateProfileDTO {
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
