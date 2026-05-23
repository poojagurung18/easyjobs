"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/lib/api/admin";
import {
  Building2,
  Trash2,
  RotateCcw,
  CheckCircle,
  Loader2,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

import ConfirmModal from "@/components/common/ConfirmModal";

export default function ReportedRecruitersPage() {
  const queryClient = useQueryClient();
  const [minReports, setMinReports] = useState(1);
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    id: null,
    type: "reset",
  });

  const { data: reportedRecruiters, isLoading } = useQuery({
    queryKey: ["reported-recruiters", minReports],
    queryFn: () => adminService.getReportedRecruiters(minReports),
  });

  const resetMutation = useMutation({
    mutationFn: (id) => adminService.resetRecruiterReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["reported-recruiters"]);
      toast.success("Report reset successfully");
      setConfirmConfig({ isOpen: false, id: null, type: "reset" });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to reset report");
    },
  });

  const toggleBlockMutation = useMutation({
    mutationFn: (id) => adminService.toggleBlockRecruiter(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["reported-recruiters"]);
      toast.success("Recruiter status updated successfully");
      setConfirmConfig({ isOpen: false, id: null, type: "block" });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update recruiter status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteRecruiter(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["reported-recruiters"]);
      toast.success("Recruiter deleted successfully");
      setConfirmConfig({ isOpen: false, id: null, type: "delete" });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete recruiter");
    },
  });

  const list = Array.isArray(reportedRecruiters) ? reportedRecruiters : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reported Recruiters</h1>
          <p className="text-secondary">Manage recruiters with user reports</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-secondary">Min reports:</label>
          <select
            value={minReports}
            onChange={(e) => setMinReports(Number(e.target.value))}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
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
      ) : list.length > 0 ? (
        <div className="rounded-xl border border-border bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary">Company</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary">Reports</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {list.map((recruiter) => (
                  <tr key={recruiter.userId} className="hover:bg-surface-hover">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-hover">
                          <Building2 size={20} className="text-brand-primary" />
                        </div>
                        <span className="font-medium text-foreground">{recruiter.companyName || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary">{recruiter.companyEmail || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          recruiter.reportCount > 10
                            ? "bg-red-100 text-red-700"
                            : recruiter.reportCount > 5
                              ? "bg-orange-100 text-orange-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {recruiter.reportCount || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setConfirmConfig({ isOpen: true, id: recruiter.userId, type: "block" })}
                          disabled={toggleBlockMutation.isPending}
                          className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                            recruiter.blocked
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                          }`}
                        >
                          {recruiter.blocked ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                          {recruiter.blocked ? "Unblock" : "Block"}
                        </button>
                        <button
                          onClick={() => setConfirmConfig({ isOpen: true, id: recruiter.userId, type: "reset" })}
                          disabled={resetMutation.isPending}
                          className="flex items-center gap-1 rounded-lg bg-yellow-100 px-3 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-200"
                        >
                          <RotateCcw size={14} />
                          Reset
                        </button>
                        <button
                          onClick={() => setConfirmConfig({ isOpen: true, id: recruiter.userId, type: "delete" })}
                          disabled={deleteMutation.isPending}
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
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
          <h3 className="mt-4 text-lg font-medium text-foreground">No reported recruiters</h3>
          <p className="mt-1 text-secondary">All recruiters are in good standing.</p>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={() => {
          if (confirmConfig.type === "reset") {
            resetMutation.mutate(confirmConfig.id);
          } else if (confirmConfig.type === "block") {
            toggleBlockMutation.mutate(confirmConfig.id);
          } else {
            deleteMutation.mutate(confirmConfig.id);
          }
        }}
        title={
          confirmConfig.type === "reset"
            ? "Reset Reports"
            : confirmConfig.type === "block"
              ? "Update Status"
              : "Delete Recruiter"
        }
        message={
          confirmConfig.type === "reset"
            ? "Are you sure you want to reset this recruiter's report count to 0?"
            : confirmConfig.type === "block"
              ? "Are you sure you want to change this recruiter's block status?"
              : "Are you sure you want to delete this recruiter? All their jobs will also be removed."
        }
        type={confirmConfig.type === "delete" ? "danger" : "warning"}
      />
    </div>
  );
}
