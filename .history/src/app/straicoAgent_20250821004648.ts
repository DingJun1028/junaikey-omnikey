// src/app/straicoAgent.ts
export interface Sigil {
  id: string;
  issuedAt: number;
  expiresAt: number;
  grantedTo: string;
  permissions: string[];
}

export class StraicoAgent {
  private static API_KEY = process.env.STRAICO_API_KEY || "";
  // 令牌消耗日誌
  private static omnilog: Array<{ sigil: Sigil; action: string; timestamp: number }> = [];

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

  // API 代理（所有消耗令牌的行為都必須經過此處）
  static async proxyGeminiRequest(sigil: Sigil, payload: any): Promise<any> {
    if (!StraicoAgent.validateSigil(sigil, "gemini:invoke")) {
      throw new Error("Sigil 無效或權限不足");
    }
    // 實際呼叫 Gemini API（僅此處持有 API_KEY）
    // 這裡僅模擬，實際可用 fetch 實作
    StraicoAgent.omnilog.push({ sigil, action: "gemini:invoke", timestamp: Date.now() });
    return { result: "Gemini 回應（模擬）" };
  }

  // 日誌查詢
  static getOmnilog() {
    return StraicoAgent.omnilog;
  }
}