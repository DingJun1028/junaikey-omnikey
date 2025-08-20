// firebaseClient.ts
import fetch from 'node-fetch';

const API_KEY = 'your_firebase_api_key'; // 建議用環境變數
const BASE_URL = 'https://firestore.googleapis.com/v1/projects/your_project_id/databases/(default)/documents';

export class FirebaseClient {
  private headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  };
  constructor(private collection: string) {}
  private getCollectionUrl() {
    return `${BASE_URL}/${this.collection}`;
  }
  async getDocuments(): Promise<any[]> {
    const res = await fetch(this.getCollectionUrl(), { headers: this.headers });
    if (!res.ok) throw new Error(`Get documents failed: ${res.statusText}`);
    const data = await res.json();
    return data.documents || [];
  }
  async createDocument(document: any): Promise<any> {
    const res = await fetch(this.getCollectionUrl(), {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(document),
    });
    if (!res.ok) throw new Error(`Create document failed: ${res.statusText}`);
    return await res.json();
  }
  async updateDocument(id: string, document: any): Promise<any> {
    const url = `${this.getCollectionUrl()}/${id}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(document),
    });
    if (!res.ok) throw new Error(`Update document failed: ${res.statusText}`);
    return await res.json();
  }
  async deleteDocument(id: string): Promise<void> {
    const url = `${this.getCollectionUrl()}/${id}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: this.headers,
    });
    if (!res.ok) throw new Error(`Delete document failed: ${res.statusText}`);
  }
}
