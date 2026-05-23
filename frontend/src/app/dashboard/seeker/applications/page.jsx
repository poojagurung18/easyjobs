"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { seekerService } from "@/lib/api/seeker";
import {
  Loader2,
  Briefcase,
  Calendar,
  MapPin,
  DollarSign,
  Building2,
  Flag,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

import { useState } from "react";
import ReportModal from "@/components/common/ReportModal";

export default function SeekerApplications() {
  const queryClient = useQueryClient();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedRecruiterId, setSelectedRecruiterId] = useState(null);

  const { data: applications, isLoading } = useQuery({
    queryKey: ["seeker-applications"],
    queryFn: seekerService.getApplications,
    retry: false,
  });

  const reportMutation = useMutation({
    mutationFn: ({ recruiterId, reason }) =>
      seekerService.reportRecruiter(recruiterId, reason),
    onSuccess: () => {
      toast.success("Recruiter reported successfully");
      setIsReportModalOpen(false);
      setSelectedRecruiterId(null);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to report recruiter",
      );
    },
  });

  const handleReport = (recruiterId) => {
    if (!recruiterId) {
      toast.error("Recruiter information not available");
      return;
    }
    setSelectedRecruiterId(recruiterId);
    setIsReportModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  const applicationsList = Array.isArray(applications)
    ? applications
    : applications?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
        <p className="text-secondary">
          Track the status of your job applications
        </p>
      </div>

      {applicationsList.length > 0 ? (
        <div className="grid gap-4">
          {applicationsList.map((app) => {
            const recruiterId =
              app.job?.recruiter?.id || app.job?.recruiterId || app.recruiterId;
            return (
              <div
                key={app.id}
                className="rounded-xl border border-border bg-surface p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-hover text-brand-accent">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                          {app.companyName ||
                            app.company?.companyName ||
                            app.job?.recruiter?.companyName ||
                            "Company"}
                        </h3>
                        <p className="text-sm text-secondary">
                          {app.jobTitle || app.job?.title}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-secondary">
                      {app.job?.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {app.job.location}
                        </span>
                      )}
                      {app.job?.salary && (
                        <span className="flex items-center gap-1">
                          <DollarSign size={14} />
                          {app.job.salary}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        Applied{" "}
                        {new Date(
                          app.appliedAt || app.createdAt,
                        ).toLocaleDateString()}
                      </span>
                      {app.interviewDate && (
                        <span className="flex items-center gap-1 text-blue-600 font-semibold bg-blue-50 px-2.5 py-1 rounded-lg">
                          <Clock size={14} />
                          Interview:{" "}
                          {new Date(app.interviewDate).toLocaleString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                        app.status?.toLowerCase() === "shortlisted" ||
                        app.status?.toLowerCase() === "interview"
                          ? "bg-green-100 text-green-700"
                          : app.status?.toLowerCase() === "applied" ||
                            app.status?.toLowerCase() === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : app.status?.toLowerCase() === "accepted" ||
                              app.status?.toLowerCase() === "accepted"
                              ? "bg-blue-100 text-blue-700"
                              : app.status?.toLowerCase() === "rejected" ||
                                app.status?.toLowerCase() === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-surface-hover text-foreground"
                      }`}
                    >
                      {app.status}
                    </span>

                    <div className="flex items-center gap-2">
                      {app.job && (
                        <Link
                          href={`/dashboard/seeker/jobs/${app.job.id || app.jobId}`}
                          className="rounded-lg bg-surface-hover px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-hover"
                        >
                          View Job
                        </Link>
                      )}
                      <button
                        onClick={() => handleReport(recruiterId)}
                        disabled={reportMutation.isPending}
                        className="rounded-lg p-1.5 text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Report Recruiter"
                      >
                        <Flag size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface p-12 text-center shadow-sm">
          <Briefcase className="mx-auto h-12 w-12 text-muted" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            No applications yet
          </h3>
          <p className="mt-1 text-secondary">
            Start applying to jobs and track your applications here.
          </p>
          <Link
            href="/dashboard/seeker/jobs"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-accent px-4 py-2 text-sm font-medium text-white hover:bg-brand-accent-hover"
          >
            Browse Jobs
          </Link>
        </div>
      )}

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setSelectedRecruiterId(null);
        }}
        onConfirm={(reason) => {
          reportMutation.mutate({ recruiterId: selectedRecruiterId, reason });
        }}
        isPending={reportMutation.isPending}
      />
    </div>
  );
}
