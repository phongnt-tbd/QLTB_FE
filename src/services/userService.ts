import { User, UserRole } from '@/types';

export const userService = {
  createUser(input: Omit<User, 'id' | 'avatar' | 'createdAt' | 'isLocked'>): User {
    const id = Math.random().toString(36).slice(2, 11);
    const avatar = `https://picsum.photos/seed/${input.username}/200`;
    return {
      ...input,
      id,
      avatar,
      isLocked: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
  },

  updateUser(existing: User, patch: Partial<User>): User {
    return { ...existing, ...patch };
  },

  toggleLock(user: User): User {
    return { ...user, isLocked: !user.isLocked };
  },

  resetPasswordMessage(user: User): string {
    // Sau này có thể thay bằng gọi API reset mật khẩu thực tế
    return `Mật khẩu của người dùng ${user.username} đã được reset về mặc định: password`;
  },

  isAdmin(user: User): boolean {
    return user.role === UserRole.SYSTEM_ADMIN;
  },
};

