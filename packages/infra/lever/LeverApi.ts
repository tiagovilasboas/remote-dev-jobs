import { z } from 'zod';
import { JobProps } from '@remote-dev-jobs/core/jobs/Job';
import {
  LeverCompanyBR,
  getEnumKeyByEnumValue,
  LEVER_BR_COMPANIES,
} from '../brCompanies';

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
  companies: string[] = LEVER_BR_COMPANIES,
): Promise<(LeverJob & { company: string })[]> => {
  const results = await Promise.all(
    companies.map(async company => ({
      company,
      jobs: await fetchCompanyJobs(company),
    })),
  );
  return results.flatMap(result =>
    result.jobs.map(job => ({ ...job, company: result.company })),
  );
};

export const mapToJobProps = (
  lj: LeverJob & { company: string },
): JobProps => {
  const companyName = getEnumKeyByEnumValue(LeverCompanyBR, lj.company) ?? 'Unknown';

  const normalizeLocation = (location: string): string => {
    const lower = location.toLowerCase();
    if (lower.includes('são paulo') || lower.includes('sao paulo'))
      return 'São Paulo, Brazil';
    if (lower.includes('brazil') || lower.includes('brasil')) return 'Brazil';
    return location;
  };

  return {
    id: lj.id,
    title: lj.text.trim(),
    company: companyName,
    location: normalizeLocation(lj.categories.location ?? 'Remote'),
    salary: undefined,
    url: lj.hostedUrl,
    publishedAt: new Date(lj.createdAt),
  };
}; 