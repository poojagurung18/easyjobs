"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { recruiterService } from "@/lib/api/recruiter";
import { paymentService } from "@/lib/api/payment";
import {
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  Plus,
  Loader2,
  AlertCircle,
  Clock,
  CreditCard,
  Wallet,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

export default function RecruiterDashboard() {
  const router = useRouter();
  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["recruiter-jobs"],
    queryFn: recruiterService.getJobs,
  });

  const { data: profile } = useQuery({
    queryKey: ["recruiter-profile"],
    queryFn: recruiterService.getProfile,
    retry: false,
  });

  const { data: credits, refetch: refetchCredits } = useQuery({
    queryKey: ["recruiter-credits"],
    queryFn: recruiterService.getCredits,
  });

  const handleBuyCredits = async () => {
    try {
      toast.loading("Preparing payment...", { id: "payment" });
      const response = await paymentService.createPayment();
      if (response.paymentLink) {
        window.location.href = response.paymentLink;
      } else {
        throw new Error("Payment link not found");
      }
    } catch (error) {
      toast.error("Failed to initiate payment", { id: "payment" });
    }
  };

  const stats = {
    activeJobs:
      jobs?.filter((j) => j.status === "open" || j.status === "OPEN")
        ?.length || 0,
    totalJobs: jobs?.length || 0,
    totalApplicants:
      jobs?.reduce((sum, job) => sum + (job.applicantsCount || 0), 0) || 0,
    profileViews: profile?.profileViews || 0,
  };

  if (jobsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {profile?.companyName
              ? `Welcome, ${profile.companyName}`
              : "Recruiter Dashboard"}
          </h1>
          <p className="text-gray-600">
            Manage your job postings and track applicants
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
          href="/dashboard/recruiter/jobs/new"
          className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover"
        >
          <Plus size={16} />
          Post New Job
        </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Active Jobs"
          value={stats.activeJobs}
          icon={Briefcase}
          color="blue"
        />
        <StatCard
          label="Total Jobs"
          value={stats.totalJobs}
          icon={Briefcase}
          color="purple"
        />
        <StatCard
          label="Total Applicants"
          value={stats.totalApplicants}
          icon={Users}
          color="green"
        />
        <StatCard
          label="Profile Views"
          value={stats.profileViews}
          icon={Eye}
          color="pink"
        />
         <StatCard
          label="Job Credits"
          value={credits || 0}
          icon={CreditCard}
          color="green"
        />
      </div>

      {profile && !profile.approved && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">
                Account Under Verification
              </p>
              <p className="text-sm text-blue-700">
                Your account is currently under manual verification. Some features may be restricted until approved.
              </p>
            </div>
          </div>
        </div>
      )}

      {!profile && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">
                Complete your company profile
              </p>
              <p className="text-sm text-yellow-700">
                Add your company details to attract more candidates.{" "}
                <Link href="/dashboard/recruiter/profile" className="underline">
                  Set up profile
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Job Postings
          </h2>
          <Link
            href="/dashboard/recruiter/jobs"
            className="text-sm text-brand-primary hover:underline"
          >
            View All Jobs
          </Link>
        </div>
        {jobs?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Job Title
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Location
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Salary
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.slice(0, 5).map((job) => (
                  <tr key={job.id}>
                    <td className="py-4">
                      <Link
                        href={`/dashboard/recruiter/jobs/${job.id}`}
                        className="font-medium text-gray-900 hover:text-brand-primary"
                      >
                        {job.title}
                      </Link>
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {job.location}
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {job.salary || "Not specified"}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${job.status === "active" || job.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">No jobs posted yet</p>
            <button
              onClick={() => {
                if (credits > 0) {
                  router.push("/dashboard/recruiter/jobs/new");
                } else {
                  handleBuyCredits();
                }
              }}
              className="mt-2 inline-block text-sm text-brand-primary hover:underline"
            >
              Post your first job
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
