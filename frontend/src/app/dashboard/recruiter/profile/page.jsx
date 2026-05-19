"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { recruiterService } from "@/lib/api/recruiter";
import {
  Upload,
  Loader2,
  Save,
  Building2,
  Pencil,
  X,
  Globe,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  User,
  CheckCircle,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import ContentRenderer from "@/components/common/ContentRenderer";
import TiptapTextBlock from "@/components/common/TipTapTextBlock";

const profileSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  companyEmail: z.string().email("Valid company email is required"),
  contactPerson: z.string().min(2, "Contact person name is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  companyWebsite: z
    .string()
    .url("Valid website URL is required")
    .optional()
    .or(z.literal("")),
  companyAddress: z.string().min(5, "Address is required"),
  industryType: z.string().min(1, "Industry type is required"),
  panNumber: z.string().min(10, "Valid PAN number is required"),
  description: z.string().min(50, "Description must be at least 50 characters"),
});

export default function RecruiterProfile() {
  const queryClient = useQueryClient();
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["recruiter-profile"],
    queryFn: recruiterService.getProfile,
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: (formData) => recruiterService.createProfile(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["recruiter-profile"]);
      toast.success("Profile created successfully!");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create profile");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (formData) => recruiterService.updateProfile(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["recruiter-profile"]);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setLogo(null);
      setLogoPreview(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      description: "",
    },
    values: profile || {},
  });

  const description = watch("description");

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key]) formData.append(key, data[key]);
    });
    if (logo) formData.append("logo", logo);

    if (profile) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setLogo(null);
    setLogoPreview(null);
    reset(profile || {});
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const hasProfile = !!profile && !profile?.message;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  // ─── Detail View ────────────────────────────────────────────────────
  if (hasProfile && !isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Company Profile
            </h1>
            <p className="text-gray-600">Your company information</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover transition-colors"
          >
            <Pencil size={15} />
            Edit Profile
          </button>
        </div>

        {profile && !profile.approved && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">
                  Account Under Verification
                </p>
                <p className="text-sm text-blue-700">
                  Your profile has been submitted and is currently under manual verification by our team.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-5">
            {profile.logoUrl ? (
              <img
                src={profile.logoUrl}
                alt={profile.companyName}
                className="h-20 w-20 rounded-xl object-cover border border-gray-100 shadow-sm"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-100">
                <Building2 className="h-10 w-10 text-gray-400" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {profile.companyName}
              </h2>
              <p className="text-sm text-gray-500">{profile.industryType}</p>
              {profile.companyWebsite && (
                <a
                  href={profile.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  <Globe size={13} />
                  {profile.companyWebsite}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoCard
            icon={Mail}
            label="Company Email"
            value={profile.companyEmail}
          />
          <InfoCard
            icon={User}
            label="Contact Person"
            value={profile.contactPerson}
          />
          <InfoCard
            icon={Phone}
            label="Phone Number"
            value={profile.phoneNumber}
          />
          <InfoCard
            icon={MapPin}
            label="Address"
            value={profile.companyAddress}
          />
          <InfoCard
            icon={Briefcase}
            label="Industry"
            value={profile.industryType}
          />
          <InfoCard
            icon={FileText}
            label="PAN Number"
            value={profile.panNumber}
          />
        </div>

        {/* Description */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            About the Company
          </p>

          <div className="text-sm leading-relaxed text-gray-700">
            <ContentRenderer content={profile.description} />
          </div>
        </div>
      </div>
    );
  }

  // ─── Create / Edit Form ──────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {hasProfile ? "Edit Profile" : "Company Profile"}
          </h1>
          <p className="text-gray-600">
            {hasProfile
              ? "Update your company information"
              : "Set up your company information"}
          </p>
        </div>
        {hasProfile && (
          <button
            onClick={handleCancelEdit}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <X size={15} />
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* Logo Upload */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative">
              {logoPreview || profile?.logoUrl ? (
                <img
                  src={logoPreview || profile.logoUrl}
                  alt="Company Logo"
                  className="h-24 w-24 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-gray-100">
                  <Building2 className="h-10 w-10 text-gray-400" />
                </div>
              )}
              <label className="absolute -bottom-2 -right-2 cursor-pointer rounded-full bg-brand-primary p-2 text-white shadow-lg hover:bg-brand-primary-hover">
                <Upload size={14} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <p className="font-medium text-gray-900">Company Logo</p>
              <p className="text-sm text-gray-500">Upload your company logo</p>
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Company Name" error={errors.companyName}>
              <input
                type="text"
                {...register("companyName")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                placeholder="Acme Inc."
              />
            </FormField>

            <FormField label="Company Email" error={errors.companyEmail}>
              <input
                type="email"
                {...register("companyEmail")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                placeholder="hr@acme.com"
              />
            </FormField>

            <FormField label="Contact Person" error={errors.contactPerson}>
              <input
                type="text"
                {...register("contactPerson")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                placeholder="John Doe"
              />
            </FormField>

            <FormField label="Phone Number" error={errors.phoneNumber}>
              <input
                type="tel"
                {...register("phoneNumber")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                placeholder="+1 234 567 8900"
              />
            </FormField>

            <FormField label="Website" error={errors.companyWebsite}>
              <input
                type="url"
                {...register("companyWebsite")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                placeholder="https://acme.com"
              />
            </FormField>

            <FormField label="Industry Type" error={errors.industryType}>
              <select
                {...register("industryType")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              >
                <option value="">Select Industry</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Other">Other</option>
              </select>
            </FormField>

            <FormField label="PAN Number" error={errors.panNumber}>
              <input
                type="text"
                {...register("panNumber")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                placeholder="ABCDE1234F"
              />
            </FormField>

            <FormField label="Address" error={errors.companyAddress}>
              <input
                type="text"
                {...register("companyAddress")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                placeholder="123 Business St, City, Country"
              />
            </FormField>
          </div>

          <div className="mt-4">
            <FormField label="Company Description" error={errors.description}>
              <TiptapTextBlock
                value={description}
                onChange={(content) => {
                  setValue("description", content, { shouldValidate: true });
                }}
              />
            </FormField>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 rounded-lg bg-brand-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-primary-hover disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {hasProfile ? "Update Profile" : "Create Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="rounded-lg bg-gray-100 p-2 shrink-0">
        <Icon size={16} className="text-gray-600" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-brand-primary-hover break-words">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function FormField({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
