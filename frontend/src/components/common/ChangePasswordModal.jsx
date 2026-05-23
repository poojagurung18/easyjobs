"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, X, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { changePassword } from "@/api/user.api";

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required")
      .min(6, "Password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmPassword,
      });
      toast.success("Password changed successfully!");
      reset();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <Lock size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Change Password
              </h2>
              <p className="text-xs text-gray-500">
                Update your account password
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-6">
          {/* Current Password */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                placeholder="Enter your current password"
                {...register("currentPassword")}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all ${
                  errors.currentPassword
                    ? "border-red-300 focus:ring-2 focus:ring-red-200"
                    : "border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                }`}
              />
              <button
                type="button"
                onClick={() => toggleShowPassword("current")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                placeholder="Enter your new password"
                {...register("newPassword")}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all ${
                  errors.newPassword
                    ? "border-red-300 focus:ring-2 focus:ring-red-200"
                    : "border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                }`}
              />
              <button
                type="button"
                onClick={() => toggleShowPassword("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                placeholder="Confirm your new password"
                {...register("confirmPassword")}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all ${
                  errors.confirmPassword
                    ? "border-red-300 focus:ring-2 focus:ring-red-200"
                    : "border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                }`}
              />
              <button
                type="button"
                onClick={() => toggleShowPassword("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
