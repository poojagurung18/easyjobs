"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, Lock, Trash2, AlertTriangle } from "lucide-react";
import ChangePasswordModal from "@/components/common/ChangePasswordModal";

export default function RecruiterSettings() {
  const { user } = useAuth();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-secondary">Manage your account preferences</p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-hover text-brand-primary">
            <User size={20} />
          </div>
          <div>
            <p className="font-semibold text-foreground">Account Information</p>
            <p className="text-sm text-secondary">Your basic account details</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border py-3">
            <div>
              <p className="font-medium text-foreground">Email</p>
              <p className="text-sm text-secondary">{user?.email || "Not available"}</p>
            </div>
          </div>
          <div className="flex items-center justify-between border-b border-border py-3">
            <div>
              <p className="font-medium text-foreground">Account Type</p>
              <p className="text-sm text-secondary capitalize">{user?.role || "Recruiter"}</p>
            </div>
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
              Recruiter
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
            <Lock size={20} />
          </div>
          <div>
            <p className="font-semibold text-foreground">Security</p>
            <p className="text-sm text-secondary">Manage your password</p>
          </div>
        </div>

        <button
          onClick={() => setIsPasswordModalOpen(true)}
          className="rounded-lg bg-surface-hover px-4 py-2 text-sm font-medium text-foreground hover:bg-border transition-colors"
        >
          Change Password
        </button>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
