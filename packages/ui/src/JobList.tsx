"use client";

import { JobCard } from './JobCard';
import { JobItem } from './JobItem';
import { Spinner } from './Spinner';

interface Props {
  jobs: JobItem[];
  isLoading?: boolean;
  children: (job: JobItem) => React.ReactNode;
}

export const JobList = ({ jobs, isLoading, children }: Props) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        Nenhuma vaga encontrada. Tente outros filtros.
      </div>
    );
  }

  return (
    <ul>
      {jobs.map(job => (
        <li key={job.id.value}>{children(job)}</li>
      ))}
    </ul>
  );
}; 