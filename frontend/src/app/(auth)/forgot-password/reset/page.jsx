"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Loader2, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { forgotPasswordChangePassword } from "@/api/user.api";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  repeatPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.repeatPassword, {
  message: "Passwords don't match",
  path: ["repeatPassword"],
});

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("forgotPasswordEmail");
    if (!storedEmail) {
      toast.error("Session expired. Please start again.");
      router.push("/forgot-password");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await forgotPasswordChangePassword(email, data.password, data.repeatPassword);
      toast.success("Password changed successfully");
      sessionStorage.removeItem("forgotPasswordEmail");
      router.push("/login");
    } catch (error) {
      toast.error(error.response?.data || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4">
      {/* Horizontal Background Split */}
      <div className="absolute inset-0 flex flex-col pointer-events-none">
        <div className="h-1/2 bg-white" />
        <div className="h-1/2 bg-[#0f202d]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">
          <div className="h-1.5 w-full bg-brand-primary" />

          <div className="px-8 py-10 sm:px-10">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-black text-brand-primary tracking-tight">
                New Password
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                Set a strong and secure password for <span className="font-bold text-brand-primary">{email}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* New Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  New Password
                </label>
                <div className="relative group">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-primary transition-colors"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={`w-full pl-11 pr-12 py-3.5 rounded-xl text-sm font-medium text-brand-primary
 placeholder:text-gray-300 border bg-white outline-none transition-all
 focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/40
 ${errors.password ? "border-red-400 bg-red-50/30" : "border-gray-200"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-brand-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs font-semibold">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-primary transition-colors"
                  />
                  <input
                    type={showRepeatPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("repeatPassword")}
                    className={`w-full pl-11 pr-12 py-3.5 rounded-xl text-sm font-medium text-brand-primary
 placeholder:text-gray-300 border bg-white outline-none transition-all
 focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/40
 ${errors.repeatPassword ? "border-red-400 bg-red-50/30" : "border-gray-200"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-brand-primary transition-colors"
                  >
                    {showRepeatPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.repeatPassword && (
                  <p className="text-red-500 text-xs font-semibold">
                    {errors.repeatPassword.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-brand-primary text-white text-base font-black
 flex items-center justify-center gap-2
 hover:bg-brand-primary-hover shadow-xl shadow-brand-primary/20 active:scale-[0.98] transition-all duration-200
 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    Reset Password
                    <CheckCircle2 size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link
                href="/login"
                className="text-sm font-bold text-gray-400 hover:text-brand-primary transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
