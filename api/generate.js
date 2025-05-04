console.log("🚀 Startar /api/generate");

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
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
    console.error("❌ OPENAI_API_KEY is missing.");
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
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Skapa SVG för denna fotbollsövning: ${description}`,
          },
        ],
      }),
    });

    const data = await openaiRes.json();
    console.log("✅ GPT response:", JSON.stringify(data));

    if (!data.choices || !data.choices[0].message.content) {
      return res.status(500).json({ error: "Unexpected GPT response", raw: data });
    }

    const svg = data.choices[0].message.content;
    res.status(200).json({ svg });
  } catch (error) {
    console.error("❌ GPT call failed:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}
