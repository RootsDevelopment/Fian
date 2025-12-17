class Board {
    constructor ( initState ) {
        this.state = initState;
        this.piecePlacement = initState[0];
        this.activeColor = initState[1];
        this.castelingAbility = initState[2];
        this.enpassent = initState[3];
        this.fityRule = initState[4];
        this.numberOfMoves = initState[5];
    }

    #board =[];

    Board () {
        console.log(this.state);
        console.log(this.piecePlacement);
    }

    set setPieces( piecePlacement){
        this.piecePlacement = piecePlacement;
    }

    get getPieces () {
        console.log(this.piecePlacement)
    }

    setBoard () {
        let rows = this.piecePlacement.split("/");
        for(let row = 0; row <=7 ; row++ ){

            let currRow = rows[row];
            let currCol = "";
            let boardRow = [];
            
            for(let col = 0; col< currRow.length ;col++){
                currCol += currRow[col];

                if(!isNaN(currCol) ){
                    for(let i = parseInt(currCol) - 1;i>=0;i--){
                        boardRow.push('0');
                    }
                }

                else{
                    boardRow.push(currCol)
                }
                
                currCol = "";
            }
            this.#board.push(boardRow);

        }
    }

    get getBoard (){
        console.log(this.#board)
    }
    
}

let boardInsatnce = new Board(["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", "w", "KQkq", "-", "0", "1"]);
boardInsatnce.setBoard() ;
boardInsatnce.getBoard;