"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  User, 
  Lock, 
  Bell, 
  Moon, 
  Sun, 
  ShieldCheck, 
  Mail, 
  ChevronRight,
  Globe
} from "lucide-react";
import toast from "react-hot-toast";
import ChangePasswordModal from "@/components/common/ChangePasswordModal";

export default function SeekerSettings() {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    // document.documentElement.classList.toggle("dark"); // Uncomment when dark mode is ready
    toast.success(`Switched to ${!isDarkMode ? "dark" : "light"} mode`);
  };

  return (
    <div className="w-full space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account security and preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Navigation Hints / Profile Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                <User size={32} />
              </div>
              <h2 className="mt-4 font-bold text-gray-900">{user?.email?.split('@')[0]}</h2>
              <p className="text-sm text-gray-500 capitalize">{user?.role?.replace('_', ' ')} Account</p>
            </div>
            
            <div className="mt-8 space-y-2">
               <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 text-sm font-medium text-gray-700">
                  <Mail size={16} className="text-brand-primary" />
                  <span className="truncate">{user?.email}</span>
               </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Security Status</h3>
            <div className="flex items-center gap-3 text-sm font-bold text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
               <ShieldCheck size={18} />
               Account is Active
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Settings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Security Section */}
          <section className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Lock size={18} className="text-brand-primary" />
                Security & Privacy
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">Account Password</p>
                  <p className="text-sm text-gray-500 text-balance">Update your password regularly to keep your account secure.</p>
                </div>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="shrink-0 rounded-xl bg-gray-900 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-gray-800 active:scale-95 shadow-lg shadow-gray-200"
                >
                  Change Password
                </button>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Bell size={18} className="text-brand-primary" />
                System Preferences
              </h3>
            </div>
            <div className="p-6 divide-y divide-gray-50">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between py-4 first:pt-0">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                    {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Appearance</p>
                    <p className="text-sm text-gray-500">Switch between light and dark theme</p>
                  </div>
                </div>
                <button 
                  onClick={handleThemeToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isDarkMode ? 'bg-brand-primary' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Email Notifications Toggle */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive job alerts and application updates</p>
                  </div>
                </div>
                <button 
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${emailNotifications ? 'bg-brand-primary' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-between">
            <p className="text-sm font-bold text-rose-700 px-2">Need to deactivate your account?</p>
            <button className="text-sm font-bold text-rose-600 hover:underline px-2 transition-all active:opacity-70">
              Learn how
            </button>
          </div>
        </div>
      </div>

      {/* Modal Component */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}