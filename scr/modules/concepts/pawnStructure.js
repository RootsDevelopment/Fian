import {
  createArrowHighlight,
  createSquareHighlight,
} from "../../utils/highlightTypes.js";

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

    const whitePawns = [];
    const blackPawns = [];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board.getPiece(r, c);
        if (!piece || piece.name !== "p") continue;

        if (piece.color === "white") whitePawns.push({ r, c });
        else blackPawns.push({ r, c });
      }
    }

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

    detectDoubled(whiteFiles, "white");
    detectDoubled(blackFiles, "black");

    detectIsolated(whiteFiles, "white");
    detectIsolated(blackFiles, "black");

    detectPassedPawn(whitePawns, "white");
    detectPassedPawn(blackPawns, "black");

    detectBackwardPawn(whitePawns, "white");
    detectBackwardPawn(blackPawns, "black");

    detectPawnChains(whitePawns, "white");
    detectPawnChains(blackPawns, "black");

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

    function isPassedPawn(pawn, color) {
      const direction = color === "white" ? -1 : 1;

      const enemyPawns = color === "white" ? blackPawns : whitePawns;

      const promotionRank = color === "white" ? 0 : 7;

      const adjacentFiles = [pawn.c, pawn.c - 1, pawn.c + 1];

      for (
        let rank = pawn.r + direction;
        color === "white" ? rank >= promotionRank : rank <= promotionRank;
        rank += direction
      ) {
        for (const file of adjacentFiles) {
          if (enemyPawns.some((p) => p.r === rank && p.c === file)) {
            return false;
          }
        }
      }

      return true;
    }

    function detectPassedPawn(pawns, color) {
      pawns.forEach((p) => {
        if (isPassedPawn(p, color)) {
          highlights.push(
            createSquareHighlight({
              concept: "pawnStructure",
              squares: [toSquare(p.r, p.c)],
              color: "rgba(0,200,0,0.4)",
              label: "Passed Pawn",
              priority: 3,
            }),
          );
        }
      });
    }

    function detectBackwardPawn(pawns, color) {
      pawns.forEach((p) => {
        const direction = color === "white" ? -1 : 1;

        const forwardRow = p.r + direction;

        const neighbors = pawns.filter(
          (other) => Math.abs(other.c - p.c) === 1,
        );

        const supported = neighbors.some((n) => n.r === forwardRow);

        if (!supported) {
          highlights.push(
            createSquareHighlight({
              concept: "pawnStructure",
              squares: [toSquare(p.r, p.c)],
              color: "rgba(255,80,80,0.4)",
              label: "Backward Pawn",
              priority: 2,
            }),
          );
        }
      });
    }

    function detectPawnChains(pawns, color) {
      const direction = color === "white" ? -1 : 1;

      pawns.forEach((p) => {
        const chainSupport = pawns.find(
          (other) =>
            other.r === p.r + direction && Math.abs(other.c - p.c) === 1,
        );

        if (chainSupport) {
          highlights.push(
            createArrowHighlight({
              concept: "pawnStructure",
              from: toSquare(p.r, p.c),
              to: toSquare(chainSupport.r, chainSupport.c),
              color: "rgba(120,120,255,0.7)",
              thickness: 3,
              priority: 2,
            }),
          );
        }
      });
    }
  },
};
