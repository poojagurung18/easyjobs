"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { recruiterService } from "@/lib/api/recruiter";
import {
  Plus,
  Briefcase,
  Loader2,
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  Users,
  Clock,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";
import ContentRenderer from "@/components/common/ContentRenderer";

import ConfirmModal from "@/components/common/ConfirmModal";
import { useEffect, useRef } from "react";

export default function RecruiterJobs() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["recruiter-jobs"],
    queryFn: recruiterService.getJobs,
  });


  const processingRef = useRef(false);

  useEffect(() => {
    const pendingData = localStorage.getItem("pending_job_data");
    if (pendingData && !processingRef.current) {
      processingRef.current = true;
      try {
        const data = JSON.parse(pendingData);
        toast.loading("Finalizing your job posting...", { id: "pending-job" });

        const attemptCreation = (isRetry = false) => {
          recruiterService.createJob(data)
            .then(() => {
              queryClient.invalidateQueries(["recruiter-jobs"]);
              toast.success("Job posted successfully!", { id: "pending-job" });
              localStorage.removeItem("pending_job_data");
            })
            .catch((error) => {
              const message = error.response?.data?.message || "";
              if (!isRetry && message.includes("credits")) {
                // Silently retry once after 5 more seconds if it's a credit error
                setTimeout(() => attemptCreation(true), 5000);
              } else {
                toast.error(message || "Failed to finalize job posting.", { id: "pending-job" });
                localStorage.removeItem("pending_job_data");
              }
            });
        };

        // Initial attempt after 5 seconds
        setTimeout(() => attemptCreation(false), 5000);

      } catch (e) {
        localStorage.removeItem("pending_job_data");
        processingRef.current = false;
      }
    }
  }, []);

  const deleteMutation = useMutation({
    mutationFn: (id) => recruiterService.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["recruiter-jobs"]);
      toast.success("Job deleted successfully");
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete job");
    },
  });

  const handleDelete = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
          <p className="text-gray-600">Manage your job postings</p>
        </div>
        <Link
          href="/dashboard/recruiter/jobs/new"
          className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover"
        >
          <Plus size={16} />
          Post New Job
        </Link>
      </div>

      {jobs?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden relative"
            >
              {/* Card Header: Icon & Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light/30 text-brand-primary/60 border border-brand-primary/5 shadow-sm group-hover:scale-105 transition-transform">
                  <Briefcase size={28} />
                </div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${job.status?.toLowerCase() === "open"
                      ? "bg-green-50 text-green-700 border border-green-100"
                      : "bg-red-50 text-red-700 border border-red-100"
                    }`}
                >
                  {job.status}
                </span>
              </div>

              {/* Title & Description */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-primary transition-colors line-clamp-1 mb-2">
                  {job.title}
                </h3>
                
                <div className="text-sm leading-relaxed text-slate-500 line-clamp-3 mb-4 min-h-[4.5rem]">
                  <ContentRenderer content={job.description} />
                </div>

                {/* Metadata Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 border border-gray-100">
                    <MapPin size={14} className="text-brand-primary" />
                    {job.location}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-50">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Hirings</p>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                      <Users size={14} className="text-blue-500" />
                      {job.noOfOpenings || 1} Positions
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Deadline</p>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-red-600">
                      <Clock size={14} className="text-red-500" />
                      {job.deadline || "Soon"}
                    </div>
                  </div>
                </div>

                {/* Required Documents Section (if any) */}
                {job.requiredDocuments && job.requiredDocuments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">Required Documents</p>
                    <div className="flex flex-wrap gap-1.5">
                      {job.requiredDocuments.map((doc, idx) => (
                        <span key={idx} className="inline-flex items-center rounded-md bg-brand-light/40 px-2 py-0.5 text-[10px] font-bold text-brand-primary border border-brand-primary/10">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center gap-3">
                <Link
                  href={`/dashboard/recruiter/jobs/${job.id}/edit`}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-800 shadow-lg shadow-slate-900/10"
                >
                  <Edit size={16} />
                  Edit Job
                </Link>
                <button
                  onClick={() => handleDelete(job.id)}
                  disabled={deleteMutation.isPending && deleteId === job.id}
                  className="flex items-center justify-center w-11 h-11 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-red-100 shadow-sm"
                  title="Delete Job"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No jobs posted yet
          </h3>
          <p className="mt-1 text-gray-500">
            Get started by posting your first job listing.
          </p>
          <Link
            href="/dashboard/recruiter/jobs/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover"
          >
            <Plus size={16} />
            Post Your First Job
          </Link>
        </div>
      )}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        title="Delete Job"
        message="Are you sure you want to delete this job? This action cannot be undone."
        type="danger"
      />
    </div>
  );
}
