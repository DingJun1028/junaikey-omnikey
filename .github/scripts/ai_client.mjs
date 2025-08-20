// Minimal OpenAI-compatible Chat Completions client (ESM, Node 20)
export async function chatComplete({ baseUrl, apiKey, model, messages, temperature = 0.2, max_tokens = 1200 }) {
  if (!baseUrl || !apiKey || !model) {
    return { error: 'Missing AI config', content: null };
  }
  const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, temperature, max_tokens, messages }),
  });
  if (!res.ok) {
    const txt = await res.text();
    return { error: `AI API error: ${res.status} ${txt}`, content: null };
  }
  const json = await res.json();
  const content = json.choices?.[0]?.message?.content || '';
  return { error: null, content };
}

export function sysmsg(text) { return { role: 'system', content: text }; }
export function usermsg(text) { return { role: 'user', content: text }; }