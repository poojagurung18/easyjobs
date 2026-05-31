"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { seekerService } from "@/lib/api/seeker";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Building2,
  Briefcase,
  Loader2,
  Send,
  AlertCircle,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import ContentRenderer from "@/components/common/ContentRenderer";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id;
  const { user, isAuthenticated } = useAuth();

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => seekerService.getJob(jobId),
  });

  const { data: applications } = useQuery({
    queryKey: ["seeker-applications"],
    queryFn: seekerService.getApplications,
    enabled:
      !!isAuthenticated &&
      (user?.role?.toLowerCase().includes("seeker") ||
        user?.role?.toLowerCase() === "employee"),
    retry: false,
  });

  const hasApplied = applications?.some(
    (app) => app.jobId === Number(jobId) || app.job?.id === Number(jobId),
  );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold text-text-primary">Job not found</h1>
        <Link
          href="/jobs"
          className="mt-4 inline-block text-brand-primary hover:underline"
        >
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/jobs"
        className="mb-4 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={16} />
        Back to Jobs
      </Link>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-start gap-4">
          {job.recruiterId ? (
            <Link
              href={`/dashboard/seeker/recruiter/${job.recruiterId}`}
              className="flex h-16 w-16 items-center justify-center rounded-xl bg-brand-light overflow-hidden hover:opacity-80 transition-opacity border border-brand-primary/10 shadow-sm"
            >
              {job.recruiterLogo || job.recruiter?.logoUrl ? (
                <img
                  src={job.recruiterLogo || job.recruiter.logoUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 size={32} className="text-text-secondary" />
              )}
            </Link>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-surface-hover">
              <Building2 size={32} className="text-text-secondary" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-text-primary">
              {job.title}
            </h1>
            {job.recruiterId ? (
              <Link
                href={`/dashboard/seeker/recruiter/${job.recruiterId}`}
                className="mt-1 text-lg text-text-secondary hover:text-brand-primary transition-colors"
              >
                {job.recruiter?.companyName || "Company Name"}
              </Link>
            ) : (
              <p className="mt-1 text-lg text-text-secondary">
                {job.recruiter?.companyName || "Company Name"}
              </p>
            )}
          </div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
              job.status?.toLowerCase() === "active"
                ? "bg-green-100 text-green-700"
                : "bg-surface-hover text-text-secondary"
            }`}
          >
            {job.status || "Active"}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          {job.location && (
            <span className="flex items-center gap-2 rounded-lg bg-surface-hover px-4 py-2 text-sm text-text-secondary">
              <MapPin size={16} />
              {job.location}
            </span>
          )}
          {job.salary && (
            <span className="flex items-center gap-2 rounded-lg bg-green-100 px-4 py-2 text-sm text-green-700">
              <DollarSign size={16} />
              {job.salary}
            </span>
          )}
          <span className="flex items-center gap-2 rounded-lg bg-surface-hover px-4 py-2 text-sm text-brand-primary">
            <Briefcase size={16} />
            {job.applicantsCount || 0} applicants
          </span>
        </div>

        <div className="mt-6">
          {isAuthenticated ? (
            user?.role?.toLowerCase().includes("seeker") ||
            user?.role?.toLowerCase() === "employee" ? (
              hasApplied ? (
                <div className="rounded-lg bg-green-50 p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <AlertCircle size={20} />
                    <span className="font-medium">
                      You have already applied for this job
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() =>
                    router.push(`/dashboard/seeker/apply/${jobId}`)
                  }
                  className="block w-full cursor-pointer rounded-lg bg-brand-primary py-3 text-center text-sm font-bold text-white transition-all hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/20"
                >
                  Apply Now
                </button>
              )
            ) : (
              <button
                onClick={() => toast.error("Recruiters cannot apply for jobs")}
                className="block w-full cursor-not-allowed rounded-lg bg-surface-hover py-3 text-center text-sm font-medium text-text-secondary"
              >
                Apply Now (Seekers Only)
              </button>
            )
          ) : (
            <button
              onClick={() => router.push(`/login?callbackUrl=/jobs/${jobId}`)}
              className="block w-full cursor-pointer rounded-lg bg-brand-primary py-3 text-center text-sm font-bold text-white transition-all hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/20"
            >
              Login to Apply
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-text-primary border-b border-border-subtle pb-4 mb-4">
              Job Description
            </h2>
            <div className="prose prose-slate max-w-none">
              <ContentRenderer content={job.description} />
            </div>
          </div>

          {job.requiredDocuments && job.requiredDocuments.length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-text-primary border-b border-border-subtle pb-4 mb-4">
                Required Documents
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.requiredDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-surface-hover border border-border"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-brand-primary shadow-sm">
                      <Send size={16} />
                    </div>
                    <span className="text-sm font-medium text-text-secondary">
                      {doc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-text-primary border-b border-border-subtle pb-4 mb-4">
              Job Overview
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 text-brand-primary">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Application Deadline
                  </p>
                  <p className="text-sm font-semibold text-text-primary">
                    {job.deadline || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 text-brand-primary">
                  <Briefcase size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Total Openings
                  </p>
                  <p className="text-sm font-semibold text-text-primary">
                    {job.noOfOpenings || 1} Positions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 text-brand-primary">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Location
                  </p>
                  <p className="text-sm font-semibold text-text-primary">
                    {job.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 text-brand-primary">
                  <DollarSign size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Offered Salary
                  </p>
                  <p className="text-sm font-semibold text-text-primary">
                    {/^\d+/.test(job.salary) ? `Rs ${job.salary}` : job.salary}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {job.recruiter && (
            <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-text-primary border-b border-border-subtle pb-4 mb-4">
                About the Company
              </h2>
              <div className="mt-4">
                <p className="font-bold text-text-primary">
                  {job.recruiter.companyName}
                </p>
                {job.recruiter.website && (
                  <a
                    href={job.recruiter.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-sm text-brand-primary hover:underline font-medium"
                  >
                    {job.recruiter.website}
                  </a>
                )}
                {job.recruiter.description && (
                  <div className="mt-4 text-sm text-text-secondary line-clamp-4">
                    <ContentRenderer content={job.recruiter.description} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
