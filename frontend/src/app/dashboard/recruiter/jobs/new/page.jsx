"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { recruiterService } from "@/lib/api/recruiter";
import { paymentService } from "@/lib/api/payment";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Gem } from "lucide-react";
import { useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import TiptapTextBlock from "@/components/common/TipTapTextBlock";

const jobSchema = z.object({
  title: z.string().min(5, "Job title must be at least 5 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  location: z.string().min(2, "Location is required"),
  salary: z.string().optional(),
  status: z.enum(["OPEN", "CLOSED"]),
  deadline: z.string().min(1, "Deadline is required"),
  noOfOpenings: z.string().min(1, "Number of openings is required"),
});

export default function NewJobPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      status: "OPEN",
      description: "",
    },
  });
  const [requiredDocs, setRequiredDocs] = useState([]);
  const [newDocName, setNewDocName] = useState("");

  const addRequiredDoc = () => {
    if (newDocName.trim()) {
      setRequiredDocs([...requiredDocs, newDocName.trim()]);
      setNewDocName("");
    }
  };

  const removeRequiredDoc = (index) => {
    setRequiredDocs(requiredDocs.filter((_, i) => i !== index));
  };

  const description = watch("description");

  const { data: credits, isLoading: isCreditsLoading } = useQuery({
    queryKey: ["recruiter-credits"],
    queryFn: recruiterService.getCredits,
  });

  const handleBuyCredits = async () => {
    try {
      toast.loading("Preparing payment...", { id: "payment" });
      const response = await paymentService.createPayment();
      if (response.paymentLink) {
        window.location.href = response.paymentLink;
      } else {
        throw new Error("Payment link not found");
      }
    } catch (error) {
      toast.error("Failed to initiate payment", { id: "payment" });
    }
  };

  const mutation = useMutation({
    mutationFn: (data) => recruiterService.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["recruiter-jobs"]);
      toast.success("Job posted successfully!");
      router.push("/dashboard/recruiter/jobs");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create job");
    },
  });

  if (isCreditsLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        <p className="text-text-secondary animate-pulse">
          Verifying your job credits...
        </p>
      </div>
    );
  }

  const onSubmit = (data) => {
    const finalData = {
      ...data,
      noOfOpenings: parseInt(data.noOfOpenings),
      requiredDocuments: requiredDocs,
    };
    // Save pending job data to local storage to be processed after successful payment
    localStorage.setItem("pending_job_data", JSON.stringify(finalData));
    handleBuyCredits();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/recruiter/jobs"
          className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Post New Job</h1>
          <p className="text-text-secondary">Create a new job listing</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-xl border border-border bg-surface p-6 shadow-sm"
      >
        <div className="space-y-4">
          <FormField label="Job Title" error={errors.title} required>
            <input
              type="text"
              {...register("title")}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              placeholder="Senior Frontend Developer"
            />
          </FormField>

          <FormField
            label="Job Description"
            error={errors.description}
            required
          >
            <TiptapTextBlock
              value={description}
              onChange={(content) => {
                setValue("description", content, { shouldValidate: true });
              }}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Location" error={errors.location} required>
              <input
                type="text"
                {...register("location")}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                placeholder="Remote, New York, NY"
              />
            </FormField>

            <FormField label="Salary" error={errors.salary}>
              <input
                type="text"
                {...register("salary")}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                placeholder="Rs 50000"
              />
            </FormField>

            <FormField label="Status" error={errors.status}>
              <select
                {...register("status")}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              >
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
              </select>
            </FormField>

            <FormField label="Deadline" error={errors.deadline} required>
              <input
                type="date"
                {...register("deadline")}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
            </FormField>

            <FormField
              label="Number of Openings"
              error={errors.noOfOpenings}
              required
            >
              <input
                type="number"
                {...register("noOfOpenings")}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                placeholder="5"
              />
            </FormField>
          </div>

          <div className="space-y-4 rounded-lg border border-border bg-surface-hover p-4">
            <h3 className="font-medium text-text-primary">
              Required Documents
            </h3>
            <p className="text-sm text-text-secondary">
              Add documents that seekers must upload when applying (e.g., ID
              Card, Citizenship, Transcript)
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                placeholder="Document name (e.g. Citizenship)"
                className="flex-1 rounded-lg border border-border bg-surface px-4 py-2 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
              <button
                type="button"
                onClick={addRequiredDoc}
                className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover"
              >
                Add
              </button>
            </div>

            <div className="space-y-2">
              {requiredDocs.map((docName, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-surface p-3 border border-border"
                >
                  <span className="text-sm font-medium text-text-secondary">
                    {docName}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeRequiredDoc(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {requiredDocs.length === 0 && (
                <p className="text-center text-sm text-text-muted py-2">
                  No documents required yet
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-6">
          <Link
            href="/dashboard/recruiter/jobs"
            className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={mutation.isPending || isCreditsLoading}
            className="flex items-center gap-2 rounded-lg bg-brand-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-accent-hover disabled:opacity-50"
          >
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            Pay & Post Job
          </button>
        </div>
      </form>
    </div>
  );
}

function FormField({ label, error, required, children }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-text-secondary">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
