import { appState } from "./core/appState.js";
import { initializeGame } from "./core/gameController.js";
import { initializeChessSystems } from "./core/chessSystems.js";
import { setupBoardInteractions } from "./ui/boardInteraction.js";
import { setupKeyboardShortcuts } from "./ui/keyboardShortcuts.js";
import { LayoutBuilder } from "./ui/layout/layOutBuilder.js";
import { fenHandler } from "./handlers/fenHandler.js";
import { toolHandler } from "./handlers/toolHandler.js";
import { examples } from "./utils/examples.js";
import { TopInsightBar } from "./ui/insights/topInsightBar.js";
import { InsightList } from "./ui/insights/insightList.js";
import { analyzeHandler } from "./handlers/analyzeHandle.js";

// Wire up callbacks
appState.callbacks = {
  onLoadFEN: (fen) => fenHandler.load(appState, fen),
  onLoadExample: () => fenHandler.loadExample(appState, examples.italian),
  onResetBoard: () => fenHandler.reset(appState),
  onFlipBoard: () => fenHandler.flip(appState),
  onSelectTool: (tool) => toolHandler.switch(appState, tool),
  onAnalyze: () => analyzeHandler.analyze(appState),
};

// Initialize the app
document.addEventListener("DOMContentLoaded", async () => {
  // Build layout
  const layoutBuilder = new LayoutBuilder();
  const panels = layoutBuilder.build();

  // Get board element
  appState.boardElement = document.getElementById("board");

  // Initialize game with default position
  initializeGame(appState, "6k1/5ppp/8/8/P7/5PP1/6K1/8");

  // Initialize chess systems (highlights, engine, etc.)
  await initializeChessSystems(appState);

  // Initialize all panels
  panels.leftPanel.initialize(appState);
  panels.rightPanel.initialize(appState);

  setTimeout(() => {
    const insightContainer = document.getElementById("insight-list-container");
    if (insightContainer) {
      appState.insightList = new InsightList(insightContainer, appState);
    }
  }, 100);

  panels.controlsPanel.initialize(appState);

  // In your DOMContentLoaded event, after panel initialization:
  appState.topInsightBar = new TopInsightBar(panels.topBarContainer, appState);

  // Insert it at the top of app-main
  const appMain = document.querySelector(".app-main");
  appMain.insertBefore(appState.topInsightBar.element, appMain.firstChild);

  // Set up interactions
  setupBoardInteractions(appState);
  setupKeyboardShortcuts(appState);
});
