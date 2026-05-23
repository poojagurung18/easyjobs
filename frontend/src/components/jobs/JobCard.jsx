"use client";

import React from "react";
import Link from "next/link";
import { MapPin, DollarSign, Building2, Calendar, Briefcase, Heart } from "lucide-react";
import ContentRenderer from "../common/ContentRenderer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { saveJob, unsaveJob, checkIsSaved } from "@/api/seeker.api";
import toast from "react-hot-toast";

export function JobCard({ job, variant = "default", basePath = "/dashboard/seeker/jobs" }) {
  const queryClient = useQueryClient();

  const { data: isSaved } = useQuery({
    queryKey: ["is-saved", job.id],
    queryFn: () => checkIsSaved(job.id),
    enabled: !!job.id,
  });

  const saveMutation = useMutation({
    mutationFn: () => saveJob(job.id),
    onSuccess: () => {
      queryClient.invalidateQueries(["is-saved", job.id]);
      queryClient.invalidateQueries(["saved-jobs"]);
      toast.success("Job saved!");
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: () => unsaveJob(job.id),
    onSuccess: () => {
      queryClient.invalidateQueries(["is-saved", job.id]);
      queryClient.invalidateQueries(["saved-jobs"]);
      toast.success("Job removed from saved");
    },
  });

  const toggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      unsaveMutation.mutate();
    } else {
      saveMutation.mutate();
    }
  };

  const recruiterId = job.recruiterId || job.recruiter?.id;
  const logoUrl = job.recruiterLogo || job.recruiter?.logoUrl;

  if (variant === "compact") {
    return (
      <Link
        href={`${basePath}/${job.id}`}
        className="group flex items-center justify-between rounded-xl border border-transparent p-3 transition-all hover:bg-surface-hover"
      >
        <div className="flex items-center gap-3">
          {recruiterId ? (
            <Link
              href={`/dashboard/seeker/recruiter/${recruiterId}`}
              onClick={(e) => e.stopPropagation()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary overflow-hidden hover:bg-brand-primary hover:text-white transition-all shadow-sm"
            >
              {logoUrl ? (
                <img src={logoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <Building2 size={20} />
              )}
            </Link>
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-brand-primary border border-border">
              <Building2 size={20} />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold text-text-primary group-hover:text-brand-primary transition-colors">
              {job.title}
            </p>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              {recruiterId ? (
                <Link
                  href={`/dashboard/seeker/recruiter/${recruiterId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="truncate hover:text-text-secondary transition-colors"
                >
                  {job.recruiterName || job.recruiter?.companyName || "Company"}
                </Link>
              ) : (
                <span className="truncate">{job.recruiterName || "Company"}</span>
              )}
              {job.location && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin size={12} />
                    {job.location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-green-500">{job.salary || "N/A"}</p>
            {job.type && (
              <p className="text-[10px] uppercase tracking-wider text-text-muted">{job.type}</p>
            )}
          </div>
          <button
            onClick={toggleSave}
            disabled={saveMutation.isPending || unsaveMutation.isPending}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
              isSaved
                ? "bg-red-500/10 text-red-500"
                : "bg-surface-hover text-text-muted hover:bg-red-500/10 hover:text-red-500"
            }`}
          >
            <Heart size={16} className={isSaved ? "fill-current" : "fill-transparent"} />
          </button>
        </div>
      </Link>
    );
  }

  return (
    <div className="group flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden relative">
      <div className="flex items-start justify-between mb-4">
        {recruiterId ? (
          <Link
            href={`/dashboard/seeker/recruiter/${recruiterId}`}
            onClick={(e) => e.stopPropagation()}
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary/10 overflow-hidden transition-all group-hover:scale-105 border border-brand-primary/10 shadow-sm"
          >
            {logoUrl ? (
              <img src={logoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <Building2 size={32} className="text-brand-primary/60" />
            )}
          </Link>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-hover text-brand-primary/60 border border-border shadow-sm">
            <Building2 size={32} />
          </div>
        )}
        <button
          onClick={toggleSave}
          disabled={saveMutation.isPending || unsaveMutation.isPending}
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 shadow-sm ${
            isSaved
              ? "bg-red-500/10 text-red-500"
              : "bg-surface-hover text-text-muted hover:bg-red-500/10 hover:text-red-500 border border-border"
          }`}
        >
          <Heart size={20} className={isSaved ? "fill-current" : "fill-transparent"} />
        </button>
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-bold text-text-primary group-hover:text-brand-primary transition-colors line-clamp-1">
          {job.title}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          {recruiterId ? (
            <Link
              href={`/dashboard/seeker/recruiter/${recruiterId}`}
              onClick={(e) => e.stopPropagation()}
              className="text-sm font-medium text-brand-primary/80 hover:text-brand-primary transition-colors"
            >
              {job.recruiterName || job.recruiter?.companyName || "Company"}
            </Link>
          ) : (
            <p className="text-sm font-medium text-text-secondary">
              {job.recruiterName || "Company"}
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.location && (
            <span className="flex items-center gap-1.5 rounded-lg bg-surface-hover px-2.5 py-1.5 text-xs font-medium text-text-secondary border border-border">
              <MapPin size={14} className="text-brand-primary" />
              {job.location}
            </span>
          )}
        </div>

        {job.description && (
          <div className="mt-4 text-sm leading-relaxed text-text-secondary line-clamp-3">
            <ContentRenderer content={job.description} />
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Hirings</p>
            <div className="flex items-center gap-1.5 text-sm font-bold text-text-primary">
              <Briefcase size={14} className="text-brand-primary" />
              {job.noOfOpenings || 1} Positions
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Deadline</p>
            <div className="flex items-center gap-1.5 text-sm font-bold text-red-500">
              <Calendar size={14} className="text-red-500" />
              {job.deadline || "Soon"}
            </div>
          </div>
        </div>
      </div>

      <Link
        href={`${basePath}/${job.id}`}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-sm font-bold text-white transition-all hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/20"
      >
        View Details
      </Link>
    </div>
  );
}
