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

const isolatedPawns = "8/2p1pp2/8/8/8/3P4/8/8";
const doubledPawns = "8/3p4/8/8/3P4/3P4/8/8";
const passedPawn = "8/8/8/3P4/8/8/8/8";
const backwardPawn = "8/8/8/3P4/2P5/1P6/8/8";
const pawnChain = "8/1ppp4/8/8/3P4/2P5/1P6/8";
const iqpPosition = "8/8/8/3k4/3P4/3K4/8/8 w - - 0 1";
const x = "6k1/5ppp/8/8/P7/5PP1/6K1/8 w - - 0 1";

const boardElement = document.getElementById("board");
const game = new Game([x, "w", "KQkq", "-", "0", "1"]);
renderBoard(game.board);

const arrowRenderer = new ArrowRenderer(boardElement);
const highlightRenderer = new HighlightRenderer(arrowRenderer);

const engine = new ConceptEngine(game);
engine.register("pawnStructure", pawnStructure);

const highlightManager = new HighlightManager(highlightRenderer, engine);

const tooltipManager = new TooltipManager(boardElement);
highlightManager.setTooltipManager(tooltipManager);

const legend = new ConceptLegend(document.body);
legend.addConceptSection("pawnStructure", pawnStructure.getVisualizer());
legend.render();

const shortcutManager = new ShortcutManager(highlightManager, engine);

let hoverTimeout = null;
boardElement.addEventListener("mouseover", (e) => {
  const highlightEl = e.target.closest("[data-highlight]");
  if (!highlightEl) return;

  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
  }

  const concept = highlightEl.getAttribute("data-concept");
  const type = highlightEl.getAttribute("data-type");

  const highlights = highlightManager.getLastHighlights();
  const highlight = highlights.find(
    (h) => h.concept === concept && h.metadata?.type === type,
  );

  // console.log("highlightEl:", highlights);

  if (highlight) {
    tooltipManager.show(highlight, e, false);
  }
});

boardElement.addEventListener("mouseout", (e) => {
  const highlightEl = e.target.closest("[data-highlight]");
  if (!highlightEl) return;

  // Small delay to prevent flicker when moving between squares
  hoverTimeout = setTimeout(() => {
    tooltipManager.hide();
  }, 50);
});

boardElement.addEventListener("click", (e) => {
  const highlightEl = e.target.closest("[data-highlight]");
  if (!highlightEl) return;

  const concept = highlightEl.getAttribute("data-concept");
  const type = highlightEl.getAttribute("data-type");

  const highlights = highlightManager.getLastHighlights();
  const highlight = highlights.find(
    (h) => h.concept === concept && h.metadata?.type === type,
  );

  if (highlight) {
    tooltipManager.pinHighlight(highlight, e);
  }
});
// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "l") {
    e.preventDefault();
    legend.toggle();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    tooltipManager.unpinHighlight();
  }
});

addEventListeners(handleClick);

let selectedSquare = null;

async function handleClick(e) {
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
