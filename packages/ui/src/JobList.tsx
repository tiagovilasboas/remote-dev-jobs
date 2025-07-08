"use client";

import { JobCard } from "./JobCard";
import { JobItem } from "./JobItem";
import { Spinner } from "./Spinner";

interface Props {
  jobs: JobItem[];
  isLoading?: boolean;
  children: (job: JobItem) => React.ReactNode;
}

export const JobList = ({ jobs, isLoading, children }: Props) => {
  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        Nenhuma vaga encontrada. Tente outros filtros.
      </div>
    );
  }

  return (
    <ul>
      {jobs.map((job) => (
        <li key={job.id.value}>{children(job)}</li>
      ))}
    </ul>
  );
};
