import {
  createArrowHighlight,
  createSquareHighlight,
} from "../../../utils/highlightTypes.js";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

function toSquare(row, col) {
  const file = FILES[col];
  const rank = 8 - row;
  return `${file}${rank}`;
}

export class PawnStructureVisualizer {
  constructor() {
    this.colors = {
      DOUBLED: {
        white: "rgba(255, 0, 0, 0.4)",
        black: "rgba(255, 100, 0, 0.4)",
      },
      ISOLATED: {
        white: "rgba(255, 255, 0, 0.4)",
        black: "rgba(255, 200, 0, 0.4)",
      },
      PASSED: {
        white: "rgba(0, 200, 0, 0.4)",
        black: "rgba(0, 200, 0, 0.4)",
      },
      BACKWARD: {
        white: "rgba(255, 80, 80, 0.4)",
        black: "rgba(255, 80, 80, 0.4)",
      },
      CHAIN: {
        white: "rgba(120, 120, 255, 0.7)",
        black: "rgba(120, 120, 255, 0.7)",
      },
    };

    this.priorities = {
      DOUBLED: 2,
      ISOLATED: 1,
      PASSED: 3,
      BACKWARD: 2,
      CHAIN: 2,
      CHAIN_BASE: 1,
    };

    this.labels = {
      DOUBLED: "Doubled Pawn",
      ISOLATED: "Isolated Pawn",
      PASSED: "Passed Pawn",
      BACKWARD: "Backward Pawn",
      CHAIN: "Pawn Chain",
      CHAIN_BASE: "Chain Base",
    };
  }

  toHighlights(analysis) {
    const highlights = [];

    // Process both colors
    highlights.push(...this._colorToHighlights(analysis.white, "white"));
    highlights.push(...this._colorToHighlights(analysis.black, "black"));

    console.log(`Generated ${highlights.length} total highlights`);
    return highlights;
  }

  _colorToHighlights(colorAnalysis, color) {
    const highlights = [];

    colorAnalysis.findings.forEach((finding) => {
      if (finding.type === "CHAIN") {
        // Chain findings become arrows
        highlights.push(
          createArrowHighlight({
            concept: "pawnStructure",
            from: toSquare(finding.position.row, finding.position.col),
            to: toSquare(finding.target.row, finding.target.col),
            color: this.colors.CHAIN[color],
            thickness: 4,
            priority: this.priorities.CHAIN,
            metadata: {
              ...finding.metadata,
              type: finding.type,
              color: color,
            },
          }),
        );

        // Optional: Add square highlight for chain base
        if (finding.metadata?.isBase) {
          highlights.push(
            createSquareHighlight({
              concept: "pawnStructure",
              squares: [toSquare(finding.position.row, finding.position.col)],
              color: this.colors.CHAIN_BASE[color],
              label: this.labels.CHAIN_BASE,
              priority: this.priorities.CHAIN_BASE,
              metadata: {
                ...finding.metadata,
                type: "CHAIN_BASE",
                color: color,
              },
            }),
          );
        }
      } else {
        // Other findings become square highlights
        highlights.push(
          createSquareHighlight({
            concept: "pawnStructure",
            squares: [toSquare(finding.position.row, finding.position.col)],
            color: this.colors[finding.type][color],
            label: this.labels[finding.type],
            priority: this.priorities[finding.type],
            metadata: {
              ...finding.metadata,
              type: finding.type,
              color: color,
            },
          }),
        );
      }
    });

    return highlights;
  }

  toAIAnalysis(analysis) {
    return {
      summary: this._generateSummary(analysis),
      details: analysis,
      naturalLanguage: this._generateNaturalLanguage(analysis),
    };
  }

  _generateSummary(analysis) {
    const summary = {
      white: { total: 0 },
      black: { total: 0 },
    };

    ["white", "black"].forEach((color) => {
      analysis[color].findings.forEach((f) => {
        summary[color][f.type] = (summary[color][f.type] || 0) + 1;
        summary[color].total++;
      });
    });

    return summary;
  }

  _generateNaturalLanguage(analysis) {
    const parts = [];

    if (analysis.white.findings.length > 0) {
      parts.push(`White: ${this._describeFindings(analysis.white)}`);
    }
    if (analysis.black.findings.length > 0) {
      parts.push(`Black: ${this._describeFindings(analysis.black)}`);
    }

    return parts.join(". ") || "No significant pawn structures detected.";
  }

  _describeFindings(colorAnalysis) {
    const descriptions = [];
    const counts = {};

    colorAnalysis.findings.forEach((f) => {
      counts[f.type] = (counts[f.type] || 0) + 1;
    });

    Object.entries(counts).forEach(([type, count]) => {
      descriptions.push(
        `${count} ${this.labels[type].toLowerCase()}${count > 1 ? "s" : ""}`,
      );
    });

    return descriptions.join(", ");
  }
}
