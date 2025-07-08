import { z } from 'zod';
import { JobProps } from '@remote-dev-jobs/core/jobs/Job';

const LeverJobSchema = z.object({
  id: z.string(),
  text: z.string(),
  hostedUrl: z.string().url(),
  categories: z.object({
    location: z.string().optional().nullable(),
  }),
  createdAt: z.number(),
});

export type LeverJob = z.infer<typeof LeverJobSchema>;

const fetchCompanyJobs = async (company: string): Promise<LeverJob[]> => {
  const url = `https://api.lever.co/v1/postings/${company}?mode=json`;
  const resp = await fetch(url);
  if (!resp.ok) {
    console.warn(`[Lever] ${company} responded ${resp.status}`);
    return [];
  }
  const json = await resp.json();
  const jobs = z.array(LeverJobSchema).parse(json);
  return jobs;
};

export const fetchLeverJobs = async (
  companies: string[],
): Promise<{ company: string; jobs: LeverJob[] }[]> => {
  const results = await Promise.all(
    companies.map(async company => ({ company, jobs: await fetchCompanyJobs(company) })),
  );
  return results;
};

export const mapToJobProps = (
  lj: LeverJob,
  company: string,
): JobProps => ({
  id: lj.id,
  title: lj.text,
  company,
  location: lj.categories.location ?? 'Remote',
  salary: undefined,
  url: lj.hostedUrl,
  publishedAt: new Date(lj.createdAt),
}); 