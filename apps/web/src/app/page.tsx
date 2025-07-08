"use client";

import { JobsSection } from "../components/JobsSection";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl">
      <h1 className="pt-6 pb-6 text-3xl font-bold">
        Encontre sua vaga de dev
      </h1>
      <Suspense
        fallback={
          <div className="p-8 text-center text-gray-400">Carregando vagas…</div>
        }
      >
        <JobsSection />
      </Suspense>
    </main>
  );
}
