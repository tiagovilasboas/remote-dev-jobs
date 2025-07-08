import { NextRequest, NextResponse } from 'next/server';
import { getJobsFactory } from '@tiago/application/get-jobs';

export const revalidate = 60; // ISR – revalidate every minute

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filters: any = {};
  const setIf = (key:string,val:string|null)=>{if(val) filters[key]=val;};
  setIf('stack', searchParams.get('stack'));
  setIf('seniority', searchParams.get('seniority'));
  setIf('location', searchParams.get('location'));
  setIf('query', searchParams.get('q'));
  const jobs = await getJobsFactory().execute(filters);
  return NextResponse.json(jobs);
} 