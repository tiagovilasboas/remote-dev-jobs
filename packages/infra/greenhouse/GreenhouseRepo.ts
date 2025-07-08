import {
  fetchGreenhouseJobs,
  fetchGreenhouseJobById,
  mapToJobProps,
} from "./GreenhouseApi";
import { Job } from "@remote-dev-jobs/core";
import { JobRepository } from "@remote-dev-jobs/core";

export class GreenhouseRepo implements JobRepository {
  public readonly source = "greenhouse";

  constructor(private readonly companies: string[] = []) {}

  async listAll(): Promise<Job[]> {
    const companies = this.companies.length > 0 ? this.companies : undefined;
    const ghJobs = await fetchGreenhouseJobs(companies);
    return ghJobs.map((gj) => {
      const jobProps = mapToJobProps(gj);
      return Job.create(jobProps);
    });
  }

  async getById(id: string): Promise<Job | null> {
    const [company, jobId] = id.split("::");
    if (!company || !jobId) return null;

    // We need to pass the company slug to the API, but the id is greenhouse::job_id
    // The details endpoint for Greenhouse is /boards/{company}/jobs/{job_id}
    // So we need to figure out which company the job belongs to.
    // The simplest way for now is to pass the company slug in the ID.
    const jobWithDetails = await fetchGreenhouseJobById(`${company}::${jobId}`);
    if (!jobWithDetails) return null;

    const jobProps = mapToJobProps(jobWithDetails);
    return Job.create(jobProps);
  }
}
