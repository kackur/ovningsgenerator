// Uppdaterad generate.js med tydlig felhantering och anpassning för sk-proj API-nyckel

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

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

  if (!apiKey || !apiKey.startsWith("sk-")) {
    return res.status(500).json({ error: "Invalid or missing OpenAI API key." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Du är en assistent som hjälper fotbollstränare skapa tydliga övningsskisser. Svara ENDAST med SVG-kod som visar övningen grafiskt."
          },
          {
            role: "user",
            content: description
          }
        ],
        temperature: 0.3
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: data?.error?.message || "Unknown error from OpenAI"
      });
    }

    const svgResponse = data.choices?.[0]?.message?.content;
    if (!svgResponse || !svgResponse.includes("<svg")) {
      return res.status(500).json({ error: "GPT svarade utan SVG-data" });
    }

    res.status(200).json({ svg: svgResponse });
  } catch (err) {
    res.status(500).json({ error: err.message || "Unexpected server error" });
  }
}
