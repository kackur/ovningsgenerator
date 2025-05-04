export default async function handler(req, res) {
  // ✅ CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Missing description" });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing OpenAI API key" });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Du är en AI som ritar upp sportövningar i SVG-format baserat på textbeskrivningar.",
          },
          {
            role: "user",
            content: `Skapa en övningsskiss baserat på följande instruktion: ${description}. Svaret ska vara ren SVG-kod utan förklaringar.`,
          },
        ],
        temperature: 0.7,
      }),
    });

    const result = await openaiRes.json();

    if (openaiRes.status !== 200) {
      return res.status(500).json({ error: result?.error?.message || "OpenAI error" });
    }

    const svg = result.choices?.[0]?.message?.content;

    if (!svg || !svg.includes("<svg")) {
      return res.status(500).json({ error: "Svar saknar giltig SVG-kod." });
    }

    return res.status(200).json({ svg });
  } catch (error) {
    return res.status(500).json({ error: "Server error: " + error.message });
  }
}
