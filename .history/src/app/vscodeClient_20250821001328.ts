// vscodeClient.ts
import fetch from 'node-fetch';

const API_TOKEN = 'your_vscode_api_token'; // 建議用環境變數
const BASE_URL = 'https://api.visualstudio.com/v1';

export class VSCodeClient {
  private headers = {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  };
  constructor(private resource: string) {}
  private getResourceUrl() {
    return `${BASE_URL}/${this.resource}`;
  }
  async getItems(): Promise<any[]> {
    const res = await fetch(this.getResourceUrl(), { headers: this.headers });
    if (!res.ok) throw new Error(`Get items failed: ${res.statusText}`);
    const data = await res.json();
    return data.items || [];
  }
  async createItem(item: any): Promise<any> {
    const res = await fetch(this.getResourceUrl(), {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error(`Create item failed: ${res.statusText}`);
    return await res.json();
  }
  async updateItem(id: string, item: any): Promise<any> {
    const url = `${this.getResourceUrl()}/${id}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error(`Update item failed: ${res.statusText}`);
    return await res.json();
  }
  async deleteItem(id: string): Promise<void> {
    const url = `${this.getResourceUrl()}/${id}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: this.headers,
    });
    if (!res.ok) throw new Error(`Delete item failed: ${res.statusText}`);
  }
}
