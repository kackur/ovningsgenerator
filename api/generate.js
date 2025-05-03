async function generate() {
  const description = document.getElementById("description").value;

  const response = await fetch("https://DITT-VERCEL-NAMN.vercel.app/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description })
  });

  const data = await response.json();
  try {
    const parsed = JSON.parse(data.result);
    draw(parsed);
  } catch (e) {
    alert("Kunde inte tolka svaret: " + data.result);
  }
}
