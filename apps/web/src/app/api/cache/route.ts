import { NextRequest, NextResponse } from 'next/server';
import { CacheManager } from '../../../lib/cacheUtils';

export async function GET() {
  try {
    const stats = await CacheManager.getCacheStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get cache stats' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');
    const type = searchParams.get('type');

    if (jobId) {
      await CacheManager.invalidateJobCache(jobId);
    } else if (type === 'jobs') {
      await CacheManager.invalidateJobsCache();
    } else {
      await CacheManager.invalidateJobsListCache();
    }

    return NextResponse.json({ message: 'Cache invalidated successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to invalidate cache' },
      { status: 500 }
    );
  }
} 