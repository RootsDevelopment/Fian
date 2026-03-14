export const toolHandler = {
  switch(appState, toolId) {
    appState.currentTool = toolId;

    // Update right panel header
    const panelHeader = document.querySelector(".right-panel__header span");
    const toolNames = {
      "pawn-structure": "PAWN STRUCTURE",
      "position-analysis": "POSITION ANALYSIS",
      tactics: "TACTICS FINDER",
      endgames: "ENDGAME GUIDE",
      openings: "OPENING EXPLORER",
      training: "TRAINING MODE",
    };

    if (panelHeader) {
      panelHeader.textContent = toolNames[toolId] || "ANALYSIS";
    }

    // Load tool-specific content
    this.loadToolContent(appState, toolId);

    // Update status
    this.updateStatusForTool(appState, toolId);
  },

  loadToolContent(appState, toolId) {
    const contentArea = document.getElementById("tool-content");
    if (!contentArea) return;

    // Clear existing content
    contentArea.innerHTML = "";

    switch (toolId) {
      case "pawn-structure":
        // Re-initialize pawn structure view
        if (appState.pawnStructureView) {
          const analysis = appState.engine?.analyzeConcept("pawnStructure");
          if (analysis) appState.pawnStructureView.update(analysis);
        }
        break;

      case "position-analysis":
        contentArea.innerHTML = this.getPositionAnalysisHTML();
        break;

      case "tactics":
        contentArea.innerHTML = this.getTacticsHTML();
        break;

      default:
        contentArea.innerHTML = this.getComingSoonHTML();
    }
  },

  getPositionAnalysisHTML() {
    return `
      <div class="feature-card">
        <div class="feature-card__title">Position Evaluation</div>
        <div class="feature-card__description">Engine analysis coming soon</div>
        <div style="font-size: 24px; text-align: center; margin: var(--space-md) 0;">+0.0</div>
      </div>
    `;
  },

  getTacticsHTML() {
    return `
      <div class="feature-card">
        <div class="feature-card__title">Tactics Finder</div>
        <div class="feature-card__description">Coming soon in v2.0</div>
      </div>
    `;
  },

  getComingSoonHTML() {
    return `
      <div class="feature-card">
        <div class="feature-card__title">Coming Soon</div>
        <div class="feature-card__description">This feature is under development</div>
      </div>
    `;
  },

  updateStatusForTool(appState, toolId) {
    const statusEl = document.getElementById("position-status");
    if (statusEl && appState.game) {
      const turn = appState.game.turn === "w" ? "White" : "Black";
      const toolName = toolId.replace("-", " ");
      statusEl.textContent = `${turn} to move • ${toolName}`;
    }
  },
};
