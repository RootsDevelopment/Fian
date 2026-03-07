import { BaseConcept } from "../baseConcept.js";
import { PawnStructureDetector } from "./pawnStructureDetector.js";
import { PawnStructureVisualizer } from "./pawnStructureVisualizer.js";

export class PawnStructureConcept extends BaseConcept {
  constructor() {
    super();
    this.name = "pawnStructure";
    this.visualizer = new PawnStructureVisualizer();
  }

  analyze(game) {
    const detector = new PawnStructureDetector(game.board);
    const analysis = detector.analyze();

    console.log("Pawn Structure Analysis:", analysis);
    return analysis;
  }
}

export const pawnStructure = new PawnStructureConcept();
