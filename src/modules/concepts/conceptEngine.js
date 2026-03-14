// engine.js
export class ConceptEngine {
  constructor(game) {
    this.game = game;
    this.concepts = new Map();
  }

  register(name, concept) {
    this.concepts.set(name, concept);
  }

  getConceptHighlights(name) {
    const concept = this.concepts.get(name);
    if (!concept) return [];

    // Get analysis from concept
    const analysis = concept.analyze(this.game);

    // Get visualizer from concept and convert to highlights
    const visualizer = concept.getVisualizer();

    if (!visualizer || !visualizer.toHighlights) {
      return [];
    }
    if (!visualizer) return [];

    return visualizer.toHighlights(analysis);
  }

  getConcept(name) {
    return this.concepts.get(name);
  }

  getAllConcepts() {
    return Array.from(this.concepts.values());
  }
}
