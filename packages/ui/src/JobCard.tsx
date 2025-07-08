import { Job } from '@remote-dev-jobs/core';

interface Props {
  job: Job;
}

export const JobCard = ({ job }: Props) => (
  <div className="rounded border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
    <h3 className="text-lg font-semibold text-blue-600">
      <a href={`/jobs/${job.id.value}`} className="hover:underline">
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