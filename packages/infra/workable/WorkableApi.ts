import { z } from 'zod';
import { JobProps } from '@remote-dev-jobs/core/jobs/Job';
import {
  WORKABLE_BR_COMPANIES,
  WorkableCompanyBR,
  getEnumKeyByEnumValue,
} from '../brCompanies';

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
  description: z.string().optional(),
});

const WorkableJobDetailsSchema = WorkableJobSchema.extend({
  description: z.string(),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
});

export type WorkableJob = z.infer<typeof WorkableJobSchema>;
export type WorkableJobWithDetails = z.infer<typeof WorkableJobDetailsSchema>;

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

export const fetchWorkableJobById = async (
  id: string,
): Promise<(WorkableJobWithDetails & { company: string }) | null> => {
  const [company, jobId] = id.split('::');
  if (!company || !jobId) return null;

  // The public API is different from the one used for listings
  const url = `https://apply.workable.com/api/v1/jobs/${jobId}`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      console.warn(`[Workable] Job ${id} responded ${resp.status}`);
      return null;
    }
    const json = await resp.json();
    const parsed = WorkableJobDetailsSchema.parse(json);
    return { ...parsed, company };
  } catch (err) {
    console.warn(`[Workable] fetch job by id failed for ${id}`, err);
    return null;
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchWorkableJobs = async (
  companies: string[] = WORKABLE_BR_COMPANIES,
): Promise<(WorkableJob & { company: string })[]> => {
  const allJobs: (WorkableJob & { company: string })[] = [];
  for (const company of companies) {
    const jobs = await fetchCompanyJobs(company);
    jobs.forEach(job => allJobs.push({ ...job, company }));
    await delay(1000); // 1s delay to avoid rate limiting
  }
  return allJobs;
};

export const mapToJobProps = (
  wj: (WorkableJob | WorkableJobWithDetails) & { company: string },
): JobProps => {
  const companyName =
    getEnumKeyByEnumValue(WorkableCompanyBR, wj.company) ?? 'Unknown';

  const normalizeLocation = (location: string): string => {
    const lower = location.toLowerCase();
    if (lower.includes('são paulo') || lower.includes('sao paulo'))
      return 'São Paulo, Brazil';
    if (lower.includes('brazil') || lower.includes('brasil')) return 'Brazil';
    return location;
  };

  const locationStr = wj.location?.city || wj.location?.country || 'Remote';

  return {
    id: `workable::${wj.company}::${wj.id}`,
    title: wj.title.trim(),
    company: companyName,
    location: normalizeLocation(locationStr),
    salary: undefined,
    url: wj.url,
    publishedAt: new Date(wj.created_at),
    description: wj.description,
  };
}; 