"use client";

import { useAuth } from "@/context/AuthContext";
import {
  User,
  Lock,
  Bell,
  Building2,
  Trash2,
  AlertTriangle,
} from "lucide-react";

export default function RecruiterSettings() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-brand-primary">
            <User size={20} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Account Information</p>
            <p className="text-sm text-gray-500">Your basic account details</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Email</p>
              <p className="text-sm text-gray-500">
                {user?.email || "Not available"}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Account Type</p>
              <p className="text-sm text-gray-500 capitalize">
                {user?.role || "Recruiter"}
              </p>
            </div>
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
              Recruiter
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">User ID</p>
              <p className="text-sm text-gray-500">
                {user?.userId || "Not available"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
            <Lock size={20} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Security</p>
            <p className="text-sm text-gray-500">Manage your password</p>
          </div>
        </div>

        <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
          Change Password
        </button>
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="font-semibold text-red-900">Danger Zone</p>
            <p className="text-sm text-red-700">Irreversible actions</p>
          </div>
        </div>

        <button className="flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
          <Trash2 size={16} />
          Delete Account
        </button>
      </div>
    </div>
  );
}
