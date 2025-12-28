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

    for (let row = 0; row < 8; row++) {
      let currRow = rows[row];
      // console.log("Processing row:", currRow);

      let boardRow = [];

      for (let char of currRow) {
        if (!isNaN(char)) {
          let emptySquares = parseInt(char);
          for (let i = 0; i < emptySquares; i++) {
            boardRow.push(null);
          }
        } else {
          boardRow.push(this.createPieceFromFen(char));
        }
      }
      this.board.push(boardRow);
    }
  }

  createPieceFromFen(char) {
    if (char === "") return null;

    const color = char === char.toUpperCase() ? "white" : "black";
    const name = char.toLowerCase();

    switch (char.toLowerCase()) {
      case "r":
        return new Rook(color, name);
      case "n":
        return new Knight(color, name);
      case "b":
        return new Bishop(color, name);
      case "q":
        return new Queen(color, name);
      case "k":
        return new King(color, name);
      case "p":
        return new Pawn(color, name);
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

  movePiece(fromCoordinate, toCoordinate) {
    const [fromRow, fromCol] = fromCoordinate;
    const [toRow, toCol] = toCoordinate;

    const piece = this.getPiece(fromRow, fromCol);

    if (piece === "") {
      return;
    }

    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;
  }

  getAttackedSquares(color) {
    const attackedSquares = [];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.getPiece(r, c);
        if (piece && piece.color === color) {
          const pieceAttacks = piece.getMoves(this, r, c);
          attackedSquares.push(...pieceAttacks);
        }
      }
    }
    return attackedSquares;
  }

  getActiveColor() {
    return this.activeColor;
  }

  switchActiveColor() {
    this.activeColor = this.activeColor === "w" ? "b" : "w";
  }

  getCastlingAbility() {
    const castlingRights = {
      whiteShort: this.castlingAbility.includes("K"),
      whiteLong: this.castlingAbility.includes("Q"),
      blackShort: this.castlingAbility.includes("k"),
      blackLong: this.castlingAbility.includes("q"),
    };

    return castlingRights;
  }
  setCastlingAbility(newAbility) {
    this.castlingAbility = newAbility;
  }

  isSquareAttacked(x, y, color) {
    const attackedSquares = this.getAttackedSquares(color);
    return attackedSquares.some((square) => square[0] === x && square[1] === y);
  }
}

// let boardInstance = new Board([
//   "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
//   "w",
//   "KQkq",
//   "-",
//   "0",
//   "1",
// ]);
// boardInstance.setBoard();

// const piece = boardInstance.getPiece(1, 3);
// const moves = piece.getMoves(boardInstance, 0, 3);
// console.log("name : " + piece.color[0] + piece.name);

// console.log(boardInstance.castlingAbility);
