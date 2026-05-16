// src/app/straicoAgent.ts
export interface Sigil {
  id: string;
  issuedAt: number;
  expiresAt: number;
  grantedTo: string;
  permissions: string[];
}

import { OpenCodeClient } from './clients/opencodeClient';

export class StraicoAgent {
  private static API_KEY = process.env.STRAICO_API_KEY || "";
  private static opencode = new OpenCodeClient();
  // ... rest of class ...
  
  // API 代理（擴充支援 OpenCode）
  static async proxyOpenCodeRequest(sigil: Sigil, payload: { prompt: string; model?: string }): Promise<any> {
    if (!StraicoAgent.validateSigil(sigil, "opencode:invoke")) {
      throw new Error("Sigil 無效或權限不足");
    }

    try {
      const response = await StraicoAgent.opencode.createCompletion({
        model: payload.model || "moonshotai/Kimi-K2.5",
        messages: [{ role: "user", content: payload.prompt }]
      });
      
      StraicoAgent.omnilog.push({ sigil, action: "opencode:invoke", timestamp: Date.now() });
      return { result: response.choices[0].message.content };
    } catch (err) {
      console.error("OpenCode Proxy Error:", err);
      return { result: "[Simulation] OpenCode 核心連動中..." };
    }
  }

  // 符令簽發
  static requestSigil(grantedTo: string, permissions: string[]): Sigil {
    const now = Date.now();
    const sigil: Sigil = {
      id: `sigil_${now}_${Math.random().toString(36).slice(2)}`,
      issuedAt: now,
      expiresAt: now + 1000 * 60 * 10, // 10分鐘有效
      grantedTo,
      permissions,
    };
    return sigil;
  }

  // 符令驗證
  static validateSigil(sigil: Sigil, permission: string): boolean {
    const now = Date.now();
    return sigil.expiresAt > now && sigil.permissions.includes(permission);
  }

  // API 代理（實施真實 AI 呼叫）
  static async proxyGeminiRequest(sigil: Sigil, payload: { prompt: string; context?: string }): Promise<any> {
    if (!StraicoAgent.validateSigil(sigil, "gemini:invoke")) {
      throw new Error("Sigil 無效或權限不足");
    }

    const apiKey = process.env.NEXT_PUBLIC_STRAICO_API_KEY || process.env.STRAICO_API_KEY;
    if (!apiKey) {
      console.warn("Straico API Key missing, falling back to simulation.");
      return { result: `[Simulation] 針對「${payload.prompt}」的王道分析：在 ${payload.context || '當前情境'} 下，建議優先平衡利益關係人。` };
    }

    try {
      const response = await fetch("https://api.straico.com/v1/prompt/completion", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          models: ["google/gemini-2.0-flash-exp"], // 使用最新 Gemini 2.0 Flash
          message: `你現在是「AI 阿丹」，王道經營智慧的數位分身。
          背景脈絡：${payload.context || '無'}
          用戶問題：${payload.prompt}
          
          請以王道精神（創造價值、利益平衡、永續經營）進行回覆。字數簡煉且具備智囊感。`,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Straico API error: ${response.statusText}`);
      }

      const data = await response.json();
      StraicoAgent.omnilog.push({ sigil, action: "gemini:invoke", timestamp: Date.now() });
      
      // 解析 Straico 回傳格式
      const completion = data.completions?.["google/gemini-2.0-flash-exp"]?.completion || "阿丹目前正在閉目養神，請稍後再試。";
      return { result: completion };
    } catch (err: any) {
      console.error("AI Proxy Error:", err);
      throw err;
    }
  }

  // 神諭分派 StraicoAgent（模擬，實際可串接 Straico API 或下層代理）
  static async dispatchOracle(oracle: any): Promise<void> {
    // 這裡僅記錄分派行為，可擴充串接 Straico API
    StraicoAgent.omnilog.push({ sigil: { id: 'oracle', issuedAt: Date.now(), expiresAt: Date.now() + 60000, grantedTo: 'straico', permissions: ['oracle:dispatch'] }, action: `dispatchOracle:${oracle.id}`, timestamp: Date.now() });
    // 可在此串接 Straico 任務分派 API
    return;
  }

  // 日誌查詢
  static getOmnilog() {
    return StraicoAgent.omnilog;
  }
}