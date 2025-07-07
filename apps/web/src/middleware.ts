import { nextSafe } from '@next-safe/middleware';

// eslint-disable-next-line @typescript-eslint/naming-convention
const middlewareConfig = nextSafe({
  contentSecurityPolicy: {
    'script-src': ["'self'", 'https://www.googletagmanager.com'],
  },
});

// Next.js espera exportação chamada `middleware`
export const middleware = middlewareConfig;

export const config = {
  matcher: '/(.*)',
}; 