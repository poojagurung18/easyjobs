"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { seekerService } from "@/lib/api/seeker";
import { Loader2, Building2, Globe, Mail, Phone, MapPin, FileText, User, Briefcase } from "lucide-react";
import Link from "next/link";
import ContentRenderer from "@/components/common/ContentRenderer";

export default function RecruiterProfilePage() {
  const params = useParams();
  const recruiterId = params.id;

  const { data: recruiter, isLoading, error } = useQuery({
    queryKey: ["recruiter-profile", recruiterId],
    queryFn: () => seekerService.getRecruiterProfile(recruiterId),
    enabled: !!recruiterId,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (error || !recruiter) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Recruiter not found</h1>
        <Link href="/dashboard/seeker/jobs" className="mt-4 inline-block text-gray-600 hover:underline">
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/seeker/jobs"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        ← Back to Jobs
      </Link>

      {/* Header Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-5">
          {recruiter.logoUrl ? (
            <img
              src={recruiter.logoUrl}
              alt={recruiter.companyName}
              className="h-20 w-20 rounded-xl object-cover border border-gray-100 shadow-sm"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-brand-light">
              <Building2 className="h-10 w-10 text-brand-primary opacity-40" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {recruiter.companyName || "Company"}
            </h1>
            <p className="text-sm text-slate-500">{recruiter.industryType || "Company"}</p>
            {recruiter.companyWebsite && (
              <a
                href={recruiter.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-sm text-gray-600 hover:underline"
              >
                <Globe size={13} />
                {recruiter.companyWebsite}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {recruiter.companyEmail && (
          <InfoCard
            icon={Mail}
            label="Company Email"
            value={recruiter.companyEmail}
          />
        )}
        {recruiter.contactPerson && (
          <InfoCard
            icon={User}
            label="Contact Person"
            value={recruiter.contactPerson}
          />
        )}
        {recruiter.phoneNumber && (
          <InfoCard
            icon={Phone}
            label="Phone Number"
            value={recruiter.phoneNumber}
          />
        )}
        {recruiter.companyAddress && (
          <InfoCard
            icon={MapPin}
            label="Address"
            value={recruiter.companyAddress}
          />
        )}
        {recruiter.industryType && (
          <InfoCard
            icon={Briefcase}
            label="Industry"
            value={recruiter.industryType}
          />
        )}
        {recruiter.panNumber && (
          <InfoCard
            icon={FileText}
            label="PAN Number"
            value={recruiter.panNumber}
          />
        )}
      </div>

      {/* Description */}
      {recruiter.description && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            About the Company
          </p>
          <div className="text-sm leading-relaxed text-slate-600">
            <ContentRenderer content={recruiter.description} />
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="rounded-lg bg-brand-light p-2 shrink-0">
        <Icon size={16} className="text-brand-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-primary/60">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-slate-800 break-words">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}
