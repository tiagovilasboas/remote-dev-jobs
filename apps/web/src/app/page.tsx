"use client";

import { JobsSection } from "../components/JobsSection";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl">
      <h1 className="pl-6 pt-6 text-3xl font-bold">
        Encontre sua vaga dev remota
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
