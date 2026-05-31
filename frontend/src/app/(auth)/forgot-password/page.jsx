"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Loader2, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { forgotPasswordSendOtp } from "@/api/user.api";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await forgotPasswordSendOtp(data.email);
      toast.success("OTP sent to your email");
      // Store email in sessionStorage to use in next steps
      sessionStorage.setItem("forgotPasswordEmail", data.email);
      router.push("/forgot-password/verify");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP. Please check your email.");
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
                Forgot Password?
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                Enter your email address and we'll send you an OTP to reset your password.
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
                    Send OTP
                    <ArrowRight size={18} />
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
