# 0002 – Aggregated Job Repositories

Date: {{TODAY}}

## Context

The platform now consumes multiple public APIs (Remotive, Arbeitnow, Greenhouse, Lever). A single unified endpoint is required to present a deduplicated list of remote front-end jobs while shielding the UI from vendor specifics.

## Decision

We introduced an `AggregateJobRepo` in the _infra_ layer that composes several `JobRepository` implementations. It merges results and deduplicates by `JobId`.

- Packages affected: `@remote-dev-jobs/infra`, `@remote-dev-jobs/application`, `@remote-dev-jobs/ui`, `web`.
- Factory `getJobsFactory` now builds `AggregateJobRepo` with all adapters.
- The BFF Next.js route `/api/jobs` supports query-param filters (stack, seniority, location).

## Consequences

- UI fetches jobs from a single endpoint.
- New providers can be added by creating a new `JobRepository` and registering it in the factory.
- Deduplication is naïve (ID equality). Future work: fuzzy match by title/company.

---
