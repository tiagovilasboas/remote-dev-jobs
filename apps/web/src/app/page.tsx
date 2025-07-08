import { JobList } from '@remote-dev-jobs/ui';
import { getJobsAction } from './actions/getJobs';

export default async function HomePage({ searchParams }: { searchParams?: { [key: string]: string } }) {
  const filters = {
    stack: searchParams?.stack,
    seniority: searchParams?.seniority,
    location: searchParams?.location,
  };
  const jobs = await getJobsAction(filters);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="mb-6 text-3xl font-bold text-center">Remote Dev Jobs</h1>
      <JobList jobs={jobs} />
    </main>
  );
} 