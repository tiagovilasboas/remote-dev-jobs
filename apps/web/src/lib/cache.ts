import { MemoryCache } from "@remote-dev-jobs/core";

// Cache global para o Next.js
const nextCache = new MemoryCache({
  ttlSeconds: 300, // 5 minutos
  prefix: "next",
});

// Iniciar limpeza automática
nextCache.startCleanup();

export { nextCache };
