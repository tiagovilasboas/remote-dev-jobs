import { nextSafe } from '@next-safe/middleware';
import { isRateLimited } from './lib/rateLimiter';
import { NextRequest, NextResponse } from 'next/server';

const isDev = process.env.NODE_ENV !== 'production';

// eslint-disable-next-line @typescript-eslint/naming-convention
const middlewareConfig = nextSafe({
  contentSecurityPolicy: {
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      ...(isDev ? ["'unsafe-eval'"] : []),
      'https://www.googletagmanager.com',
    ],
  },
});

// Next.js espera exportação chamada `middleware`
export function middleware(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  if (req.nextUrl.pathname.startsWith('/api/jobs') && isRateLimited(ip)) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }
  return (middlewareConfig as any)(req);
}

export const config = {
  matcher: '/(.*)',
}; 