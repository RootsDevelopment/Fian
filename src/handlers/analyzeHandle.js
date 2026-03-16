// handlers/analyzeHandler.js
export const analyzeHandler = {
  analyze(appState) {
    if (!appState.engine || !appState.game) return [];

    const concepts = appState.engine.getConceptHighlights("pawnStructure");
    console.log("Concepts found:", concepts);

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
