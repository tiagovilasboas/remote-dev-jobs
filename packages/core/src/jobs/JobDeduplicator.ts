import { Job } from "./Job";

export class JobDeduplicator {
  /**
   * Remove jobs duplicados baseado em título e empresa
   */
  static deduplicate(jobs: Job[]): Job[] {
    const dedupKey = (job: Job) =>
      `${job.title.toLowerCase()}|${job.company.toLowerCase()}`;
    const map = new Map<string, Job>();

    for (const job of jobs) {
      const key = dedupKey(job);
      if (!map.has(key)) {
        map.set(key, job);
      }
    }

    return Array.from(map.values());
  }

  /**
   * Remove jobs duplicados baseado em ID
   */
  static deduplicateById(jobs: Job[]): Job[] {
    const map = new Map<string, Job>();

    for (const job of jobs) {
      const key = job.id.value;
      if (!map.has(key)) {
        map.set(key, job);
      }
    }

    return Array.from(map.values());
  }
}
