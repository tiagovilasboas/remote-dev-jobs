"use client";

import React, { useEffect, useState } from 'react';
import { JobList } from '@remote-dev-jobs/ui';
import { GetJobsFilters, PaginationOptions, GetJobsResult } from '@tiago/application/get-jobs';

interface Props {
  filters: Record<string, string | undefined>;
  page: number;
}

export default function JobsSection({ filters, page }: Props) {
  const [data, setData] = useState<GetJobsResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    params.set('page', String(page));
    fetch(`/api/jobs?${params.toString()}`)
      .then(res => res.json())
      .then(res => setData({ ...res, items: res.items.map((j: any) => ({ ...j, id: typeof j.id === 'string' ? { value: j.id } : j.id, publishedAt: new Date(j.publishedAt) })) }))
      .finally(() => setLoading(false));
  }, [JSON.stringify(filters), page]);

  return <JobList jobs={data?.items ?? []} isLoading={loading} />;
} 