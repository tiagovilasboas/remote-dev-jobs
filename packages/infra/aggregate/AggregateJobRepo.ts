import { Job, JobId, JobRepository } from '@remote-dev-jobs/core';

export class AggregateJobRepo implements JobRepository {
  constructor(private readonly repos: JobRepository[]) {}

  async listAll(): Promise<Job[]> {
    const lists = await Promise.all(this.repos.map(r => r.listAll()));
    const merged = lists.flat();
    const dedupKey = (job: Job) => `${job.title.toLowerCase()}|${job.company.toLowerCase()}`;
    const map = new Map<string, Job>();
    for (const job of merged) {
      const key = dedupKey(job);
      if (!map.has(key)) {
        map.set(key, job);
      }
    }
    return Array.from(map.values());
  }

  async findById(id: JobId): Promise<Job | null> {
    for (const repo of this.repos) {
      const job = await repo.findById(id);
      if (job) return job;
    }
    return null;
  }
} 