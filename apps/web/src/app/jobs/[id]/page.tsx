'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
          router.push('/404');
          return;
        }
        
        const job = await response.json();
        window.location.href = job.url;
      } catch (error) {
        console.error('Error fetching job:', error);
        router.push('/404');
      }
    };

    fetchJobAndRedirect();
  }, [params.id, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to job...</p>
      </div>
    </div>
  );
} 