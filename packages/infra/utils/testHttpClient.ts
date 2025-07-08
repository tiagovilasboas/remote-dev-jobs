import { HttpClient } from "./httpClient";

async function testHttpClient() {
  console.log("🧪 Testando HttpClient...");
  
  try {
    const html = await HttpClient.fetchWithRetry(
      "https://www.vagas.com.br/vagas-de-programador-remoto",
      {
        delayMs: 1000,
        maxRetries: 2,
        timeoutMs: 10000,
      }
    );
    
    console.log("✅ HttpClient funcionando!");
    console.log(`📄 Tamanho da resposta: ${html.length} caracteres`);
    console.log(`🔍 Primeiros 200 caracteres: ${html.substring(0, 200)}`);
    
    // Verificar se há conteúdo de vagas
    if (html.includes("vaga") || html.includes("job") || html.includes("emprego")) {
      console.log("✅ Conteúdo parece ser de vagas");
    } else {
      console.log("⚠️ Conteúdo não parece ser de vagas");
    }
    
  } catch (error) {
    console.error("❌ HttpClient falhou:", error);
  }
}

// Executar teste se este arquivo for executado diretamente
if (require.main === module) {
  testHttpClient();
}

export { testHttpClient }; 