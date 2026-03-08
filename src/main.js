import Game from "./modules/game.js";
import renderBoard, { addEventListeners, selectPiece } from "./ui/render.js";
import { HighlightRenderer } from "./ui/highlightRenderer.js";
import { ConceptEngine } from "./modules/concepts/conceptEngine.js";
import { pawnStructure } from "./modules/concepts/pawnStructure/index.js";
import { HighlightManager } from "./ui/highlightManager.js";
import { ArrowRenderer } from "./ui/arrowRenderer.js";
import { ShortcutManager } from "./utils/shortcutManager.js";
import { TooltipManager } from "./utils/tooltipManager.js";
import { ConceptLegend } from "./ui/conceptLegend.js";
import { LayoutBuilder } from "./ui/layout/layOutBuilder.js";

//App state
const appState = {
  game: null,
  boardElement: null,
  highlightManager: null,
  highlightRenderer: null,
  arrowRenderer: null,
  engine: null,
  tooltipManager: null,
  shortcutManager: null,
  legend: null,
  currentTool: null,
  pawnStructureView: null,
  callbacks: {
    onLoadFEN: (fen) => handleLoadFEN(fen),
    onLoadExample: () => handleLoadExample(),
    onResetBoard: () => handleResetBoard(),
    onFlipBoard: () => handleFlipBoard(),
    onSelectTool: (tool) => switchTool(tool),
    // onLoadRecent: (id) => handleLoadRecent(id),
  },
};

// FEN Handler
function handleLoadFEN(fen) {
  try {
    const cleanFEN = fen.trim();

    const fenParts = cleanFEN.split(" ");

    if (fenParts.length < 1) {
      throw new Error("Invalid FEN");
    }

    const defaultParts = ["w", "KQkq", "-", "0", "1"];

    const fullFenParts = [
      fenParts[0],
      fenParts[1] || defaultParts[0],
      fenParts[2] || defaultParts[1],
      fenParts[3] || defaultParts[2],
      fenParts[4] || defaultParts[3],
      fenParts[5] || defaultParts[4],
    ];

    // Update game
    appState.game = new Game(fullFenParts);

    // Re-render board
    renderBoard(appState.game.board);

    // Clear any existing highlights
    if (appState.highlightManager) {
      appState.highlightManager.clearHighlights();
    }

    // // Update AI coach if it exists
    // if (appState.rightPanel && appState.rightPanel.aiCoach) {
    //   appState.rightPanel.aiCoach.clear();
    // }

    // // Update pawn structure view if active
    // if (appState.currentTool === 'pawn-structure' && appState.pawnStructureView) {
    //   const analysis = appState.engine.analyzeConcept('pawnStructure');
    //   appState.pawnStructureView.update(analysis);
    // }

    // Update status bar
    updateStatusBar();

    // console.log("FEN loaded successfully:", cleanFEN);
  } catch (error) {
    console.error("Error loading FEN:", error);

    const statusEl = document.getElementById("position-status");
    if (statusEl) {
      statusEl.textContent = "Invalid FEN";
      statusEl.style.color = "var(--color-error)";
      setTimeout(() => {
        statusEl.style.color = "";
        updateStatusBar();
      }, 2000);
    }

    // Optional: Show error in the FEN input
    const fenInput = document.getElementById("fen-input");
    if (fenInput) {
      fenInput.style.borderColor = "var(--color-error)";
      setTimeout(() => {
        fenInput.style.borderColor = "";
      }, 2000);
    }
  }
}

// Example positions for Load Example
const examples = {
  italian: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
  sicilian: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2",
  french: "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
  caro: "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
};

function handleLoadExample() {
  // You could cycle through examples or show a dropdown
  // For now, load the Italian Game
  handleLoadFEN(examples.italian);

  // Update FEN input field to show the loaded FEN
  const fenInput = document.getElementById("fen-input");
  if (fenInput) {
    fenInput.value = examples.italian;
  }
}

function handleResetBoard() {
  const startPosition =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  handleLoadFEN(startPosition);

  // Update FEN input
  const fenInput = document.getElementById("fen-input");
  if (fenInput) {
    fenInput.value = startPosition;
  }
}

function handleFlipBoard() {
  const board = document.getElementById("board");
  board.classList.toggle("flipped");

  // Update status
  const statusEl = document.getElementById("position-status");
  if (statusEl) {
    statusEl.textContent = board.classList.contains("flipped")
      ? "Board flipped"
      : "Board normal";
    setTimeout(updateStatusBar, 1500);
  }
}

function updateStatusBar() {
  const statusEl = document.getElementById("position-status");
  if (statusEl && appState.game) {
    const turn = appState.game.turn === "w" ? "White" : "Black";
    statusEl.textContent = `${turn} to move`;
    statusEl.style.color = "";
  }
}

// Initialize the app
document.addEventListener("DOMContentLoaded", async () => {
  const layoutBuilder = new LayoutBuilder();
  const panels = layoutBuilder.build();

  // 2. Get the board element (now inside the layout)
  appState.boardElement = document.getElementById("board");

  // 3. Initialize your existing game with your test position
  const startPosition = "6k1/5ppp/8/8/P7/5PP1/6K1/8";
  appState.game = new Game([startPosition, "w", "KQkq", "-", "0", "1"]);

  // 4. Initialize your existing rendering and highlight systems
  await initializeChessSystems();

  // 5. Initialize all panels
  panels.leftPanel.initialize(appState);
  panels.rightPanel.initialize(appState);
  panels.controlsPanel.initialize(appState);

  // 5. Set up the UI event listeners
  // setupUIEventListeners(panels);

  // 6. Set up your existing board interactions
  // setupBoardInteractions();

  // 7. Initialize the pawn structure view in the right panel
  // initializePawnStructureView();
});

async function initializeChessSystems() {
  // Render the initial board
  renderBoard(appState.game.board);

  // Initialize arrow renderer
  // appState.arrowRenderer = new ArrowRenderer(appState.boardElement);

  // Initialize highlight renderer
  // appState.highlightRenderer = new HighlightRenderer(appState.arrowRenderer);

  // Initialize concept engine and register pawn structure
  // appState.engine = new ConceptEngine(appState.game);
  // appState.engine.register("pawnStructure", pawnStructure);

  // Initialize highlight manager
  // appState.highlightManager = new HighlightManager(
  //   appState.highlightRenderer,
  //   appState.engine,
  // );

  // // Initialize tooltip manager
  // appState.tooltipManager = new TooltipManager(appState.boardElement);
  // appState.highlightManager.setTooltipManager(appState.tooltipManager);

  // // Initialize shortcut manager
  // appState.shortcutManager = new ShortcutManager(
  //   appState.highlightManager,
  //   appState.engine,
  // );

  // // Initialize concept legend and add to left panel?
  // // We'll decide where to place this
  // appState.legend = new ConceptLegend(document.body);
  // appState.legend.addConceptSection(
  //   "pawnStructure",
  //   pawnStructure.getVisualizer(),
  // );
  // appState.legend.render();

  // // Hide the legend initially - we'll integrate it into the left panel
  // appState.legend.container.style.display = "none";
}

function setupUIEventListeners(panels) {
  // Tool selection from left panel
  document.querySelectorAll("[data-tool]").forEach((item) => {
    item.addEventListener("click", (e) => {
      const tool = e.currentTarget.dataset.tool;
      switchTool(tool);
    });
  });

  // Control panel actions
  document.querySelectorAll("[data-action]").forEach((item) => {
    item.addEventListener("click", (e) => {
      const action = e.currentTarget.dataset.action;
      handleControlAction(action);
    });
  });

  // Keyboard shortcuts (your existing ones plus new ones)
  document.addEventListener("keydown", handleKeyboardShortcuts);
}

function setupBoardInteractions() {
  // Your existing hover logic
  let hoverTimeout = null;

  appState.boardElement.addEventListener("mouseover", (e) => {
    const highlightEl = e.target.closest("[data-highlight]");
    if (!highlightEl) return;

    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }

    const concept = highlightEl.getAttribute("data-concept");
    const type = highlightEl.getAttribute("data-type");

    const highlights = appState.highlightManager.getLastHighlights();
    const highlight = highlights.find(
      (h) => h.concept === concept && h.metadata?.type === type,
    );

    if (highlight) {
      appState.tooltipManager.show(highlight, e, false);
    }
  });

  appState.boardElement.addEventListener("mouseout", (e) => {
    const highlightEl = e.target.closest("[data-highlight]");
    if (!highlightEl) return;

    hoverTimeout = setTimeout(() => {
      appState.tooltipManager.hide();
    }, 50);
  });

  appState.boardElement.addEventListener("click", (e) => {
    const highlightEl = e.target.closest("[data-highlight]");
    if (!highlightEl) return;

    const concept = highlightEl.getAttribute("data-concept");
    const type = highlightEl.getAttribute("data-type");

    const highlights = appState.highlightManager.getLastHighlights();
    const highlight = highlights.find(
      (h) => h.concept === concept && h.metadata?.type === type,
    );

    if (highlight) {
      appState.tooltipManager.pinHighlight(highlight, e);
    }
  });

  // Your existing click handler for moves
  addEventListeners(handleBoardClick);
}

function handleKeyboardShortcuts(e) {
  // Your existing shortcuts
  if (e.ctrlKey && e.key === "l") {
    e.preventDefault();
    // Toggle legend visibility (maybe move this to a panel)
    const legend = appState.legend;
    if (legend) {
      legend.toggle();
    }
  }

  if (e.key === "Escape") {
    appState.tooltipManager.unpinHighlight();
  }

  // Ctrl+P for pawn structure (your existing feature)
  if (e.ctrlKey && e.key === "p") {
    e.preventDefault();

    // Switch to pawn structure tool if not already
    if (appState.currentTool !== "pawn-structure") {
      switchTool("pawn-structure");
    }

    // Toggle pawn structure highlights
    appState.highlightManager.toggleConcept("pawnStructure");

    // Update button state in view
    if (appState.pawnStructureView) {
      appState.pawnStructureView.setHighlightButtonState(
        appState.highlightManager.isActive("pawnStructure"),
      );
    }
  }

  // Ctrl+N for new game
  if (e.ctrlKey && e.key === "n") {
    e.preventDefault();
    handleControlAction("new-game");
  }

  // Ctrl+F for flip board
  if (e.ctrlKey && e.key === "f") {
    e.preventDefault();
    handleControlAction("flip-board");
  }
}
// const isolatedPawns = "8/2p1pp2/8/8/8/3P4/8/8";
// const doubledPawns = "8/3p4/8/8/3P4/3P4/8/8";
// const passedPawn = "8/8/8/3P4/8/8/8/8";
// const backwardPawn = "8/8/8/3P4/2P5/1P6/8/8";
// const pawnChain = "8/1ppp4/8/8/3P4/2P5/1P6/8";
// const iqpPosition = "8/8/8/3k4/3P4/3K4/8/8 w - - 0 1";
// const x = "6k1/5ppp/8/8/P7/5PP1/6K1/8 w - - 0 1";

// const boardElement = document.getElementById("board");
// const game = new Game([x, "w", "KQkq", "-", "0", "1"]);
// renderBoard(game.board);

// const arrowRenderer = new ArrowRenderer(boardElement);
// const highlightRenderer = new HighlightRenderer(arrowRenderer);

// const engine = new ConceptEngine(game);
// engine.register("pawnStructure", pawnStructure);

// const highlightManager = new HighlightManager(highlightRenderer, engine);

// const tooltipManager = new TooltipManager(boardElement);
// highlightManager.setTooltipManager(tooltipManager);

// const legend = new ConceptLegend(document.body);
// legend.addConceptSection("pawnStructure", pawnStructure.getVisualizer());
// legend.render();

// const shortcutManager = new ShortcutManager(highlightManager, engine);

// let hoverTimeout = null;
// boardElement.addEventListener("mouseover", (e) => {
//   const highlightEl = e.target.closest("[data-highlight]");
//   if (!highlightEl) return;

//   if (hoverTimeout) {
//     clearTimeout(hoverTimeout);
//   }

//   const concept = highlightEl.getAttribute("data-concept");
//   const type = highlightEl.getAttribute("data-type");

//   const highlights = highlightManager.getLastHighlights();
//   const highlight = highlights.find(
//     (h) => h.concept === concept && h.metadata?.type === type,
//   );

//   // console.log("highlightEl:", highlights);

//   if (highlight) {
//     tooltipManager.show(highlight, e, false);
//   }
// });

// boardElement.addEventListener("mouseout", (e) => {
//   const highlightEl = e.target.closest("[data-highlight]");
//   if (!highlightEl) return;

//   // Small delay to prevent flicker when moving between squares
//   hoverTimeout = setTimeout(() => {
//     tooltipManager.hide();
//   }, 50);
// });

// boardElement.addEventListener("click", (e) => {
//   const highlightEl = e.target.closest("[data-highlight]");
//   if (!highlightEl) return;

//   const concept = highlightEl.getAttribute("data-concept");
//   const type = highlightEl.getAttribute("data-type");

//   const highlights = highlightManager.getLastHighlights();
//   const highlight = highlights.find(
//     (h) => h.concept === concept && h.metadata?.type === type,
//   );

//   if (highlight) {
//     tooltipManager.pinHighlight(highlight, e);
//   }
// });
// // Keyboard shortcuts
// document.addEventListener("keydown", (e) => {
//   if (e.ctrlKey && e.key === "l") {
//     e.preventDefault();
//     legend.toggle();
//   }
// });

// document.addEventListener("keydown", (e) => {
//   if (e.key === "Escape") {
//     tooltipManager.unpinHighlight();
//   }
// });

// addEventListeners(handleClick);

let selectedSquare = null;

async function handleBoardClick(e) {
  const square = e.target.closest(".square");
  if (!square) return;

  const img = square.querySelector("img");

  if (!selectedSquare) {
    if (!img) return;
    selectSquare(square);
    return;
  }

  if (selectedSquare === square) {
    clearSelection();
    return;
  }

  const moved = await attemptMove(selectedSquare, square);
  clearSelection();

  if (!moved) return;

  if (game.turn === "black" && game.status === "active") {
    console.log("AI is thinking...");
    await new Promise((r) => setTimeout(r, 200));
    await game.makeRandomMove();
    renderBoard(game.board);
  }
}

function selectSquare(square) {
  const row = parseInt(square.dataset.row);
  const col = parseInt(square.dataset.col);

  const selectedPiece = game.board.getPiece(row, col);

  if (!selectedPiece) return;
  if (selectedPiece.color !== game.turn) return;

  const moves = game.getLegalMoves(row, col);

  possibleMoves(moves);

  selectedSquare = square;
  square.classList.add("selected");
}

function possibleMoves(moves) {
  moves.forEach((move) => {
    const square = document.querySelector(
      `.square[data-row="${move[0]}"][data-col="${move[1]}"]`,
    );
    square.classList.add("highlight");
  });
}

function clearSelection() {
  selectedSquare.classList.remove("selected");
  removeHighlight();
  selectedSquare = null;
}

function removeHighlight() {
  const highlights = document.querySelectorAll(".square.highlight");
  highlights.forEach((square) => {
    square.classList.remove("highlight");
  });
}

async function attemptMove(fromSquare, toSquare) {
  const from = [+fromSquare.dataset.row, +fromSquare.dataset.col];
  const to = [+toSquare.dataset.row, +toSquare.dataset.col];

  const moved = await game.makeMove(from, to);

  if (moved) renderBoard(game.board);

  return moved;
}

function updateControlLayers(board) {
  document.querySelectorAll(".square").forEach((sq) => {
    sq.classList.remove("white-control", "black-control");
  });

  const whiteAttacks = board.getAttackedSquares("white");
  const blackAttacks = board.getAttackedSquares("black");

  whiteAttacks.forEach(([r, c]) => {
    const el = document.querySelector(
      `.square[data-row="${r}"][data-col="${c}"]`,
    );
    if (el) el.classList.add("white-control");
  });

  blackAttacks.forEach(([r, c]) => {
    const el = document.querySelector(
      `.square[data-row="${r}"][data-col="${c}"]`,
    );
    if (el) el.classList.add("black-control");
  });
}
