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
    // findings.push(...this._detectBackward(pawns, enemyPawns, color));
    // findings.push(...this._detectChains(pawns, color));

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
        const file = FILES[pawn.col];
        const rank = pawn.row;
        const promotionRank = color === "white" ? 8 : 1;
        const distanceToPromotion = color === "white" ? 8 - rank : rank - 1;

        findings.push({
          type: "PASSED",
          color,
          position: { row: pawn.row, col: pawn.col },
          metadata: {
            // Basic info
            type: "passedPawn",
            owner: color,
            staticEvaluation: color === "white" ? 0.5 : -0.5, // Passed pawns are usually good
            structural: false,
            dynamicPotential: true,
            difficulty: "beginner",

            // Passed pawn specific
            promotionSquare: `${file}${promotionRank}`,
            distanceToPromotion: distanceToPromotion,
            isProtected: this._isPawnProtected(pawn, pawns), // You'll need this helper
            isBlocked: this._isPawnBlocked(pawn), // You'll need this helper

            // Phase impact
            phaseImpact: {
              opening: "rare",
              middlegame: distanceToPromotion <= 3 ? "dangerous" : "potential",
              endgame: "decisive",
            },

            // Key squares
            keySquares: {
              promotion: `${file}${promotionRank}`,
              blockade: this._getBlockadeSquare(pawn, color), // Square in front
              supportPoints: this._getSupportSquares(pawn, color), // Squares where pieces can support
            },

            // Strategic plans
            plans: {
              forOwner: [
                distanceToPromotion <= 3
                  ? "Push immediately!"
                  : "Advance step by step",
                "Trade pieces to clear the path",
                "Use king to support in endgame",
                "Place rook behind the passed pawn",
              ],
              againstOwner: [
                "Blockade with knight or king",
                "Attack the base of the pawn chain",
                "Trade passed pawn for less valuable pawn",
                "Create counterplay elsewhere",
              ],
            },

            explanation: {
              beginner:
                "This pawn has no enemy pawns in front of it on its file or adjacent files. It's free to run to promotion!",
              intermediate:
                "A passed pawn is a major advantage. It can distract the opponent's pieces or promote to a queen.",
              advanced:
                "Passed pawns increase in value as pieces are traded. A protected passed pawn is especially powerful as it cannot be captured by the enemy king.",
            },

            // Key moments/patterns
            keyMoments: [
              distanceToPromotion <= 2 ? "Immediate promotion threat" : null,
              this._isPawnProtected(pawn, pawns)
                ? "Protected passed pawn - very strong"
                : null,
              `Creates a ${distanceToPromotion}-move threat`,
            ].filter(Boolean),

            // Additional metadata for rich display
            description: {
              strength: "strength",
              label: `${color === "white" ? "White" : "Black"} Passed Pawn`,
              description: `A passed pawn on ${file}${rank} with a clear path to promotion${this._isPawnProtected(pawn, pawns) ? " (protected)" : ""}.`,
              advice: this._getPassedPawnAdvice(
                pawn,
                color,
                distanceToPromotion,
              ),
            },
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
          type: "CHAIN_LINK",
          color,
          position: { row: pawn.row, col: pawn.col }, // Supporter (behind)
          target: { row: supports.row, col: supports.col }, // Supported (in front)
          metadata: {
            explanation: "Pawn supports pawn in front",
          },
        });
      }
    });
    pawns.forEach((pawn) => {
      const hasSupport = pawns.some(
        (other) =>
          other.row === pawn.row + direction && // Pawn behind
          Math.abs(other.col - pawn.col) === 1,
      );

      const isBase = !hasSupport;

      if (isBase) {
        findings.push({
          type: "CHAIN_BASE",
          color,
          position: { row: pawn.row, col: pawn.col },
          metadata: {
            explanation:
              "This is the base of the pawn chain - the most vulnerable point",
          },
        });
      }
    });

    return findings;
  }

  // Add these helper methods to your pawn structure class

  _isPawnProtected(pawn, friendlyPawns) {
    // Check if pawn is protected by another friendly pawn
    const protectionSquares = [
      { row: pawn.row - 1, col: pawn.col - 1 },
      { row: pawn.row - 1, col: pawn.col + 1 },
    ];

    return friendlyPawns.some((p) =>
      protectionSquares.some((sq) => sq.row === p.row && sq.col === p.col),
    );
  }

  _isPawnBlocked(pawn) {
    // Check if square in front is occupied
    const forwardRow = pawn.color === "white" ? pawn.row - 1 : pawn.row + 1;
    // You'll need access to the board to check if square is occupied
    return this.board[forwardRow]?.[pawn.col] !== null;
  }

  _getBlockadeSquare(pawn, color) {
    const forwardRow = color === "white" ? pawn.row - 1 : pawn.row + 1;
    return `${FILES[pawn.col]}${forwardRow}`;
  }

  _getSupportSquares(pawn, color) {
    const supportSquares = [];
    const backwardRow = color === "white" ? pawn.row + 1 : pawn.row - 1;

    // Squares where pieces can support the passed pawn
    if (pawn.col > 0) {
      supportSquares.push(`${FILES[pawn.col - 1]}${backwardRow}`);
    }
    if (pawn.col < 7) {
      supportSquares.push(`${FILES[pawn.col + 1]}${backwardRow}`);
    }

    return supportSquares;
  }

  _getPassedPawnAdvice(pawn, color, distance) {
    const baseAdvice = `Push the passed pawn! It's a major advantage.`;

    if (distance <= 2) {
      return `${baseAdvice} It's only ${distance} square${distance === 1 ? "" : "s"} from promotion - push now!`;
    }

    if (this._isPawnBlocked(pawn)) {
      return `The pawn is blocked. Trade pieces to clear the path or create a breakthrough.`;
    }

    return baseAdvice;
  }
}

// Helper for file names
const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
