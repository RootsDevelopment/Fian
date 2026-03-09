// handlers/analyzeHandler.js
export const analyzeHandler = {
  analyze(appState) {
    if (!appState.engine || !appState.game) return [];

    console.log("🔍 Analyzing position...");

    // Get all concepts from engine
    const concepts = appState.engine.getConceptHighlights("pawnStructure");

    // Store in appState
    appState.currentInsights = concepts;

    // Update UI
    if (appState.topInsightBar) {
      appState.topInsightBar.show(concepts);
    }

    if (appState.insightList) {
      appState.insightList.updateInsights(concepts);
    }

    return concepts;
  },
};
