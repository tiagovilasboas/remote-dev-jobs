import { nextSafe } from '@next-safe/middleware';

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
export const middleware = middlewareConfig;

export const config = {
  matcher: '/(.*)',
}; 