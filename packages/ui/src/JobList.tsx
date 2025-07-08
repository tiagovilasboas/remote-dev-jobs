"use client";

import { Job } from '@remote-dev-jobs/core';
import { JobCard, JobCardSkeleton } from './JobCard';

interface Props {
  jobs: Job[];
  isLoading?: boolean;
  baseQuery?: string;
}

export const JobList = ({ jobs, isLoading, baseQuery }: Props) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return <p className="text-center text-gray-500">Nenhuma vaga encontrada 😔</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map(job => (
        <JobCard key={job.id.value} job={job} href={`/?${baseQuery ? baseQuery + '&' : ''}id=${job.id.value}`} />
      ))}
    </div>
  );
}; 