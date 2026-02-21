import Game from "./modules/game.js";
import renderBoard, { addEventListeners, selectPiece } from "./ui/render.js";
import { HighlightRenderer } from "./ui/highlightRenderer.js";
import { ConceptEngine } from "./modules/concepts/conceptEngine.js";
import { pawnStructure } from "./modules/concepts/pawnStructure.js";
import { HighlightManager } from "./ui/highlightManager.js";
import { registerShortcuts } from "./utils/shorcutManager.js";
import { ArrowRenderer } from "./ui/arrowRenderer.js";

const isolatedPawns = "8/8/8/8/8/3P4/8/8";
const doubledPawns = "8/3p4/8/8/3P4/3P4/8/8";
const passedPawn = "8/8/8/3P4/8/8/8/8";
const backwardPawn = "8/8/8/3P4/2P5/8/8/8";
const pawnChain = "8/1ppp4/8/3P4/2P5/1P6/8/8";

const game = new Game([pawnChain, "w", "KQkq", "-", "0", "1"]);

renderBoard(game.board);

const boardElement = document.getElementById("board");

const engine = new ConceptEngine(game);
engine.register("pawnStructure", pawnStructure);

const arrowRendererInstance = new ArrowRenderer(boardElement);

const renderer = new HighlightRenderer(arrowRendererInstance);

const highlightManager = new HighlightManager(renderer, engine);

registerShortcuts(engine, highlightManager);

addEventListeners(handleClick);

// arrowRendererInstance.render([
//   {
//     id: "test-arrow-1",
//     type: "arrow",
//     from: "c2",
//     to: "d4",
//     color: "rgba(23, 109, 135, 0.8)",
//     thickness: 4,
//     priority: 10,
//   },
// ]);

// updateControlLayers(game.board);

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
