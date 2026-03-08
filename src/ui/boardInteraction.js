import { addEventListeners } from "./render.js";
import { makeMove, makeAIMove } from "../core/gameController.js";

let selectedSquare = null;

export function setupBoardInteractions(appState) {
  // Your existing hover logic
  let hoverTimeout = null;

  appState.boardElement.addEventListener("mouseover", (e) => {
    const highlightEl = e.target.closest("[data-highlight]");
    if (!highlightEl) return;

    if (hoverTimeout) clearTimeout(hoverTimeout);

    const concept = highlightEl.getAttribute("data-concept");
    const type = highlightEl.getAttribute("data-type");

    const highlights = appState.highlightManager?.getLastHighlights() || [];
    const highlight = highlights.find(
      (h) => h.concept === concept && h.metadata?.type === type,
    );

    if (highlight) {
      appState.tooltipManager?.show(highlight, e, false);
    }
  });

  appState.boardElement.addEventListener("mouseout", (e) => {
    const highlightEl = e.target.closest("[data-highlight]");
    if (!highlightEl) return;

    hoverTimeout = setTimeout(() => {
      appState.tooltipManager?.hide();
    }, 50);
  });

  appState.boardElement.addEventListener("click", (e) => {
    const highlightEl = e.target.closest("[data-highlight]");
    if (!highlightEl) return;

    const concept = highlightEl.getAttribute("data-concept");
    const type = highlightEl.getAttribute("data-type");

    const highlights = appState.highlightManager?.getLastHighlights() || [];
    const highlight = highlights.find(
      (h) => h.concept === concept && h.metadata?.type === type,
    );

    if (highlight) {
      appState.tooltipManager?.pinHighlight(highlight, e);
    }
  });

  // Add click handler for moves
  addEventListeners((e) => handleBoardClick(e, appState));
}

async function handleBoardClick(e, appState) {
  const square = e.target.closest(".square");
  if (!square) return;

  const img = square.querySelector("img");

  if (!selectedSquare) {
    if (!img) return;
    selectSquare(square, appState);
    return;
  }

  if (selectedSquare === square) {
    clearSelection();
    return;
  }

  const moved = await makeMove(appState, selectedSquare, square);
  clearSelection();

  if (!moved) return;

  await makeAIMove(appState);

  // Update analysis if needed
  if (appState.currentTool === "pawn-structure" && appState.pawnStructureView) {
    const analysis = appState.engine?.analyzeConcept("pawnStructure");
    if (analysis) appState.pawnStructureView.update(analysis);
  }
}

function selectSquare(square, appState) {
  const row = parseInt(square.dataset.row);
  const col = parseInt(square.dataset.col);

  const selectedPiece = appState.game?.board.getPiece(row, col);

  if (!selectedPiece) return;
  if (selectedPiece.color !== appState.game?.turn) return;

  const moves = appState.game?.getLegalMoves(row, col) || [];

  possibleMoves(moves);

  selectedSquare = square;
  square.classList.add("selected");
}

function possibleMoves(moves) {
  moves.forEach((move) => {
    const square = document.querySelector(
      `.square[data-row="${move[0]}"][data-col="${move[1]}"]`,
    );
    if (square) square.classList.add("highlight");
  });
}

function clearSelection() {
  if (selectedSquare) {
    selectedSquare.classList.remove("selected");
  }
  removeHighlight();
  selectedSquare = null;
}

function removeHighlight() {
  const highlights = document.querySelectorAll(".square.highlight");
  highlights.forEach((square) => {
    square.classList.remove("highlight");
  });
}
