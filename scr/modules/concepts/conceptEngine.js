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

    return module.analyze(this.game);
  }
}
