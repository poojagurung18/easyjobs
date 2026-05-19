"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { adminService } from "@/lib/api/admin";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, Shield, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

import ConfirmModal from "@/components/common/ConfirmModal";

export default function AdminSettings() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const deleteAccountMutation = useMutation({
    mutationFn: () => adminService.deleteOwnAccount(),
    onSuccess: () => {
      toast.success("Account deleted successfully");
      logout();
      router.push("/login");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete account");
      setIsDeleteModalOpen(false);
    },
  });

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600">Manage your admin account</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-brand-primary">
            <Shield size={20} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Account Information</p>
            <p className="text-sm text-gray-500">Your admin account details</p>
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
              <p className="text-sm text-gray-500">Administrator</p>
            </div>
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
              Admin
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
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
            <Shield size={20} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Security</p>
            <p className="text-sm text-gray-500">
              Manage your account security
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Password</p>
              <p className="text-sm text-gray-500">Last changed: Never</p>
            </div>
            <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
              Change Password
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="font-semibold text-red-900">Danger Zone</p>
            <p className="text-sm text-red-700">
              Irreversible and destructive actions
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          <Trash2 size={16} />
          Delete My Admin Account
        </button>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your admin account? This action cannot be undone and all your data will be permanently lost."
        type="danger"
      />
    </div>
  );
}
