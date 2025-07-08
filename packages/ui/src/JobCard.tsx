import { JobItem } from './JobItem';

interface Props {
  job: JobItem;
  isSelected?: boolean;
}

export const JobCard = ({ job, isSelected }: Props) => {
  const cardClasses = `block p-4 border-b hover:bg-gray-100 ${isSelected ? 'bg-blue-100' : 'bg-white'}`;

  return (
    <div className={cardClasses}>
      <h3 className="font-bold text-blue-700">{job.title}</h3>
      <p className="text-gray-800">{job.company}</p>
      <p className="text-sm text-gray-600">{job.location}</p>
      {job.salary && (
        <p className="text-sm text-gray-600 font-medium">{job.salary}</p>
      )}
      <p className="text-xs text-gray-500 mt-2">
        {job.publishedAt.toLocaleDateString()}
      </p>
    </div>
  );
};

export const JobCardSkeleton = () => (
  <div className="rounded border border-gray-200 bg-white p-4 shadow-sm animate-pulse">
    <div className="h-4 w-3/4 rounded bg-gray-200" />
    <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
    <div className="mt-4 h-3 w-1/3 rounded bg-gray-200" />
  </div>
); 