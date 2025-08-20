import fetch from 'node-fetch';
const API_KEY = 'usk28GpdMJMAhCfhwtRiaDI';
const BASE_ID = 'spcAoNYWy3eSU';
export class AitableClient {
  private baseUrl = `https://api.aitable.ai/v1/bases/${BASE_ID}`;
  private headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  };
  constructor(private tableName: string) {}
  private getTableUrl() {
    return `${this.baseUrl}/tables/${encodeURIComponent(this.tableName)}/records`;
  }
  async getRecords(): Promise<any[]> {
    const res = await fetch(this.getTableUrl(), { headers: this.headers });
    if (!res.ok) throw new Error(`Get records failed: ${res.statusText}`);
    const data = await res.json();
    return data.records;
  }
  async createRecords(records: any[]): Promise<any[]> {
    const res = await fetch(this.getTableUrl(), {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ records }),
    });
    if (!res.ok) throw new Error(`Create records failed: ${res.statusText}`);
    const data = await res.json();
    return data.records;
  }
  async updateRecords(records: any[]): Promise<any[]> {
    const res = await fetch(this.getTableUrl(), {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({ records }),
    });
    if (!res.ok) throw new Error(`Update records failed: ${res.statusText}`);
    const data = await res.json();
    return data.records;
  }
  async deleteRecords(recordIds: string[]): Promise<void> {
    const url = `${this.getTableUrl()}?records=${recordIds.join(',')}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: this.headers,
    });
    if (!res.ok) throw new Error(`Delete records failed: ${res.statusText}`);
  }
}
