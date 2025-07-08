import { AggregateJobRepo } from "./AggregateJobRepo";
import { Job } from "@remote-dev-jobs/core";
import { JobRepository } from "@remote-dev-jobs/core";

const makeJob = (id: string): Job =>
  Job.create({
    id,
    title: `Dev ${id}`,
    company: "TestCo",
    location: "brazil",
    url: "https://example.com",
    publishedAt: new Date(),
  });

class StubRepo implements JobRepository {
  public readonly source = "stub";

  constructor(private readonly jobs: Job[]) {}

  listAll() {
    return Promise.resolve(this.jobs);
  }

  getById(id: string) {
    return Promise.resolve(this.jobs.find((j) => j.id.value === id) ?? null);
  }

  findById(id: import("@remote-dev-jobs/core").JobId) {
    return this.getById(id.value);
  }
}

describe("AggregateJobRepo", () => {
  it("merges jobs and removes duplicates by id", async () => {
    const repoA = new StubRepo([makeJob("1"), makeJob("2")]);
    const repoB = new StubRepo([makeJob("2"), makeJob("3")]);
    const aggregate = new AggregateJobRepo([repoA, repoB]);
    const list = await aggregate.listAll();
    const ids = list.map((j) => j.id.value);
    expect(ids.sort()).toEqual(["1", "2", "3"]);
  });

  it("getById searches by source", async () => {
    const repoA = new StubRepo([makeJob("stub::1")]);
    const repoB = new StubRepo([makeJob("stub::2")]);
    const aggregate = new AggregateJobRepo([repoA, repoB]);
    const found = await aggregate.getById("stub::2");
    expect(found?.id.value).toBe("stub::2");
  });

  it("getById returns null for invalid source", async () => {
    const repoA = new StubRepo([makeJob("stub::1")]);
    const aggregate = new AggregateJobRepo([repoA]);
    const found = await aggregate.getById("invalid::1");
    expect(found).toBeNull();
  });
});
