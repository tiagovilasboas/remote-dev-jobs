import { JobProps } from "@remote-dev-jobs/core/jobs/Job";
import { z } from "zod";

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
  try {
    const resp = await fetch("https://api.arbeitnow.com/v1/job-board-api");
    if (!resp.ok) {
      console.warn(`[Arbeitnow] responded ${resp.status}`);
      return [];
    }
    const json = await resp.json();
    const parsed = ArbeitnowResponseSchema.parse(json);
    return parsed.data;
  } catch (err) {
    console.warn("[Arbeitnow] fetch failed", err);
    return [];
  }
};

export const mapToJobProps = (aj: ArbeitnowJob): JobProps => {
  const normalizeLocation = (location: string): string => {
    const lower = location.toLowerCase();
    if (lower.includes("são paulo") || lower.includes("sao paulo"))
      return "São Paulo, Brazil";
    if (lower.includes("brazil") || lower.includes("brasil")) return "Brazil";
    return location;
  };

  return {
    id: `arbeitnow::${aj.slug}`,
    title: aj.title.trim(),
    company: aj.company_name,
    location: normalizeLocation(aj.location ?? "Remote"),
    salary: aj.salary ?? undefined,
    url: aj.url,
    publishedAt: new Date(aj.created_at),
  };
};
