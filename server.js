require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

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

app.post('/api/grade', async (req, res) => {
  const { name, description } = req.body || {};

  if (!name || !description) {
    return res.status(400).json({ error: 'name and description are required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: PROMPT_TEMPLATE(name, description) }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.4 }
        })
      }
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.json().catch(() => ({}));
      return res.status(geminiRes.status).json({ error: err.error?.message || `Gemini error ${geminiRes.status}` });
    }

    const data = await geminiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response from Gemini');

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) result = JSON.parse(match[0]);
      else throw new Error('Could not parse Gemini response as JSON');
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Static files — must come after API routes
app.use(express.static(path.join(__dirname)));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`PUBLICWORKS → http://localhost:${PORT}`);
});
