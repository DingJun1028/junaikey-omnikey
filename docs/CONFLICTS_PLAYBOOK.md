# 衝突處理與 non-fast-forward 應對

- 原則：
  - 不直接在 `main` 上修改
  - 維持小批次、頻繁整合
- AI PR：
  - 自動加 `rebase:bot`，主幹變動時由 `auto-rebase` 工作流程處理
- 手機端限制（無法 rebase/pull）：
  - 優先透過 GitHub Web 編輯或開啟 PR
  - 必要時以最小變更單位上傳，交由 Review 與 CI 保障品質
- 常見決策：
  - 多人同檔案衝突 → 先合入測試覆蓋高者，後者 rebase 並修正
  - 互斥需求 → 以 Feature Flag 隔離，避免長期分叉