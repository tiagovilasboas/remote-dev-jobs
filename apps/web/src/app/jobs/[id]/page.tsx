import { redirect, notFound } from 'next/navigation';
import { getJobsAction } from '../../actions/getJobs';

interface Props {
  params: { id: string };
}

export default async function JobRedirectPage({ params }: Props) {
  const jobs = await getJobsAction();
  const job = jobs.find(j => j.id.value === params.id);
  if (!job) {
    notFound();
  }
  redirect(job!.url);
} 