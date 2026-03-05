export class ShortcutManager {
  constructor(highlightManager, engine) {
    this.highlightManager = highlightManager;
    this.engine = engine;
    this.shortcuts = new Map();

    this.initShortcuts();
  }

  initShortcuts() {
    this.register("ctrl+p", "pawnStructure");
    this.register("ctrl+t", "tacticalThreats");
    this.register("ctrl+k", "kingSafety");
    this.register("ctrl+s", "spaceAdvantage");
    this.register("ctrl+f", "filesAndRooks");

    // Listen to key events
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  register(shortcut, conceptName) {
    this.shortcuts.set(shortcut.toLowerCase(), conceptName);
  }

  handleKeyDown(event) {
    // Build shortcut string
    const parts = [];
    if (event.ctrlKey) parts.push("ctrl");
    if (event.shiftKey) parts.push("shift");
    if (event.altKey) parts.push("alt");
    parts.push(event.key.toLowerCase());

    const shortcut = parts.join("+");

    const conceptName = this.shortcuts.get(shortcut);
    if (conceptName) {
      event.preventDefault();

      // Toggle the concept
      console.log(
        `Toggling concept for shortcut: ${shortcut} -> ${conceptName}`,
      );
      this.highlightManager.toggleConcept(conceptName);
    }
  }
}
