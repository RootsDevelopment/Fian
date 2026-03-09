import { BoardCoordinates } from "../../../utils/boardCoordinates.js.js";
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
    this.coords = new BoardCoordinates("top-to-bottom");
    this.colors = {
      DOUBLED: {
        white: "rgba(255, 80, 80, 0.5)", // Strong red
        black: "rgba(200, 50, 50, 0.5)",
      },
      ISOLATED: {
        white: "rgba(255, 200, 0, 0.5)", // Amber
        black: "rgba(200, 150, 0, 0.5)",
      },
      PASSED: {
        white: "rgba(50, 200, 50, 0.5)",
        black: "rgba(30, 150, 30, 0.5)",
      },
      BACKWARD: {
        white: "rgba(255, 100, 0, 0.5)",
        black: "rgba(200, 80, 0, 0.5)",
      },
      CHAIN_LINK: {
        white: "rgba(100, 100, 255, 0.6)",
        black: "rgba(70, 70, 200, 0.6)",
      },
      CHAIN_BASE: {
        white: "rgba(150, 0, 150, 0.5)",
        black: "rgba(120, 0, 120, 0.5)",
      },
    };

    this.priorities = {
      DOUBLED: 2,
      ISOLATED: 1,
      PASSED: 3,
      BACKWARD: 2,
      CHAIN_LINK: 2,
      CHAIN_BASE: 3,
    };

    this.labels = {
      DOUBLED: "Doubled Pawns",
      ISOLATED: "Isolated Pawn",
      PASSED: "Passed Pawn",
      BACKWARD: "Backward Pawn",
      CHAIN_LINK: "Chain Support",
      CHAIN_BASE: "Chain Base",
    };

    this.descriptions = {
      DOUBLED: {
        strength: "weakness",
        description:
          "Two pawns on the same file cannot protect each other and are vulnerable to attack.",
        advice:
          "Try to trade one of the doubled pawns or use them to control key squares.",
      },
      ISOLATED: {
        strength: "weakness",
        description:
          "An isolated pawn has no friendly pawns on adjacent files, making it hard to defend.",
        advice:
          "Blockade the square in front of the pawn to prevent its advance.",
      },
      PASSED: {
        strength: "strength",
        description:
          "A passed pawn has no enemy pawns blocking its path to promotion.",
        advice: "Push the passed pawn! It's a major endgame advantage.",
      },
      BACKWARD: {
        strength: "weakness",
        description:
          "A backward pawn lags behind and cannot be defended by friendly pawns.",
        advice:
          "Attack the square in front of the backward pawn - it's a permanent weakness.",
      },
      CHAIN_LINK: {
        strength: "strength",
        description:
          "Pawns in a chain protect each other, creating a strong formation.",
        advice: "Attack the base of the chain, defend the tip.",
      },
      CHAIN_BASE: {
        strength: "weakness",
        description:
          "The base of the pawn chain is vulnerable as it has no pawn protection.",
        advice:
          "This is the critical point - attack here to collapse the chain.",
      },
    };
  }

  toHighlights(analysis) {
    const highlights = [];

    highlights.push(...this.colorToHighlights(analysis.white, "white"));
    // highlights.push(...this.colorToHighlights(analysis.black, "black"));

    return highlights;
  }

  getEducationalContent(highlight) {
    const type = highlight.metadata?.type;

    if (!type || !this.descriptions[type]) return null;

    return {
      ...this.descriptions[type],
      type: type,
    };
  }

  getLegendData() {
    const legendItems = [];

    Object.keys(this.descriptions).forEach((type) => {
      legendItems.push({
        type,
        label: this.labels[type],
        color: this.colors[type]?.white, // Use white as reference color
        description: this.descriptions[type].description,
        strength: this.descriptions[type].strength,
        advice: this.descriptions[type].advice,
      });
    });

    return legendItems;
  }

  colorToHighlights(colorAnalysis, color) {
    const highlights = [];

    colorAnalysis.findings.forEach((finding) => {
      const descriptionObj = this.descriptions[finding.type] || {
        strength: "info",
        description: "No description available",
        advice: "",
      };

      if (finding.type === "CHAIN_LINK") {
        const fromSquare = toSquare(finding.position.row, finding.position.col);
        const toSquare_ = toSquare(finding.target.row, finding.target.col);

        // Parse ranks
        const fromRank = parseInt(fromSquare[1]);
        const toRank = parseInt(toSquare_[1]);

        let validFrom, validTo;

        if (color === "white") {
          if (fromRank < toRank) {
            validFrom = fromSquare;
            validTo = toSquare_;
          } else {
            validFrom = toSquare_;
            validTo = fromSquare;
          }
        } else {
          if (fromRank > toRank) {
            validFrom = fromSquare;
            validTo = toSquare_;
          } else {
            validFrom = toSquare_;
            validTo = fromSquare;
          }
        }

        highlights.push(
          createArrowHighlight({
            concept: "pawnStructure",
            from: validFrom,
            to: validTo,
            color: this.colors.CHAIN_LINK[color],
            thickness: 4,
            priority: this.priorities.CHAIN_LINK,
            metadata: {
              ...finding.metadata,
              type: finding.type,
              color: color,
            },
            description: descriptionObj,
            label: this.labels[finding.type],
          }),
        );

        if (finding.metadata?.isBase) {
          highlights.push(
            createSquareHighlight({
              concept: "pawnStructure",
              squares: [
                this.coords.toChessSquare(
                  finding.position.row,
                  finding.position.col,
                ),
              ],
              color: this.colors.CHAIN_BASE[color],
              label: this.labels.CHAIN_BASE,
              priority: this.priorities.CHAIN_BASE,
              metadata: {
                ...finding.metadata,
                type: "CHAIN_BASE",
                color: color,
              },
              description: descriptionObj,
              label: this.labels[finding.type],
            }),
          );
        }
      } else {
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
            description: descriptionObj,
          }),
        );
      }
    });

    return highlights;
  }
}
