import JobsSection from '../components/JobsSection';
import { JobFilters } from '../components/JobFilters';

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}) {
  const filters: any = {};
  const set = (k: string, v?: string) => {
    if (v) filters[k] = v;
  };
  set('stack', searchParams?.stack);
  set('seniority', searchParams?.seniority);
  set('location', searchParams?.location);
  set('q', searchParams?.q);
  const pageNum = Number(searchParams?.page ?? '1');

  return (
    <main className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Encontre sua vaga dev remota</h1>
      <JobFilters />
      <JobsSection filters={filters} page={pageNum} />
    </main>
  );
} 