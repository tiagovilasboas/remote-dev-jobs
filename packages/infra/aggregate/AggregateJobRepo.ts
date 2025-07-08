import { Job, JobRepository, JobDeduplicator } from "@remote-dev-jobs/core";

export class AggregateJobRepo implements JobRepository {
  public readonly source = "aggregate";
  private reposBySource: Map<string, JobRepository>;

  constructor(private readonly repos: JobRepository[]) {
    this.reposBySource = new Map(repos.map((r) => [r.source, r]));
  }

  async listAll(): Promise<Job[]> {
    const results = await Promise.allSettled(
      this.repos.map(async (repo) => {
        try {
          const jobs = await repo.listAll();
          console.log(`[${repo.source}] ${jobs.length} vagas encontradas`);
          return jobs;
        } catch (error) {
          console.error(`[${repo.source}] Erro ao buscar vagas:`, error);
          return [];
        }
      })
    );

    const successfulResults = results
      .filter((result): result is PromiseFulfilledResult<Job[]> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);

    const failedResults = results
      .filter((result): result is PromiseRejectedResult => 
        result.status === 'rejected'
      );

    if (failedResults.length > 0) {
      console.warn(`${failedResults.length} repositórios falharam:`, 
        failedResults.map(r => r.reason?.message || 'Erro desconhecido')
      );
    }

    const merged = successfulResults.flat();
    const deduplicated = JobDeduplicator.deduplicate(merged);
    
    console.log(`Total de vagas após deduplicação: ${deduplicated.length}`);
    return deduplicated;
  }

  async getById(id: string): Promise<Job | null> {
    const [source] = id.split("::");
    if (!source) return null;

    const repo = this.reposBySource.get(source);
    if (!repo) return null;

    return repo.getById(id);
  }
}
