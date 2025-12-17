import Points from "./points.js"; 

const board = document.getElementById("board");

const pieces = [
  ["wr","wn","wb","wq","wk","wb","wn","wr"],
  ["wp","wp","wp","wp","wp","wp","wp","wp"],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["bp","bp","bp","bp","bp","bp","bp","bp"],
  ["br","bn","bb","bq","bk","bb","bn","br"]
];

for (let row = 7; row >= 0; row--) {
    for (let col = 0; col < 8; col++) {
      
      let square = document.createElement("div");
      square.dataset.row = row;
      square.dataset.col = col;
      square.classList.add("square");

      let isDark = (row + col) % 2 === 0;
      square.classList.add(isDark ? "dark" : "light");

      let piece = pieces[row][col];

      if (piece) {

        let img = document.createElement("img");

        img.classList.add("piece");
        img.src = `images/${piece}.png`; 

        img.dataset.row = row;
        img.dataset.col = col;
        img.dataset.piece = piece;

        square.appendChild(img);
      }
      board.appendChild(square);
    }
}

let selectedSquare = null;

board.addEventListener("click", (e) => {

  let square = e.target.closest(".square");
  const img = square.querySelector("img");

  if (!square) return;

  if(!selectedSquare){
    if (!img) return;
    selectSquare(square,img);
    return;
  }
  
  if(selectedSquare === square){
    clearSelection();
    return;
  }

  attenptMove(selectedSquare,square);
  clearSelection();

  if(img){
      selectSquare(square,img);
  }

})

function attenptMove(fromSquare,toSquare){
  const piece = fromSquare.querySelector("img");
  toSquare.appendChild(piece);

  piece.dataset.row = toSquare.dataset.row;
  piece.dataset.col = toSquare.dataset.col;
}

function selectSquare(square,img){
  let selectedRow = img.dataset.row;
  let selectedCol = img.dataset.col;
  let selectedPiece = img.dataset.piece;

  const points = new Points;
  const moves = points.availableMoves(+selectedRow,+selectedCol, selectedPiece[1],  selectedPiece[0]);
  AddHighlights(moves);

  selectedSquare = square;
  square.classList.add("selected");
}

function clearSelection(){
  selectedSquare.classList.remove("selected");
  RemoveHighlight();
  selectedSquare = null;
}

function RemoveHighlight(){
  const highlights = document.querySelectorAll(".square.highlight")
  highlights.forEach (square => {
    square.classList.remove("highlight")
  })
}

function AddHighlights (moves){
  moves.forEach (move => {
    const square = document.querySelector(`.square[data-row="${move[0]}"][data-col="${move[1]}"]`);
    square.classList.add("highlight");
  }) 
}