export default async function handler(req, res) {
  // ✅ CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Hantera preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // ❌ Endast POST tillåtet
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Missing description" });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: `Du är en AI som tolkar fotbollsövningar och returnerar en strikt JSON-struktur enligt detta schema:

{
  "field": { "width": 40, "height": 30 },
  "players": [{ "id": "A", "x": 10, "y": 15 }, { "id": "B", "x": 30, "y": 15 }],
  "cones": [{ "x": 20, "y": 15 }],
  "movements": [{ "from": "A", "to": { "x": 20, "y": 15 } }]
}

Du returnerar endast JSON – inga förklaringar eller texter.`
          },
          {
            role: "user",
            content: description
          }
        ]
      })
    });

    const data = await response.json();

    const content = data.choices?.[0]?.message?.content || null;

    if (!content) {
      console.error("GPT-svar saknar content:", data);
      return res.status(500).json({ error: "GPT-svar saknar content", data });
    }

    res.status(200).json({ result: content });

  } catch (e) {
    console.error("Fel vid GPT-anrop eller tolkning:", e);
    res.status(500).json({ error: "Kunde inte tolka GPT-svaret", raw: e.message });
  }
}
