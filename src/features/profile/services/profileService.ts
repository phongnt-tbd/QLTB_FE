import { User } from '@/types';
import { UpdateProfileDTO, ChangePasswordDTO } from '../types';

export const profileService = {
  /**
   * Validate profile update data
   */
  validateProfileUpdate: (dto: UpdateProfileDTO): string[] => {
    const errors: string[] = [];

    if (!dto.fullName?.trim()) {
      errors.push('Họ và tên không được để trống');
    }

    if (!dto.email?.trim()) {
      errors.push('Email không được để trống');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email)) {
      errors.push('Email không hợp lệ');
    }

    if (!dto.phone?.trim()) {
      errors.push('Số điện thoại không được để trống');
    } else if (!/^[0-9]{10,11}$/.test(dto.phone.replace(/\s/g, ''))) {
      errors.push('Số điện thoại không hợp lệ');
    }

    return errors;
  },

  /**
   * Validate password change
   */
  validatePasswordChange: (dto: ChangePasswordDTO): string[] => {
    const errors: string[] = [];

    if (!dto.currentPassword) {
      errors.push('Vui lòng nhập mật khẩu hiện tại');
    }

    if (!dto.newPassword) {
      errors.push('Vui lòng nhập mật khẩu mới');
    } else if (dto.newPassword.length < 6) {
      errors.push('Mật khẩu mới phải có ít nhất 6 ký tự');
    }

    if (dto.newPassword !== dto.confirmPassword) {
      errors.push('Mật khẩu xác nhận không khớp');
    }

    return errors;
  },

  /**
   * Update user profile
   */
  updateProfile: (user: User, dto: UpdateProfileDTO): User => {
    return {
      ...user,
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      avatar: dto.avatar,
    };
  },

  /**
   * Simulate password change (in real app, this would call API)
   */
  changePassword: async (dto: ChangePasswordDTO): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 800);
    });
  },
};
