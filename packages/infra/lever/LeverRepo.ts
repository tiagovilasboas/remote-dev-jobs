import { fetchLeverJobs, mapToJobProps } from "./LeverApi";
import { Job, JobId } from "@remote-dev-jobs/core";
import { JobRepository } from "@remote-dev-jobs/core";

export class LeverRepo implements JobRepository {
  public readonly source = "lever";

  constructor() {}

  async listAll(): Promise<Job[]> {
    const leverJobs = await fetchLeverJobs();
    return leverJobs.map((lj) => {
      const jobProps = mapToJobProps(lj);
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
