import { register } from '../../core/src/jobs/JobRepository.contract';
import { RemotiveRepo } from './RemotiveRepo';
/* eslint-disable jest/no-conditional-expect */

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
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(sampleApiResponse),
      }),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
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