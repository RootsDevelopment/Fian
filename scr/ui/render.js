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

export function selectPiece(color) {
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");

  const dialog = document.createElement("div");
  dialog.classList.add("dialog");

  const title = document.createElement("h3");
  title.textContent = "Select promotion piece:";
  dialog.appendChild(title);

  const pieces = ["q", "r", "b", "n"];

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("promotion-buttons");

  pieces.forEach((piece) => {
    const button = document.createElement("button");
    const img = document.createElement("img");
    img.src = `images/${color}${piece}.png`;
    img.classList.add("piece");
    button.appendChild(img);
    button.dataset.piece = piece;

    button.onmousedown = () => {
      button.classList.add("onmousedown");
    };
    button.onmouseout = () => {
      button.classList.add("onmouseout");
    };

    button.onclick = () => {
      document.body.removeChild(overlay);
      console.log("Piece selected:", piece);
    };

    buttonsContainer.appendChild(button);
  });

  dialog.appendChild(buttonsContainer);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
}
