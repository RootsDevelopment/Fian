// handlers/analyzeHandler.js
export const analyzeHandler = {
  analyze(appState) {
    if (!appState.engine || !appState.game) return [];

    console.log("🔍 Analyzing position...");

    // Get all concepts from engine
    const concepts = [];

    // For now, just get pawn structure
    const pawnAnalysis = appState.engine.getConceptHighlights("pawnStructure");

    // Format pawn structure insights
    if (pawnAnalysis) {
      // Passed pawns
      if (pawnAnalysis.passed && pawnAnalysis.passed.length > 0) {
        pawnAnalysis.passed.forEach((pawn) => {
          concepts.push(this.formatInsight(pawn, "passedPawn", pawnAnalysis));
        });
      }

      // Isolated pawns
      if (pawnAnalysis.isolated && pawnAnalysis.isolated.length > 0) {
        pawnAnalysis.isolated.forEach((pawn) => {
          concepts.push(this.formatInsight(pawn, "isolatedPawn", pawnAnalysis));
        });
      }

      // Doubled pawns
      if (pawnAnalysis.doubled && pawnAnalysis.doubled.length > 0) {
        pawnAnalysis.doubled.forEach((pawn) => {
          concepts.push(this.formatInsight(pawn, "doubledPawn", pawnAnalysis));
        });
      }

      // Backward pawns
      if (pawnAnalysis.backward && pawnAnalysis.backward.length > 0) {
        pawnAnalysis.backward.forEach((pawn) => {
          concepts.push(this.formatInsight(pawn, "backwardPawn", pawnAnalysis));
        });
      }
    }

    // Sort by priority/evaluation
    concepts.sort(
      (a, b) =>
        (b.metadata?.staticEvaluation || 0) -
        (a.metadata?.staticEvaluation || 0),
    );

    // Store in appState
    appState.currentInsights = concepts;

    // Update UI
    if (appState.topInsightBar) {
      appState.topInsightBar.show(concepts);
    }

    if (appState.insightList) {
      appState.insightList.updateInsights(concepts);
    }

    return concepts;
  },

  formatInsight(pawn, type, fullAnalysis) {
    const isWhite = pawn.color === "white";
    const square = this.coordsToSquare(pawn.row, pawn.col);
    const evalValue = this.getEvaluation(pawn, type);

    return {
      id: `${type}-${square}-${Date.now()}`,
      concept: "pawnStructure",
      type: "square",
      squares: [square],
      color: this.getColor(type),
      label: this.getLabel(type),
      priority: this.getPriority(type),
      metadata: {
        type: type.toUpperCase(),
        owner: pawn.color,
        square: square,
        staticEvaluation: evalValue,
        promotionSquare:
          type === "passedPawn" ? this.getPromotionSquare(pawn) : undefined,
        keySquares: this.getKeySquares(pawn, type),
        plans: this.getPlans(pawn, type),
        explanation: this.getExplanation(type),
        description: {
          strength: this.getStrength(type),
          description: this.getDescription(type),
          advice: this.getAdvice(type),
        },
      },
      description: {
        strength: this.getStrength(type),
        description: this.getDescription(type),
        advice: this.getAdvice(type),
      },
    };
  },

  coordsToSquare(row, col) {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const rank = 8 - row;
    return files[col] + rank;
  },

  getColor(type) {
    const colors = {
      passedPawn: "rgba(76, 175, 80, 0.5)",
      isolatedPawn: "rgba(244, 135, 113, 0.5)",
      doubledPawn: "rgba(220, 220, 170, 0.5)",
      backwardPawn: "rgba(156, 220, 254, 0.5)",
    };
    return colors[type] || "rgba(255, 255, 0, 0.3)";
  },

  getLabel(type) {
    const labels = {
      passedPawn: "Passed Pawn",
      isolatedPawn: "Isolated Pawn",
      doubledPawn: "Doubled Pawn",
      backwardPawn: "Backward Pawn",
    };
    return labels[type] || "Pawn Structure";
  },

  getPriority(type) {
    const priorities = {
      passedPawn: 3,
      isolatedPawn: 2,
      doubledPawn: 1,
      backwardPawn: 1,
    };
    return priorities[type] || 1;
  },

  getStrength(type) {
    const strengths = {
      passedPawn: "strength",
      isolatedPawn: "weakness",
      doubledPawn: "weakness",
      backwardPawn: "weakness",
    };
    return strengths[type] || "info";
  },

  getDescription(type) {
    const descriptions = {
      passedPawn:
        "A passed pawn has no enemy pawns blocking its path to promotion.",
      isolatedPawn:
        "An isolated pawn has no friendly pawns on adjacent files, making it hard to defend.",
      doubledPawn:
        "Doubled pawns are stacked on the same file, limiting their control and mobility.",
      backwardPawn:
        "A backward pawn has fallen behind and cannot be advanced safely.",
    };
    return descriptions[type] || "A pawn structure concept.";
  },

  getAdvice(type) {
    const advice = {
      passedPawn:
        "Push the passed pawn! It becomes stronger as pieces are traded.",
      isolatedPawn:
        "Blockade the square in front of the pawn to prevent its advance.",
      doubledPawn: "Try to trade them or use them as outposts for pieces.",
      backwardPawn:
        "Attack the base of the pawn chain to exploit this weakness.",
    };
    return advice[type] || "";
  },

  getExplanation(type) {
    const explanations = {
      passedPawn: {
        beginner:
          "This pawn has no enemy pawns in front of it. It can run to the end of the board to become a queen!",
        intermediate:
          "A passed pawn is a major advantage. It can distract the opponent or promote.",
        advanced:
          "Passed pawns increase in value as pieces are traded. A protected passed pawn is especially powerful.",
      },
      isolatedPawn: {
        beginner:
          "This pawn has no friends on the files next to it. It might be hard to protect.",
        intermediate:
          "Isolated pawns are structural weaknesses that can be targeted by your opponent.",
        advanced:
          "The square in front of an isolated pawn can become an excellent outpost for an enemy knight.",
      },
    };
    return explanations[type] || { beginner: "A pawn structure concept." };
  },

  getEvaluation(pawn, type) {
    // Simple evaluation based on type and position
    if (type === "passedPawn") return 0.5;
    if (type === "isolatedPawn") return -0.3;
    if (type === "doubledPawn") return -0.2;
    if (type === "backwardPawn") return -0.2;
    return 0;
  },

  getPromotionSquare(pawn) {
    const file = ["a", "b", "c", "d", "e", "f", "g", "h"][pawn.col];
    const promotionRank = pawn.color === "white" ? 8 : 1;
    return file + promotionRank;
  },

  getKeySquares(pawn, type) {
    const squares = {};
    const file = ["a", "b", "c", "d", "e", "f", "g", "h"][pawn.col];

    if (type === "passedPawn") {
      squares.promotion = this.getPromotionSquare(pawn);

      // Blockade square
      const blockadeRank = pawn.color === "white" ? pawn.row + 1 : pawn.row - 1;
      squares.blockade = file + (8 - blockadeRank);

      // Support points
      squares.supportPoints = [
        file + (pawn.color === "white" ? pawn.row + 2 : pawn.row - 2),
      ];
    }

    return squares;
  },

  getPlans(pawn, type) {
    const owner = pawn.color;
    const opponent = owner === "white" ? "black" : "white";

    if (type === "passedPawn") {
      return {
        forOwner: [
          "Advance the pawn step by step",
          "Support the pawn with your king in the endgame",
          "Trade pieces to clear the path to promotion",
          "Place a rook behind the passed pawn",
        ],
        againstOwner: [
          "Blockade the pawn with a knight or king",
          "Attack the base of the pawn chain",
          "Create counterplay on the other side of the board",
        ],
      };
    }

    if (type === "isolatedPawn") {
      return {
        forOwner: [
          "Keep the pawn protected by pieces",
          "Use the square in front as an outpost",
          "Trade pieces to reduce attacking chances",
          "Push the pawn if it can be traded",
        ],
        againstOwner: [
          "Blockade the square in front of the pawn",
          "Attack the pawn with pieces",
          "Place a knight on the blockade square",
          "Open the position to attack the pawn",
        ],
      };
    }

    return {
      forOwner: ["Assess the position carefully"],
      againstOwner: ["Exploit the structural weakness"],
    };
  },
};
