// Jest globals used directly
import { JobId } from "./JobId";
import { JobRepository } from "./JobRepository";

/**
 * Register a JobRepository contract test suite for a given factory.
 * Usage: `register(() => new MyRepo())` inside your repo test file.
 */
export const register = (repoFactory: () => JobRepository) => {
  describe("JobRepository contract", () => {
    let repo: JobRepository;

    beforeEach(() => {
      repo = repoFactory();
    });

    it("listAll returns an array", async () => {
      const jobs = await repo.listAll();
      expect(Array.isArray(jobs)).toBe(true);
    });

    it("getById returns job that exists", async () => {
      const jobs = await repo.listAll();
      if (jobs.length === 0) {
        return;
      }
      const target = jobs[0];
      const found = await repo.getById(target.id.value);
      expect(found).not.toBeNull();
      expect(found?.id.value).toBe(target.id.value);
    });

    it("getById returns null for unknown id", async () => {
      const result = await repo.getById("___unknown___");
      expect(result).toBeNull();
    });
  });
};
