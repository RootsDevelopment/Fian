export class BaseConcept {
  constructor() {
    this.name = "base";
    this.visualizer = null;
  }

  analyze(game) {
    throw new Error("analyze() must be implemented");
  }

  getVisualizer() {
    return this.visualizer;
  }
}
