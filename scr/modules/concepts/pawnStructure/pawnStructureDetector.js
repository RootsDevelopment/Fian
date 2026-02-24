export class PawnStructureDetector {
  constructor(board) {
    this.board = board;
    this.whitePawns = [];
    this.blackPawns = [];
    this.whiteFileMap = new Map();
    this.blackFileMap = new Map();

    this.scanBoard();
  }

  scanBoard() {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.board.getPiece(r, c);
        if (!piece || piece.name !== "p") continue;

        const pawn = { row: r, col: c, piece };

        if (piece.color === "white") {
          this.whitePawns.push(pawn);
          this.addToFileMap(this.whiteFileMap, c, pawn);
        } else {
          this.blackPawns.push(pawn);
          this.addToFileMap(this.blackFileMap, c, pawn);
        }
      }
    }
  }

  addToFileMap(map, file, pawn) {
    if (!map.has(file)) map.set(file, []);
    map.get(file).push(pawn);
  }

  analyze() {
    return {
      white: {
        pawns: this.whitePawns,
        fileMap: this.whiteFileMap,
        findings: this.detectAll("white"),
      },
      black: {
        pawns: this.blackPawns,
        fileMap: this.blackFileMap,
        findings: this.detectAll("black"),
      },
    };
  }

  detectAll(color) {
    const findings = [];
    const pawns = color === "white" ? this.whitePawns : this.blackPawns;
    const fileMap = color === "white" ? this.whiteFileMap : this.blackFileMap;
    const enemyPawns = color === "white" ? this.blackPawns : this.whitePawns;

    findings.push(...this._detectDoubled(fileMap, color));
    findings.push(...this._detectIsolated(fileMap, color));
    findings.push(...this._detectPassed(pawns, enemyPawns, color));
    findings.push(...this._detectBackward(pawns, enemyPawns, color));
    findings.push(...this._detectChains(pawns, color));

    return findings;
  }

  _detectDoubled(fileMap, color) {
    const findings = [];

    for (const [file, pawns] of fileMap.entries()) {
      if (pawns.length > 1) {
        pawns.forEach((pawn) => {
          findings.push({
            type: "DOUBLED",
            color,
            position: { row: pawn.row, col: pawn.col },
            metadata: {
              file,
              count: pawns.length,
              explanation: `${pawns.length} pawns stacked on the ${FILES[file]}-file`,
            },
          });
        });
      }
    }

    return findings;
  }

  _detectIsolated(fileMap, color) {
    const findings = [];

    for (const [file, pawns] of fileMap.entries()) {
      const hasLeft = fileMap.has(file - 1);
      const hasRight = fileMap.has(file + 1);

      if (!hasLeft && !hasRight) {
        pawns.forEach((pawn) => {
          findings.push({
            type: "ISOLATED",
            color,
            position: { row: pawn.row, col: pawn.col },
            metadata: {
              file,
              explanation: `No friendly pawns on adjacent files (${FILES[Math.max(0, file - 1)]} or ${FILES[Math.min(7, file + 1)]})`,
            },
          });
        });
      }
    }

    return findings;
  }

  _detectPassed(pawns, enemyPawns, color) {
    const findings = [];
    const direction = color === "white" ? -1 : 1;
    const lastRank = color === "white" ? 0 : 7;

    pawns.forEach((pawn) => {
      if (this._isPassedPawn(pawn, enemyPawns, direction, lastRank)) {
        findings.push({
          type: "PASSED",
          color,
          position: { row: pawn.row, col: pawn.col },
          metadata: {
            promotionSquare: `${FILES[pawn.col]}${color === "white" ? 8 : 1}`,
            explanation: "No enemy pawns can block the path to promotion",
          },
        });
      }
    });

    return findings;
  }

  _isPassedPawn(pawn, enemyPawns, direction, lastRank) {
    const adjacentCols = [pawn.col - 1, pawn.col, pawn.col + 1];

    for (
      let row = pawn.row + direction;
      direction < 0 ? row >= lastRank : row <= lastRank;
      row += direction
    ) {
      for (const col of adjacentCols) {
        if (col < 0 || col > 7) continue;

        if (enemyPawns.some((p) => p.row === row && p.col === col)) {
          return false;
        }
      }
    }

    return true;
  }

  _detectBackward(pawns, enemyPawns, color) {
    const findings = [];
    const direction = color === "white" ? -1 : 1;
    const oneStepBack = color === "white" ? 1 : -1;

    pawns.forEach((pawn) => {
      // Check if pawn is backward
      const canBeAttacked = enemyPawns.some(
        (ep) =>
          ep.row === pawn.row + oneStepBack &&
          Math.abs(ep.col - pawn.col) === 1,
      );

      const hasSupport = pawns.some(
        (other) =>
          other.row === pawn.row + direction &&
          Math.abs(other.col - pawn.col) === 1,
      );

      const isBehindOthers = pawns.some(
        (other) =>
          other.col === pawn.col &&
          (color === "white" ? other.row < pawn.row : other.row > pawn.row),
      );

      if (canBeAttacked && !hasSupport && !isBehindOthers) {
        findings.push({
          type: "BACKWARD",
          color,
          position: { row: pawn.row, col: pawn.col },
          metadata: {
            explanation: "Pawn lacks support and can be attacked by enemy pawn",
          },
        });
      }
    });

    return findings;
  }

  _detectChains(pawns, color) {
    const findings = [];
    const direction = color === "white" ? -1 : 1;

    pawns.forEach((pawn) => {
      // Look for pawns this pawn SUPPORTS (in front)
      const supports = pawns.find(
        (other) =>
          other.row === pawn.row - direction && // Pawn in front (toward opponent side)
          Math.abs(other.col - pawn.col) === 1,
      );

      if (supports) {
        // Arrow should go FROM supporter (behind) TO supported (in front)
        findings.push({
          type: "CHAIN",
          color,
          position: { row: pawn.row, col: pawn.col }, // Supporter (behind)
          target: { row: supports.row, col: supports.col }, // Supported (in front)
          metadata: {
            explanation: "Pawn supports pawn in front",
          },
        });
      }
    });

    return findings;
  }
}

// Helper for file names
const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
