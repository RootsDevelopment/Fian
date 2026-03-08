export class ArrowRenderer {
  constructor(boardElement) {
    this.boardElement = boardElement;

    this.svg = document.getElementById("arrow-layer");

    if (!this.svg) {
      this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

      this.svg.id = "arrow-layer";
      this.svg.style.position = "absolute";
      this.svg.style.top = "0";
      this.svg.style.left = "0";
      this.svg.style.width = "100%";
      this.svg.style.height = "100%";
      this.svg.style.pointerEvents = "none";

      boardElement.appendChild(this.svg);
    }
    const size = this.boardElement.clientWidth;

    this.svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    this.svg.setAttribute("width", size);
    this.svg.setAttribute("height", size);

    const xmlns = "http://www.w3.org/2000/svg";

    const defs = document.createElementNS(xmlns, "defs");

    const marker = document.createElementNS(xmlns, "marker");
    marker.setAttribute("id", "arrowhead");
    marker.setAttribute("markerWidth", "12");
    marker.setAttribute("markerHeight", "12");
    marker.setAttribute("refX", "6");
    marker.setAttribute("refY", "3");
    marker.setAttribute("orient", "auto");
    marker.setAttribute("markerUnits", "strokeWidth");

    const polygon = document.createElementNS(xmlns, "polygon");
    polygon.setAttribute("points", "0 0, 10 3, 0 6");
    polygon.setAttribute("fill", "black");
    polygon.setAttribute("class", "arrow-head");

    marker.appendChild(polygon);
    defs.appendChild(marker);
    this.svg.appendChild(defs);
  }

  clear() {
    this.svg.innerHTML = "";
  }

  squareToCoords(square) {
    const file = square[0];
    const rank = parseInt(square[1]);

    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

    const col = files.indexOf(file);
    const row = 8 - rank;

    return { row, col };
  }

  render(arrows) {
    arrows
      .sort((a, b) => (b.priority || 1) - (a.priority || 1))
      .forEach((arrow) => {
        if (arrow.type !== "arrow") return;

        const from = this.squareToCenter(arrow.from);
        const to = this.squareToCenter(arrow.to);

        if (!from || !to) return;

        this.drawAnimatedArrow(from, to, arrow);
      });
  }

  squareToCenter(square) {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

    const file = square[0];
    const rank = parseInt(square[1]);

    const col = files.indexOf(file);
    const row = 8 - rank;

    console.log("Square to center:", square, "->", { row, col });
    const squareEl = document.querySelector(
      `[data-row="${row}"][data-col="${col}"]`,
    );

    if (!squareEl) return null;

    const rect = squareEl.getBoundingClientRect();

    const boardRect = this.boardElement.getBoundingClientRect();

    return {
      x: rect.left - boardRect.left + rect.width / 2,
      y: rect.top - boardRect.top + rect.height / 2,
    };
  }

  drawAnimatedArrow(from, to, arrow) {
    const color = arrow.color || "rgba(0,0,255,0.7)";
    this.svg.style.setProperty("--arrow-color", color);

    const xmlns = "http://www.w3.org/2000/svg";

    const path = document.createElementNS(xmlns, "path");

    const dx = to.x - from.x;
    const dy = to.y - from.y;

    const headSize = 12;
    const headLength = Math.sqrt(dx * dx + dy * dy);

    // Normalize direction vector
    const ux = dx / headLength;
    const uy = dy / headLength;

    // Pull line endpoint back so shaft doesn't enter arrow head
    const trim = (arrow.thickness || 4) * 6;
    const endX = to.x - ux * trim;
    const endY = to.y - uy * trim;

    const pathData = `
      M ${from.x} ${from.y}
      L ${endX} ${endY}
    `;

    path.setAttribute("d", pathData);
    path.setAttribute("stroke", arrow.color || "rgba(0,0,255,0.7)");
    path.setAttribute("stroke-width", arrow.thickness || 4);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-linecap", "round");

    path.setAttribute("marker-end", "url(#arrowhead)");
    path.style.color = arrow.color || "rgba(0,0,255,0.7)";

    // Animation setup
    const length = path.getTotalLength();

    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    this.svg.appendChild(path);

    // Animate
    path.getBoundingClientRect(); // force layout

    path.style.transition = "stroke-dashoffset 0.6s ease";
    path.style.strokeDashoffset = "0";
  }
}
