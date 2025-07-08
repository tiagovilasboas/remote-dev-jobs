import { Job, JobRepository } from '@remote-dev-jobs/core';

export class AggregateJobRepo implements JobRepository {
  public readonly source = 'aggregate';
  private reposBySource: Map<string, JobRepository>;

  constructor(private readonly repos: JobRepository[]) {
    this.reposBySource = new Map(repos.map(r => [r.source, r]));
  }

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

  async getById(id: string): Promise<Job | null> {
    const [source] = id.split('::');
    if (!source) return null;

    const repo = this.reposBySource.get(source);
    if (!repo) return null;

    return repo.getById(id);
  }
} 