import { Job } from "@remote-dev-jobs/core/jobs/Job";
import { JobRepository } from "@remote-dev-jobs/core/jobs/JobRepository";

export class GetJobDetailsUseCase {
  constructor(private jobRepositories: Record<string, JobRepository>) {}

  async execute(id: string): Promise<Job | null> {
    const [source, jobId] = id.split("::");
    if (!source || !jobId) {
      console.warn(`[GetJobDetails] Invalid job ID format: ${id}`);
      return null;
    }

    const repository = this.jobRepositories[source];
    if (!repository) {
      console.warn(`[GetJobDetails] No repository found for source: ${source}`);
      return null;
    }

    try {
      const job = await repository.getById(id);
      return job;
    } catch (error) {
      console.error(
        `[GetJobDetails] Error fetching job ${id} from ${source}:`,
        error,
      );
      return null;
    }
  }
}
