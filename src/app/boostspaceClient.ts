// boostspaceClient.ts
import fetch from 'node-fetch';

const API_KEY = 'your_boostspace_api_key'; // 請改用環境變數
const BASE_URL = 'https://api.boost.space/v1';

export class BoostspaceClient {
  private headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  };
  constructor(private module: string) {}
  private getModuleUrl() {
    return `${BASE_URL}/${this.module}`;
  }
  async getItems(): Promise<any[]> {
    const res = await fetch(this.getModuleUrl(), { headers: this.headers });
    if (!res.ok) throw new Error(`Get items failed: ${res.statusText}`);
    const data = await res.json();
    return data.items || [];
  }
  async createItem(item: any): Promise<any> {
    const res = await fetch(this.getModuleUrl(), {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error(`Create item failed: ${res.statusText}`);
    return await res.json();
  }
  async updateItem(id: string, item: any): Promise<any> {
    const url = `${this.getModuleUrl()}/${id}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error(`Update item failed: ${res.statusText}`);
    return await res.json();
  }
  async deleteItem(id: string): Promise<void> {
    const url = `${this.getModuleUrl()}/${id}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: this.headers,
    });
    if (!res.ok) throw new Error(`Delete item failed: ${res.statusText}`);
  }
}
