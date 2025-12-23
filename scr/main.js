import Board from "./modules/board.js";
import renderBoard, { addEventListeners } from "./ui/render.js";

const board = new Board([
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
  "w",
  "KQkq",
  "-",
  "0",
  "1",
]);
board.setBoard();
renderBoard(board);
addEventListeners(handleClick);

updateControlLayers(board);

let selectedSquare = null;
function handleClick(e) {
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

  attemptMove(selectedSquare, square, board);
  clearSelection();
}
function selectSquare(square) {
  const row = parseInt(square.dataset.row);
  const col = parseInt(square.dataset.col);
  const selectedPiece = board.getPiece(row, col);

  const moves = selectedPiece.getMoves(board, row, col);

  addHighlights(moves);

  selectedSquare = square;
  square.classList.add("selected");
}

function addHighlights(moves) {
  moves.forEach((move) => {
    const square = document.querySelector(
      `.square[data-row="${move[0]}"][data-col="${move[1]}"]`
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

function attemptMove(fromSquare, toSquare, board) {
  const from = [+fromSquare.dataset.row, +fromSquare.dataset.col];
  const to = [+toSquare.dataset.row, +toSquare.dataset.col];

  const moves = board
    .getPiece(from[0], from[1])
    .getMoves(board, from[0], from[1]);
  const isValid = moves.some((m) => m[0] === to[0] && m[1] === to[1]);

  if (isValid) {
    board.movePiece(from, to);
    renderBoard(board);

    updateControlLayers(board);
  }
}

function updateControlLayers(board) {
  document.querySelectorAll(".square").forEach((sq) => {
    sq.classList.remove("white-control", "black-control");
  });

  const whiteAttacks = board.getAttackedSquares("white");
  const blackAttacks = board.getAttackedSquares("black");

  whiteAttacks.forEach(([r, c]) => {
    const el = document.querySelector(
      `.square[data-row="${r}"][data-col="${c}"]`
    );
    if (el) el.classList.add("white-control");
  });

  blackAttacks.forEach(([r, c]) => {
    const el = document.querySelector(
      `.square[data-row="${r}"][data-col="${c}"]`
    );
    if (el) el.classList.add("black-control");
  });
}
