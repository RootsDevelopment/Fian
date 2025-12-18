import Points from "./points.js"; 

export default class Board {
    constructor ( container ) {
        this.container = container;
        this.pieces = [
            ["wr","wn","wb","wq","wk","wb","wn","wr"],
            ["wp","wp","wp","wp","wp","wp","wp","wp"],
            ["","","","","","","",""],
            ["","","","","","","",""],
            ["","","","","","","",""],
            ["","","","","","","",""],
            ["bp","bp","bp","bp","bp","bp","bp","bp"],
            ["br","bn","bb","bq","bk","bb","bn","br"]
        ];
        this.selectedSquare = null;
        this.render();
        this.addEventListeners();
    }

    moves = [];

    render() {
        this.container.innerHTML = "";

        for (let row = 7; row >= 0; row--) {
            for (let col = 0; col < 8; col++) {
              
              const square = document.createElement("div");
              square.dataset.row = row;
              square.dataset.col = col;
              square.classList.add("square");
        
              const isDark = (row + col) % 2 === 0;
              square.classList.add(isDark ? "dark" : "light");
        
              const piece = this.pieces[row][col];
        
              if (piece) {
        
                const img = document.createElement("img");
        
                img.classList.add("piece");
                img.src = `images/${piece}.png`; 
        
                img.dataset.row = row;
                img.dataset.col = col;
                img.dataset.piece = piece;
        
                square.appendChild(img);
              }
              this.container.appendChild(square);
            }
        }
    }

    addEventListeners() {
        this.container.addEventListener("click", (e)=> this.handleClick(e));
    }

    handleClick(e) {
        const square = e.target.closest(".square");
        const img = square.querySelector("img");

        if (!square) return;

        if(!this.selectedSquare){
            if (!img) return;
            this.selectSquare(square,img);
            return;
        }
        if(this.selectedSquare === square){
            this.clearSelection();
            return;
        }

        this.attenptMove(this.selectedSquare,square);
        this.clearSelection();

        if(img){
            this.selectSquare(square,img);
        }
    }

    attenptMove(fromSquare,toSquare){

        const exists = this.moves.some(
            arr => JSON.stringify(arr) === JSON.stringify([+toSquare.dataset.row,+toSquare.dataset.col])
        );

        if( exists ) {

            const piece = fromSquare.querySelector("img");

            piece.classList.add("animate");
            piece.addEventListener("animationend", () => {
                piece.classList.remove("animate");
              }, { once: true });


            toSquare.appendChild(piece);
      
            piece.dataset.row = toSquare.dataset.row;
            piece.dataset.col = toSquare.dataset.col;
        }
    }
      
    selectSquare(square,img){
        let selectedRow = img.dataset.row;
        let selectedCol = img.dataset.col;
        let selectedPiece = img.dataset.piece;
      
        const points = new Points;
        this.moves = points.availableMoves(+selectedRow,+selectedCol, selectedPiece[1],  selectedPiece[0]);
        this.addHighlights(this.moves);
      
        this.selectedSquare = square;
        square.classList.add("selected");
    }
      
    clearSelection(){
        this.selectedSquare.classList.remove("selected");
        this.removeHighlight();
        this.selectedSquare = null;
    }
      
    removeHighlight(){
        const highlights = document.querySelectorAll(".square.highlight")
        highlights.forEach (square => {
          square.classList.remove("highlight")
        })
    }

    addHighlights (moves){
        moves.forEach (move => {
          const square = document.querySelector(`.square[data-row="${move[0]}"][data-col="${move[1]}"]`);
          square.classList.add("highlight");
        }) 
    }

}
