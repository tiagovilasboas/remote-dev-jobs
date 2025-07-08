export interface HttpClientOptions {
  delayMs?: number;
  maxRetries?: number;
  timeoutMs?: number;
  userAgent?: string;
}

export class HttpClient {
  private static readonly DEFAULT_USER_AGENTS = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  ];

  private static getRandomUserAgent(): string {
    const index = Math.floor(Math.random() * this.DEFAULT_USER_AGENTS.length);
    return this.DEFAULT_USER_AGENTS[index];
  }

  private static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async fetch(url: string, options: HttpClientOptions = {}): Promise<Response> {
    const {
      delayMs = 1000 + Math.random() * 2000, // 1-3 segundos aleatório
      maxRetries = 3,
      timeoutMs = 10000,
      userAgent = this.getRandomUserAgent(),
    } = options;

    const headers = {
      'User-Agent': userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Cache-Control': 'max-age=0',
    };

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Delay antes da requisição (exceto na primeira tentativa)
        if (attempt > 1) {
          const backoffDelay = delayMs * Math.pow(2, attempt - 1);
          console.log(`[HTTP] Tentativa ${attempt}/${maxRetries} para ${url} em ${backoffDelay}ms`);
          await this.delay(backoffDelay);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(url, {
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          return response;
        }

        // Se recebeu 429 (Too Many Requests), espera mais
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : delayMs * 2;
          console.log(`[HTTP] Rate limited, aguardando ${waitTime}ms`);
          await this.delay(waitTime);
          continue;
        }

        // Se recebeu 403 (Forbidden), pode ser bloqueio anti-bot
        if (response.status === 403) {
          console.warn(`[HTTP] Acesso bloqueado (403) para ${url}`);
          // Tenta com User-Agent diferente na próxima tentativa
          continue;
        }

        throw new Error(`HTTP error! status: ${response.status}`);

      } catch (error) {
        console.error(`[HTTP] Tentativa ${attempt} falhou para ${url}:`, error);
        
        if (attempt === maxRetries) {
          throw error;
        }
      }
    }

    throw new Error(`Falha após ${maxRetries} tentativas para ${url}`);
  }

  static async fetchWithRetry(url: string, options: HttpClientOptions = {}): Promise<string> {
    const response = await this.fetch(url, options);
    return response.text();
  }
} 