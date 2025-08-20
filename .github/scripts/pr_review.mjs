import { chatComplete, sysmsg, usermsg } from './ai_client.mjs';
import { gh, repoFromEnv, event, upsertStickyComment } from './github_api.mjs';

const AI_MARKER = '<!-- ai-review:sticky -->';

async function main() {
  const ev = event();
  const pr = ev.pull_request;
  const number = pr.number || ev.number || ev.issue?.number;
  const { owner, repo } = repoFromEnv();

  // Collect context
  const files = await gh(`/repos/${owner}/${repo}/pulls/${number}/files?per_page=200`);
  const commits = await gh(`/repos/${owner}/${repo}/pulls/${number}/commits?per_page=250`);

  const changedList = files.map(f => `- ${f.filename} (+${f.additions}/-${f.deletions})`).join('\n');
  const commitSumm = commits.map(c => `- ${c.sha.slice(0,7)} ${c.commit.message.split('\n')[0]}`).join('\n');

  const aiBase = process.env.AI_API_BASE;
  const aiKey = process.env.AI_API_KEY;
  const aiModel = process.env.AI_MODEL;

  let content = '';
  let usedAI = false;

  if (aiBase && aiKey && aiModel) {
    const { error, content: aiOut } = await chatComplete({
      baseUrl: aiBase,
      apiKey: aiKey,
      model: aiModel,
      temperature: 0.2,
      messages: [
        sysmsg('You are a senior code reviewer. Produce concise, actionable review with sections: Summary, Strengths, Risks, Must-fix, Suggestions, Test gaps.'),
        usermsg(`PR Title: ${pr.title}\n\nPR Body (truncated):\n${(pr.body || '').slice(0, 4000)}\n\nChanged files:\n${changedList}\n\nCommits:\n${commitSumm}`),
      ],
    });
    if (!error && aiOut) {
      content = aiOut;
      usedAI = true;
    }
  }

  if (!content) {
    content = [
      'AI Review is inactive (missing AI_API_KEY or provider error).',
      '',
      'Changed files:',
      changedList || '(none)',
      '',
      'Commits:',
      commitSumm || '(none)'
    ].join('\n');
  }

  const body = [
    '### 🤖 AI Review',
    '',
    usedAI ? '_Model-backed review_' : '_Placeholder review (no AI secrets available)_',
    '',
    '---',
    '',
    content,
    '',
    AI_MARKER,
  ].join('\n');

  await upsertStickyComment(number, AI_MARKER, body);
  // Optionally label
  try { await gh(`/repos/${owner}/${repo}/issues/${number}/labels`, { method: 'POST', body: JSON.stringify({ labels: ['ai','status:ai-review'] }) }); } catch {}
}

main().catch(err => {
  console.error(err);
  process.exitCode = 0; // do not fail CI for reviewer
});