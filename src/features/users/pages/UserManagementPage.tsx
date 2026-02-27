import React, { useMemo, useState } from 'react';
import { User, UserRole } from '@/types';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { UserTable } from '../components/UserTable';
import { UserFormModal, UserFormValues } from '../components/UserFormModal';
import { userService } from '@/services/userService';

export interface UserManagementPageProps {
  users: User[];
  onCreateUser: (input: Omit<User, 'id' | 'avatar' | 'createdAt' | 'isLocked'>) => void;
  onUpdateUser: (userId: string, patch: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
  onToggleUserLock: (userId: string) => void;
}

export const UserManagementPage: React.FC<UserManagementPageProps> = ({
  users,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
  onToggleUserLock,
}) => {
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.fullName.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.username.toLowerCase().includes(search.toLowerCase()),
      ),
    [users, search],
  );

  const handleResetPassword = (user: User) => {
    const msg = userService.resetPasswordMessage(user);
    // Hiện tại vẫn dùng alert đơn giản, có thể thay bằng toast sau
    // để không trộn logic vào UI, text sinh ra từ service
    window.alert(msg);
  };

  const handleSubmitForm = (data: UserFormValues) => {
    if (editingUser) {
      onUpdateUser(editingUser.id, data);
    } else {
      onCreateUser(data);
    }
    setEditingUser(null);
    setIsModalOpen(false);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm theo tên, email, username..."
          className="w-full sm:w-96"
        />
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <i className="fas fa-plus mr-2" />
          Thêm người dùng
        </Button>
      </div>

      <UserTable
        users={filteredUsers}
        onEdit={handleEdit}
        onToggleLock={onToggleUserLock}
        onDelete={onDeleteUser}
        onResetPassword={handleResetPassword}
      />

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleSubmitForm}
        initialUser={editingUser || undefined}
      />
    </div>
  );
};

