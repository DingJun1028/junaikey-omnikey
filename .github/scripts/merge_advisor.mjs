#!/usr/bin/env node
import fs from 'fs';

const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
if (!repo || !token) { console.error('Missing repo/token'); process.exit(1); }
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

function decide(pr) {
  const manyCommits = pr.commits > 3;
  const largeChange = (pr.additions + pr.deletions) > 2000;
  const headRef = pr.head.ref || '';
  const hasMergeInTitle = /\bmerge\b/i.test(pr.title || '');
  let method = 'SQUASH';
  const rationale = new Set();

  if (manyCommits) rationale.add('多筆小提交，有利壓縮歷史');
  if (largeChange) rationale.add('變更量大，建議保留單一提交易於回滾');
  if (!manyCommits && !largeChange) rationale.add('變更適中');

  const likelyConventional = /^[a-z]+(\([^)]+\))?:/.test((pr.title || '').trim());
  if (!manyCommits && likelyConventional && !hasMergeInTitle) {
    method = 'REBASE';
    rationale.add('提交訊息整潔，rebase 可保線性歷史');
  }
  if (hasMergeInTitle) {
    method = 'MERGE';
    rationale.add('此 PR 為整合性分支，保留合併提交');
  }
  return { method, rationale: Array.from(rationale) };
}

async function upsertComment(prNumber, body, marker) {
  const comments = await gh(`/issues/${prNumber}/comments?per_page=100`);
  const prev = comments.find(c => c.body && c.body.includes(marker));
  if (prev) {
    await gh(`/issues/comments/${prev.id}`, { method: 'PATCH', body: JSON.stringify({ body }) });
  } else {
    await gh(`/issues/${prNumber}/comments`, { method: 'POST', body: JSON.stringify({ body }) });
  }
}

(async () => {
  const payload = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  const prNumber = payload.pull_request?.number;
  if (!prNumber) return;

  const pr = await gh(`/pulls/${prNumber}`);
  const { method, rationale } = decide(pr);

  try {
    await gh(`/issues/${prNumber}/labels`, {
      method: 'POST',
      body: JSON.stringify({ labels: [`merge:${method.toLowerCase()}`] })
    });
  } catch (_) {}

  const body = `
<!-- ai-merge:begin -->
### 🧭 合併策略建議：${method}
理由：
- ${rationale.join('\n- ')}

注意：
- 若 CI 綠燈且已審核通過且分支最新，將由工作流程嘗試啟用 Auto-merge（僅限同倉庫分支）。
<!-- ai-merge:end -->
`;
  await upsertComment(prNumber, body, '<!-- ai-merge:begin -->');

  // Write chosen method to GITHUB_OUTPUT for downstream step
  try {
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `method=${method}\n`);
    }
  } catch (_) {}
})();