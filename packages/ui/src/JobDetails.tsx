import { JobItem } from "./JobItem";

interface Props {
  job: JobItem;
}

export const JobDetails = ({ job }: Props) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{job.title}</h1>
      <h2 className="text-xl text-gray-700">{job.company}</h2>
      <p className="text-md mt-1 text-gray-600">{job.location}</p>
      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
      >
        Apply Now
      </a>
      <div
        className="prose mt-6 max-w-none"
        dangerouslySetInnerHTML={{
          __html: job.description || "<p>Job description not available.</p>",
        }}
      />
    </div>
  );
};
