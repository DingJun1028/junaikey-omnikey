import { gh, ghGraphQL, repoFromEnv, event, addLabels, removeLabel } from './github_api.mjs';

function decideMethod({ commits, additions, deletions, title }) {
  const delta = (additions||0) + (deletions||0);
  if (commits > 5 || delta > 1000) return 'squash';
  if (commits <= 3 && title && title.length < 80) return 'rebase';
  return 'merge';
}

async function enableAutoMerge(nodeId, method) {
  const methodEnum = { squash: 'SQUASH', rebase: 'REBASE', merge: 'MERGE' }[method] || 'SQUASH';
  const mutation = `mutation($pr:ID!, $method:PullRequestMergeMethod!){ enablePullRequestAutoMerge(input:{ pullRequestId:$pr, mergeMethod:$method }){ clientMutationId } }`;
  await ghGraphQL(mutation, { pr: nodeId, method: methodEnum });
}

async function main() {
  const ev = event();
  const pr = ev.pull_request;
  const number = pr.number;
  const { owner, repo } = repoFromEnv();

  const prData = await gh(`/repos/${owner}/${repo}/pulls/${number}`);
  const commits = prData.commits;
  const additions = prData.additions;
  const deletions = prData.deletions;
  const title = prData.title;

  const method = decideMethod({ commits, additions, deletions, title });
  // Maintain exclusive merge:* label
  const labels = (prData.labels || []).map(l => l.name);
  const toRemove = ['merge:squash','merge:rebase','merge:merge'].filter(l => l !== `merge:${method}` && labels.includes(l));
  for (const l of toRemove) { try { await removeLabel(number, l); } catch {} }
  await addLabels(number, [`merge:${method}`, 'ai']);

  // Auto-merge if conditions are met
  const sameRepo = prData.head?.repo?.full_name === prData.base?.repo?.full_name;
  const hasAutoLabel = labels.includes('automerge-candidate') || (await gh(`/repos/${owner}/${repo}/issues/${number}/labels`)).some(l=>l.name==='automerge-candidate');

  // checks success
  let checksOk = false;
  try {
    const st = await gh(`/repos/${owner}/${repo}/commits/${prData.head.sha}/status`);
    checksOk = st.state === 'success';
  } catch {}

  const approved = true; // Simplification: let repository rules enforce required reviews

  if (sameRepo && hasAutoLabel && checksOk && prData.mergeable) {
    try { await enableAutoMerge(prData.node_id, method); } catch (e) { console.warn('Auto-merge enable failed:', e.message); }
  }
}

main().catch(err => { console.error(err); process.exit(0); });