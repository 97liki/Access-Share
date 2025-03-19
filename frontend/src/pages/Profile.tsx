import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import MyDonations from '../components/MyDonations';
import { userApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone_number: string | null;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // If we have user data from auth context, use it as a fallback
        if (user) {
          setProfile(user as UserProfile);
        }
        
        // Try to fetch profile from API
        try {
          const profileData = await userApi.getProfile();
          if (profileData) {
            setProfile(profileData);
          }
        } catch (profileError: any) {
          console.error('Error fetching profile:', profileError);
          // If we don't have user data from auth context either, show error
          if (!user) {
            setError('Could not load profile information');
          }
        }
      } catch (error: any) {
        console.error('Error in fetchData:', error);
        setError(error.message || 'Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const renderProfileInfo = () => {
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
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <div className="flex items-center gap-x-4 mb-4 pb-4 border-b border-gray-200">
                <div className="bg-blue-50 rounded-full p-2.5">
                  <UserCircleIcon className="h-10 w-10 text-blue-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {profile?.full_name || 'User'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage your personal information
                  </p>
                </div>
              </div>
            </div>

            <div className="sm:col-span-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-bold text-gray-900 mb-1">Username</p>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-x-3">
                      <UserCircleIcon className="h-5 w-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
                      <p className="text-base text-gray-700 truncate">{profile?.username || 'Not available'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-bold text-gray-900 mb-1">Email</p>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-x-3">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
                      <p className="text-base text-gray-700 truncate">{profile?.email || 'Not available'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-bold text-gray-900 mb-1">Phone Number</p>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-x-3">
                      <PhoneIcon className="h-5 w-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
                      <p className="text-base text-gray-700 truncate">{profile?.phone_number || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
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
          {/* Profile Information */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-lg font-bold leading-7 text-gray-900">Profile Information</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Your personal information.
              </p>
            </div>

            {isLoading ? (
              <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                <div className="p-8 text-center">
                  <p className="text-gray-500">Loading profile information...</p>
                </div>
              </div>
            ) : (
              renderProfileInfo()
            )}
          </div>

          {/* My Donations */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-lg font-bold leading-7 text-gray-900">My Donations</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                View and manage your donations and listings.
              </p>
            </div>
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
              <div className="p-4 sm:p-6 lg:p-8">
                <MyDonations />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 