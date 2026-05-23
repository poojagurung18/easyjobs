"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/lib/api/admin";
import {
  Users,
  Building2,
  AlertTriangle,
  CheckCircle,
  Trash2,
  RotateCcw,
  Shield,
  Loader2,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import ConfirmModal from "@/components/common/ConfirmModal";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [minReports, setMinReports] = useState(1);

  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "danger",
  });

  const closeConfirm = () => setConfirmConfig((prev) => ({ ...prev, isOpen: false }));

  const {
    data: reportedRecruiters,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["reported-recruiters", minReports],
    queryFn: () => adminService.getReportedRecruiters(minReports),
  });

  const { data: unverifiedRecruiters, isLoading: isUnverifiedLoading } = useQuery({
    queryKey: ["unverified-recruiters"],
    queryFn: adminService.getUnverifiedRecruiters,
  });

  const verifyRecruiterMutation = useMutation({
    mutationFn: (recruiterId) => adminService.verifyRecruiter(recruiterId),
    onSuccess: () => {
      queryClient.invalidateQueries(["unverified-recruiters"]);
      toast.success("Recruiter verified successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to verify recruiter");
    },
  });

  const resetReportMutation = useMutation({
    mutationFn: (recruiterId) => adminService.resetRecruiterReport(recruiterId),
    onSuccess: () => {
      queryClient.invalidateQueries(["reported-recruiters"]);
      toast.success("Recruiter report reset successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to reset report");
    },
  });

  const deleteRecruiterMutation = useMutation({
    mutationFn: (recruiterId) => adminService.deleteRecruiter(recruiterId),
    onSuccess: () => {
      queryClient.invalidateQueries(["reported-recruiters", "unverified-recruiters"]);
      toast.success("Recruiter deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete recruiter");
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: () => adminService.deleteOwnAccount(),
    onSuccess: () => {
      toast.success("Account deleted successfully");
      logout();
      router.push("/login");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete account");
    },
  });

  const handleDeleteAccount = () => {
    setConfirmConfig({
      isOpen: true,
      title: "Delete Account",
      message: "Are you sure you want to delete your admin account? This action cannot be undone.",
      onConfirm: () => deleteAccountMutation.mutate(),
      type: "danger",
    });
  };

  const handleResetReport = (recruiterId) => {
    setConfirmConfig({
      isOpen: true,
      title: "Reset Reports",
      message: "Are you sure you want to reset this recruiter's report count to 0?",
      onConfirm: () => resetReportMutation.mutate(recruiterId),
      type: "warning",
    });
  };

  const handleDeleteRecruiter = (recruiterId) => {
    setConfirmConfig({
      isOpen: true,
      title: "Delete Recruiter",
      message: "Are you sure you want to delete this recruiter? All their jobs will also be removed.",
      onConfirm: () => deleteRecruiterMutation.mutate(recruiterId),
      type: "danger",
    });
  };

  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleViewDetails = async (recruiterId) => {
    try {
      const details = await adminService.getRecruiterProfile(recruiterId);
      setSelectedRecruiter(details);
      setIsDetailsModalOpen(true);
    } catch (error) {
      toast.error("Failed to load recruiter details");
    }
  };

  const handleVerifyRecruiter = (recruiterId) => {
    setConfirmConfig({
      isOpen: true,
      title: "Verify Recruiter",
      message: "Verify this recruiter and approve their profile?",
      onConfirm: () => {
        verifyRecruiterMutation.mutate(recruiterId);
        setIsDetailsModalOpen(false);
      },
      type: "info",
    });
  };

  const reportedList = Array.isArray(reportedRecruiters) ? reportedRecruiters : [];
  const unverifiedList = Array.isArray(unverifiedRecruiters) ? unverifiedRecruiters : [];

  return (
    <div className="space-y-6">
      {/* Details Modal */}
      {isDetailsModalOpen && selectedRecruiter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-border p-6">
              <h3 className="text-xl font-bold text-foreground">Recruiter Details</h3>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="rounded-lg p-2 text-muted hover:bg-surface-hover hover:text-secondary"
              >
                <Trash2 size={20} className="rotate-45" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <DetailItem label="Company Name" value={selectedRecruiter.companyName} />
                <DetailItem label="Industry" value={selectedRecruiter.industryType} />
                <DetailItem label="Contact Person" value={selectedRecruiter.contactPerson} />
                <DetailItem label="Email" value={selectedRecruiter.companyEmail} />
                <DetailItem label="Phone" value={selectedRecruiter.phoneNumber} />
                <DetailItem label="Address" value={selectedRecruiter.companyAddress} />
                <DetailItem label="Website" value={selectedRecruiter.companyWebsite} isLink />
                <DetailItem label="PAN Number" value={selectedRecruiter.panNumber} />
              </div>
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-widest text-muted">Description</p>
                <div className="mt-2 rounded-xl bg-surface-hover p-4 text-sm text-secondary">
                  <div dangerouslySetInnerHTML={{ __html: selectedRecruiter.description }} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-border p-6">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="rounded-xl border border-border px-6 py-2.5 text-sm font-bold text-secondary hover:bg-surface-hover"
              >
                Close
              </button>
              {!selectedRecruiter.approved && (
                <button
                  onClick={() => handleVerifyRecruiter(selectedRecruiter.userId)}
                  className="rounded-xl bg-green-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-green-700"
                >
                  Approve Recruiter
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-secondary">Manage recruiters, verifications and platform safety</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Pending Verification</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">{unverifiedList.length}</p>
            </div>
            <div className="rounded-lg bg-blue-100 p-3">
              <Shield size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Reported Recruiters</p>
              <p className="mt-1 text-2xl font-bold text-red-600">{reportedList.length}</p>
            </div>
            <div className="rounded-lg bg-red-100 p-3">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">High Risk</p>
              <p className="mt-1 text-2xl font-bold text-orange-600">
                {reportedList.filter((r) => r.reportCount > 10).length}
              </p>
            </div>
            <div className="rounded-lg bg-orange-100 p-3">
              <AlertTriangle size={24} className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Platform Status</p>
              <p className="mt-1 text-lg font-bold text-green-600">Secure</p>
            </div>
            <div className="rounded-lg bg-green-100 p-3">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Unverified Recruiters Section */}
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">Pending Verifications</h2>
          <p className="text-sm text-secondary">Review and approve new recruiter profiles</p>
        </div>

        {isUnverifiedLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
          </div>
        ) : unverifiedList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-secondary">Company</th>
                  <th className="pb-3 text-left text-sm font-medium text-secondary">Email</th>
                  <th className="pb-3 text-left text-sm font-medium text-secondary">Industry</th>
                  <th className="pb-3 text-left text-sm font-medium text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {unverifiedList.map((recruiter) => (
                  <tr key={recruiter.userId}>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <Building2 size={20} />
                        </div>
                        <span className="font-medium text-foreground">{recruiter.companyName}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-secondary">{recruiter.companyEmail}</td>
                    <td className="py-4 text-sm text-secondary">{recruiter.industryType}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(recruiter.userId)}
                          className="flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-200"
                        >
                          <Eye size={14} />
                          View
                        </button>
                        <button
                          onClick={() => handleVerifyRecruiter(recruiter.userId)}
                          disabled={verifyRecruiterMutation.isPending}
                          className="flex items-center gap-1 rounded-lg bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-200"
                        >
                          <CheckCircle size={14} />
                          Verify
                        </button>
                        <button
                          onClick={() => handleDeleteRecruiter(recruiter.userId)}
                          className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200"
                        >
                          <Trash2 size={14} />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
            <p className="mt-2 text-secondary">No pending verifications</p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Reported Recruiters</h2>
            <p className="text-sm text-secondary">Manage recruiters with reports from job seekers</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-secondary">Min reports:</label>
            <select
              value={minReports}
              onChange={(e) => setMinReports(Number(e.target.value))}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-brand-primary focus:outline-none"
            >
              <option value={1}>1+</option>
              <option value={5}>5+</option>
              <option value={10}>10+</option>
              <option value={20}>20+</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
          </div>
        ) : reportedList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-secondary">Company</th>
                  <th className="pb-3 text-left text-sm font-medium text-secondary">Email</th>
                  <th className="pb-3 text-left text-sm font-medium text-secondary">Contact</th>
                  <th className="pb-3 text-left text-sm font-medium text-secondary">Reports</th>
                  <th className="pb-3 text-left text-sm font-medium text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reportedList.map((recruiter) => (
                  <tr key={recruiter.userId}>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-hover text-brand-primary">
                          <Building2 size={20} />
                        </div>
                        <span className="font-medium text-foreground">
                          {recruiter.companyName || "Company"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-secondary">{recruiter.companyEmail || "N/A"}</td>
                    <td className="py-4 text-sm text-secondary">{recruiter.contactPerson || "N/A"}</td>
                    <td className="py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          recruiter.reportCount > 10
                            ? "bg-red-100 text-red-700"
                            : recruiter.reportCount > 5
                              ? "bg-orange-100 text-orange-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {recruiter.reportCount || 0} reports
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(recruiter.userId)}
                          className="flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-200"
                        >
                          <Eye size={14} />
                          View
                        </button>
                        <button
                          onClick={() => handleResetReport(recruiter.userId)}
                          disabled={resetReportMutation.isPending}
                          className="flex items-center gap-1 rounded-lg bg-yellow-100 px-3 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-200"
                        >
                          <RotateCcw size={14} />
                          Reset
                        </button>
                        <button
                          onClick={() => handleDeleteRecruiter(recruiter.userId)}
                          disabled={deleteRecruiterMutation.isPending}
                          className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
            <h3 className="mt-4 text-lg font-medium text-foreground">No reported recruiters</h3>
            <p className="mt-1 text-secondary">All recruiters are in good standing.</p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
        <p className="mt-1 text-sm text-red-700">These actions are irreversible. Please proceed with caution.</p>
        <button
          onClick={handleDeleteAccount}
          disabled={deleteAccountMutation.isPending}
          className="mt-4 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          <Trash2 size={16} />
          Delete My Admin Account
        </button>
      </div>

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
      />
    </div>
  );
}

function DetailItem({ label, value, isLink = false }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-bold uppercase tracking-widest text-muted">{label}</p>
      {isLink && value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate text-sm font-medium text-blue-600 hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="text-sm font-medium text-foreground">{value || "—"}</p>
      )}
    </div>
  );
}
