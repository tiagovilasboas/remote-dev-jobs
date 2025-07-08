import { NextRequest, NextResponse } from 'next/server';
import { getJobsFactory } from '@remote-dev-jobs/application/get-jobs';
import { nextCache } from '../../../lib/cache';

export const revalidate = 60; // ISR – revalidate every minute

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filters: any = {};
  const setIf = (key:string,val:string|null)=>{if(val) filters[key]=val;};
  setIf('stack', searchParams.get('stack'));
  setIf('seniority', searchParams.get('seniority'));
  setIf('location', searchParams.get('location'));
  setIf('query', searchParams.get('q'));
  setIf('page', searchParams.get('page'));
  setIf('pageSize', searchParams.get('pageSize'));
  const pageNum = Number(filters.page);
  const sizeNum = Number(filters.pageSize);
  
  // Criar chave de cache baseada nos parâmetros
  const cacheKey = `api:jobs:${JSON.stringify(filters)}:${pageNum || 1}:${sizeNum || 20}`;
  
  // Tentar buscar do cache
  const cached = await nextCache.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  const { items, total } = await getJobsFactory().execute(filters, { page: pageNum || 1, pageSize: sizeNum || 20 });

  const id = searchParams.get('id');
  if (id) {
    const { items } = await getJobsFactory().execute({ location: 'brazil' }, { pageSize: 1000 });
    const job = items.find((j: any) => j.id === id || j.id?.value === id);
    return job ? NextResponse.json(job) : NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const result = { items, total, page: pageNum || 1, pageSize: sizeNum || 20 };
  
  // Salvar no cache
  await nextCache.set(cacheKey, result, 300);
  
  return NextResponse.json(result);
} 