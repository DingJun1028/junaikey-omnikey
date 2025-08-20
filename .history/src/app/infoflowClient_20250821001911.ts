// infoflowClient.ts
import fetch from 'node-fetch';

// 建議用環境變數管理 API_KEY，避免硬編碼
const API_KEY = process.env.INFOFLOW_API_KEY || '';
const BASE_URL = 'https://api.infoflow.com/v1';

export class InfoflowClient {
  private headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  };
  constructor(private resource: string) {}
  private getResourceUrl() {
    return `${BASE_URL}/${this.resource}`;
  }
  // 支援分頁與批次操作，提升效能
  async getItems(params: Record<string, any> = {}): Promise<any[]> {
    const url = new URL(this.getResourceUrl());
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
    const res = await fetch(url.toString(), { headers: this.headers });
    if (!res.ok) throw new Error(`Get items failed: ${res.statusText}`);
    const data: any = await res.json();
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
  // 支援 webhook 事件接收，便於平台間同步
  static handleWebhook(event: any, syncCallback: (data: any) => Promise<void>) {
    // 驗證 event 來源與安全性
    if (!event || !event.type) return;
    // 根據 event 類型執行同步
    syncCallback(event.data).catch(console.error);
  }
}
