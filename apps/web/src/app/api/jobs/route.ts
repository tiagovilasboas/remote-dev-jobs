import { NextRequest, NextResponse } from 'next/server';
import { getJobsFactory } from '@tiago/application/get-jobs';

export const revalidate = 60; // ISR – revalidate every minute

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filters = {
    stack: searchParams.get('stack') || undefined,
    seniority: searchParams.get('seniority') || undefined,
    location: searchParams.get('location') || undefined,
    query: searchParams.get('q') || undefined,
  };
  const jobs = await getJobsFactory().execute(filters);
  return NextResponse.json(jobs);
} 