import { useState } from 'react';
import { PasswordFormData } from '../types';

export const usePasswordForm = () => {
  const [passwords, setPasswords] = useState<PasswordFormData>({
    current: '',
    next: '',
    confirm: '',
  });

  const updateField = (field: keyof PasswordFormData, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setPasswords({
      current: '',
      next: '',
      confirm: '',
    });
  };

  return {
    passwords,
    updateField,
    resetForm,
  };
};
