/**
 * 🌌 OmniCore Frontend Client
 * Fully type-safe communication with the OmniCore backend.
 */
import { 
    ApiRequest, 
    ApiResponse, 
    OmniRequestType,
    EternalMemoryType
} from '../omni/shared/types';

export class OmniCoreClient {
    private baseUrl: string = '/api';

    private async post<T>(endpoint: string, body: any): Promise<T> {
        const res = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error(`OmniCore Network Error: ${res.statusText}`);
        return await res.json();
    }

    /**
     * Process a request (Query, Command, etc.)
     * Returns a fully type-safe ApiResponse
     */
    async process(type: OmniRequestType, content: string, data?: any): Promise<ApiResponse> {
        const request: ApiRequest = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            content,
            data,
            timestamp: Date.now()
        };
        return await this.post<ApiResponse>('/process', request);
    }

    /**
     * Manifest a new AI Agent session
     */
    async manifestAgent(config: { name: string; systemPrompt: string }) {
        return await this.process(OmniRequestType.MANIFEST, config.name, config);
    }

    /**
     * Store memory in the Eternal Memory vault
     */
    async storeMemory(content: string, type: EternalMemoryType) {
        return await this.process(OmniRequestType.COMMAND, `Store Memory: ${type}`, { content, type });
    }
}

export const omniClient = new OmniCoreClient();
