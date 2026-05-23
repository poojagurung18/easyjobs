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
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function RecruiterInterviews() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [rescheduleModal, setRescheduleModal] = useState(null); // application object
  const [newInterviewDate, setNewInterviewDate] = useState("");
  const [isStartingChat, setIsStartingChat] = useState(false);

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
      toast.success("Interview status updated!");
      setRescheduleModal(null);
      setNewInterviewDate("");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update interview");
    },
  });

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

  const handleReschedule = () => {
    if (!newInterviewDate) {
      toast.error("Please select a new date and time");
      return;
    }
    const selectedDate = new Date(newInterviewDate);
    if (isNaN(selectedDate.getTime())) {
      toast.error("Invalid date or time selected");
      return;
    }
    updateStatusMutation.mutate({
      id: rescheduleModal.id,
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

  const rawApplications = Array.isArray(applications)
    ? applications
    : applications?.data || [];

  // Filter for applications in "SHORTLISTED" status, representing our scheduled interviews
  const interviewsList = rawApplications.filter(
    (app) => app.status === "SHORTLISTED" && app.interviewDate
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Interviews & Candidates</h1>
        <p className="text-gray-400">Track scheduled slots, communicate, and manage hiring decisions.</p>
      </div>

      <div className="bg-[#0b121f] rounded-xl border border-gray-100/10 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="text-brand-primary h-5 w-5" />
          Active Interview Schedules ({interviewsList.length})
        </h2>

        {interviewsList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#060b13] text-gray-400 uppercase text-xs tracking-wider border-b border-gray-200/10">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl">Candidate</th>
                  <th className="px-6 py-4">Job Title</th>
                  <th className="px-6 py-4">Contact Details</th>
                  <th className="px-6 py-4">Scheduled Slot</th>
                  <th className="px-6 py-4">Resume</th>
                  <th className="px-6 py-4 rounded-tr-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/5">
                {interviewsList.map((app) => {
                  const applicantName = app.seeker?.user?.name || "Applicant";
                  const applicantEmail = app.seeker?.user?.email || "N/A";
                  const applicantPhone = app.seeker?.phoneNumber || app.seeker?.phone || "N/A";
                  const jobTitle = app.job?.title || "Unknown Job";
                  
                  return (
                    <tr key={app.id} className="hover:bg-[#111a2e] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary font-bold border border-brand-primary/20">
                            {applicantName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{applicantName}</div>
                            <span className="inline-flex rounded-full bg-brand-primary/10 text-brand-primary px-2.5 py-0.5 text-xs font-semibold mt-1">
                              Shortlisted
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-white font-medium">
                          <Briefcase size={16} className="text-gray-500" />
                          {jobTitle}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1.5 text-gray-300">
                            <Mail size={12} className="text-gray-500" />
                            {applicantEmail}
                          </div>
                          {applicantPhone !== "N/A" && (
                            <div className="flex items-center gap-1.5 text-gray-300">
                              <Phone size={12} className="text-gray-500" />
                              {applicantPhone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-brand-primary font-semibold bg-brand-primary/10 border border-brand-primary/20 px-3 py-1.5 rounded-lg w-fit">
                          <Clock size={14} />
                          {new Date(app.interviewDate).toLocaleString(undefined, {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {app.resumeUrl ? (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-brand-primary hover:text-brand-primary-hover hover:underline transition-all"
                          >
                            <FileText size={14} />
                            View CV
                            <ExternalLink size={10} />
                          </a>
                        ) : (
                          <span className="text-gray-500 text-xs italic">No Resume</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleMessageApplicant(app)}
                            disabled={isStartingChat}
                            className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                            title="Chat with Seeker"
                          >
                            <MessageSquare size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setRescheduleModal(app);
                              setNewInterviewDate(app.interviewDate ? app.interviewDate.substring(0, 16) : "");
                            }}
                            className="px-3 py-1.5 rounded-lg border border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white transition-all text-xs font-medium"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Are you sure you want to hire this candidate?")) {
                                updateStatusMutation.mutate({ id: app.id, status: "ACCEPTED" });
                              }
                            }}
                            className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-50 hover:text-white border border-emerald-500/20 transition-all"
                            title="Hire Candidate"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Are you sure you want to reject this candidate?")) {
                                updateStatusMutation.mutate({ id: app.id, status: "REJECTED" });
                              }
                            }}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-50 hover:text-white border border-red-500/20 transition-all"
                            title="Reject Candidate"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">No Upcoming Interviews</h3>
            <p className="text-gray-400 max-w-sm">
              Candidates will appear here once you shortlist their applications and set an interview date.
            </p>
            <Link
              href="/dashboard/recruiter/applications"
              className="mt-4 inline-flex items-center gap-2 bg-brand-accent text-white font-semibold px-5 py-2 rounded-xl hover:bg-brand-accent-hover transition-colors text-sm shadow-lg shadow-brand-accent/20"
            >
              Shortlist Candidates
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-[#0b121f] border border-gray-100/10 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white mb-2">Reschedule Interview</h3>
            <p className="text-sm text-gray-400 mb-4">
              Select a new date and time for your interview with{" "}
              <span className="text-brand-primary font-semibold">
                {rescheduleModal.seeker?.user?.name}
              </span>.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  New Interview Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={newInterviewDate}
                  min={new Date().toISOString().substring(0, 16)}
                  onChange={(e) => setNewInterviewDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200/10 bg-[#060b13] text-white px-4 py-3 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200/10">
                <button
                  type="button"
                  onClick={() => setRescheduleModal(null)}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReschedule}
                  disabled={updateStatusMutation.isPending}
                  className="flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-hover disabled:opacity-50 transition-colors shadow-lg shadow-brand-primary/20"
                >
                  {updateStatusMutation.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Update Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
