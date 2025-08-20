// githubClient.ts
import fetch from 'node-fetch';

const API_TOKEN = 'your_github_token'; // 建議用環境變數
const BASE_URL = 'https://api.github.com';

export class GithubClient {
  private headers = {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };
  constructor(private repo: string) {}
  private getRepoUrl() {
    return `${BASE_URL}/repos/${this.repo}`;
  }
  async getRepoInfo(): Promise<any> {
    const res = await fetch(this.getRepoUrl(), { headers: this.headers });
    if (!res.ok) throw new Error(`Get repo info failed: ${res.statusText}`);
    return await res.json();
  }
  async getIssues(): Promise<any[]> {
    const url = `${this.getRepoUrl()}/issues`;
    const res = await fetch(url, { headers: this.headers });
    if (!res.ok) throw new Error(`Get issues failed: ${res.statusText}`);
    return await res.json();
  }
  async createIssue(title: string, body: string): Promise<any> {
    const url = `${this.getRepoUrl()}/issues`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ title, body }),
    });
    if (!res.ok) throw new Error(`Create issue failed: ${res.statusText}`);
    return await res.json();
  }
}
