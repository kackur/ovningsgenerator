const svg = document.getElementById("field");

function draw(data) {
  svg.innerHTML = ""; // Rensa tidigare plan

  const scaleX = 1;
  const scaleY = 1;

  function drawCircle(x, y, className) {
    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("cx", x);
    c.setAttribute("cy", y);
    c.setAttribute("r", 2);
    c.setAttribute("class", className);
    svg.appendChild(c);
  }

  function drawLine(x1, y1, x2, y2) {
    const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
    l.setAttribute("x1", x1);
    l.setAttribute("y1", y1);
    l.setAttribute("x2", x2);
    l.setAttribute("y2", y2);
    l.setAttribute("class", "movement");
    svg.appendChild(l);
  }

  // Rita spelare
  data.players.forEach(p => {
    drawCircle(p.x * scaleX, p.y * scaleY, `player ${p.team}`);
  });

  // Rita koner
  data.cones.forEach(c => {
    drawCircle(c.x * scaleX, c.y * scaleY, "cone");
  });

  // Rita rörelser
  data.movements.forEach(m => {
    const from = data.players.find(p => p.id === m.from);
    if (from) {
      drawLine(from.x * scaleX, from.y * scaleY, m.to.x * scaleX, m.to.y * scaleY);
    }
  });
}

async function generate() {
  const description = document.getElementById("description").value;

  const response = await fetch("https://ovningsgenerator.vercel.app/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description })
  });

  const data = await response.json();

  try {
    const parsed = JSON.parse(data.result);
    draw(parsed);
  } catch (e) {
    alert("Kunde inte tolka svaret från GPT:\n\n" + data.result);
  }
}
