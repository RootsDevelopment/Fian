export class HighlightManager {
  constructor(renderer, engine) {
    this.renderer = renderer;
    this.engine = engine;
    this.activeConcepts = new Set();
    this.priorities = new Map();
  }

  toggleConcept(name) {
    if (this.activeConcepts.has(name)) {
      this.activeConcepts.delete(name);
      console.log(`Deactivated ${name}`);
    } else {
      this.activeConcepts.add(name);
      console.log(`Activated ${name}`);
    }

    this.refresh();
  }

  refresh() {
    const allHighlights = [];

    this.activeConcepts.forEach((name) => {
      const highlights = this.engine.getConceptHighlights(name);
      allHighlights.push(...highlights);
    });

    allHighlights.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    console.log("Rendering highlights:", allHighlights);
    this.renderer.render(allHighlights);
  }

  // Called when game position changes
  onPositionChange() {
    this.engine.invalidateCache(); // Clear cache
    this.refresh(); // Re-render with fresh data
  }

  clearAll() {
    this.activeConcepts.clear();
    this.renderer.clear();
  }

  // For debugging
  getActiveConcepts() {
    return Array.from(this.activeConcepts);
  }
}
