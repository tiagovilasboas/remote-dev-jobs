import { z } from 'zod';
import { JobProps } from '@remote-dev-jobs/core/jobs/Job';

const PostingSchema = z.object({
  id: z.string(),
  title: z.string(),
  jobUrl: z.string().url(),
  createdDate: z.string(),
  workplace: z.string().optional().nullable(),
});

export type GupyPosting = z.infer<typeof PostingSchema>;

const fetchCompanyJobs = async (company: string): Promise<GupyPosting[]> => {
  const url = `https://portal.gupy.io/api/postings?company=${company}`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      console.warn(`[Gupy] ${company} responded ${resp.status}`);
      return [];
    }
    const json = await resp.json();
    const postingsRaw = Array.isArray(json) ? json : json?.data ?? [];
    const postings: GupyPosting[] = [];
    for (const pr of postingsRaw) {
      try {
        postings.push(PostingSchema.parse(pr));
      } catch (_) {
        // skip invalid
      }
    }
    return postings;
  } catch (err) {
    console.warn('[Gupy] fetch failed', err);
    return [];
  }
};

export const fetchGupyJobs = async (
  companies: string[],
): Promise<{ company: string; jobs: GupyPosting[] }[]> => {
  const results = await Promise.all(
    companies.map(async company => ({ company, jobs: await fetchCompanyJobs(company) })),
  );
  return results;
};

export const mapToJobProps = (
  gp: GupyPosting,
  company: string,
): JobProps => ({
  id: gp.id,
  title: gp.title,
  company,
  location: gp.workplace || 'Remote',
  salary: undefined,
  url: gp.jobUrl,
  publishedAt: new Date(gp.createdDate),
}); 