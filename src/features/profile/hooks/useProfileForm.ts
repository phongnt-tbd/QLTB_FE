import { useState } from 'react';
import { User } from '@/types';
import { ProfileFormData } from '../types';

export const useProfileForm = (user: User) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
  });

  const updateField = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
    });
  };

  return {
    formData,
    updateField,
    resetForm,
    setFormData,
  };
};
