import dynamic from 'next/dynamic';
import JobsLayout from '../components/JobsLayout';
import JobDetail from '../components/JobDetail';
import JobsSection from '../components/JobsSection';

export default async function HomePage({ searchParams }: { searchParams?: { [key: string]: string } }) {
  const filters: any = {};
  const set = (k:string,v?:string)=>{if(v) filters[k]=v};
  set('stack', searchParams?.stack);
  set('seniority', searchParams?.seniority);
  set('location', searchParams?.location);
  set('query', searchParams?.q);
  const pageNum = Number(searchParams?.page ?? '1');

  const content = (
    <JobsLayout
      list={<JobsSection filters={filters} page={pageNum} />}
      detail={<JobDetail id={searchParams?.id} />}
    />
  );
  return content;
} 