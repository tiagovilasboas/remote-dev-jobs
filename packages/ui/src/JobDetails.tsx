import { JobItem } from './JobItem';

interface Props {
  job: JobItem;
}

export const JobDetails = ({ job }: Props) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{job.title}</h1>
      <h2 className="text-xl text-gray-700">{job.company}</h2>
      <p className="text-md text-gray-600 mt-1">{job.location}</p>
      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Apply Now
      </a>
      <div
        className="prose mt-6 max-w-none"
        dangerouslySetInnerHTML={{
          __html: job.description || '<p>Job description not available.</p>',
        }}
      />
    </div>
  );
}; 