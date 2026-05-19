"use client";

import { useState } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";

export default function ReportModal({ isOpen, onClose, onConfirm, isPending }) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reason.trim()) {
      onConfirm(reason);
      setReason("");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md scale-100 transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
        <div className="bg-red-50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <AlertTriangle size={24} />
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <h3 className="mt-4 text-xl font-bold text-gray-900">
            Report Recruiter
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Please provide a detailed reason for reporting this recruiter. Your report will be reviewed by our admin team.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <textarea
            required
            autoFocus
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe the issue..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:border-red-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all resize-none"
          />

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !reason.trim()}
              className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 hover:bg-red-700 disabled:opacity-50 transition-all"
            >
              {isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "Submit Report"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
