import { JobItem } from "./JobItem";

interface Props {
  job: JobItem;
}

export const JobCard = ({ job }: Props) => {
  return (
    <div className="block p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm">
      <h3 className="font-bold text-blue-700 hover:text-blue-800">{job.title}</h3>
      <p className="text-gray-800">{job.company}</p>
      <p className="text-sm text-gray-600">{job.location}</p>
      {job.salary && (
        <p className="text-sm font-medium text-gray-600">{job.salary}</p>
      )}
      <p className="mt-2 text-xs text-gray-500">
        {job.publishedAt instanceof Date 
          ? job.publishedAt.toLocaleDateString()
          : new Date(job.publishedAt).toLocaleDateString()
        }
      </p>
    </div>
  );
};

export const JobCardSkeleton = () => (
  <div className="animate-pulse rounded border border-gray-200 bg-white p-4 shadow-sm">
    <div className="h-4 w-3/4 rounded bg-gray-200" />
    <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
    <div className="mt-4 h-3 w-1/3 rounded bg-gray-200" />
  </div>
);
