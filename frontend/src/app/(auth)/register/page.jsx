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

  const inputBase = `w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-brand-primary
 placeholder:text-gray-400 border bg-white outline-none transition-all
 focus:ring-2 focus:ring-brand-primary/10 focus:border-gray-400`;

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4">
      {/* Horizontal Background Split */}
      <div className="absolute inset-0 flex flex-col pointer-events-none">
        <div className="h-1/2 bg-white" />
        <div className="h-1/2 bg-[#0f202d]" />
      </div>

      <div className="w-full max-w-xl relative z-10">
        {/* Logo — above the card */}
          <Link
            href="/"
            className="flex items-center justify-center gap-2.5 mb-6"
          >
            <Image
              src="/favicon.png"
              alt="EasyJobs Logo"
              width={50}
              height={75}
            />
            <span className="text-lg font-extrabold text-brand-primary tracking-tight">
              Easy<span className="text-brand-primary">Jobs</span>
            </span>
          </Link>

          {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">
          {/* Top accent bar using brand color */}
          <div className="h-1.5 w-full bg-brand-primary" />

          <div className="px-8 py-10 sm:px-10">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-black text-brand-primary tracking-tight">
                Create an account
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                Join the EasyJobs community today
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Full Name
                </label>
                <div className="relative group">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-primary transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="John Doe"
                    {...register("name")}
                    className={`${inputBase} ${errors.name ? "border-red-400 bg-red-50/30" : "border-gray-200"}`}
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
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-primary transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    {...register("email")}
                    className={`${inputBase} ${errors.email ? "border-red-400 bg-red-50/30" : "border-gray-200"}`}
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
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
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
                            ? "bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20"
                            : "bg-white border-gray-100 text-gray-500 hover:border-brand-primary/40 hover:bg-brand-light/50"
                          }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${isSelected ? "bg-white/10" : "bg-gray-50"}`}
                        >
                          <Icon
                            size={20}
                            className={
                              isSelected ? "text-white" : "text-brand-primary"
                            }
                          />
                        </div>
                        <div>
                          <span
                            className={`block text-sm font-black ${isSelected ? "text-white" : "text-brand-primary"}`}
                          >
                            {role.label}
                          </span>
                          <span
                            className={`text-xs ${isSelected ? "text-white/70" : "text-gray-400"}`}
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
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Password
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
                      className={`${inputBase} pr-12 ${errors.password ? "border-red-400 bg-red-50/30" : "border-gray-200"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-brand-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <ShieldCheck
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-primary transition-colors"
                    />
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("confirmPassword")}
                      className={`${inputBase} pr-12 ${errors.confirmPassword ? "border-red-400 bg-red-50/30" : "border-gray-200"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-brand-primary transition-colors"
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
                className="w-full py-4 rounded-xl bg-brand-primary text-white text-base font-black
 flex items-center justify-center gap-2
 hover:bg-brand-primary-hover shadow-xl shadow-brand-primary/20 active:scale-[0.98] transition-all duration-200
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
            <div className="mt-10 pt-8 border-t border-gray-50 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{""}
                <Link
                  href="/login"
                  className="text-sm font-black text-brand-primary hover:underline underline-offset-4 ml-2"
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
