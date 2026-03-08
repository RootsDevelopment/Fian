import { initializeGame, updateStatusBar } from "../core/gameController.js";
import { clearHighlights } from "../core/chessSystems.js";

export const fenHandler = {
  load(appState, fen) {
    try {
      const cleanFEN = fen.trim();
      const fenParts = cleanFEN.split(" ");

      if (fenParts.length < 1) {
        throw new Error("Invalid FEN");
      }

      initializeGame(appState, cleanFEN);
      clearHighlights(appState);

      // Update any active views
      if (
        appState.currentTool === "pawn-structure" &&
        appState.pawnStructureView
      ) {
        const analysis = appState.engine?.analyzeConcept("pawnStructure");
        if (analysis) appState.pawnStructureView.update(analysis);
      }

      // Update AI coach if exists
      if (appState.rightPanel?.aiCoach) {
        appState.rightPanel.aiCoach.clear();
      }

      updateStatusBar(appState);

      return { success: true };
    } catch (error) {
      console.error("Error loading FEN:", error);
      this.showError(error.message);
      return { success: false, error: error.message };
    }
  },

  loadExample(appState, exampleFen) {
    const result = this.load(appState, exampleFen);

    // Update FEN input field
    const fenInput = document.getElementById("fen-input");
    if (fenInput && result.success) {
      fenInput.value = exampleFen;
    }

    return result;
  },

  reset(appState) {
    const startPosition =
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    const result = this.load(appState, startPosition);

    const fenInput = document.getElementById("fen-input");
    if (fenInput && result.success) {
      fenInput.value = startPosition;
    }

    return result;
  },

  flip(appState) {
    const board = document.getElementById("board");
    board.classList.toggle("flipped");

    const statusEl = document.getElementById("position-status");
    if (statusEl) {
      statusEl.textContent = board.classList.contains("flipped")
        ? "Board flipped"
        : "Board normal";
      setTimeout(() => updateStatusBar(appState), 1500);
    }
  },

  showError(message) {
    const statusEl = document.getElementById("position-status");
    if (statusEl) {
      statusEl.textContent = "Invalid FEN";
      statusEl.style.color = "var(--color-error)";
      setTimeout(() => {
        statusEl.style.color = "";
        updateStatusBar(appState);
      }, 2000);
    }

    const fenInput = document.getElementById("fen-input");
    if (fenInput) {
      fenInput.style.borderColor = "var(--color-error)";
      setTimeout(() => {
        fenInput.style.borderColor = "";
      }, 2000);
    }
  },

  validate(fen) {
    const fenPattern =
      /^\s*([rnbqkpRNBQKP1-8]+\/){7}[rnbqkpRNBQKP1-8]+\s+[wb]\s+(K?Q?k?q?|-)\s+(-|[a-h][36])\s+\d+\s+\d+\s*$/;
    return fenPattern.test(fen.trim());
  },
};
