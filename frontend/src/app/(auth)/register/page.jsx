"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  BriefcaseBusiness,
  Search,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["JOB_SEEKER", "JOB_RECRUITER"], {
      errorMap: () => ({ message: "Please select a role" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser(data.name, data.email, data.password, data.role);
      toast.success("Registration successful! Check your email for OTP.");
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}&type=registration`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setValue("role", role, { shouldValidate: true });
  };

  const inputBase = `w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-foreground
 placeholder:text-muted border bg-surface outline-none transition-all
 focus:ring-2 focus:ring-brand-accent/10 focus:border-border`;

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 bg-background">
      {/* Background adapts to theme */}
      <div className="absolute inset-0 pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
          {/* Card */}
        <div className="bg-surface rounded-3xl border border-border shadow-2xl overflow-hidden">
          {/* Top accent bar using brand color */}
          <div className="h-1.5 w-full bg-brand-accent" />

          <div className="px-8 py-10 sm:px-10">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-black text-brand-accent tracking-tight">
                Create an account
              </h1>
              <p className="text-secondary text-sm mt-2">
                Join the EasyJobs community today
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase tracking-widest">
                  Full Name
                </label>
                <div className="relative group">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-accent transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="John Doe"
                    {...register("name")}
                    className={`${inputBase} ${errors.name ? "border-red-400 bg-red-50/30 dark:bg-red-950/20" : "border-border"}`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs font-semibold">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase tracking-widest">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-accent transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    {...register("email")}
                    className={`${inputBase} ${errors.email ? "border-red-400 bg-red-50/30 dark:bg-red-950/20" : "border-border"}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs font-semibold">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-muted uppercase tracking-widest">
                  I am joining as a
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      value: "JOB_SEEKER",
                      label: "Job Seeker",
                      desc: "Looking for work",
                      icon: Search,
                    },
                    {
                      value: "JOB_RECRUITER",
                      label: "Recruiter",
                      desc: "Hiring talent",
                      icon: BriefcaseBusiness,
                    },
                  ].map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.value;
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => handleRoleSelect(role.value)}
                        className={`flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all duration-200
 ${isSelected
                            ? "bg-brand-accent border-brand-accent text-white shadow-lg shadow-brand-accent/20"
                            : "bg-surface border-border text-secondary hover:border-brand-accent/40 hover:bg-surface-hover"
                          }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${isSelected ? "bg-white/10" : "bg-surface-hover"}`}
                        >
                          <Icon
                            size={20}
                            className={
                              isSelected ? "text-white" : "text-brand-accent"
                            }
                          />
                        </div>
                        <div>
                          <span
                            className={`block text-sm font-black ${isSelected ? "text-white" : "text-brand-accent"}`}
                          >
                            {role.label}
                          </span>
                          <span
                            className={`text-xs ${isSelected ? "text-white/70" : "text-muted"}`}
                          >
                            {role.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <input type="hidden" {...register("role")} />
                {errors.role && (
                  <p className="text-red-500 text-xs font-semibold">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Password row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-widest">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-accent transition-colors"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password")}
                      className={`${inputBase} pr-12 ${errors.password ? "border-red-400 bg-red-50/30 dark:bg-red-950/20" : "border-border"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-brand-accent transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-widest">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <ShieldCheck
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-accent transition-colors"
                    />
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("confirmPassword")}
                      className={`${inputBase} pr-12 ${errors.confirmPassword ? "border-red-400 bg-red-50/30 dark:bg-red-950/20" : "border-border"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-brand-accent transition-colors"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {(errors.password || errors.confirmPassword) && (
                <p className="text-red-500 text-xs font-semibold">
                  {errors.password?.message ||
                    errors.confirmPassword?.message}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-brand-accent text-white text-base font-black
 flex items-center justify-center gap-2
 hover:bg-brand-accent-hover shadow-xl shadow-brand-accent/20 active:scale-[0.98] transition-all duration-200
 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-10 pt-8 border-t border-border text-center">
              <p className="text-sm text-secondary">
                Already have an account?{""}
                <Link
                  href="/login"
                  className="text-sm font-black text-brand-accent hover:underline underline-offset-4 ml-2"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
