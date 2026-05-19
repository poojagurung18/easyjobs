"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSavedJobs, unsaveJob } from "@/api/seeker.api";
import {
  Loader2,
  Briefcase,
  MapPin,
  DollarSign,
  Building2,
  Trash2,
  Heart,
} from "lucide-react";
import toast from "react-hot-toast";
import ContentRenderer from "@/components/common/ContentRenderer";

import ConfirmModal from "@/components/common/ConfirmModal";
import { useState } from "react";
import { JobCard } from "@/components/jobs/JobCard";

export default function SavedJobs() {
  const queryClient = useQueryClient();
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: savedJobs, isLoading } = useQuery({
    queryKey: ["saved-jobs"],
    queryFn: getSavedJobs,
    retry: false,
  });

  const unsaveMutation = useMutation({
    mutationFn: unsaveJob,
    onSuccess: () => {
      queryClient.invalidateQueries(["saved-jobs"]);
      toast.success("Job removed from saved");
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to remove saved job",
      );
    },
  });

  const handleUnsave = (jobId) => {
    setSelectedJobId(jobId);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  const savedJobsList = Array.isArray(savedJobs)
    ? savedJobs
    : savedJobs?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
        <p className="text-gray-600">Jobs you've saved for later</p>
      </div>

      {savedJobsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {savedJobsList.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              basePath="/dashboard/seeker/jobs" 
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <Heart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No saved jobs
          </h3>
          <p className="mt-1 text-gray-500">
            Save jobs you're interested in to view them later.
          </p>
          <Link
            href="/dashboard/seeker/jobs"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover"
          >
            Browse Jobs
          </Link>
        </div>
      )}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => unsaveMutation.mutate(selectedJobId)}
        title="Remove Saved Job"
        message="Are you sure you want to remove this job from your saved list?"
        type="warning"
      />
    </div>
  );
}
