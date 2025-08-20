import { gh, repoFromEnv, event, upsertStickyComment } from './github_api.mjs';

const MARKER = '<!-- ai-progress:sticky -->';

function checklistProgress(text) {
  const all = (text.match(/- \[ \]/g) || []).length + (text.match(/- \[x\]/gi) || []).length;
  const done = (text.match(/- \[x\]/gi) || []).length;
  return { all, done, pct: all ? Math.round((done/all)*100) : 0 };
}

async function combinedStatus(owner, repo, sha) {
  try {
    const st = await gh(`/repos/${owner}/${repo}/commits/${sha}/status`);
    return st.state; // success | failure | pending | error
  } catch { return 'unknown'; }
}

async function main() {
  const ev = event();
  const pr = ev.pull_request;
  const number = pr.number;
  const { owner, repo } = repoFromEnv();

  const { all, done, pct } = checklistProgress(pr.body || '');
  const ci = await combinedStatus(owner, repo, pr.head.sha);

  // Mergeability
  const prData = await gh(`/repos/${owner}/${repo}/pulls/${number}`);
  const mergeable = prData.mergeable; // true | false | null
  const canMerge = mergeable === true ? 'yes' : (mergeable === false ? 'no' : 'unknown');

  const body = `### 📊 PR 進度追蹤\n\n- 任務完成度：${done}/${all} (${pct}%)\n- CI 狀態：${ci}\n- 可合併：${canMerge}\n\n${MARKER}`;

  await upsertStickyComment(number, MARKER, body);
  try { await gh(`/repos/${owner}/${repo}/issues/${number}/labels`, { method: 'POST', body: JSON.stringify({ labels: ['ai','status:ai-progress'] }) }); } catch {}
}

main().catch(err => { console.error(err); process.exitCode = 0; });