/* Generic OpenAI-compatible chat client via env:
   - AI_API_BASE (e.g. https://api.openai.com/v1)
   - AI_API_KEY
   - AI_MODEL (e.g. sonar)
*/
export async function chat(messages, opts = {}) {
  const base = process.env.AI_API_BASE || 'https://api.openai.com/v1';
  const key = process.env.AI_API_KEY;
  const model = opts.model || process.env.AI_MODEL || 'sonar';
  const temperature = opts.temperature ?? 0.2;

  if (!key) {
    return { content: 'AI_API_KEY not set. Skipping AI analysis.', skipped: true };
  }

  const url = base.replace(/\/$/, '') + '/chat/completions';
  const payload = {
    model,
    temperature,
    messages
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`AI API error ${resp.status}: ${text}`);
  }
  const data = await resp.json();
  const content = data.choices?.[0]?.message?.content ?? '';
  return { content, skipped: false };
}