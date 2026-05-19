"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  DollarSign,
  Building2,
  Calendar,
  Briefcase,
  Heart,
} from "lucide-react";
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
        className="group flex items-center justify-between rounded-xl border border-transparent p-3 transition-all hover:bg-white"
      >
        <div className="flex items-center gap-3">
          {recruiterId ? (
            <Link
              href={`/dashboard/seeker/recruiter/${recruiterId}`}
              onClick={(e) => e.stopPropagation()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand-primary overflow-hidden hover:bg-brand-primary hover:text-white transition-all shadow-sm"
            >
              {logoUrl ? (
                <img src={logoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <Building2 size={20} />
              )}
            </Link>
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-brand-primary">
              <Building2 size={20} />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold text-gray-900 group-hover:text-brand-primary">
              {job.title}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {recruiterId ? (
                <Link
                  href={`/dashboard/seeker/recruiter/${recruiterId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="truncate hover:text-gray-600"
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
            <p className="text-sm font-bold text-green-600">
              {job.salary || "N/A"}
            </p>
            {job.type && (
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                {job.type}
              </p>
            )}
          </div>
          <button
            onClick={toggleSave}
            disabled={saveMutation.isPending || unsaveMutation.isPending}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${isSaved
              ? "bg-red-50 text-red-500"
              : "bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-400"
              }`}
          >
            <Heart
              size={16}
              className={isSaved ? "fill-current" : "fill-transparent"}
            />
          </button>
        </div>
      </Link>
    );
  }

  return (
    <div className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden relative">
      <div className="flex items-start justify-between mb-4">
        {recruiterId ? (
          <Link
            href={`/dashboard/seeker/recruiter/${recruiterId}`}
            onClick={(e) => e.stopPropagation()}
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light/30 overflow-hidden transition-all group-hover:scale-105 border border-brand-primary/5 shadow-sm"
          >
            {logoUrl ? (
              <img src={logoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <Building2 size={32} className="text-brand-primary/60" />
            )}
          </Link>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-brand-primary/60 border border-gray-100 shadow-sm">
            <Building2 size={32} />
          </div>
        )}
        <button
          onClick={toggleSave}
          disabled={saveMutation.isPending || unsaveMutation.isPending}
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 shadow-sm ${isSaved
            ? "bg-red-50 text-red-500"
            : "bg-white text-gray-400 hover:bg-red-50 hover:text-red-400 border border-gray-100"
            }`}
        >
          <Heart
            size={20}
            className={isSaved ? "fill-current" : "fill-transparent"}
          />
        </button>
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-primary transition-colors line-clamp-1">
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
            <p className="text-sm font-medium text-slate-500">
              {job.recruiterName || "Company"}
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.location && (
            <span className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 border border-gray-100">
              <MapPin size={14} className="text-brand-primary" />
              {job.location}
            </span>
          )}
        </div>

        {job.description && (
          <div className="mt-4 text-sm leading-relaxed text-slate-500 line-clamp-3">
            <ContentRenderer content={job.description} />
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Hirings</p>
            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
              <Briefcase size={14} className="text-blue-500" />
              {job.noOfOpenings || 1} Positions
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Deadline</p>
            <div className="flex items-center gap-1.5 text-sm font-bold text-red-600">
              <Calendar size={14} className="text-red-500" />
              {job.deadline || "Soon"}
            </div>
          </div>
        </div>
      </div>

      <Link
        href={`${basePath}/${job.id}`}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-brand-primary shadow-lg shadow-slate-900/10 hover:shadow-brand-primary/20"
      >
        View Details
      </Link>
    </div>
  );
}
