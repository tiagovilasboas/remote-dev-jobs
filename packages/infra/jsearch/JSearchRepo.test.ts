import { JSearchRepo } from "./JSearchRepo";

describe("JSearchRepo", () => {
  const mockApiKey = "test_api_key";

  it("should create instance with API key", () => {
    const repo = new JSearchRepo(mockApiKey);
    expect(repo.source).toBe("JSearch");
  });

  it("should handle missing API key gracefully", () => {
    expect(() => new JSearchRepo("")).toThrow();
  });

  // Teste de integração (requer API key real)
  describe("Integration tests", () => {
    const realApiKey = process.env.JSEARCH_API_KEY;
    
    if (!realApiKey) {
      it.skip("skipped - JSEARCH_API_KEY not configured", () => {});
      return;
    }

    it("should fetch jobs from JSearch API", async () => {
      const repo = new JSearchRepo(realApiKey);
      const jobs = await repo.listAll();
      
      expect(Array.isArray(jobs)).toBe(true);
      expect(jobs.length).toBeGreaterThan(0);
      
      // Verificar se as vagas têm os campos obrigatórios
      jobs.forEach(job => {
        expect(job.id).toBeDefined();
        expect(job.title).toBeDefined();
        expect(job.company).toBeDefined();
        expect(job.url).toBeDefined();
        expect(job.publishedAt).toBeInstanceOf(Date);
      });
    }, 30000); // Timeout de 30s para API externa

    it("should filter remote jobs only", async () => {
      const repo = new JSearchRepo(realApiKey);
      const jobs = await repo.listAll();
      
      // Todas as vagas devem ser remotas
      jobs.forEach(job => {
        expect(job.isRemote()).toBe(true);
      });
    }, 30000);
  });
}); 