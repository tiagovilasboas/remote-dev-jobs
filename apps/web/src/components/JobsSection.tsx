"use client";

import { useJobsStore } from "../stores/useJobsStore";
import { JobFilters } from "./JobFilters";
import { JobCard } from "@remote-dev-jobs/ui/src/JobCard";
import { JobDetails } from "@remote-dev-jobs/ui/src/JobDetails";
import { Spinner } from "@remote-dev-jobs/ui/src/Spinner";
import { GetJobsFilters } from "@tiago/application/get-jobs";
import { Job } from "@tiago/core/jobs/Job";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function JobsSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const {
    jobs,
    selectedJob,
    loading,
    filters,
    fetchJobs,
    selectJob,
    setFilters,
  } = useJobsStore();

  useEffect(() => {
    const urlFilters: Partial<GetJobsFilters> = {};
    const q = searchParams.get("q");
    const workType = searchParams.get("workType");
    const datePosted = searchParams.get("datePosted");

    if (q) urlFilters.query = q;
    if (workType) urlFilters.workType = workType;
    if (datePosted) urlFilters.datePosted = datePosted;

    setFilters(urlFilters);
  }, [searchParams, setFilters]);

  useEffect(() => {
    fetchJobs(filters, 1);
  }, [filters, fetchJobs]);

  useEffect(() => {
    const jobId = searchParams.get("id");
    if (jobId && jobId !== "undefined" && jobId !== "null") {
      selectJob(jobId);
    }
  }, [searchParams, selectJob]);

  const handleJobSelect = (job: Job) => {
    const jobId = job.id.value;
    selectJob(jobId);
    const params = new URLSearchParams(searchParams.toString());
    params.set("id", jobId);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleFilterChange = (newFilters: Partial<GetJobsFilters>) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key === "query" ? "q" : key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  if (loading && !selectedJob) {
    return <Spinner />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="col-span-1">
        <JobFilters onFilterChange={handleFilterChange} filters={{}} />
        {jobs?.items.map((job) => (
          <JobCard
            key={job.id.value}
            job={job}
            onClick={() => handleJobSelect(job)}
            isSelected={selectedJob?.id.value === job.id.value}
          />
        ))}
      </div>
      <div className="col-span-2">
        {selectedJob ? (
          <JobDetails job={selectedJob} />
        ) : (
          <div>Selecione uma vaga para ver os detalhes</div>
        )}
      </div>
    </div>
  );
}
