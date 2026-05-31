"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { recruiterService } from "@/lib/api/recruiter";
import { paymentService } from "@/lib/api/payment";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
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
});

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const jobId = params.id;

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["recruiter-jobs"],
    queryFn: recruiterService.getJobs,
  });

  const job = jobs?.find((j) => j.id === Number(jobId) || j.id === jobId);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: job
      ? {
        title: job.title,
        description: job.description,
        location: job.location,
        salary: job.salary || "",
        status: job.status,
        deadline: job.deadline || "",
      }
      : {},
  });

  const description = watch("description");
  
  const mutation = useMutation({
    mutationFn: (data) => recruiterService.updateJob(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["recruiter-jobs"]);
      toast.success("Job updated successfully!");
      router.push("/dashboard/recruiter/jobs");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update job");
    },
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

  const onSubmit = (data) => {
    if (job.status === "CLOSED" && data.status === "OPEN") {
      localStorage.setItem("pending_job_update", JSON.stringify({ jobId, data }));
      handleBuyCredits();
    } else {
      mutation.mutate(data);
    }
  };

  if (jobsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-950" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Job not found</p>
        <Link
          href="/dashboard/recruiter/jobs"
          className="text-gray-950 hover:underline"
        >
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/recruiter/jobs"
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Job</h1>
          <p className="text-gray-600">Update job listing</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="space-y-4">
          <FormField label="Job Title" error={errors.title} required>
            <input
              type="text"
              {...register("title")}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-950/20"
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
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-950/20"
              />
            </FormField>

            <FormField label="Salary" error={errors.salary}>
              <input
                type="text"
                {...register("salary")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-950/20"
              />
            </FormField>

            <FormField label="Status" error={errors.status}>
              <select
                {...register("status")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-950/20"
              >
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
              </select>
            </FormField>

            <FormField label="Deadline" error={errors.deadline} required>
              <input
                type="date"
                {...register("deadline")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-950/20"
              />
            </FormField>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
          <Link
            href="/dashboard/recruiter/jobs"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-gray-950 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

function FormField({ label, error, required, children }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
