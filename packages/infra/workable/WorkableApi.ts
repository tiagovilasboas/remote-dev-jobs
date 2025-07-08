import { z } from 'zod';
import { JobProps } from '@remote-dev-jobs/core/jobs/Job';

const WorkableJobSchema = z.object({
  id: z.string(),
  title: z.string(),
  created_at: z.string(),
  full_title: z.string().optional(),
  location: z.object({
    city: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
  }).optional(),
  url: z.string().url(),
});

export type WorkableJob = z.infer<typeof WorkableJobSchema>;

const fetchCompanyJobs = async (company: string): Promise<WorkableJob[]> => {
  const url = `https://apply.workable.com/api/v3/accounts/${company}/jobs`; // returns JSON list
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      console.warn(`[Workable] ${company} responded ${resp.status}`);
      return [];
    }
    const json = await resp.json();
    // response structure: { results: WorkableJob[] }
    const jobsRaw = Array.isArray(json?.results) ? json.results : [];
    const jobs: WorkableJob[] = [];
    for (const jr of jobsRaw) {
      try {
        jobs.push(WorkableJobSchema.parse(jr));
      } catch (_) {
        // skip invalid
      }
    }
    return jobs;
  } catch (err) {
    console.warn('[Workable] fetch failed', err);
    return [];
  }
};

export const fetchWorkableJobs = async (
  companies: string[],
): Promise<{ company: string; jobs: WorkableJob[] }[]> => {
  const results = await Promise.all(
    companies.map(async company => ({ company, jobs: await fetchCompanyJobs(company) })),
  );
  return results;
};

export const mapToJobProps = (
  wj: WorkableJob,
  company: string,
): JobProps => ({
  id: wj.id,
  title: wj.title,
  company,
  location: wj.location?.city || wj.location?.country || 'Remote',
  salary: undefined,
  url: wj.url,
  publishedAt: new Date(wj.created_at),
}); 