"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { seekerService } from "@/lib/api/seeker";
import { Search, MapPin, DollarSign, Briefcase, Loader2, X } from "lucide-react";
import { JobCard } from "@/components/jobs/JobCard";

export default function JobsPage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [minSalary, setMinSalary] = useState("");

  const { data: jobs, isLoading, isFetching } = useQuery({
    queryKey: ["jobs", keyword, location, minSalary],
    queryFn: async () => {
      if (keyword || location || minSalary) {
        return seekerService.searchJobs(keyword, location, minSalary ? parseFloat(minSalary) : null);
      }
      return seekerService.getAllJobs();
    },
  });

  const handleClearFilters = () => {
    setKeyword("");
    setLocation("");
    setMinSalary("");
  };

  const hasFilters = keyword || location || minSalary;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Find Your Dream Job</h1>
          <p className="mt-1 text-text-secondary">Discover opportunities that match your skills</p>
        </div>

        {/* Search / filter bar */}
        <div className="mb-8 rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input
                type="text"
                placeholder="Job title, keywords..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-colors"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-colors"
              />
            </div>
            <div className="relative flex-1">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input
                type="number"
                placeholder="Min salary"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-colors"
              />
            </div>
            {hasFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
              >
                <X size={16} />
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">
            {hasFilters ? "Search Results" : "All Jobs"}
            {jobs?.length > 0 && (
              <span className="ml-2 text-text-muted">({jobs.length})</span>
            )}
          </h2>
        </div>

        {isLoading || isFetching ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
          </div>
        ) : jobs && jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} basePath="/jobs" />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-surface p-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-text-muted" />
            <h3 className="mt-4 text-lg font-medium text-text-primary">No jobs found</h3>
            <p className="mt-1 text-text-secondary">Try adjusting your search criteria</p>
            {hasFilters && (
              <button
                onClick={handleClearFilters}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
