import { z } from 'zod';
import { JobProps } from '@remote-dev-jobs/core/jobs/Job';
import {
  GREENHOUSE_BR_COMPANIES,
  GreenhouseCompanyBR,
  getEnumKeyByEnumValue,
} from '../brCompanies';

const BoardJobSchema = z.object({
  id: z.number(),
  title: z.string(),
  updated_at: z.string(),
  absolute_url: z.string().url(),
  location: z.object({
    name: z.string(),
  }),
  content: z.string().optional(),
});

const BoardResponseSchema = z.object({
  jobs: z.array(BoardJobSchema),
});

const GreenhouseJobSchema = BoardJobSchema.extend({
  content: z.string(),
  departments: z.array(z.any()).optional(),
  offices: z.array(z.any()).optional(),
});

export type GreenhouseJob = z.infer<typeof BoardJobSchema>;
export type GreenhouseJobWithDetails = z.infer<typeof GreenhouseJobSchema>;

const DEFAULT_COMPANIES = GREENHOUSE_BR_COMPANIES;

const fetchCompanyJobs = async (
  company: string,
): Promise<{ company: string; jobs: GreenhouseJob[] }> => {
  const url = `https://boards-api.greenhouse.io/v1/boards/${company}/jobs?content=true`;
  const resp = await fetch(url);
  if (!resp.ok) {
    console.warn(`[Greenhouse] ${company} responded ${resp.status}`);
    return { company, jobs: [] };
  }
  const json = await resp.json();
  const parsed = BoardResponseSchema.parse(json);
  return { company, jobs: parsed.jobs };
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchGreenhouseJobs = async (
  companies: string[] = DEFAULT_COMPANIES,
): Promise<(GreenhouseJob & { company: string })[]> => {
  const allJobs: (GreenhouseJob & { company: string })[] = [];
  for (const company of companies) {
    const result = await fetchCompanyJobs(company);
    result.jobs.forEach(job =>
      allJobs.push({ ...job, company: result.company }),
    );
    await delay(500); // 500ms delay to avoid rate limiting
  }
  return allJobs;
};

export const fetchGreenhouseJobById = async (
  id: string,
): Promise<(GreenhouseJobWithDetails & { company: string }) | null> => {
  const [company, jobId] = id.split('::');
  if (!company || !jobId) return null;

  const url = `https://boards-api.greenhouse.io/v1/boards/${company}/jobs/${jobId}`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      console.warn(`[Greenhouse] Job ${id} responded ${resp.status}`);
      return null;
    }
    const json = await resp.json();
    const parsed = GreenhouseJobSchema.parse(json);
    return { ...parsed, company };
  } catch (err) {
    console.warn(`[Greenhouse] fetch job by id failed for ${id}`, err);
    return null;
  }
};

export const mapToJobProps = (
  gj: (GreenhouseJob | GreenhouseJobWithDetails) & { company: string },
): JobProps => {
  const companyName =
    getEnumKeyByEnumValue(GreenhouseCompanyBR, gj.company) ?? 'Unknown';

  const normalizeLocation = (location: string): string => {
    const lower = location.toLowerCase();
    if (lower.includes('são paulo') || lower.includes('sao paulo'))
      return 'São Paulo, Brazil';
    if (lower.includes('brazil') || lower.includes('brasil')) return 'Brazil';
    return location;
  };

  return {
    id: `greenhouse::${gj.company}::${gj.id}`,
    title: gj.title.trim(),
    company: companyName,
    location: normalizeLocation(gj.location.name ?? 'Remote'),
    url: gj.absolute_url,
    salary: undefined,
    publishedAt: new Date(gj.updated_at),
    description: gj.content,
  };
}; 