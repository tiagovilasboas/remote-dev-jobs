import { Job } from '@remote-dev-jobs/core';
import { JobCard } from './JobCard';

interface Props {
  jobs: Job[];
}

export const JobList = ({ jobs }: Props) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {jobs.map(job => (
      <JobCard key={job.id.value} job={job} />
    ))}
  </div>
); 