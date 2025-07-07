import { register } from '@tiago/core/jobs/JobRepository.contract.test';
import { RemotiveRepo } from './RemotiveRepo';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

const sampleApiResponse = {
  jobs: [
    {
      id: 1,
      title: 'Senior JS Dev',
      company_name: 'Acme',
      candidate_required_location: 'Worldwide',
      salary: '$100k',
      url: 'https://example.com',
      publication_date: '2024-01-01T00:00:00',
    },
  ],
};

register(() => new RemotiveRepo());

describe('RemotiveRepo specific', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(sampleApiResponse),
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('maps jobs from API', async () => {
    const repo = new RemotiveRepo();
    const jobs = await repo.listAll();
    expect(jobs).toHaveLength(1);
    const job = jobs[0];
    expect(job.title).toBe('Senior JS Dev');
    expect(job.company).toBe('Acme');
    expect(job.isRemote()).toBe(true);
  });
}); 