import { HighlightRenderer } from "../ui/highlightRenderer.js";
import { ConceptEngine } from "../modules/concepts/conceptEngine.js";
import { pawnStructure } from "../modules/concepts/pawnStructure/index.js";
import { HighlightManager } from "../ui/highlightManager.js";
import { ArrowRenderer } from "../ui/arrowRenderer.js";
import { ShortcutManager } from "../utils/shortcutManager.js";
import { TooltipManager } from "../utils/tooltipManager.js";
import { ConceptLegend } from "../ui/conceptLegend.js";
import renderBoard from "../ui/render.js";

export async function initializeChessSystems(appState) {
  // Render initial board
  renderBoard(appState.game.board);

  // Initialize arrow renderer
  appState.arrowRenderer = new ArrowRenderer(appState.boardElement);

  // Initialize highlight renderer
  appState.highlightRenderer = new HighlightRenderer(appState.arrowRenderer);

  // Initialize concept engine and register pawn structure
  appState.engine = new ConceptEngine(appState.game);
  appState.engine.register("pawnStructure", pawnStructure);

  // Initialize highlight manager
  appState.highlightManager = new HighlightManager(
    appState.highlightRenderer,
    appState.engine,
  );

  // Initialize tooltip manager
  appState.tooltipManager = new TooltipManager(appState.boardElement);
  appState.highlightManager.setTooltipManager(appState.tooltipManager);

  // Initialize shortcut manager
  appState.shortcutManager = new ShortcutManager(
    appState.highlightManager,
    appState.engine,
  );

  // Initialize concept legend (hidden by default)
  appState.legend = new ConceptLegend(document.body);
  appState.legend.addConceptSection(
    "pawnStructure",
    pawnStructure.getVisualizer(),
  );
  appState.legend.render();
  appState.legend.hide();
}

export function clearHighlights(appState) {
  if (appState.highlightManager) {
    // appState.highlightManager.clearHighlights();
  }
}

export function analyzePawnStructure(appState) {
  if (!appState.engine) return null;
  return appState.engine.analyzeConcept("pawnStructure");
}
