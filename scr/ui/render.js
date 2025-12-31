const boardElement = document.getElementById("board");

export default function renderBoard(boardInstance) {
  boardElement.innerHTML = "";

  // selectPiece();

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

export function selectPiece() {
  const pieces = ["Queen", "Rook", "Bishop", "Knight"];

  const selectList = document.createElement("select");
  selectList.id = "selectPiece";

  pieces.forEach((piece) => {
    const option = document.createElement("option");
    option.value = piece.toLowerCase();
    option.text = piece;
    selectList.appendChild(option);
  });

  document.body.appendChild(selectList);
  console.log("Piece selection UI added.");
}
