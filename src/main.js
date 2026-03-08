import { appState } from "./core/appState.js";
import { initializeGame } from "./core/gameController.js";
import { initializeChessSystems } from "./core/chessSystems.js";
import { setupBoardInteractions } from "./ui/boardInteraction.js";
import { setupKeyboardShortcuts } from "./ui/keyboardShortcuts.js";
import { LayoutBuilder } from "./ui/layout/layOutBuilder.js";
import { fenHandler } from "./handlers/fenHandler.js";
import { toolHandler } from "./handlers/toolHandler.js";
import { examples } from "./utils/examples.js";

// Wire up callbacks
appState.callbacks = {
  onLoadFEN: (fen) => fenHandler.load(appState, fen),
  onLoadExample: () => fenHandler.loadExample(appState, examples.italian),
  onResetBoard: () => fenHandler.reset(appState),
  onFlipBoard: () => fenHandler.flip(appState),
  onSelectTool: (tool) => toolHandler.switch(appState, tool),
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
  panels.controlsPanel.initialize(appState);

  // Set up interactions
  setupBoardInteractions(appState);
  setupKeyboardShortcuts(appState);
});
