'use client';

import { useState } from 'react';
import { Bell, Shield, Users } from 'lucide-react';

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your admin account settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-900">Push Notifications</p>
              <p className="text-sm text-gray-500">Receive notifications for new orders and updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Security</h2>
          </div>
          <div className="space-y-4">
            <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Change Password
            </button>
            <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Enable Two-Factor Authentication
            </button>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Users className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Admin Users</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Manage admin users and permissions
          </p>
          <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            Manage Users
          </button>
        </div>
      </div>
    </div>
  );
}

