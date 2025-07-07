import { z } from 'zod';
import { JobProps } from '@remote-dev-jobs/core/jobs/Job';

const RemotiveJobSchema = z.object({
  id: z.number(),
  title: z.string(),
  company_name: z.string(),
  candidate_required_location: z.string().optional().nullable(),
  salary: z.string().optional().nullable(),
  url: z.string().url(),
  publication_date: z.string(),
});

const RemotiveResponseSchema = z.object({
  jobs: z.array(RemotiveJobSchema),
});

export type RemotiveJob = z.infer<typeof RemotiveJobSchema>;

export const fetchRemotiveJobs = async (): Promise<RemotiveJob[]> => {
  const resp = await fetch('https://remotive.com/api/remote-jobs');
  if (!resp.ok) {
    throw new Error(`Remotive API error: ${resp.status}`);
  }
  const json = await resp.json();
  const parsed = RemotiveResponseSchema.parse(json);
  return parsed.jobs;
};

export const mapToJobProps = (rj: RemotiveJob): JobProps => ({
  id: String(rj.id),
  title: rj.title,
  company: rj.company_name,
  location: rj.candidate_required_location ?? 'Remote',
  salary: rj.salary ?? undefined,
  url: rj.url,
  publishedAt: new Date(rj.publication_date),
}); 