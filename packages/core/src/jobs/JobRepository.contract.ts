// Jest globals used directly
import { JobRepository } from './JobRepository';
import { JobId } from './JobId';

/**
 * Register a JobRepository contract test suite for a given factory.
 * Usage: `register(() => new MyRepo())` inside your repo test file.
 */
export const register = (repoFactory: () => JobRepository) => {
  describe('JobRepository contract', () => {
    let repo: JobRepository;

    beforeEach(() => {
      repo = repoFactory();
    });

    it('listAll returns an array', async () => {
      const jobs = await repo.listAll();
      expect(Array.isArray(jobs)).toBe(true);
    });

    it('findById returns job that exists', async () => {
      const jobs = await repo.listAll();
      if (jobs.length === 0) {
        return;
      }
      const target = jobs[0];
      const found = await repo.findById(target.id as unknown as JobId);
      expect(found).not.toBeNull();
      expect(found?.id.value).toBe(target.id.value);
    });

    it('findById returns null for unknown id', async () => {
      const result = await repo.findById(JobId.create('___unknown___'));
      expect(result).toBeNull();
    });
  });
}; 