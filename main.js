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

let prevSelectedSquare = null;
let pieceSelected = null;
let selectedRow = null;
let selectedCol = null;
let selectedPiece = null;

board.addEventListener("click", (e) => {

  let selectedSquare = e.target.closest(".square");
  const img = selectedSquare.querySelector("img");

  if (!selectedSquare) return;

  if(!prevSelectedSquare){
    if (!img) return;

    selectSquare(selectedSquare,img);
    return;
  }
  
  if(prevSelectedSquare === selectedSquare){
    clearSelection();
    return;
  }

  clearSelection();

  if(img){
      selectSquare(selectedSquare,img);
  }
})

function selectSquare(square,img){
  selectedRow = img.dataset.row;
  selectedCol = img.dataset.col;
  selectedPiece = img.dataset.piece;

  const points = new Points;
  const moves = points.availableMoves(+selectedRow,+selectedCol, img.dataset.piece[1],  img.dataset.piece[0]);
  AddHighlights(moves);

  prevSelectedSquare = square;
  square.classList.add("selected");
}

function clearSelection(){
  prevSelectedSquare.classList.remove("selected");
  RemoveHighlight();
  prevSelectedSquare = null;
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