const boardElement = document.getElementById("board");

export default function renderBoard(boardInstance) {
  boardElement.innerHTML = "";

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.dataset.row = row;
      square.dataset.col = col;
      square.classList.add("square");

      const isDark = (row + col) % 2 === 0;
      square.classList.add(isDark ? "dark" : "light");

      const piece = boardInstance.getPiece(row, col);

      if (piece) {
        const img = document.createElement("img");

        img.classList.add("piece");
        img.src = `images/${piece.color[0] + piece.name}.png`;

        square.appendChild(img);
      }
      boardElement.appendChild(square);
    }
  }
}

export function addEventListeners(handleClick) {
  boardElement.addEventListener("click", handleClick);
}

let selectedSquare = null;

function selectSquare(square, img) {
  let selectedRow = img.dataset.row;
  let selectedCol = img.dataset.col;
  let selectedPiece = img.dataset.piece;

  selectedSquare = square;
  square.classList.add("selected");
}
function clearSelection() {
  selectedSquare.classList.remove("selected");
  selectedSquare = null;
}
