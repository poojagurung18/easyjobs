"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Suspense } from "react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex text-gray-900 items-center justify-center">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await login(data.email, data.password);
      
      toast.success("Welcome back");
      
      // Redirect based on role
      const role = response.role;
      let targetPath = "/dashboard";
      
      if (role === "ADMIN") {
        targetPath = "/dashboard/admin";
      } else if (role === "JOB_RECRUITER") {
        targetPath = "/dashboard/recruiter";
      } else if (role === "JOB_SEEKER") {
        targetPath = "/dashboard/seeker";
      }
      
      const callbackUrl = searchParams.get("callbackUrl");
      router.push(callbackUrl || targetPath);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
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
        {/* Logo — above the card */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2.5 mb-8"
        >
          <Image
            src="/favicon.png"
            alt="EasyJobs Logo"
            width={60}
            height={90}
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
                Welcome back
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                Sign in to your EasyJobs account
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium text-brand-primary
 placeholder:text-gray-300 border bg-white outline-none transition-all
 focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/40
 ${errors.email ? "border-red-400 bg-red-50/30" : "border-gray-200"}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs font-semibold">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-bold text-brand-primary hover:underline underline-offset-4 transition-all"
                  >
                    Forgot Password?
                  </Link>
                </div>
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
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                or
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500">
              New to EasyJobs?{""}
              <Link
                href="/register"
                className="text-brand-primary font-black ml-2 hover:underline underline-offset-4"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
