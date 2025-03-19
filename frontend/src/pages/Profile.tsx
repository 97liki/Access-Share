import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  HeartIcon,
  DevicePhoneMobileIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import MyDonations from '../components/MyDonations';

// Mock data - replace with API call
const userProfile = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  bio: 'Passionate about helping others and making a difference in the community.',
  bloodType: 'A+',
  preferences: {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    bloodDonationReminders: true,
    deviceRequestNotifications: true,
    caregiverRequestNotifications: true,
  },
  activityHistory: [
    {
      id: 1,
      type: 'blood_donation',
      title: 'Blood Donation',
      description: 'Donated blood at San Francisco General Hospital',
      date: '2024-03-15T10:00:00',
      status: 'completed',
    },
    {
      id: 2,
      type: 'device_request',
      title: 'Device Request',
      description: 'Requested a wheelchair from Alice Johnson',
      date: '2024-03-10T14:30:00',
      status: 'pending',
    },
    {
      id: 3,
      type: 'caregiver_request',
      title: 'Caregiver Request',
      description: 'Requested medical care from Sarah Wilson',
      date: '2024-03-05T09:15:00',
      status: 'completed',
    },
  ],
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(userProfile);

  const handleSave = () => {
    // TODO: Implement API call to save profile
    setIsEditing(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'blood_donation':
        return <HeartIcon className="h-5 w-5 text-red-500" />;
      case 'device_request':
        return <DevicePhoneMobileIcon className="h-5 w-5 text-blue-500" />;
      case 'caregiver_request':
        return <UserCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-10 divide-y divide-gray-900/10">
          {/* Profile Information */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Profile Information</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Update your personal information and preferences.
              </p>
            </div>

            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
              <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full">
                    <div className="flex items-center gap-x-3">
                      <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                      <button
                        type="button"
                        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Change avatar
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                      Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        disabled={!isEditing}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        disabled={!isEditing}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                      Phone
                    </label>
                    <div className="mt-2">
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        disabled={!isEditing}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                      Location
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="location"
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        disabled={!isEditing}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label htmlFor="bio" className="block text-sm font-medium leading-6 text-gray-900">
                      Bio
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        disabled={!isEditing}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleSave}
                    className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Notification Preferences</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Choose how you want to be notified about updates.
              </p>
            </div>

            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
              <div className="px-4 py-6 sm:p-8">
                <div className="max-w-2xl space-y-10">
                  <fieldset>
                    <legend className="text-sm font-medium leading-6 text-gray-900">Notification Channels</legend>
                    <div className="mt-6 space-y-6">
                      <div className="flex items-center gap-x-3">
                        <input
                          id="email-notifications"
                          name="email-notifications"
                          type="checkbox"
                          checked={profile.preferences.emailNotifications}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              preferences: {
                                ...profile.preferences,
                                emailNotifications: e.target.checked,
                              },
                            })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                        />
                        <label htmlFor="email-notifications" className="block text-sm font-medium leading-6 text-gray-900">
                          Email notifications
                        </label>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <input
                          id="push-notifications"
                          name="push-notifications"
                          type="checkbox"
                          checked={profile.preferences.pushNotifications}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              preferences: {
                                ...profile.preferences,
                                pushNotifications: e.target.checked,
                              },
                            })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                        />
                        <label htmlFor="push-notifications" className="block text-sm font-medium leading-6 text-gray-900">
                          Push notifications
                        </label>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <input
                          id="sms-notifications"
                          name="sms-notifications"
                          type="checkbox"
                          checked={profile.preferences.smsNotifications}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              preferences: {
                                ...profile.preferences,
                                smsNotifications: e.target.checked,
                              },
                            })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                        />
                        <label htmlFor="sms-notifications" className="block text-sm font-medium leading-6 text-gray-900">
                          SMS notifications
                        </label>
                      </div>
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="text-sm font-medium leading-6 text-gray-900">Notification Types</legend>
                    <div className="mt-6 space-y-6">
                      <div className="flex items-center gap-x-3">
                        <input
                          id="blood-donation-reminders"
                          name="blood-donation-reminders"
                          type="checkbox"
                          checked={profile.preferences.bloodDonationReminders}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              preferences: {
                                ...profile.preferences,
                                bloodDonationReminders: e.target.checked,
                              },
                            })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                        />
                        <label htmlFor="blood-donation-reminders" className="block text-sm font-medium leading-6 text-gray-900">
                          Blood donation reminders
                        </label>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <input
                          id="device-request-notifications"
                          name="device-request-notifications"
                          type="checkbox"
                          checked={profile.preferences.deviceRequestNotifications}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              preferences: {
                                ...profile.preferences,
                                deviceRequestNotifications: e.target.checked,
                              },
                            })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                        />
                        <label htmlFor="device-request-notifications" className="block text-sm font-medium leading-6 text-gray-900">
                          Device request notifications
                        </label>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <input
                          id="caregiver-request-notifications"
                          name="caregiver-request-notifications"
                          type="checkbox"
                          checked={profile.preferences.caregiverRequestNotifications}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              preferences: {
                                ...profile.preferences,
                                caregiverRequestNotifications: e.target.checked,
                              },
                            })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                        />
                        <label htmlFor="caregiver-request-notifications" className="block text-sm font-medium leading-6 text-gray-900">
                          Caregiver request notifications
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
              <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Save preferences
                </button>
              </div>
            </div>
          </div>

          {/* My Donations */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-base font-semibold leading-7 text-gray-900">My Donations</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Manage your blood donations, assistive devices, and caregiver services.
              </p>
            </div>

            <div className="md:col-span-2">
              <MyDonations />
            </div>
          </div>

          {/* Activity History */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Activity History</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Recent activity on your account.
              </p>
            </div>

            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
              <div className="px-4 py-6 sm:p-8">
                <div className="flow-root">
                  <ul role="list" className="-mb-8">
                    {profile.activityHistory.map((activity, activityIdx) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {activityIdx !== profile.activityHistory.length - 1 ? (
                            <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white ring-1 ring-gray-300">
                                {getActivityIcon(activity.type)}
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <p className="text-sm text-gray-500">
                                  {activity.description}{' '}
                                  <span className="font-medium text-gray-900">{activity.title}</span>
                                </p>
                                <p className="mt-0.5 text-sm text-gray-500">
                                  {new Date(activity.date).toLocaleString()}
                                </p>
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                <span
                                  className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                    activity.status === 'completed'
                                      ? 'bg-green-50 text-green-700 ring-green-600/20'
                                      : 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                                  }`}
                                >
                                  {activity.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 