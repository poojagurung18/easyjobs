"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { seekerService } from "@/lib/api/seeker";
import {
  Briefcase,
  FileText,
  Clock,
  CheckCircle,
  ArrowRight,
  Loader2,
  AlertCircle,
  Building2,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { JobCard } from "@/components/jobs/JobCard";

export default function SeekerDashboard() {
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["seeker-profile"],
    queryFn: seekerService.getProfile,
    retry: false,
  });

  const { data: applications } = useQuery({
    queryKey: ["seeker-applications"],
    queryFn: seekerService.getApplications,
    retry: false,
  });

  const { data: recommendedJobs } = useQuery({
    queryKey: ["recommended-jobs"],
    queryFn: seekerService.getRecommendedJobs,
    retry: false,
  });

  if (profileLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  const applicationsList = Array.isArray(applications)
    ? applications
    : applications?.data || [];
  const recommendedJobsList = Array.isArray(recommendedJobs)
    ? recommendedJobs
    : recommendedJobs?.data || [];

  const stats = {
    totalApplications: applicationsList.length,
    pendingApplications: applicationsList.filter(
      (a) =>
        a.status?.toLowerCase() === "applied" ||
        a.status?.toLowerCase() === "pending",
    ).length,
    interviewApplications: applicationsList.filter(
      (a) =>
        a.status?.toLowerCase() === "shortlisted" ||
        a.status?.toLowerCase() === "interview",
    ).length,
    recommendedJobs: recommendedJobsList.length,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome{profile?.firstName ? `, ${profile.firstName}` : ""}!
          </h1>
          <p className="mt-1 text-gray-600">
            Track your job applications and discover new opportunities
          </p>
        </div>
        <Link
          href="/dashboard/seeker/jobs"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-primary-hover hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
        >
          Browse Jobs
          <ArrowRight size={18} />
        </Link>
      </div>

      {!profile && (
        <div className="relative overflow-hidden rounded-2xl border border-yellow-200 bg-yellow-50/50 p-6">
          <div className="flex items-start gap-4">
            <div className="mt-1 rounded-full bg-yellow-100 p-2 text-yellow-600">
              <AlertCircle size={20} />
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold text-yellow-900">
                Complete your profile
              </p>
              <p className="mt-1 text-yellow-800/80">
                Add your skills, experience, and resume to stand out to
                employers and get better job matches.
              </p>
              <Link
                href="/dashboard/seeker/profile"
                className="mt-4 inline-flex items-center text-sm font-semibold text-yellow-900 underline decoration-yellow-900/30 underline-offset-4 hover:decoration-yellow-900"
              >
                Set up profile
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Applications"
          value={stats.totalApplications}
          icon={FileText}
          color="blue"
        />
        <StatCard
          label="Under Review"
          value={stats.pendingApplications}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          label="Interviews"
          value={stats.interviewApplications}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          label="Recommended Jobs"
          value={stats.recommendedJobs}
          icon={Briefcase}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Applications */}
        <section className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Applications
            </h2>
            <Link
              href="/dashboard/seeker/applications"
              className="group flex items-center gap-1 text-sm font-semibold text-brand-primary hover:text-blue-700"
            >
              View All
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="flex-1">
            {applicationsList.length > 0 ? (
              <div className="space-y-1">
                {applicationsList.slice(0, 5).map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between rounded-xl border border-transparent p-3 transition-colors hover:bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                        <Building2 size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-gray-900">
                          {app.jobTitle || app.job?.title}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {app.companyName || app.company?.companyName}
                        </p>
                        {app.interviewDate && (
                          <p className="mt-1 text-[11px] font-semibold text-blue-600 flex items-center gap-0.5">
                            <Clock size={12} className="shrink-0" />
                            Interview: {new Date(app.interviewDate).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                        app.status?.toLowerCase() === "shortlisted" ||
                        app.status?.toLowerCase() === "interview"
                          ? "bg-green-100 text-green-700"
                          : app.status?.toLowerCase() === "applied" ||
                            app.status?.toLowerCase() === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : app.status?.toLowerCase() === "accepted"
                              ? "bg-blue-100 text-blue-700"
                              : app.status?.toLowerCase() === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-gray-100 p-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">
                  No applications yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start your journey by applying to your first job.
                </p>
                <Link
                  href="/dashboard/seeker/jobs"
                  className="mt-4 text-sm font-bold text-brand-primary hover:text-blue-700"
                >
                  Browse jobs
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Recommended Jobs */}
        <section className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Recommended Jobs
            </h2>
            <Link
              href="/dashboard/seeker/jobs"
              className="group flex items-center gap-1 text-sm font-semibold text-brand-primary hover:text-blue-700"
            >
              View All
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="flex-1">
            {recommendedJobsList.length > 0 ? (
              <div className="space-y-1">
                {recommendedJobsList.slice(0, 5).map((job) => (
                  <JobCard key={job.id} job={job} variant="compact" />
                ))}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-gray-100 p-4">
                  <Briefcase className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">
                  No recommendations
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  We'll show jobs that match your profile here.
                </p>
                <Link
                  href="/dashboard/seeker/jobs"
                  className="mt-4 text-sm font-bold text-brand-primary hover:text-blue-700"
                >
                  Explore opportunities
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
