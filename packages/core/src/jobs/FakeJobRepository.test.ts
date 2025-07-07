import { register } from './JobRepository.contract.test';
import { FakeJobRepository } from './FakeJobRepository';
import { Job } from './Job';

register(() => {
  const sampleJob = Job.create({
    id: '1',
    title: 'Dev',
    company: 'Acme',
    location: 'Remote',
    url: 'https://example.com',
    publishedAt: new Date(),
  });
  return new FakeJobRepository([sampleJob]);
}); 