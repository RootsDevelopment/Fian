import { normalizeHighlights } from "../../ui/highlightNormalizer.js";

export class ConceptEngine {
  constructor(game) {
    this.game = game;
    this.registry = new Map();
  }

  register(name, module) {
    this.registry.set(name, module);
  }

  run(name) {
    const module = this.registry.get(name);
    if (!module) return [];

    const rawHighlights = module.analyze(this.game);
    return normalizeHighlights(rawHighlights);
  }
}
