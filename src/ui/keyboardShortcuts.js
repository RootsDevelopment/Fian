export function setupKeyboardShortcuts(appState) {
  document.addEventListener("keydown", (e) => {
    // Ctrl+L - Toggle legend
    if (e.ctrlKey && e.key === "l") {
      e.preventDefault();
      if (appState.legend) {
        appState.legend.toggle();
      }
    }

    // Escape - Unpin tooltip
    if (e.key === "Escape") {
      appState.tooltipManager?.unpinHighlight();
    }

    // Ctrl+P - Pawn structure
    if (e.ctrlKey && e.key === "p") {
      e.preventDefault();

      if (appState.currentTool !== "pawn-structure") {
        appState.callbacks.onSelectTool?.("pawn-structure");
      }

      appState.highlightManager?.toggleConcept("pawnStructure");

      if (appState.pawnStructureView) {
        appState.pawnStructureView.setHighlightButtonState(
          appState.highlightManager?.isActive("pawnStructure") || false,
        );
      }
    }

    // Ctrl+N - New game
    if (e.ctrlKey && e.key === "n") {
      e.preventDefault();
      appState.callbacks.onResetBoard?.();
    }

    // Ctrl+F - Flip board
    if (e.ctrlKey && e.key === "f") {
      e.preventDefault();
      appState.callbacks.onFlipBoard?.();
    }

    // Ctrl+1-4 - Switch tools
    if (e.ctrlKey && e.key === "1") {
      e.preventDefault();
      appState.callbacks.onSelectTool?.("pawn-structure");
    }
    if (e.ctrlKey && e.key === "2") {
      e.preventDefault();
      appState.callbacks.onSelectTool?.("position-analysis");
    }
    if (e.ctrlKey && e.key === "3") {
      e.preventDefault();
      appState.callbacks.onSelectTool?.("tactics");
    }
  });
}
