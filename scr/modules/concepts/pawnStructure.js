import { createSquareHighlight } from "../../utils/highlightTypes.js";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

function toSquare(row, col) {
  const file = FILES[col];
  const rank = 8 - row;
  return `${file}${rank}`;
}

export const pawnStructure = {
  analyze(game) {
    const highlights = [];
    const board = game.board;

    const whiteFiles = {};
    const blackFiles = {};

    // Step 1: Collect pawns by file
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board.getPiece(r, c);
        if (!piece) continue;

        if (piece.name === "p") {
          const fileMap = piece.color === "white" ? whiteFiles : blackFiles;

          if (!fileMap[c]) fileMap[c] = [];
          fileMap[c].push({ r, c });
        }
      }
    }

    // Step 2: Detect doubled pawns
    detectDoubled(whiteFiles, "white");
    detectDoubled(blackFiles, "black");

    // Step 3: Detect isolated pawns
    detectIsolated(whiteFiles, "white");
    detectIsolated(blackFiles, "black");

    return highlights;

    // ---------------------------
    function detectDoubled(fileMap, color) {
      Object.entries(fileMap).forEach(([file, pawns]) => {
        if (pawns.length > 1) {
          pawns.forEach((p) => {
            highlights.push(
              createSquareHighlight({
                concept: "pawnStructure",
                squares: [toSquare(p.r, p.c)],
                color:
                  color === "white"
                    ? "rgba(255, 0, 0, 0.4)"
                    : "rgba(255, 100, 0, 0.4)",
                label: "Doubled Pawn",
                priority: 2,
              }),
            );
          });
        }
      });
    }

    function detectIsolated(fileMap, color) {
      Object.entries(fileMap).forEach(([fileStr, pawns]) => {
        const file = parseInt(fileStr);

        const left = fileMap[file - 1];
        const right = fileMap[file + 1];

        if (!left && !right) {
          pawns.forEach((p) => {
            highlights.push(
              createSquareHighlight({
                concept: "pawnStructure",
                squares: [toSquare(p.r, p.c)],
                color:
                  color === "white"
                    ? "rgba(255, 255, 0, 0.4)"
                    : "rgba(255, 200, 0, 0.4)",
                label: "Isolated Pawn",
                priority: 1,
              }),
            );
          });
        }
      });
    }
  },
};
