// handlers/analyzeHandler.js
export const analyzeHandler = {
  analyze(appState) {
    if (!appState.engine || !appState.game) return [];

    console.log("🔍 Analyzing position...");

    const concepts = appState.engine.getConceptHighlights("pawnStructure");

    appState.currentInsights = concepts;

    if (appState.topInsightBar) {
      appState.topInsightBar.show(concepts);
    }

    if (appState.insightList) {
      appState.insightList.updateInsights(concepts);
    }

    return concepts;
  },
};
