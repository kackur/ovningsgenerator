const svg = document.getElementById("field");

const demoData = {
  field: { width: 100, height: 60 },
  players: [
    { id: "A", team: "blue", x: 10, y: 30 },
    { id: "B", team: "red", x: 90, y: 30 }
  ],
  cones: [
    { x: 50, y: 30 }
  ],
  movements: [
    { from: "A", to: { x: 50, y: 30 }, type: "dribble" }
  ]
};

function draw(data) {
  svg.innerHTML = ""; // Töm tidigare SVG

  const scaleX = 1, scaleY = 1;

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

  data.players.forEach(p => {
    drawCircle(p.x * scaleX, p.y * scaleY, `player ${p.team}`);
  });

  data.cones.forEach(c => {
    drawCircle(c.x * scaleX, c.y * scaleY, "cone");
  });

  data.movements.forEach(m => {
    const from = data.players.find(p => p.id === m.from);
    if (from) {
      drawLine(from.x * scaleX, from.y * scaleY, m.to.x * scaleX, m.to.y * scaleY);
    }
  });
}

function generate() {
  // Här ersätter vi med GPT-anrop senare
  draw(demoData);
}
