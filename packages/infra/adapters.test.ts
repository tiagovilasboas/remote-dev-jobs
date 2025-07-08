import { ArbeitnowRepo } from "./arbeitnow/ArbeitnowRepo";
import { GreenhouseRepo } from "./greenhouse/GreenhouseRepo";
import { GupyRepo } from "./gupy/GupyRepo";
import { LeverRepo } from "./lever/LeverRepo";
import { WorkableRepo } from "./workable/WorkableRepo";
import { JobRepository } from "@remote-dev-jobs/core";

afterEach(() => {
  // restore original fetch
  jest.restoreAllMocks();
});

const mockFetch = (impl: (url: string) => any) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.fetch = jest.fn(async (url: string) => ({
    ok: true,
    json: async () => impl(url),
  }));
};

describe("Adapter repositories", () => {
  it.each`
    name            | repo                                 | setup
    ${"Arbeitnow"}  | ${() => new ArbeitnowRepo()}         | ${(url: string) => ({ data: [{ slug: "1", title: "Dev", company_name: "Acme", location: "Brazil", salary: null, url: "https://acme.com", created_at: new Date().toISOString() }] })}
    ${"Greenhouse"} | ${() => new GreenhouseRepo(["foo"])} | ${(url: string) => ({ jobs: [{ id: 1, title: "Dev", updated_at: new Date().toISOString(), absolute_url: "https://greenhouse.io/job", location: { name: "Brazil" } }] })}
    ${"Lever"}      | ${() => new LeverRepo(["foo"])}      | ${(url: string) => [{ id: "1", text: "Dev", hostedUrl: "https://lever.co/job", categories: { location: "Brazil" }, createdAt: Date.now() }]}
    ${"Workable"}   | ${() => new WorkableRepo(["foo"])}   | ${(url: string) => ({ results: [{ id: "1", title: "Dev", created_at: new Date().toISOString(), location: { city: "São Paulo" }, url: "https://workable.com/job" }] })}
    ${"Gupy"}       | ${() => new GupyRepo(["foo"])}       | ${(url: string) => [{ id: "1", title: "Dev", jobUrl: "https://gupy.io/job", createdDate: new Date().toISOString(), workplace: "Brazil" }]}
  `("listAll returns jobs for $name", async ({ repo, setup }) => {
    mockFetch(setup);
    const instance: JobRepository = repo();
    const jobs = await instance.listAll();
    expect(jobs.length).toBe(1);
    expect(jobs[0].title).toContain("Dev");
  });
});
