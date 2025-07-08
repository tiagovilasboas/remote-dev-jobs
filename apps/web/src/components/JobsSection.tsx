"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { JobList, JobCard, Spinner } from '@remote-dev-jobs/ui';
import { JobItem } from '@remote-dev-jobs/ui/src/JobItem';
import { JobDetails } from '@remote-dev-jobs/ui/src/JobDetails';
import {
  GetJobsFilters,
  PaginationOptions,
  GetJobsResult,
} from '../../../../packages/application/src/get-jobs';

interface Props {
  filters: Partial<GetJobsFilters>;
  page: number;
}

const PAGE_SIZE = 20;

export default function JobsSection({ filters, page }: Props) {
  const [data, setData] = useState<GetJobsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobDetails, setJobDetails] = useState<JobItem | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');

  useEffect(() => {
    if (!selectedId) {
      setJobDetails(null);
      return;
    }

    setLoadingDetails(true);
    setJobDetails(null);

    fetch(`/api/jobs/${selectedId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch job details');
        return res.json();
      })
      .then(details => setJobDetails(details))
      .catch(err => {
        console.error(err);
        setJobDetails(null);
      })
      .finally(() => setLoadingDetails(false));
  }, [selectedId]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k === 'query' ? 'q' : k, v);
    });
    params.set('page', String(page));
    fetch(`/api/jobs?${params.toString()}`)
      .then(res => res.json())
      .then(res => {
        setData({
          ...res,
          items: res.items.map((j: any) => ({
            ...j,
            publishedAt: new Date(j.publishedAt),
          })),
        });
      })
      .finally(() => setLoading(false));
  }, [JSON.stringify(filters), page]);

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1;
  const qsBase = new URLSearchParams(filters as any).toString();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 h-[80vh] overflow-y-auto border rounded-lg">
        <JobList jobs={data?.items ?? []} isLoading={loading}>
          {job => {
            const id = (job.id as any)?._value ?? job.id;
            const finalHref = `?${qsBase}&id=${id}`;
            const isSelected = selectedId === id;
            return (
              <Link href={finalHref} scroll={false}>
                <JobCard job={{...job, id}} isSelected={isSelected} />
              </Link>
            );
          }}
        </JobList>
        {!loading && data && (
          <div className="mt-6 flex justify-center gap-4 p-4">
            {page > 1 && (
              <Link
                href={`/?${new URLSearchParams({
                  ...filters,
                  page: String(page - 1),
                }).toString()}`}
              >
                <button
                  className="text-blue-600 hover:underline"
                  disabled={page === 1}
                >
                  ← Previous
                </button>
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/?${new URLSearchParams({
                  ...filters,
                  page: String(page + 1),
                }).toString()}`}
              >
                <button className="text-blue-600 hover:underline">
                  Next →
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
      <div className="md:col-span-2 h-[80vh] overflow-y-auto border rounded-lg p-4">
        {loadingDetails ? (
          <div className="flex items-center justify-center h-full">
            <Spinner />
          </div>
        ) : jobDetails ? (
          <JobDetails job={{...jobDetails, id: (jobDetails.id as any)?._value ?? jobDetails.id}} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Selecione uma vaga para ver os detalhes
          </div>
        )}
      </div>
    </div>
  );
} 