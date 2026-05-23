"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { seekerService } from "@/lib/api/seeker";
import {
  Search,
  MapPin,
  DollarSign,
  Briefcase,
  Loader2,
  X,
} from "lucide-react";
import { JobCard } from "@/components/jobs/JobCard";

export default function BrowseJobsPage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [minSalary, setMinSalary] = useState("");

  const { data: jobs, isLoading, isFetching } = useQuery({
    queryKey: ["jobs", keyword, location, minSalary],
    queryFn: async () => {
      if (keyword || location || minSalary) {
        return seekerService.searchJobs(
          keyword,
          location,
          minSalary ? parseFloat(minSalary) : null
        );
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Browse Jobs</h1>
        <p className="text-secondary">Discover opportunities that match your skills</p>
      </div>

      {/* Search / Filter bar */}
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
            <input
              type="text"
              placeholder="Job title, keywords..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
            />
          </div>
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
            />
          </div>
          <div className="relative flex-1">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
            <input
              type="number"
              placeholder="Min salary"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
            />
          </div>
          {hasFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-surface-hover"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          {hasFilters ? "Search Results" : "All Jobs"}
          {jobs?.length > 0 && (
            <span className="ml-2 text-gray-500">({jobs.length})</span>
          )}
        </h2>
      </div>

      {/* Job list */}
      {isLoading || isFetching ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      ) : jobs && jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-muted" />
          <h3 className="mt-4 text-lg font-medium text-foreground">No jobs found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search criteria</p>
          {hasFilters && (
            <button
              onClick={handleClearFilters}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-accent px-4 py-2 text-sm font-medium text-white hover:bg-brand-accent-hover"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
