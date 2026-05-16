# 🌌 ESGss JunAiKey Beta - OmniCore v4.0

> **「以神聖代碼契約鑄造永恆架構，在熵增的混沌中開闢秩序之路。」**

ESGss JunAiKey Beta 是一個基於 **Hermes Workspace v2 (Zero-Fork)** 標準開發的自適應代理指揮中心。本平台將王道經營哲學與高性能 AI 群集調度完美融合，為企業決策者提供具備數據信託與自主執行能力的指揮介面。

---

## 💎 核心技術架構 (Ultimate Architecture)

### 1. 🌌 萬能心核 (OmniCore v4.0)
系統採用 **雙向 TypeScript (Double-Ended TS)** 架構，實現前後端 100% 類型安全：
*   **共享定義**: `src/omni/shared/types.ts` 定義了全系統的唯一真相來源。
*   **天界伺服器 (Celestial Server)**: 基於 Express，實現 **5T 邏輯門** 驗算、**4+1 狀態機** 與數據 **Hash Lock** 鎖定。

### 2. 🐝 Hermes Swarm 群集調度 (Swarm Mode)
遵循 Hermes 官方規範的生產級調度系統：
*   **Conductor**: 支援高階任務分解（Mission Decomposition）與自主執行路徑。
*   **Kanban TaskBoard**: 完整的 Backlog, Ready, Running, Review, Blocked, Done 泳道管理。
*   **Greenlight Gate**: 內建安全邊界，所有破壞性操作（Commit/Merge）均需人類核准。
*   **tmux 持久化**: 支援 TUI 模式，Agent 會話以 `swarm-<workerId>` 持久化運行。

### 3. 🛡️ 5T 數據信託框架 (5T Data Trust)
所有數據流必須通過以下門徑，確保願景轉化為真實影響力：
*   🟢 **Tangible (可感知)** | 🟢 **Traceable (可溯源)** | 🟢 **Trackable (可追蹤)**
*   🟢 **Transparent (可透明驗算)** | 🔴 **Trustworthy (不可篡改)**

---

## ✨ 平台功能 (What's Inside)

*   💬 **Chat**: 支援 SSE 串流與多引擎 AI (Gemini 2.0 Flash & OpenCode Kimi)。
*   🧠 **Memory**: 透過 AITable 進行戰略知識編織與長期記憶存儲。
*   🧩 **Skills**: 整合數位武器庫，具備 2,000+ 技能調用潛力。
*   📊 **Dashboard**: 實時 5T 治理面板與 OmniLog 稽核員。
*   🦾 **Body**: 透過 Boost.Space 適配器觸發 2000+ 外部應用自動化。

---

## 🚀 快速開始 (Quick Start)

### 1. 環境需求 (Prerequisites)
*   **Node.js**: 22.0.0+
*   **Package Manager**: `pnpm`
*   **tmux**: 用於持久化 TUI 工作進程
*   **Hermes Profile**: 需配置於 `~/.hermes/profiles/`

### 2. 安裝與啟動
```bash
# 安裝依賴
pnpm install

# 啟動開發環境 (Frontend & Celestial Server)
pnpm dev
cd server && pnpm dev
```

### 3. 外部服務調用 (Quickstart Curl)
```bash
curl -X POST http://localhost:3000/api/swarm-dispatch \
  -H 'Content-Type: application/json' \
  -d '{"workerIds": ["swarm7"], "prompt": "執行 5T 審計任務"}'
```

---

## 📅 戰略演進 (Roadmap)

*   [x] **Stage 1**: 創業之星報名完成。
*   [x] **Stage 2**: 三創複審技術準備 (5T Dashboard, Swarm Mode, ESG Health Check)。
*   [ ] **Stage 3**: 獅鷲計畫 (Gryphon Plan) - iPaaS 適配器解耦與轉型。

---

**© 2026 ESG Sunshine Management Institute. All rights reserved.**
*「萬法歸一・永恆編纂。」*
