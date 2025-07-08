import { Job, JobRepository } from "@remote-dev-jobs/core";

interface GitHubIssue {
  id: number;
  title: string;
  body: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  labels: Array<{ name: string }>;
}

export class GitHubVagasRepo implements JobRepository {
  public readonly source = "GitHub frontendbr/vagas";
  private readonly apiUrl =
    "https://api.github.com/repos/frontendbr/vagas/issues";
  private readonly baseUrl = "https://github.com/frontendbr/vagas/issues";

  async listAll(): Promise<Job[]> {
    try {
      const response = await fetch(`${this.apiUrl}?state=open&per_page=100`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const issues: GitHubIssue[] = await response.json();
      return this.parseIssues(issues);
    } catch (error) {
      console.error("Erro ao buscar vagas do GitHub frontendbr/vagas:", error);
      return [];
    }
  }

  async getById(id: string): Promise<Job | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);

      if (!response.ok) {
        return null;
      }

      const issue: GitHubIssue = await response.json();
      return this.parseIssue(issue);
    } catch (error) {
      console.error("Erro ao buscar vaga específica do GitHub:", error);
      return null;
    }
  }

  private parseIssues(issues: GitHubIssue[]): Job[] {
    return issues
      .filter((issue) => this.isJobIssue(issue))
      .map((issue) => this.parseIssue(issue))
      .filter((job): job is Job => job !== null);
  }

  private parseIssue(issue: GitHubIssue): Job | null {
    const jobData = this.extractJobData(issue.body);

    if (!jobData) return null;

    return Job.create({
      id: issue.id.toString(),
      title: issue.title,
      company: jobData.company,
      location: jobData.location,
      description: issue.body,
      url: issue.html_url,
      publishedAt: new Date(issue.created_at),
      salary: jobData.salary,
    });
  }

  private isJobIssue(issue: GitHubIssue): boolean {
    // Verifica se é uma vaga baseado nas labels ou conteúdo
    const jobLabels = [
      "vagas",
      "frontend",
      "react",
      "vue",
      "angular",
      "javascript",
      "typescript",
    ];
    const hasJobLabel = issue.labels.some((label) =>
      jobLabels.some((jobLabel) => label.name.toLowerCase().includes(jobLabel)),
    );

    const hasJobKeywords =
      /vaga|desenvolvedor|frontend|front-end|programador/i.test(issue.title);

    return hasJobLabel || hasJobKeywords;
  }

  private extractJobData(
    body: string,
  ): { company: string; location: string; salary?: string } | null {
    // Extrai informações da empresa, localização e salário do corpo da issue
    const companyMatch = body.match(/(?:empresa|company):\s*([^\n]+)/i);
    const locationMatch = body.match(
      /(?:localização|location|local):\s*([^\n]+)/i,
    );
    const salaryMatch = body.match(/(?:salário|salary):\s*([^\n]+)/i);

    const company = companyMatch?.[1]?.trim() || "Empresa não informada";
    const location = locationMatch?.[1]?.trim() || "Localização não informada";
    const salary = salaryMatch?.[1]?.trim();

    return {
      company,
      location,
      salary: salary || undefined,
    };
  }
}
