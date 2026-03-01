import { HighlightType } from "../utils/highlightTypes.js";

export class HighlightRenderer {
  constructor(arrowRenderer) {
    this.arrowRenderer = arrowRenderer;
    this.boardElement = arrowRenderer.boardElement;
  }

  clear() {
    document
      .querySelectorAll("[data-highlight], .highlight-layer")
      .forEach((el) => el.remove());

    const arrowLayer = document.getElementById("arrow-layer");
    if (arrowLayer) {
      const children = Array.from(arrowLayer.children);
      children.forEach((child) => {
        if (child.tagName !== "defs") {
          child.remove();
        }
      });
    }
  }

  renderMany(highlights) {
    // console.log("renderMany called with", highlights, "highlights");

    this.clear();

    if (!this.boardElement) {
      console.error("boardElement is not set in HighlightRenderer");
      return;
    }

    highlights.forEach((highlight, index) => {
      if (highlight.type === HighlightType.ARROW || highlight.from) {
        this.arrowRenderer.render([highlight]);
      } else {
        this.renderSquareHighlight(highlight, index);
      }
    });
  }

  renderSquareHighlight(highlight, index) {
    if (!highlight.squares || !Array.isArray(highlight.squares)) {
      console.warn("Invalid square highlight:", highlight);
      return;
    }

    highlight.squares.forEach((squareName) => {
      // Try to find by data-square first
      let squareElement = document.querySelector(
        `[data-square="${squareName}"]`,
      );

      // If not found, try to find by row/col
      if (!squareElement) {
        const { row, col } = this.squareToCoords(squareName);
        squareElement = document.querySelector(
          `[data-row="${row}"][data-col="${col}"]`,
        );
      }

      if (!squareElement) {
        console.warn(
          `Square not found: ${squareName} (tried data-square and data-row/data-col)`,
        );

        // Debug: Log available squares
        const allSquares = document.querySelectorAll("[data-row]");
        // console.log(
        //   "Available squares:",
        //   Array.from(allSquares).map((el) => ({
        //     row: el.getAttribute("data-row"),
        //     col: el.getAttribute("data-col"),
        //   })),
        // );

        return;
      }

      // Remove any existing highlight on this square
      const existingHighlight = squareElement.querySelector("[data-highlight]");
      if (existingHighlight) {
        existingHighlight.remove();
      }

      const overlay = document.createElement("div");
      overlay.setAttribute("data-highlight", "true");
      overlay.setAttribute("data-highlight-index", index);
      overlay.setAttribute(
        "data-concept",
        highlight.concept || "pawnStructure",
      );
      overlay.setAttribute("data-type", highlight.metadata?.type || "");

      overlay.classList.add("highlight-layer");
      overlay.style.backgroundColor = highlight.color || "rgba(255,255,0,0.3)";
      overlay.style.zIndex = highlight.priority || 10;
      overlay.style.pointerEvents = "all";
      overlay.style.cursor = "help";
      overlay.style.position = "absolute";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.borderRadius = "4px";

      squareElement.appendChild(overlay);
      squareElement.style.position = "relative";
    });
  }

  render(highlights) {
    if (Array.isArray(highlights)) {
      this.renderMany(highlights);
    } else if (highlights.type === HighlightType.SQUARE) {
      this.renderSquareHighlight(highlights, 0);
    } else if (highlights.type === HighlightType.ARROW) {
      this.arrowRenderer.render([highlights]);
    }
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
