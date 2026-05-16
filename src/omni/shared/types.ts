/**
 * 🌌 OmniCore Shared Types
 * Full-stack type definitions for the Double-Ended TypeScript architecture.
 */

export enum OmniRequestType {
    QUERY = 'query',
    COMMAND = 'command',
    MANIFEST = 'manifest',
    OPTIMIZE = 'optimize'
}

export enum OmniResponseStatus {
    SUCCESS = 'success',
    ERROR = 'error',
    THINKING = 'thinking',
    ORACLE = 'oracle'
}

export enum EternalMemoryType {
    EPISODIC = 'episodic',
    SEMANTIC = 'semantic',
    PROCEDURAL = 'procedural',
    STRATEGIC = 'strategic'
}

export interface ApiRequest<T = any> {
    id: string;
    type: OmniRequestType;
    content: string;
    data?: T;
    timestamp: number;
}

export interface ApiResponse<T = any> {
    id: string;
    status: OmniResponseStatus;
    content: string;
    data?: T;
    latency: number;
}

export interface AgentSession {
    sessionId: string;
    agentName: string;
    status: 'active' | 'suspended';
    startTime: number;
}

export interface Message {
    role: 'user' | 'adan' | 'system';
    content: string;
    status?: OmniResponseStatus;
    timestamp: number;
}

/**
 * 🏛️ 5T Logic Gate Metadata
 */
export interface IEvidence {
    tangible_metric: string;      // 🟢 Tangible
    source_origin: string;        // 🟢 Traceable
    lifecycle_hooks: string[];    // 🟢 Trackable
    formula_ref: string;          // 🟢 Transparent
}

export interface IComponentCore {
    readonly uuid: string;
    readonly timestamp: number;
    readonly evidence: IEvidence;
    readonly status: "Trustworthy"; // 🔴 Trustworthy
    readonly hash_lock: string;
}
