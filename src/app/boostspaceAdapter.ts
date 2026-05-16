import { 
    OmniResponseStatus, 
    ApiResponse,
    ApiRequest,
    IComponentCore,
    IEvidence
} from '../omni/shared/types';
import { BoostspaceClient } from './boostspaceClient';

/**
 * 🦾 BoostSpace Adapter (Universal Adapter - The Body)
 * Specialized for triggering real-world actions and automation workflows.
 * Implements the Gryphon Plan "Universal Adapter" pattern.
 */
export class BoostspaceAdapter {
    private client: BoostspaceClient;
    private static API_KEY = process.env.BOOSTSPACE_API_KEY || "";

    constructor(module: string = 'tasks') {
        this.client = new BoostspaceClient(module);
    }

    /**
     * Execute an action (The "Body" manifests the result)
     */
    async execute(request: ApiRequest): Promise<ApiResponse> {
        const start = Date.now();
        console.log(`🦾 BoostSpace Body Executing: ${request.id} [${request.content}]`);

        try {
            // Step 1: 5T Execution Audit (Trackable Hook)
            const audit: IEvidence = {
                tangible_metric: `Boost_Action_v1`,
                source_origin: `OmniCore_Dispatch`,
                lifecycle_hooks: [`Action_Initiated`, `BoostSpace_Webhook_Ready`],
                formula_ref: `[ISO-BOOST-EXEC]`
            };

            // Step 2: Trigger BoostSpace Action
            // In a real scenario, this would map request.data to BoostSpace payload
            const result = await this.client.createItem({
                name: request.content,
                status: 'pending',
                source: 'OmniCore_v4',
                timestamp: Date.now(),
                ...request.data
            });

            // Step 3: Hash Lock & Finalize Core
            const core: IComponentCore = {
                uuid: `BOOST_${request.id}`,
                timestamp: Date.now(),
                evidence: audit,
                status: "Trustworthy",
                hash_lock: `B-LOCK-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
            };

            return {
                id: request.id,
                status: OmniResponseStatus.SUCCESS,
                content: `成功觸發「${request.content}」執行任務。數據已同步至 BoostSpace ${this.client['module']} 模組。`,
                data: core,
                latency: Date.now() - start
            };

        } catch (err: any) {
            console.error("🦾 BoostSpace Execution Error:", err);
            return {
                id: request.id,
                status: OmniResponseStatus.ERROR,
                content: `執行力受阻：${err.message}`,
                latency: Date.now() - start
            };
        }
    }
}

export const boostBody = new BoostspaceAdapter();
