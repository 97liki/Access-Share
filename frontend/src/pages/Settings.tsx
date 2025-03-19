import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  KeyIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../services/api';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';

// Mock data - replace with API call
const userSettings = {
  account: {
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    language: 'en',
    timezone: 'America/Los_Angeles',
  },
  privacy: {
    profileVisibility: 'public',
    showLocation: true,
    showContactInfo: true,
    showActivityHistory: true,
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
  },
};

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
];

const timezones = [
  { value: 'America/Los_Angeles', name: 'Pacific Time (US & Canada)' },
  { value: 'America/New_York', name: 'Eastern Time (US & Canada)' },
  { value: 'Europe/London', name: 'London' },
  { value: 'Europe/Paris', name: 'Paris' },
  { value: 'Asia/Tokyo', name: 'Tokyo' },
];

interface UserProfile {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone_number: string | null;
}

export default function Settings() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    phone_number: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const navigate = useNavigate();
  const { user, deleteAccount } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // If we have user data from auth context, use it as a fallback
        if (user) {
          setProfile(user as UserProfile);
          setFormData({
            username: user.username || '',
            full_name: user.full_name || '',
            phone_number: user.phone_number || '',
          });
        }
        
        // Try to fetch profile from API
        try {
          const profileData = await userApi.getProfile();
          if (profileData) {
            setProfile(profileData);
            setFormData({
              username: profileData.username || '',
              full_name: profileData.full_name || '',
              phone_number: profileData.phone_number || '',
            });
          }
        } catch (profileError: any) {
          console.error('Error fetching profile:', profileError);
          // If we don't have user data from auth context either, show error
          if (!user) {
            setError('Could not load profile information');
          }
        }
      } catch (error: any) {
        console.error('Error in fetchProfile:', error);
        setError(error.message || 'Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const result = await userApi.updateProfile(formData);
      
      if (result) {
        setProfile(result);
        toast.success('Profile updated successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    // Validate password inputs
    if (!currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    
    if (!newPassword) {
      toast.error('Please enter a new password');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }
    
    if (passwordStrength < 2) {
      toast.error('Please use a stronger password');
      return;
    }
    
    try {
      setIsChangingPassword(true);
      const result = await userApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword
      });
      
      if (result.success) {
        toast.success('Password changed successfully');
        // Reset password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(result.message || 'Failed to change password');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteAccount();
      
      if (result.success) {
        toast.success('Your account has been successfully deleted');
        // Redirect to login page after successful deletion
        navigate('/login');
      } else {
        toast.error(result.message || 'Failed to delete account');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while deleting your account');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };
  
  const renderAccountSettings = () => {
    if (error && !profile) {
      return (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div className="p-8 text-center">
            <p className="text-red-500">{error}</p>
            <p className="mt-2 text-sm text-gray-500">Try refreshing the page or contact support if the problem persists.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="max-w-2xl space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label htmlFor="email" className="block text-sm font-bold leading-6 text-gray-900">
                Email Address
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                <span className="text-base text-gray-700">{profile?.email || 'Not available'}</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Your email address cannot be changed as it is linked to your account.</p>
            </div>
            
            <div>
              <label htmlFor="username" className="block text-sm font-bold leading-6 text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                    <UserCircleIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm font-bold leading-6 text-gray-900">
                Full Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="full_name"
                  id="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-bold leading-6 text-gray-900">
                Phone Number
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                    <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                  <input
                    type="text"
                    name="phone_number"
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPasswordSettings = () => {
    return (
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="max-w-2xl space-y-6">
            <div>
              <label htmlFor="current_password" className="block text-sm font-bold leading-6 text-gray-900">
                Current Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="current_password"
                  id="current_password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="new_password" className="block text-sm font-bold leading-6 text-gray-900">
                New Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="new_password"
                  id="new_password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    // Calculate password strength
                    const strength = calculatePasswordStrength(e.target.value);
                    setPasswordStrength(strength);
                  }}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {newPassword && <PasswordStrengthIndicator strength={passwordStrength} />}
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-sm font-bold leading-6 text-gray-900">
                Confirm New Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="confirm_password"
                  id="confirm_password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {confirmPassword && confirmPassword !== newPassword && (
                <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={handlePasswordChange}
                disabled={isChangingPassword}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChangingPassword ? 'Changing Password...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-10 divide-y divide-gray-900/10">
          {/* Account Settings */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-lg font-bold leading-7 text-gray-900">Account Settings</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Manage your account information and profile details.
              </p>
            </div>

            {isLoading ? (
              <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                <div className="p-8 text-center">
                  <p className="text-gray-500">Loading account settings...</p>
                </div>
              </div>
            ) : (
              renderAccountSettings()
            )}
          </div>

          {/* Password & Security */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-lg font-bold leading-7 text-gray-900">Password & Security</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Update your password and manage security settings.
              </p>
            </div>
            {renderPasswordSettings()}
          </div>

          {/* Delete Account */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-lg font-bold leading-7 text-gray-900">Delete Account</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600 text-red-500">
                This action is irreversible and will permanently delete your account.
              </p>
            </div>

            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
              <div className="px-4 py-6 sm:p-8">
                <div className="max-w-2xl space-y-6">
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Warning</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>
                            Deleting your account will remove all your personal information, donations, and history from our system.
                            This action cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!showDeleteConfirm ? (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="inline-flex items-center gap-x-1.5 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    >
                      <TrashIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                      Delete My Account
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-700">Are you sure you want to delete your account?</p>
                      <div className="flex gap-x-4">
                        <button
                          type="button"
                          onClick={handleDeleteAccount}
                          disabled={isDeleting}
                          className="inline-flex items-center gap-x-1.5 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate password strength
const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let strength = 0;
  
  // Length
  if (password.length >= 8) strength += 1;
  
  // Contains lowercase
  if (/[a-z]/.test(password)) strength += 1;
  
  // Contains uppercase
  if (/[A-Z]/.test(password)) strength += 1;
  
  // Contains number
  if (/[0-9]/.test(password)) strength += 1;
  
  // Contains special char
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
  
  return Math.min(strength, 4); // Max strength is 4
}; 