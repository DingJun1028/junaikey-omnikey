// src/app/blueClient.ts
/**
 * Blue.cc Client for Next.js (Web-compatible)
 * 採用 GraphQL 直接通訊，適用於前端或 API Routes。
 */
export class BlueClient {
  private apiKey: string;
  private companyId: string;
  private baseUrl: string = "https://api.blue.cc/graphql";

  constructor(apiKey: string, companyId: string) {
    this.apiKey = apiKey;
    this.companyId = companyId;
  }

  private async query(query: string, variables: any = {}) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'x-company-id': this.companyId
      },
      body: JSON.stringify({ query, variables })
    });
    
    const result = await response.json();
    if (result.errors) {
      throw new Error(result.errors.map((e: any) => e.message).join(', '));
    }
    return result.data;
  }

  async listRecords(workspaceId: string) {
    const q = `
      query($id: ID!) {
        workspace(id: $id) {
          records(first: 50) {
            items {
              id
              title
              todoList { title }
              description
            }
          }
        }
      }
    `;
    const data = await this.query(q, { id: workspaceId });
    return data.workspace.records.items;
  }

  async createRecord(workspaceId: string, listId: string, title: string, description: string) {
    const q = `
      mutation($workspaceId: ID!, $listId: ID!, $title: String!, $description: String) {
        createRecord(input: {
          workspaceId: $workspaceId,
          listId: $listId,
          title: $title,
          description: $description
        }) {
          record { id title }
        }
      }
    `;
    const data = await this.query(q, { workspaceId, listId, title, description });
    return data.createRecord.record;
  }
}
