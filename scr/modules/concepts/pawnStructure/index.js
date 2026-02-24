import { PawnStructureDetector } from "./pawnStructureDetector.js";
import { PawnStructureVisualizer } from "./pawnStructureVisualizer.js";

export const pawnStructure = {
  analyze(game) {
    console.log("PawnStructure analysis running ...");

    const detector = new PawnStructureDetector(game.board);
    const visualizer = new PawnStructureVisualizer();
    const analysis = detector.analyze();

    console.log("PawnStructure analysis complete:", analysis);
    return visualizer.toHighlights(analysis);
  },
};
