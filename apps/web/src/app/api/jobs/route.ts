import { NextResponse } from 'next/server';
import { getJobsFactory } from '@tiago/application/get-jobs';

export const revalidate = 60; // ISR – revalidate every minute

export async function GET() {
  const jobs = await getJobsFactory().execute();
  return NextResponse.json(jobs);
} 