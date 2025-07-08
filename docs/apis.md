# Configuração de APIs

## JSearch API (RapidAPI)

O JSearch é uma API de IA que usa modelos GPT-3 + BERT para buscar vagas em múltiplas plataformas como Google for Jobs, LinkedIn, Indeed, ZipRecruiter, etc.

### Como obter a API Key

1. Acesse [RapidAPI JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
2. Faça login ou crie uma conta
3. Assine o plano **Basic** (gratuito - 200 requests/mês)
4. Copie sua API key

### Configuração

Crie um arquivo `.env` na raiz do projeto com:

```bash
JSEARCH_API_KEY=sua_api_key_aqui
```

### Limites do plano gratuito

- **200 requests/mês** no plano Basic
- Rate limit: ~1 request/segundo
- Dados retornados em JSON limpo
- Filtros automáticos por "remote jobs"

### Exemplo de resposta

```json
{
  "job_title": "Senior Front-End Engineer (React)",
  "employer_name": "Tech Company",
  "job_is_remote": true,
  "job_apply_link": "https://example.com/apply",
  "job_posted_at_datetime_utc": "2025-01-15T10:00:00Z",
  "job_highlights": {
    "Qualifications": ["React", "TypeScript", "5+ years"],
    "Benefits": ["Health insurance", "Remote work"]
  }
}
```

## Próximas APIs a implementar

### Cohere Rerank
- **Propósito**: Ordenar vagas por relevância usando IA
- **Limite gratuito**: Trial ilimitado para devs
- **Uso**: Rerank das descrições de vagas pelo perfil do usuário

### Google Gemini API
- **Propósito**: Extrair informações estruturadas das descrições
- **Limite gratuito**: 100 requests/dia
- **Uso**: Extrair salário, benefícios, requisitos

### Jobicy Remote Jobs API
- **Propósito**: Vagas remotas com filtros de stack
- **Limite gratuito**: 50 vagas + filtros
- **Uso**: Complementar outras fontes

## Estratégia de implementação

1. **JSearch como motor principal** - Busca inteligente de vagas
2. **APIs existentes como backup** - Remotive, Arbeitnow, etc.
3. **Scrapers brasileiros** - Para vagas locais
4. **IA para processamento** - Cohere/Gemini para melhorar relevância

## Monitoramento

- Logs de rate limiting
- Contagem de requests por API
- Alertas quando próximo do limite
- Fallback automático para outras fontes 