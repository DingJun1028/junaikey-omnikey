/**
 * JunAiKey 核心類型定義
 * 遵循「萬能開發聖典」第一條：繁中英碼，矩陣釋義
 * 這些介面是系統的基石，定義了代理、技能、記憶和權能的結構。
 */

/**
 * @name Permission (權能)
 * @description 定義了執行一個動作所需的權限。
 * @example "slack:write", "github:read:pull_request"
 */
export type Permission = string;

/**
 * @name Rune (符文 / 技能)
 * @description 代表一個模組化、可插拔的技能。代理可以組合符文來執行複雜任務。
 */
export interface Rune {
  id: string; // 符文的唯一標識符
  name: string; // 符文的名稱，例如 "發送 Slack 訊息"
  description: string; // 符文功能的詳細描述
  // 'any' is used here as a placeholder for a proper JSON schema definition library like Zod.
  inputSchema: any; // 輸入參數的 JSON Schema
  outputSchema: any; // 輸出結果的 JSON Schema
  requiredPermissions: Permission[]; // 執行此符文所需的權能列表
  execute: (input: any) => Promise<any>; // 符文的執行邏輯
}

/**
 * @name Agent (代理)
 * @description 代表一個自主代理，能夠分解任務、組合符文並執行。
 */
export interface Agent {
  id: string; // 代理的唯一標識符
  name: string; // 代理的名稱或角色，例如 "任務分解代理"
  role: 'planner' | 'executor' | 'specialist'; // 代理的角色
  status: 'idle' | 'planning' | 'executing' | 'error'; // 代理的當前狀態
  currentTask: string | null; // 當前正在處理的任務描述
}

/**
 * @name Memory (記憶)
 * @description 代表代理記憶宮殿中的一個記憶片段。
 */
export interface Memory {
  id: string; // 記憶的唯一標識符
  content: string; // 記憶的文本內容
  timestamp: number; // 記憶創建的時間戳
  // Vector embedding will be handled by the database (e.g., pgvector) and might not be directly in the object.
  // 向量嵌入將由數據庫處理，不一定直接存在於對象中。
  metadata: {
    taskId?: string; // 關聯的任務 ID
    agentId?: string; // 產生此記憶的代理 ID
    runeId?: string; // 關聯的符文 ID
    type: 'experience' | 'knowledge' | 'conversation'; // 記憶類型
  };
}
