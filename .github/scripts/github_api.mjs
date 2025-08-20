// Lightweight GitHub REST/GraphQL helpers using built-in fetch (Node 20)
const apiUrl = process.env.GITHUB_API_URL || 'https://api.github.com';
const token = process.env.GITHUB_TOKEN;

if (!token) throw new Error('Missing GITHUB_TOKEN');

export async function gh(path, init = {}) {
  const res = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      'authorization': `Bearer ${token}`,
      'content-type': 'application/json',
      'accept': 'application/vnd.github+json',
      ...(init.headers || {}),
    },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`GitHub API ${res.status} ${path}: ${t}`);
  }
  return res.json();
}

export async function ghGraphQL(query, variables = {}) {
  const res = await fetch(`${apiUrl}/graphql`, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  return json.data;
}

export function repoFromEnv() {
  const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');
  return { owner, repo };
}

import { readFileSync } from 'fs';

export function event() {
  return JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
}

export async function upsertStickyComment(issue_number, marker, body) {
  const { owner, repo } = repoFromEnv();
  const comments = await gh(`/repos/${owner}/${repo}/issues/${issue_number}/comments`);
  const existing = comments.find(c => c.body && c.body.includes(marker));
  const payload = { body };
  if (existing) {
    await gh(`/repos/${owner}/${repo}/issues/comments/${existing.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  } else {
    await gh(`/repos/${owner}/${repo}/issues/${issue_number}/comments`, { method: 'POST', body: JSON.stringify(payload) });
  }
}

export async function addLabels(issue_number, labels) {
  const { owner, repo } = repoFromEnv();
  return gh(`/repos/${owner}/${repo}/issues/${issue_number}/labels`, { method: 'POST', body: JSON.stringify({ labels }) });
}

export async function setLabels(issue_number, labels) {
  const { owner, repo } = repoFromEnv();
  return gh(`/repos/${owner}/${repo}/issues/${issue_number}/labels`, { method: 'PUT', body: JSON.stringify({ labels }) });
}

export async function removeLabel(issue_number, name) {
  const { owner, repo } = repoFromEnv();
  return gh(`/repos/${owner}/${repo}/issues/${issue_number}/labels/${encodeURIComponent(name)}`, { method: 'DELETE' });
}