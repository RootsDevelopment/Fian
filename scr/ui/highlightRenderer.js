import { HighlightType } from "../utils/highlightTypes.js";
import { ArrowRenderer } from "./arrowRenderer.js";

export class HighlightRenderer {
  constructor(arrowRenderer) {
    this.arrowRenderer = arrowRenderer;
  }

  clear() {
    document.querySelectorAll(".highlight-layer").forEach((el) => el.remove());

    const arrowLayer = document.getElementById("arrow-layer");

    if (arrowLayer) {
      // Keep defs (arrowhead definition)
      const children = Array.from(arrowLayer.children);

      children.forEach((child) => {
        if (child.tagName !== "defs") {
          child.remove();
        }
      });
    }
  }

  render(highlights) {
    this.clear();

    highlights.forEach((h) => {
      if (h.type === HighlightType.SQUARE) {
        this.renderSquareHighlight(h);
      }
      if (h.type === HighlightType.ARROW) {
        this.arrowRenderer.render([h]);
      }
    });
  }

  renderSquareHighlight(highlight) {
    highlight.squares.forEach((squareName) => {
      const { row, col } = this.squareToCoords(squareName);

      const squareEl = document.querySelector(
        `[data-row="${row}"][data-col="${col}"]`,
      );

      if (!squareEl) {
        console.warn("Square not found:", squareName);
        return;
      }

      const overlay = document.createElement("div");
      overlay.classList.add("highlight-layer");
      overlay.style.backgroundColor = highlight.color;
      overlay.style.zIndex = highlight.priority;

      squareEl.appendChild(overlay);
    });
  }

  squareToCoords(square) {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

    const file = square[0];
    const rank = parseInt(square[1]);

    const col = files.indexOf(file);
    const row = 8 - rank;

    return { row, col };
  }
}
