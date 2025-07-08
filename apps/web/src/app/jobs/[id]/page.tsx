"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  params: { id: string };
}

export default function JobRedirectPage({ params }: Props) {
  const router = useRouter();

  useEffect(() => {
    const fetchJobAndRedirect = async () => {
      try {
        const response = await fetch(`/api/jobs/${params.id}`);

        if (!response.ok) {
          router.push("/404");
          return;
        }

        const job = await response.json();
        window.location.href = job.url;
      } catch (error) {
        console.error("Error fetching job:", error);
        router.push("/404");
      }
    };

    fetchJobAndRedirect();
  }, [params.id, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Redirecting to job...</p>
      </div>
    </div>
  );
}
