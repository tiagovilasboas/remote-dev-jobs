import { fetchGupyJobs, mapToJobProps } from "./GupyApi";
import { Job, JobId } from "@remote-dev-jobs/core";
import { JobRepository } from "@remote-dev-jobs/core";

export class GupyRepo implements JobRepository {
  public readonly source = "gupy";

  constructor() {}

  async listAll(): Promise<Job[]> {
    const gupyJobs = await fetchGupyJobs();
    return gupyJobs.map((gp) => {
      const jobProps = mapToJobProps(gp);
      return Job.create(jobProps);
    });
  }

  async getById(id: string): Promise<Job | null> {
    const jobs = await this.listAll();
    return jobs.find((j) => j.id.value === id) ?? null;
  }

  async findById(id: JobId): Promise<Job | null> {
    return this.getById(id.value);
  }
}
