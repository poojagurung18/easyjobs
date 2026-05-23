"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { recruiterService } from "@/lib/api/recruiter";
import { getOrCreateChatRoom } from "@/api/chat.api";
import {
  Loader2,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";

export default function RecruiterApplications() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [interviewModal, setInterviewModal] = useState(null); // applicationId
  const [interviewDate, setInterviewDate] = useState("");
  const [isStartingChat, setIsStartingChat] = useState(false);

  const handleMessageApplicant = async (app) => {
    try {
      setIsStartingChat(true);
      const seekerUserId = app.seeker?.user?.id || app.userId || app.seekerId || app.user?.id;
      const jobId = app.job?.id || app.jobId;
      
      if (!seekerUserId || !jobId) {
         toast.error("Missing applicant or job information");
         return;
      }
      
      const room = await getOrCreateChatRoom(seekerUserId, jobId);
      router.push(`/dashboard/recruiter/chat?roomId=${room.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to start chat");
    } finally {
      setIsStartingChat(false);
    }
  };

  const { data: applications, isLoading } = useQuery({
    queryKey: ["recruiter-applications"],
    queryFn: recruiterService.getApplications,
    retry: false,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, interviewDate }) =>
      recruiterService.updateApplicationStatus(id, status, interviewDate || null),
    onSuccess: () => {
      queryClient.invalidateQueries(["recruiter-applications"]);
      toast.success("Application status updated");
      setInterviewModal(null);
      setInterviewDate("");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });

  const handleStatusUpdate = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleScheduleInterview = () => {
    if (!interviewDate) {
      toast.error("Please select an interview date and time");
      return;
    }
    const selectedDate = new Date(interviewDate);
    if (isNaN(selectedDate.getTime())) {
      toast.error("Invalid date or time selected");
      return;
    }
    updateStatusMutation.mutate({
      id: interviewModal,
      status: "SHORTLISTED",
      interviewDate: selectedDate.toISOString(),
    });
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
        <h1 className="text-2xl font-bold text-foreground">Applications</h1>
        <p className="text-secondary">Review and manage job applications</p>
      </div>

      {applicationsList.length > 0 ? (
        <div className="grid gap-4">
          {applicationsList.map((app) => {
            const applicantName = app.seeker?.user?.name || app.applicantName || "Applicant";
            const applicantEmail = app.seeker?.user?.email || app.applicantEmail || "N/A";
            const applicantPhone = app.seeker?.phone || app.applicantPhone;
            const jobTitle = app.job?.title || app.jobTitle || "Unknown Job";
            const appliedDate = app.appliedAt || app.createdAt || Date.now();
            
            return (
            <div
              key={app.id}
              className="rounded-xl border border-border bg-surface p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-hover text-brand-accent font-bold">
                      {applicantName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {applicantName}
                      </h3>
                      <p className="text-sm text-secondary">
                        {jobTitle}
                      </p>
                    </div>
                    <span
                      className={`ml-auto inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        app.status?.toLowerCase() === "applied"
                          ? "bg-yellow-100 text-yellow-700"
                          : app.status?.toLowerCase() === "shortlisted"
                            ? "bg-green-100 text-green-700"
                            : app.status?.toLowerCase() === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-surface-hover text-foreground"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-secondary">
                    <span className="flex items-center gap-1">
                      <Mail size={14} />
                      {applicantEmail}
                    </span>
                    {applicantPhone && (
                      <span className="flex items-center gap-1">
                        <Phone size={14} />
                        {applicantPhone}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      Applied{" "}
                      {new Date(appliedDate).toLocaleDateString()}
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

                  {(app.coverLetter || app.message) && (
                    <div className="mt-4 rounded-lg bg-surface-hover p-4">
                      <p className="text-sm font-medium text-foreground">
                        Cover Letter
                      </p>
                      <p className="mt-1 text-sm text-secondary">
                        {app.coverLetter || app.message}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-3 flex-wrap">
                    {app.resumeUrl && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-brand-accent shadow-sm"
                      >
                        <FileText size={16} />
                        View Resume
                      </a>
                    )}
                    
                    {app.uploadedDocuments?.map((doc, index) => (
                      <a
                        key={index}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-xl bg-surface-hover px-4 py-2 text-xs font-bold text-foreground transition-all hover:bg-surface-hover border border-border shadow-sm"
                      >
                        <FileText size={16} className="text-brand-accent" />
                        View {doc.name}
                      </a>
                    ))}
                    
                    <div className="flex-1" />

                    {app.status?.toLowerCase() === "applied" && (
                      <>
                        <button
                          onClick={() => {
                            setInterviewModal(app.id);
                            setInterviewDate("");
                          }}
                          disabled={updateStatusMutation.isPending}
                          className="flex items-center gap-1 rounded-lg bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-200"
                        >
                          <CheckCircle size={14} />
                          Shortlist
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app.id, "REJECTED")}
                          disabled={updateStatusMutation.isPending}
                          className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleMessageApplicant(app)}
                      disabled={isStartingChat}
                      className="flex items-center gap-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-secondary hover:bg-surface-hover disabled:opacity-50"
                    >
                      {isStartingChat ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MessageSquare size={14} />
                      )}
                      Message
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
            Applications will appear here when candidates apply to your jobs.
          </p>
        </div>
      )}

      {/* Interview Date Modal */}
      {interviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-surface p-6 shadow-xl">
            <h3 className="text-lg font-bold text-foreground">
              Schedule Interview
            </h3>
            <p className="mt-1 text-sm text-secondary">
              Select date and time for the interview
            </p>
            <div className="mt-4">
              <input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                min={(() => {
                  const now = new Date();
                  const year = now.getFullYear();
                  const month = String(now.getMonth() + 1).padStart(2, "0");
                  const day = String(now.getDate()).padStart(2, "0");
                  const hours = String(now.getHours()).padStart(2, "0");
                  const minutes = String(now.getMinutes()).padStart(2, "0");
                  return `${year}-${month}-${day}T${hours}:${minutes}`;
                })()}
                className="w-full rounded-lg border border-border bg-background text-foreground px-4 py-2.5 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setInterviewModal(null);
                  setInterviewDate("");
                }}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-secondary hover:bg-surface-hover"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleInterview}
                disabled={updateStatusMutation.isPending || !interviewDate}
                className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover disabled:opacity-50"
              >
                {updateStatusMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Calendar size={16} />
                )}
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
