"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { Loader2, ShieldCheck, ArrowLeft, ArrowRight, RefreshCcw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex text-gray-900 items-center justify-center">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}

function VerifyOtpContent() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = [
    useRef(), useRef(), useRef(), useRef(), useRef(), useRef()
  ];

  const { verifyOtp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const type = searchParams.get("type") || "login";
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  useEffect(() => {
    if (!email) {
      router.push("/login");
    }
  }, [email, router]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    
    // Focus last filled or next empty
    const nextIndex = pastedData.length < 6 ? pastedData.length : 5;
    inputRefs[nextIndex].current.focus();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyOtp(email, otpCode);
      
      if (type === "registration") {
        toast.success("Account verified successfully!");
        
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
        
        router.push(targetPath);
      } else {
        toast.success("Identity verified!");
        router.push(callbackUrl);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    // Implementation for resend would go here
    // For now we just reset the timer
    setTimer(30);
    setCanResend(false);
    toast.success("New code sent to your email");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4">
      {/* Horizontal Background Split */}
      <div className="absolute inset-0 flex flex-col pointer-events-none">
        <div className="h-1/2 bg-white" />
        <div className="h-1/2 bg-[#0f202d]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <Image
            src="/favicon.png"
            alt="EasyJobs Logo"
            width={60}
            height={90}
          />
          <span className="text-lg font-extrabold text-brand-primary tracking-tight">
            Easy<span className="text-brand-primary">Jobs</span>
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">
          <div className="h-1.5 w-full bg-brand-primary" />

          <div className="px-8 py-10 sm:px-10">
            <div className="mb-8">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck size={24} className="text-brand-primary" />
              </div>
              <h1 className="text-3xl font-black text-brand-primary tracking-tight">
                Two-Step Verification
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                We've sent a 6-digit code to <span className="font-bold text-brand-primary">{email}</span>
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-8">
              <div className="flex justify-between gap-2">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    maxLength={1}
                    value={data}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-full h-14 text-center text-xl font-bold bg-gray-50 border border-gray-200 rounded-xl focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all"
                  />
                ))}
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={isLoading || otp.includes("")}
                  className="w-full py-4 rounded-xl bg-brand-primary text-white text-base font-black
                    flex items-center justify-center gap-2
                    hover:bg-brand-primary-hover shadow-xl shadow-brand-primary/20 active:scale-[0.98] transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      Verify Identity
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <div className="flex flex-col items-center gap-4">
                  <p className="text-sm text-gray-500">
                    Didn't receive the code?{" "}
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResend}
                        className="text-brand-primary font-black hover:underline inline-flex items-center gap-1"
                      >
                        <RefreshCcw size={14} />
                        Resend now
                      </button>
                    ) : (
                      <span className="text-gray-400 font-medium">
                        Resend in {timer}s
                      </span>
                    )}
                  </p>

                  <Link
                    href="/login"
                    className="text-xs font-bold text-gray-400 hover:text-brand-primary flex items-center gap-1 transition-colors"
                  >
                    <ArrowLeft size={14} />
                    Back to login
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
