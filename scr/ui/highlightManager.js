export class HighlightManager {
  constructor(renderer) {
    this.renderer = renderer;
    this.activeConcepts = new Map();
  }

  toggleConcept(name, highlights) {
    if (this.activeConcepts.has(name)) {
      this.activeConcepts.delete(name);
    } else {
      this.activeConcepts.set(name, highlights);
    }

    this.renderAll();
  }

  renderAll() {
    const allHighlights = Array.from(this.activeConcepts.values())
      .flat()
      .sort((a, b) => b.priority - a.priority); // priority handling

    this.renderer.render(allHighlights);
  }

  clearAll() {
    this.activeConcepts.clear();
    this.renderer.clear();
  }
}
