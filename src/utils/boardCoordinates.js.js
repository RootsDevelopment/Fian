// utils/boardCoordinates.js
export class BoardCoordinates {
  constructor(renderOrientation = "top-to-bottom") {
    this.orientation = renderOrientation;
  }

  // Convert rendering row/col to chess notation
  toChessSquare(row, col) {
    const file = String.fromCharCode(97 + col); // a-h
    const rank = 8 - row; // Convert rendering row to chess rank
    return `${file}${rank}`;
  }

  // Get forward direction in rendering coordinates
  getForwardDirection(color) {
    // In top-to-bottom rendering:
    // White moves UP (decreasing row) toward rank 8
    // Black moves DOWN (increasing row) toward rank 1
    return color === "white" ? -1 : 1;
  }

  // Get backward direction in rendering coordinates
  getBackwardDirection(color) {
    return color === "white" ? 1 : -1;
  }

  // For arrows, ensure they point in the correct visual direction
  validateArrowDirection(from, to, color) {
    const fromRank = parseInt(from[1]);
    const toRank = parseInt(to[1]);

    // In chess: arrows should point toward the opponent's side
    // White arrows point to higher ranks, black arrows point to lower ranks
    if (color === "white" && fromRank < toRank) {
      return { from: to, to: from }; // Swap if pointing wrong way
    }
    if (color === "black" && fromRank > toRank) {
      return { from: to, to: from }; // Swap if pointing wrong way
    }
    return { from, to };
  }
}
