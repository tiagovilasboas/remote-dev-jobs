'use client';

import { JobsSection } from '../components/JobsSection';

export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold pl-6 pt-6">Encontre sua vaga dev remota</h1>
      <JobsSection />
    </main>
  );
} 