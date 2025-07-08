# ADR-0001: BFF Embedded in Next.js

Date: 2025-05-18

## Context

We evaluated creating a standalone Fastify BFF versus keeping API logic within Next.js Route Handlers.

## Decision

For the initial scope (aggregating remote job feeds, simple auth, favorites) we embed the BFF inside Next.js (`/app/api/*`). This reduces infra overhead and latency.

## Consequences

- Zero extra deploy surface.
- Same repo / framework for UI & API.  
  − Web & API cannot scale independently (acceptable for MVP).  
  − If multiple clients appear, we may extract to `packages/infra/http` or `apps/bff/`.
