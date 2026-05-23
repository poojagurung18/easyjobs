"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { seekerService } from "@/lib/api/seeker";
import {
  Briefcase,
  FileText,
  Clock,
  ArrowRight,
  Loader2,
  Building2,
  Sparkles,
  Calendar,
  Search,
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
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
        <p className="text-sm font-medium text-secondary">Curating your dashboard...</p>
      </div>
    );
  }

  const applicationsList = Array.isArray(applications) ? applications : applications?.data || [];
  const recommendedJobsList = Array.isArray(recommendedJobs) ? recommendedJobs : recommendedJobs?.data || [];

  const stats = {
    totalApplications: applicationsList.length,
    pendingApplications: applicationsList.filter((a) =>
      ["applied", "pending"].includes(a.status?.toLowerCase()),
    ).length,
    interviewApplications: applicationsList.filter((a) =>
      ["shortlisted", "interview"].includes(a.status?.toLowerCase()),
    ).length,
    recommendedJobs: recommendedJobsList.length,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
            Welcome back{profile?.firstName ? `, ${profile.firstName}` : ""}!
          </h1>
          <p className="mt-2 text-lg text-secondary">
            You have{" "}
            <span className="font-semibold text-brand-primary">
              {stats.interviewApplications} interviews
            </span>{" "}
            coming up this week.
          </p>
        </div>
        <Link
          href="/dashboard/seeker/jobs"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-accent px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-brand-accent-hover hover:shadow-lg active:scale-95"
        >
          <Search size={18} />
          Explore Jobs
        </Link>
      </div>

      {/* Profile Completion Alert */}
      {!profile && (
        <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              <Sparkles size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-blue-900">Boost your hiring chances!</h3>
              <p className="text-sm text-blue-700/80">
                Candidates with completed profiles are 3x more likely to be noticed by top recruiters.
              </p>
            </div>
            <Link
              href="/dashboard/seeker/profile"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700"
            >
              Finish Setup
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Applications" value={stats.totalApplications} icon={FileText} color="blue" />
        <StatCard label="Under Review" value={stats.pendingApplications} icon={Clock} color="orange" />
        <StatCard label="Interviews" value={stats.interviewApplications} icon={Calendar} color="green" />
        <StatCard label="Recommendations" value={stats.recommendedJobs} icon={Sparkles} color="purple" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Recent Applications */}
        <section className="lg:col-span-5 flex flex-col rounded-3xl border border-border bg-surface p-1 shadow-sm">
          <div className="flex items-center justify-between p-6 pb-4">
            <h2 className="text-xl font-bold text-foreground">Recent Applications</h2>
            <Link href="/dashboard/seeker/applications" className="text-sm font-bold text-brand-primary hover:underline">
              See all
            </Link>
          </div>

          <div className="px-2 pb-4">
            {applicationsList.length > 0 ? (
              <div className="space-y-1">
                {applicationsList.slice(0, 5).map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between rounded-2xl p-4 transition-all hover:bg-surface-hover"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-hover text-muted">
                        <Building2 size={24} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-bold text-foreground">
                          {app.jobTitle || app.job?.title}
                        </p>
                        <p className="truncate text-sm text-secondary">
                          {app.companyName || app.company?.companyName}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={FileText} title="No applications yet" />
            )}
          </div>
        </section>

        {/* Recommended Jobs */}
        <section className="lg:col-span-7 flex flex-col rounded-3xl border border-border bg-surface p-1 shadow-sm">
          <div className="flex items-center justify-between p-6 pb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">Recommended Jobs</h2>
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-600 uppercase tracking-tight">
                AI Powered
              </span>
            </div>
            <Link href="/dashboard/seeker/jobs" className="text-sm font-bold text-brand-primary hover:underline">
              View matches
            </Link>
          </div>

          <div className="px-4 pb-6 space-y-4">
            {recommendedJobsList.length > 0 ? (
              recommendedJobsList.slice(0, 3).map((job) => (
                <div key={job.id} className="group transition-transform hover:-translate-y-1">
                  <JobCard job={job} variant="compact" />
                </div>
              ))
            ) : (
              <EmptyState icon={Briefcase} title="Calculating recommendations..." />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    shortlisted: "bg-emerald-50 text-emerald-700 border-emerald-100",
    interview: "bg-blue-50 text-blue-700 border-blue-100",
    applied: "bg-amber-50 text-amber-700 border-amber-100",
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    accepted: "bg-indigo-50 text-indigo-700 border-indigo-100",
    rejected: "bg-rose-50 text-rose-700 border-rose-100",
  };

  const currentStyle = styles[status?.toLowerCase()] || "bg-surface-hover text-secondary border-border";

  return (
    <span className={`border px-3 py-1 text-[11px] font-bold uppercase tracking-wide rounded-lg ${currentStyle}`}>
      {status}
    </span>
  );
}

function EmptyState({ icon: Icon, title }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-surface-hover p-4 text-muted">
        <Icon size={32} />
      </div>
      <h3 className="font-bold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-secondary max-w-[200px]">
        Check back later or update your profile for more.
      </p>
    </div>
  );
}
