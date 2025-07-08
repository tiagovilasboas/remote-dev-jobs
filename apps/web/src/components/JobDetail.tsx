"use client";

import { Job } from "@remote-dev-jobs/core";
import { useEffect, useState } from "react";

interface Props {
  id?: string;
}

export default function JobDetail({ id }: Props) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`/api/jobs/${id}`)
      .then((res) => res.json())
      .then((data: Job) => {
        setJob(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!job) return <div>Job not found</div>;

  return (
    <div>
      <h1>{job.title}</h1>
      <p>{job.company}</p>
      <div dangerouslySetInnerHTML={{ __html: job.description || "" }} />
    </div>
  );
}
