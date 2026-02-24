export class ShortcutManager {
  constructor(highlightManager, engine) {
    this.highlightManager = highlightManager;
    this.engine = engine;
    this.shortcuts = new Map();

    this._initShortcuts();
  }

  _initShortcuts() {
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

      console.log(`Shortcut ${shortcut} triggered for ${conceptName}`);

      // // NEW: Get AI analysis when toggling (for future use)
      // const aiAnalysis = this.engine.getConceptAnalysis(conceptName);
      // console.log("AI Analysis:", aiAnalysis);

      // Toggle the concept
      this.highlightManager.toggleConcept(conceptName);

      // // Optional: Dispatch event for AI logging
      // this._dispatchAnalysisEvent(conceptName, aiAnalysis);
    }
  }

  _dispatchAnalysisEvent(conceptName, analysis) {
    const event = new CustomEvent("conceptAnalyzed", {
      detail: {
        concept: conceptName,
        analysis: analysis,
        timestamp: Date.now(),
      },
    });
    document.dispatchEvent(event);
  }
}
