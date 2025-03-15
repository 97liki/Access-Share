import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  KeyIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

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

export default function Settings() {
  const [settings, setSettings] = useState(userSettings);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    // TODO: Implement API call to save settings
    console.log('Saving settings:', settings);
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    console.log('Deleting account');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-10 divide-y divide-gray-900/10">
          {/* Account Settings */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Account Settings</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Manage your account information and preferences.
              </p>
            </div>

            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
              <div className="px-4 py-6 sm:p-8">
                <div className="max-w-2xl space-y-10">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={settings.account.email}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            account: { ...settings.account, email: e.target.value },
                          })
                        }
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                      Phone number
                    </label>
                    <div className="mt-2">
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={settings.account.phone}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            account: { ...settings.account, phone: e.target.value },
                          })
                        }
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="language" className="block text-sm font-medium leading-6 text-gray-900">
                      Language
                    </label>
                    <div className="mt-2">
                      <select
                        id="language"
                        name="language"
                        value={settings.account.language}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            account: { ...settings.account, language: e.target.value },
                          })
                        }
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      >
                        {languages.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium leading-6 text-gray-900">
                      Timezone
                    </label>
                    <div className="mt-2">
                      <select
                        id="timezone"
                        name="timezone"
                        value={settings.account.timezone}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            account: { ...settings.account, timezone: e.target.value },
                          })
                        }
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      >
                        {timezones.map((tz) => (
                          <option key={tz.value} value={tz.value}>
                            {tz.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Privacy Settings</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Control your privacy and data sharing preferences.
              </p>
            </div>

            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
              <div className="px-4 py-6 sm:p-8">
                <div className="max-w-2xl space-y-10">
                  <div>
                    <label htmlFor="profile-visibility" className="block text-sm font-medium leading-6 text-gray-900">
                      Profile Visibility
                    </label>
                    <div className="mt-2">
                      <select
                        id="profile-visibility"
                        name="profile-visibility"
                        value={settings.privacy.profileVisibility}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            privacy: { ...settings.privacy, profileVisibility: e.target.value },
                          })
                        }
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="friends">Friends Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-x-3">
                      <input
                        id="show-location"
                        name="show-location"
                        type="checkbox"
                        checked={settings.privacy.showLocation}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            privacy: { ...settings.privacy, showLocation: e.target.checked },
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                      />
                      <label htmlFor="show-location" className="block text-sm font-medium leading-6 text-gray-900">
                        Show my location
                      </label>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        id="show-contact-info"
                        name="show-contact-info"
                        type="checkbox"
                        checked={settings.privacy.showContactInfo}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            privacy: { ...settings.privacy, showContactInfo: e.target.checked },
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                      />
                      <label htmlFor="show-contact-info" className="block text-sm font-medium leading-6 text-gray-900">
                        Show contact information
                      </label>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        id="show-activity-history"
                        name="show-activity-history"
                        type="checkbox"
                        checked={settings.privacy.showActivityHistory}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            privacy: { ...settings.privacy, showActivityHistory: e.target.checked },
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                      />
                      <label htmlFor="show-activity-history" className="block text-sm font-medium leading-6 text-gray-900">
                        Show activity history
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Account Actions</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Manage your account and data.
              </p>
            </div>

            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
              <div className="px-4 py-6 sm:p-8">
                <div className="max-w-2xl space-y-10">
                  <div>
                    <h3 className="text-sm font-medium leading-6 text-gray-900">Change Password</h3>
                    <div className="mt-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        <KeyIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Change password
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium leading-6 text-gray-900">Export Data</h3>
                    <div className="mt-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        <ArrowRightOnRectangleIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Export my data
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium leading-6 text-red-600">Delete Account</h3>
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
                      >
                        <TrashIcon className="-ml-0.5 h-5 w-5 text-red-400" aria-hidden="true" />
                        Delete account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">
                      Delete Account
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete your account? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 