import { Job } from '@remote-dev-jobs/core';

interface Props {
  job: Job;
  href?: string;
}

export const JobCard = ({ job, href }: Props) => (
  <div className="rounded border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
    <h3 className="text-lg font-semibold text-blue-600">
      <a href={href ?? `/jobs/${job.id.value}`} className="hover:underline">
        {job.title}
      </a>
    </h3>
    <p className="text-sm text-gray-700">
      {job.company} • {job.location}
    </p>
    {job.salary && (
      <p className="text-sm text-green-700 font-medium mt-1">{job.salary}</p>
    )}
    <p className="text-xs text-gray-400 mt-2">
      {job.publishedAt.toLocaleDateString()}
    </p>
  </div>
);

export const JobCardSkeleton = () => (
  <div className="rounded border border-gray-200 bg-white p-4 shadow-sm animate-pulse">
    <div className="h-4 w-3/4 rounded bg-gray-200" />
    <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
    <div className="mt-4 h-3 w-1/3 rounded bg-gray-200" />
  </div>
); 