const hits = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 10 * 60 * 1000; // 10 minutos
const MAX_REQ = 30;

export const isRateLimited = (key: string): boolean => {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_REQ) {
    return true;
  }
  entry.count += 1;
  return false;
};
