import { FakeJobRepository } from "./FakeJobRepository";
import { Job } from "./Job";
import { register } from "./JobRepository.contract";

register(() => {
  const sampleJob = Job.create({
    id: "1",
    title: "Dev",
    company: "Acme",
    location: "Remote",
    url: "https://example.com",
    publishedAt: new Date(),
  });
  return new FakeJobRepository([sampleJob]);
});
