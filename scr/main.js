import Game from "./modules/game.js";
import renderBoard, { addEventListeners, selectPiece } from "./ui/render.js";

const game = new Game([
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
  "w",
  "KQkq",
  "-",
  "0",
  "1",
]);

renderBoard(game.board);
addEventListeners(handleClick);

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

  await attemptMove(selectedSquare, square);
  clearSelection();
}

function selectSquare(square) {
  const row = parseInt(square.dataset.row);
  const col = parseInt(square.dataset.col);

  const selectedPiece = game.board.getPiece(row, col);

  if (!selectedPiece) return;
  if (selectedPiece.color !== game.turn) return;

  const moves = game.getLegalMoves(row, col);

  console.log("Legal moves for", selectedPiece, "at", [row, col], ":", moves);

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
