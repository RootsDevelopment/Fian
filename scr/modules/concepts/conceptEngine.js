export class ConceptEngine {
  constructor(game) {
    this.game = game;
    this.concepts = new Map();
    this.cache = new Map();
    this.cacheTimeout = 1000;
  }

  register(name, concept) {
    this.concepts.set(name, concept);
  }

  getConceptHighlights(name) {
    const concept = this.concepts.get(name);
    if (!concept) return [];

    console.log(`Analyzing ${name}...`);
    const highlights = concept.analyze(this.game);

    return highlights;
  }

  getConceptAnalysis(name) {
    const concept = this.concepts.get(name);
    if (!concept) return null;

    const highlights = concept.analyze(this.game);
    return {
      highlights,
      summary: this.summarizeHighlights(highlights),
      timestamp: Date.now(),
    };
  }

  summarizeHighlights(highlights) {
    const summary = {};
    highlights.forEach((h) => {
      const type = h.label || "unknown";
      summary[type] = (summary[type] || 0) + 1;
    });
    return summary;
  }
}
