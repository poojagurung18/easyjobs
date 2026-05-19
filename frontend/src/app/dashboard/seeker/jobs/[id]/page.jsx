"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { seekerService } from "@/lib/api/seeker";
import { getOrCreateChatRoom } from "@/api/chat.api";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Building2,
  Briefcase,
  Loader2,
  AlertCircle,
  MessageSquare,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import ContentRenderer from "@/components/common/ContentRenderer";

export default function SeekerJobDetailPage() {
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

  const application = applications?.find(
    (app) => app.jobId === Number(jobId) || app.job?.id === Number(jobId),
  );
  const hasApplied = !!application;

  const [isStartingChat, setIsStartingChat] = useState(false);

  const handleMessageRecruiter = async () => {
    try {
      setIsStartingChat(true);
      const room = await getOrCreateChatRoom(user.userId, jobId);
      router.push(`/dashboard/seeker/chat?roomId=${room.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to start chat");
    } finally {
      setIsStartingChat(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Job not found</h1>
        <Link
          href="/dashboard/seeker/jobs"
          className="mt-4 inline-block text-gray-950 hover:underline"
        >
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/seeker/jobs"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Back to Jobs
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          {job.recruiterId ? (
            <Link
              href={`/dashboard/seeker/recruiter/${job.recruiterId}`}
              className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 overflow-hidden hover:opacity-80 transition-opacity"
            >
              {job.recruiterLogo ? (
                <img src={job.recruiterLogo} alt="" className="h-full w-full object-cover" />
              ) : (
                <Building2 size={32} className="text-slate-600" />
              )}
            </Link>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100">
              <Building2 size={32} className="text-slate-600" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
            {job.recruiterId ? (
              <Link
                href={`/dashboard/seeker/recruiter/${job.recruiterId}`}
                className="mt-1 text-lg text-shadow-gray-600">
                {job.recruiterName || job.recruiter?.companyName || "Company Name"}
              </Link>
            ) : (
              <p className="mt-1 text-lg text-slate-600">
                {job.recruiterName || "Company Name"}
              </p>
            )}
          </div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${job.status?.toLowerCase() === "open" ||
                job.status?.toLowerCase() === "active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
              }`}
          >
            {job.status || "Active"}
          </span>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-50 pb-4 mb-4">Job Description</h2>
            <div className="prose prose-slate max-w-none">
              <ContentRenderer content={job.description} />
            </div>
          </div>

          {job.requiredDocuments && job.requiredDocuments.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-50 pb-4 mb-4">Required Documents</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.requiredDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-brand-primary shadow-sm">
                      <Briefcase size={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {(user?.role?.toLowerCase().includes("seeker") ||
            user?.role?.toLowerCase() === "employee") && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3">
                  {hasApplied ? (
                    <div className="space-y-3">
                      <div className={`rounded-xl p-4 border ${
                        application?.status?.toLowerCase() === "shortlisted"
                          ? "bg-green-50 border-green-100 text-green-800"
                          : application?.status?.toLowerCase() === "rejected"
                            ? "bg-red-50 border-red-100 text-red-800"
                            : "bg-blue-50 border-blue-100 text-blue-800"
                      }`}>
                        <div className="flex items-center gap-2 font-semibold">
                          <AlertCircle size={18} className="shrink-0" />
                          <span className="text-xs font-bold uppercase tracking-wider">
                            Status: {application?.status}
                          </span>
                        </div>
                        {application?.interviewDate && (
                          <div className="mt-3 border-t border-current/10 pt-3 text-xs space-y-1">
                            <p className="font-bold uppercase tracking-wider text-current/70">Interview Scheduled:</p>
                            <p className="flex items-center gap-1 font-semibold">
                              <Clock size={12} className="shrink-0" />
                              {new Date(application.interviewDate).toLocaleString(undefined, {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => router.push(`/dashboard/seeker/apply/${jobId}`)}
                      className="w-full cursor-pointer rounded-xl bg-slate-900 py-4 text-center text-sm font-bold text-white transition-all hover:bg-brand-primary shadow-lg shadow-slate-900/10 hover:shadow-brand-primary/20 active:scale-95"
                    >
                      Apply Now
                    </button>
                  )}

                  <button
                    onClick={handleMessageRecruiter}
                    disabled={isStartingChat}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3.5 text-sm font-bold text-slate-700 transition-all hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 active:scale-95"
                  >
                    {isStartingChat ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <MessageSquare className="h-5 w-5" />
                    )}
                    Message Recruiter
                  </button>
                </div>
              </div>
            )}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-50 pb-4 mb-4">Job Overview</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 text-brand-primary">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Application Deadline</p>
                  <p className="text-sm font-semibold text-slate-900">{job.deadline || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 text-brand-primary">
                  <Briefcase size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Openings</p>
                  <p className="text-sm font-semibold text-slate-900">{job.noOfOpenings || 1} Positions</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 text-brand-primary">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Location</p>
                  <p className="text-sm font-semibold text-slate-900">{job.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 text-brand-primary">
                  <DollarSign size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Offered Salary</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {/^\d+/.test(job.salary) ? `Rs ${job.salary}` : job.salary}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {job.recruiter && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-50 pb-4 mb-4">
                About the Company
              </h2>
              <div className="mt-4">
                <p className="font-bold text-gray-900">
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
                  <div className="mt-4 text-sm text-slate-600 line-clamp-4">
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
