"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { seekerService } from "@/lib/api/seeker";
import {
  Building2,
  Loader2,
  UploadCloud,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id;
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);
  const [additionalDocs, setAdditionalDocs] = useState({});

  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => seekerService.getJob(jobId),
  });

  const applyMutation = useMutation({
    mutationFn: () => {
      const docs = Object.entries(additionalDocs).map(([name, file]) => ({
        name,
        file,
      }));
      return seekerService.applyForJob(jobId, file, "", docs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["seeker-applications"]);
      toast.success("Application submitted successfully!");
      router.push("/dashboard/seeker/applications");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to submit application",
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload your resume");
      return;
    }

    const missingDocs = job.requiredDocuments?.filter(docName => !additionalDocs[docName]);
    if (missingDocs?.length > 0) {
      toast.error(`Please upload: ${missingDocs.join(", ")}`);
      return;
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Only PDF files are accepted");
      return;
    }

    applyMutation.mutate();
  };

  if (jobLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-950" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Job not found</h1>
        <Link
          href="/jobs"
          className="mt-4 inline-block text-gray-950 hover:underline"
        >
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-950 transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-950 mb-2">
            Apply for Job
          </h1>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-8 border border-gray-100">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200 text-gray-950">
              <Building2 size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{job.title}</h3>
              <p className="text-sm text-gray-500">
                {job.recruiter?.companyName || "Company"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Resume (PDF Only)
              </label>
              <label
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl ${file ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"} transition-colors cursor-pointer`}
              >
                <div className="space-y-2 text-center">
                  {file ? (
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  ) : (
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600 justify-center">
                    <span className="relative font-medium text-gray-950 focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-950 focus-within:ring-offset-2">
                      {file ? file.name : "Upload a file"}
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".pdf"
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </span>
                    {!file && <p className="pl-1">or drag and drop</p>}
                  </div>
                  {!file && (
                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                  )}
                </div>
              </label>
            </div>

            {job.requiredDocuments?.map((docName, index) => (
              <div key={index}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {docName}
                </label>
                <label
                  className={`mt-1 flex justify-center px-6 pt-4 pb-4 border-2 border-dashed rounded-xl ${additionalDocs[docName] ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"} transition-colors cursor-pointer`}
                >
                  <div className="space-y-1 text-center">
                    {additionalDocs[docName] ? (
                      <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
                    ) : (
                      <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-600 justify-center">
                      <span className="font-medium text-gray-950">
                        {additionalDocs[docName] ? additionalDocs[docName].name : `Upload ${docName}`}
                        <input
                          type="file"
                          className="sr-only"
                          onChange={(e) => {
                            const selectedFile = e.target.files[0];
                            if (selectedFile) {
                              setAdditionalDocs(prev => ({
                                ...prev,
                                [docName]: selectedFile
                              }));
                            }
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={applyMutation.isPending || !file}
                className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gray-950 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {applyMutation.isPending ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
