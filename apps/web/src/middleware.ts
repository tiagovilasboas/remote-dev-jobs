import createMiddleware from '@next-safe/middleware';

export const middleware = createMiddleware({
  contentSecurityPolicy: {
    'script-src': ["'self'", 'https://www.googletagmanager.com'],
  },
});

export const config = {
  matcher: '/(.*)',
}; 