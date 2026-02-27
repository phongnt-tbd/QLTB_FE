import React, { useEffect, useState } from 'react';
import { User, UserRole } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FormField } from '../../../components/ui/FormField';

export interface UserFormValues {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
}

export interface UserFormModalProps {
  isOpen: boolean;
  initialUser?: User;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  initialUser,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState<UserFormValues>({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    role: UserRole.TECHNICIAN,
  });

  useEffect(() => {
    if (!initialUser) {
      setValues({
        username: '',
        fullName: '',
        email: '',
        phone: '',
        role: UserRole.TECHNICIAN,
      });
    } else {
      setValues({
        username: initialUser.username,
        fullName: initialUser.fullName,
        email: initialUser.email,
        phone: initialUser.phone,
        role: initialUser.role,
      });
    }
  }, [initialUser]);

  const handleChange =
    (field: keyof UserFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const title = initialUser ? 'Cập nhật nhân sự' : 'Thêm nhân sự mới';
  const iconClass = initialUser ? 'fas fa-user-edit' : 'fas fa-user-plus';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      iconClassName={`${iconClass} mr-0 text-blue-600`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField label="Tên đăng nhập" htmlFor="username">
          <Input
            id="username"
            name="username"
            required
            placeholder="Ví dụ: nva_it"
            value={values.username}
            onChange={handleChange('username')}
          />
        </FormField>

        <FormField label="Họ và tên" htmlFor="fullName">
          <Input
            id="fullName"
            name="fullName"
            required
            placeholder="Ví dụ: Nguyễn Văn A"
            value={values.fullName}
            onChange={handleChange('fullName')}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4">
          <FormField label="Email" htmlFor="email">
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="example@uni.edu.vn"
              value={values.email}
              onChange={handleChange('email')}
            />
          </FormField>
          <FormField label="Số điện thoại" htmlFor="phone">
            <Input
              id="phone"
              name="phone"
              required
              placeholder="09xxxxxxx"
              value={values.phone}
              onChange={handleChange('phone')}
            />
          </FormField>
        </div>

        <FormField label="Vai trò hệ thống" htmlFor="role">
          <select
            id="role"
            name="role"
            value={values.role}
            onChange={handleChange('role')}
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none cursor-pointer"
          >
            {Object.values(UserRole).map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </FormField>

        <div className="mt-8 flex gap-4">
          <Button type="submit" className="flex-1">
            Lưu thông tin
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="px-8 py-4 text-slate-400"
            onClick={onClose}
          >
            Hủy
          </Button>
        </div>
      </form>
    </Modal>
  );
};

