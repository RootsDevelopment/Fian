// Central state object - pure data, no functions
export const appState = {
  // Game
  game: null,
  boardElement: null,

  // Highlight systems
  highlightManager: null,
  highlightRenderer: null,
  arrowRenderer: null,

  // Concept systems
  engine: null,

  // UI helpers
  tooltipManager: null,
  shortcutManager: null,
  legend: null,

  topInsightBar: null,
  insightList: null,
  insightCard: null,
  currentInsights: [],
  pinnedInsights: [],

  // Current state
  currentTool: null,
  pawnStructureView: null,

  // Callbacks (to be populated by main.js)
  callbacks: {},
};
