import { Job, JobRepository, JobDeduplicator } from "@remote-dev-jobs/core";

export class AggregateJobRepo implements JobRepository {
  public readonly source = "aggregate";
  private reposBySource: Map<string, JobRepository>;

  constructor(private readonly repos: JobRepository[]) {
    this.reposBySource = new Map(repos.map((r) => [r.source, r]));
  }

  async listAll(): Promise<Job[]> {
    const lists = await Promise.all(this.repos.map((r) => r.listAll()));
    const merged = lists.flat();
    return JobDeduplicator.deduplicate(merged);
  }

  async getById(id: string): Promise<Job | null> {
    const [source] = id.split("::");
    if (!source) return null;

    const repo = this.reposBySource.get(source);
    if (!repo) return null;

    return repo.getById(id);
  }
}
