import Board from "./scr/modules/board.js";
import renderBoard, { addEventListeners } from "./scr/ui/render.js";

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

function handleClick(e) {
  console.log("Clicked element:", e.target);
  const square = e.target.closest(".square");

  if (!square) return;

  const row = parseInt(square.dataset.row);
  const col = parseInt(square.dataset.col);

  console.log(`Square clicked: Row ${row}, Col ${col}`);
}
