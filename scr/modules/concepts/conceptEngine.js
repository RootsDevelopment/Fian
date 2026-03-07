// engine.js
export class ConceptEngine {
  constructor(game) {
    this.game = game;
    this.concepts = new Map();
  }

  register(name, concept) {
    console.log(`Registering concept: ${name}`, { concept });
    this.concepts.set(name, concept);
  }

  getConceptHighlights(name) {
    const concept = this.concepts.get(name);
    // console.log(`Getting highlights for concept: ${name}`, { concept });
    if (!concept) return [];

    // Get analysis from concept
    const analysis = concept.analyze(this.game);
    console.log(`Analysis for concept ${name}:`, analysis);

    // Get visualizer from concept and convert to highlights
    const visualizer = concept.getVisualizer();

    console.log(`Visualizer for concept ${name}:`, visualizer);
    if (!visualizer || !visualizer.toHighlights) {
      console.warn(`Concept ${name} has no visualizer or toHighlights method`);
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
