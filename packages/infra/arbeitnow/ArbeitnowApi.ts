import { z } from 'zod';
import { JobProps } from '@remote-dev-jobs/core/jobs/Job';

const ArbeitnowJobSchema = z.object({
  slug: z.string(),
  company_name: z.string(),
  title: z.string(),
  location: z.string(),
  salary: z.string().optional().nullable(),
  url: z.string().url(),
  created_at: z.string(),
});

const ArbeitnowResponseSchema = z.object({
  data: z.array(ArbeitnowJobSchema),
});

export type ArbeitnowJob = z.infer<typeof ArbeitnowJobSchema>;

export const fetchArbeitnowJobs = async (): Promise<ArbeitnowJob[]> => {
  const resp = await fetch('https://api.arbeitnow.com/v1/job-board-api');
  if (!resp.ok) {
    throw new Error(`Arbeitnow API error: ${resp.status}`);
  }
  const json = await resp.json();
  const parsed = ArbeitnowResponseSchema.parse(json);
  return parsed.data;
};

export const mapToJobProps = (aj: ArbeitnowJob): JobProps => ({
  id: aj.slug,
  title: aj.title,
  company: aj.company_name,
  location: aj.location ?? 'Remote',
  salary: aj.salary ?? undefined,
  url: aj.url,
  publishedAt: new Date(aj.created_at),
}); 