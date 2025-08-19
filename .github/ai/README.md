# GitHub AI 助理（審查 / 追蹤 / 合併建議 / 衝突協助）

此套件提供：
- AI PR Review：摘要重點、風險、Must-fix 與具體建議
- 進度追蹤：任務完成度、CI 狀態、合併可行性自動更新
- 合併策略建議：依提交/變更大小等啟發式決策，並可自動啟用 Auto-merge
- 衝突協助：嘗試 rebase 並應用鎖檔/格式化等啟發式修復

## 安裝/設定

1) Secrets / Vars（於 repo 設定）
- AI_API_BASE：OpenAI 相容 API base（例：https://api.perplexity.ai）
- AI_API_KEY：你的 API Key
- AI_MODEL：模型名稱（例：sonar）
- GITHUB_TOKEN：GitHub 內建自動提供，無須設定

2) 標籤（可選）
- ai、automerge-candidate、conflict:auto-fix、merge:squash、merge:rebase、merge:merge
- 可用 label sync workflow 管理，或手動建立

3) Auto-merge
- Repo Settings → General → Pull Requests → 勾選「Allow auto-merge」
- 預設由 AI Merge Advisor 決策後，若同倉庫分支且 CI 綠燈與審核通過，將啟用 auto-merge。

## 安全性說明
- AI Review 在 pull_request 事件執行；若來源為 fork 且無 AI_API_KEY（Secrets 不會暴露），腳本將跳過 AI 呼叫僅留下標記評論。
- Merge Advisor 使用 pull_request_target，但不 checkout PR 內容，僅操作標籤與（可選）啟用 Auto-merge。
- 衝突自動解決僅對同倉庫分支生效，避免對 Fork 進行未授權推送。

## 使用
- 建立/更新 PR → 自動產生/更新「AI Review」與「PR 進度追蹤」評論
- 套用 `automerge-candidate` 標籤 → 若條件符合會啟用 Auto-merge
- 套用 `conflict:auto-fix` 標籤或手動觸發工作流程 → 嘗試自動 rebase 與啟發式修復