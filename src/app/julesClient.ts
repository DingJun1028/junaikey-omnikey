// julesClient.ts
import fetch from 'node-fetch';

const API_KEY = 'your_google_jules_api_key'; // 建議用環境變數
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export class JulesClient {
  private headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  };
  constructor(private model: string = 'gemini-pro') {}
  private getModelUrl() {
    return `${BASE_URL}/${this.model}:generateContent`;
  }
  async generateContent(prompt: string): Promise<string> {
    const res = await fetch(this.getModelUrl(), {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    if (!res.ok) throw new Error(`Jules API failed: ${res.statusText}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }
}
