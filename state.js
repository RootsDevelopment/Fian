import Bishop from "./piece/bishop.js";
import King from "./piece/king.js";
import Knight from "./piece/knight.js";
import Pawn from "./piece/pawn.js";
import Queen from "./piece/queen.js";
import Rook from "./piece/rook.js";

export default class Board {
  constructor(initState) {
    this.state = initState;
    this.piecePlacement = initState[0];
    this.activeColor = initState[1];
    this.castlingAbility = initState[2];
    this.enpassent = initState[3];
    this.fiftyRule = initState[4];
    this.numberOfMoves = initState[5];
  }

  board = [];

  setBoard() {
    const rows = this.piecePlacement.split("/");

    for (let row = 0; row <= 7; row++) {
      let currRow = rows[row];
      let currCol = "";
      let boardRow = [];

      for (let col = 0; col < currRow.length; col++) {
        currCol += currRow[col];

        if (!isNaN(currCol)) {
          for (let i = parseInt(currCol) - 1; i >= 0; i--) {
            boardRow.push(null);
          }
        } else {
          boardRow.push(this.createPieceFromFen(currCol));
        }
        currCol = "";
      }
      this.board.push(boardRow);
    }
  }

  createPieceFromFen(char) {
    if (char === "") return null;

    const color = char === char.toUpperCase() ? "white" : "black";

    switch (char.toLowerCase()) {
      case "r":
        return new Rook(color);
      case "n":
        return new Knight(color);
      case "b":
        return new Bishop(color);
      case "q":
        return new Queen(color);
      case "k":
        return new King(color);
      case "p":
        return new Pawn(color);
      default:
        return null;
    }
  }

  getPiece(x, y) {
    return this.board[x][y];
  }

  inBounds(x, y) {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
  }

  updateBoard(fromCoordinate, toCoordinate) {
    const [fromRow, fromCol] = fromCoordinate;
    const [toRow, toCol] = toCoordinate;

    const piece = this.getPiece(fromRow, fromCol);

    if (piece === "") {
      return;
    }

    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;
  }
}

let boardInsatnce = new Board([
  "rnbqkbnr/8/8/8/8/8/8/RNBQKBNR",
  "w",
  "KQkq",
  "-",
  "0",
  "1",
]);
boardInsatnce.setBoard();

const piece = boardInsatnce.getPiece(0, 3);
const moves = piece.getMoves(boardInsatnce, 0, 3);
console.log("moves : " + moves);
