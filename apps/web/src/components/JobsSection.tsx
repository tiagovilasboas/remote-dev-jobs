"use client";

import React, { useEffect, useState } from 'react';
import { JobList } from '@remote-dev-jobs/ui';
import { GetJobsFilters, PaginationOptions, GetJobsResult } from '@tiago/application/get-jobs';

interface Props {
  filters: Record<string, string | undefined>;
  page: number;
}

const PAGE_SIZE = 20;

export default function JobsSection({ filters, page }: Props) {
  const [data, setData] = useState<GetJobsResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k === 'query' ? 'q' : k, v);
    });
    params.set('page', String(page));
    fetch(`/api/jobs?${params.toString()}`)
      .then(res => res.json())
      .then(res =>
        setData({
          ...res,
          items: res.items.map((j: any) => ({
            ...j,
            id: ('value' in (j.id || {})) ? j.id : { value: String(j.id ?? `${j.title}-${j.company}`) },
            publishedAt: new Date(j.publishedAt),
          })),
        }),
      )
      .finally(() => setLoading(false));
  }, [JSON.stringify(filters), page]);

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1;

  const qsBase = new URLSearchParams(filters as any).toString();

  return (
    <>
      {/* @ts-ignore */}
      <JobList jobs={data?.items ?? []} isLoading={loading} baseQuery={qsBase} />
      {!loading && data && (
        <div className="mt-6 flex justify-center gap-4">
          {page > 1 && (
            <a
              href={`/?${new URLSearchParams({ ...filters, page: String(page - 1) }).toString()}`}
              className="text-blue-600 hover:underline"
            >
              ← Previous
            </a>
          )}
          {page < totalPages && (
            <a
              href={`/?${new URLSearchParams({ ...filters, page: String(page + 1) }).toString()}`}
              className="text-blue-600 hover:underline"
            >
              Next →
            </a>
          )}
        </div>
      )}
    </>
  );
} 