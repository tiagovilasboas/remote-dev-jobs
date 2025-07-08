import { z } from 'zod';
import { JobProps } from '@remote-dev-jobs/core/jobs/Job';

const BoardJobSchema = z.object({
  id: z.number(),
  title: z.string(),
  updated_at: z.string(),
  absolute_url: z.string().url(),
  location: z.object({
    name: z.string(),
  }),
});

const BoardResponseSchema = z.object({
  jobs: z.array(BoardJobSchema),
});

export type GreenhouseJob = z.infer<typeof BoardJobSchema>;

const DEFAULT_COMPANIES = [
  'nubank',
  'quintoandar',
  'wildlife',
  'gympass',
  'c6bank',
  'picpay',
];

const fetchCompanyJobs = async (company: string): Promise<GreenhouseJob[]> => {
  const url = `https://boards-api.greenhouse.io/v1/boards/${company}/jobs`;
  const resp = await fetch(url);
  if (!resp.ok) {
    console.warn(`[Greenhouse] ${company} responded ${resp.status}`);
    return [];
  }
  const json = await resp.json();
  const parsed = BoardResponseSchema.parse(json);
  return parsed.jobs;
};

export const fetchGreenhouseJobs = async (
  companies: string[] = DEFAULT_COMPANIES,
): Promise<GreenhouseJob[]> => {
  const results = await Promise.all(companies.map(fetchCompanyJobs));
  return results.flat();
};

export const mapToJobProps = (gj: GreenhouseJob): JobProps => ({
  id: String(gj.id),
  title: gj.title,
  company: '', // será preenchido no Repo
  location: gj.location.name ?? 'Remote',
  url: gj.absolute_url,
  salary: undefined,
  publishedAt: new Date(gj.updated_at),
}); 