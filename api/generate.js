export default async function handler(req, res) {
  // ✅ CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Preflight request hantering
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

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Du är en AI som tolkar fotbollsövningar och returnerar strikt JSON enligt detta schema: { field: { width, height }, players: [...], cones: [...], movements: [...] }"
        },
        {
          role: "user",
          content: description
        }
      ],
      temperature: 0.2
    })
  });

  const data = await response.json();

  try {
    const json = data.choices[0].message.content;
    res.status(200).json({ result: json });
  } catch (e) {
    res.status(500).json({ error: "Kunde inte tolka GPT-svaret" });
  }
}
