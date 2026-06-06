const PROMPT_TEMPLATE = (name, description) => `You are a conversion rate optimization expert specializing in subscription paywalls for streaming, mobile apps, and CTV platforms. Grade the following paywall on effectiveness.

Paywall name: ${name}
Description: ${description}

Score guide:
- 85-100: Highly optimized. Strong conversion likely.
- 65-84: Solid foundation. Notable gaps.
- 45-64: Mixed signals. Friction or trust issues present.
- 0-44: Significant conversion barriers. Needs rework.

Return JSON only — no markdown, no extra text, exactly this shape:
{
  "score": <integer 0-100>,
  "grade": "<A|B|C|D|F>",
  "summary": "<2-3 sentence overall verdict>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "top_recommendation": "<The single most impactful change to improve conversion>"
}`;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, description } = req.body || {};

  if (!name || !description) {
    return res.status(400).json({ error: 'name and description are required' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY is not configured' });
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: PROMPT_TEMPLATE(name, description) }],
        response_format: { type: 'json_object' },
        temperature: 0.4
      })
    });

    if (!groqRes.ok) {
      const err = await groqRes.json().catch(() => ({}));
      return res.status(groqRes.status).json({ error: err.error?.message || `Groq error ${groqRes.status}` });
    }

    const data = await groqRes.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('Empty response from Groq');

    res.json(JSON.parse(text));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
