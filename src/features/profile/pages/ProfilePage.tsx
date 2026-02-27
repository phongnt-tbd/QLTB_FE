import React, { useState } from 'react';
import { User } from '@/types';
import { ProfileTab } from '../types';
import { useProfileForm } from '../hooks/useProfileForm';
import { usePasswordForm } from '../hooks/usePasswordForm';
import { profileService } from '../services/profileService';
import { ProfileTabs } from '../components/ProfileTabs';
import { ProfileInfoForm } from '../components/ProfileInfoForm';
import { PasswordChangeForm } from '../components/PasswordChangeForm';

interface ProfilePageProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('info');
  const [loading, setLoading] = useState(false);

  const { formData, updateField, setFormData } = useProfileForm(user);
  const { passwords, updateField: updatePasswordField, resetForm: resetPasswordForm } = usePasswordForm();

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = profileService.validateProfileUpdate(formData);
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const updatedUser = profileService.updateProfile(user, formData);
      onUpdate(updatedUser);
      setLoading(false);
      alert('Cập nhật hồ sơ thành công!');
    }, 800);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = profileService.validatePasswordChange({
      currentPassword: passwords.current,
      newPassword: passwords.next,
      confirmPassword: passwords.confirm,
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    setLoading(true);
    try {
      await profileService.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.next,
        confirmPassword: passwords.confirm,
      });
      resetPasswordForm();
      alert('Đổi mật khẩu thành công!');
    } catch (error) {
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {activeTab === 'info' ? (
          <ProfileInfoForm
            user={user}
            formData={formData}
            loading={loading}
            onFieldChange={updateField}
            onAvatarChange={(avatar) => setFormData((prev) => ({ ...prev, avatar }))}
            onSubmit={handleInfoSubmit}
          />
        ) : (
          <PasswordChangeForm
            passwords={passwords}
            loading={loading}
            onFieldChange={updatePasswordField}
            onSubmit={handlePasswordSubmit}
          />
        )}
      </div>
    </div>
  );
};
