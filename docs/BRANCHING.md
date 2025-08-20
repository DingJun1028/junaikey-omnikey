# 分支與提交規範（GitHub Flow）

- 主分支：`main`（受保護，禁止直接 push）
- 開發流程：
  1. 從 `main` 切出分支：`feat/<topic>`、`fix/<topic>`、`chore/<topic>`
  2. 提交訊息採用 Conventional Commits：`type(scope): subject`
     - 常見 type：feat, fix, chore, docs, refactor, test, ci
     - 範例：`feat(auth): support github login`
  3. 透過 PR 合併回 `main`，須通過：
     - CI 檢查（lint、測試）
     - Commitlint
     - Code Review 至少 1 位（受保護分支規則）
  4. AI PR：由自動流程加上 `ai`、`rebase:bot` 標籤，遇到 `main` 變動自動 rebase

- Merge 策略：
  - AI 代理在建立 PR 前應先 rebase（由工作流程 auto-rebase 協助）
  - 人類開發者分支建議定期 `git pull --rebase origin main`
  - `Squash and merge` 作為預設，保持精簡歷史（針對 feature 分支）