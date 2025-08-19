#!/usr/bin/env node
import fs from 'fs';

const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;

if (!repo || !token) {
  console.error('Missing GITHUB_REPOSITORY or GITHUB_TOKEN');
  process.exit(1);
}

const [owner, repoName] = repo.split('/');

async function gh(path, init = {}) {
  const url = `https://api.github.com/repos/${owner}/${repoName}${path}`;
  const resp = await fetch(url, {
    ...init,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      ...(init.headers || {})
    }
  });
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`GitHub API ${resp.status} ${url}: ${t}`);
  }
  return resp.json();
}

function parseTasks(markdown) {
  const re = /- \[( |x|X)\] (.+)/g;
  let m, total = 0, done = 0;
  while ((m = re.exec(markdown || '')) !== null) {
    total++;
    if (m[1].toLowerCase() === 'x') done++;
  }
  return { total, done };
}

function pct(n, d) {
  return d === 0 ? '0%' : `${Math.round((n * 100) / d)}%`;
}

async function upsertComment(prNumber, body, marker) {
  const comments = await gh(`/issues/${prNumber}/comments?per_page=100`);
  const prev = comments.find(c => c.body && c.body.includes(marker));
  if (prev) {
    await gh(`/issues/comments/${prev.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ body })
    });
  } else {
    await gh(`/issues/${prNumber}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body })
    });
  }
}

(async () => {
  const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  const prNumber = event.pull_request?.number || event.workflow_run?.pull_requests?.[0]?.number;
  if (!prNumber) return;

  const pr = await gh(`/pulls/${prNumber}`);

  const bodyTasks = parseTasks(pr.body || '');

  // Combined status for head sha
  let ciState = 'unknown', ciSummary = '';
  try {
    const status = await gh(`/commits/${pr.head.sha}/status`);
    ciState = status.state; // success | failure | pending | error
    ciSummary = (status.statuses || []).slice(0, 5).map(s => `${s.context}:${s.state}`).join(', ');
  } catch (_) {}

  const conflicts = pr.mergeable_state && !['clean', 'unstable'].includes(pr.mergeable_state);

  const progress = `
<!-- ai-progress:begin -->
### 📊 PR 進度追蹤
- 任務完成度：${bodyTasks.done}/${bodyTasks.total} (${pct(bodyTasks.done, bodyTasks.total)})
- CI 狀態：${ciState}${ciSummary ? ` (${ciSummary})` : ''}
- 合併狀態：${conflicts ? '⚠️ 有衝突' : '✅ 可合併或待審查'}
- 提交數/檔案數：${pr.commits} commits / ${pr.changed_files} files
- 變更：+${pr.additions} / -${pr.deletions}

> 說明：此評論將在 PR 更新、標籤變更或 CI 完成後自動更新。
<!-- ai-progress:end -->
`;

  await upsertComment(prNumber, progress, '<!-- ai-progress:begin -->');
})();