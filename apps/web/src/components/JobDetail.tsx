"use client";

import React, { useEffect, useState } from 'react';
import { GetJobsResult } from '@tiago/application/get-jobs';

interface Props { id?: string }

export default function JobDetail({ id }: Props) {
  const [job, setJob] = useState<any | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/jobs?id=${id}`)
      .then(res => res.json())
      .then((res: any) => setJob(res))
      .catch(() => setJob(null));
  }, [id]);

  if (!id) {
    return <p className="text-center text-gray-500 mt-10">Selecione uma vaga para ver detalhes</p>;
  }

  if (!job) {
    return <p className="mt-10 text-center text-gray-500">Carregando…</p>;
  }

  return (
    <article className="prose max-w-none">
      <h2>{job.title}</h2>
      <p>
        <strong>{job.company}</strong> • {job.location}
      </p>
      {job.salary && <p>Salário: {job.salary}</p>}
      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Aplicar
      </a>
    </article>
  );
} 