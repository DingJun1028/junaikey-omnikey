#!/usr/bin/env node
import { chat } from './ai_client.mjs';
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

function limitText(s, max = 12000) {
  if (!s) return '';
  if (s.length <= max) return s;
  return s.slice(0, max) + `\n\n[...truncated ${s.length - max} chars]`;
}

function buildPrompt({ pr, files }) {
  const filesSummary = files.map(f => {
    const patch = f.patch || '';
    const header = `File: ${f.filename} (${f.status}, +${f.additions}/-${f.deletions})`;
    const body = limitText(patch, 6000);
    return `${header}\n${body}`;
  }).join('\n\n---\n\n');

  const system = `You are an expert code reviewer. Provide actionable, prioritized review for pull requests. 
- Focus on correctness, security, performance, test coverage, readability.
- If you find must-fix issues, list them clearly.
- Suggest concrete diffs or code snippets when possible.
- Use concise bullet points. 
- Return sections: Summary, Strengths, Risks, Must-fix, Suggestions, Test gaps.`;

  const user = `PR Title: ${pr.title}
Author: ${pr.user?.login}
Base: ${pr.base?.ref} <- Head: ${pr.head?.ref}
Commits: ${pr.commits}, Files changed: ${pr.changed_files}, +${pr.additions}/-${pr.deletions}

PR Body:
${limitText(pr.body || '', 4000)}

Diff Patches:
${filesSummary}`;

  return { system, user };
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
  const eventPath = process.env.GITHUB_EVENT_PATH;
  const payload = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
  const prNumber = payload.pull_request?.number;
  if (!prNumber) {
    console.log('Not a pull_request event');
    return;
  }

  const pr = await gh(`/pulls/${prNumber}`);
  const files = await gh(`/pulls/${prNumber}/files?per_page=100`);

  const { system, user } = buildPrompt({ pr, files });

  let analysis = 'AI review unavailable (no API key).';
  try {
    const resp = await chat([
      { role: 'system', content: system },
      { role: 'user', content: user }
    ]);
    analysis = resp.content;
  } catch (e) {
    analysis = `AI error: ${(e && e.message) || String(e)}`;
  }

  const marker = '<!-- ai-review:begin -->';
  const body = `${marker}
### 🤖 AI Review

${analysis}

— AI Reviewer
<!-- ai-review:end -->`;

  await upsertComment(prNumber, body, marker);

  // Optional: Add 'ai' label
  try {
    await gh(`/issues/${prNumber}/labels`, {
      method: 'POST',
      body: JSON.stringify({ labels: ['ai'] })
    });
  } catch (_) {}
})();