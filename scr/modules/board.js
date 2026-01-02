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
      return 0;
    }

    if (piece.name === "k") {
      if (piece.color === "white") {
        this.castlingAbility = this.castlingAbility
          .replace("K", "")
          .replace("Q", "");
      } else {
        this.castlingAbility = this.castlingAbility
          .replace("k", "")
          .replace("q", "");
      }

      if (Math.abs(toCol - fromCol) === 2) {
        if (toCol === 6) {
          const rook = this.getPiece(fromRow, 7);
          this.board[fromRow][5] = rook;
          this.board[fromRow][7] = null;
        } else if (toCol === 2) {
          const rook = this.getPiece(fromRow, 0);
          this.board[fromRow][3] = rook;
          this.board[fromRow][0] = null;
        }

        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        return 0;
      }
    }

    if (piece.name === "r") {
      if (piece.color === "white") {
        if (fromRow === 7 && fromCol === 0) {
          this.castlingAbility = this.castlingAbility.replace("Q", "");
        }
        if (fromRow === 7 && fromCol === 7) {
          this.castlingAbility = this.castlingAbility.replace("K", "");
        }
      } else {
        if (fromRow === 0 && fromCol === 0) {
          this.castlingAbility = this.castlingAbility.replace("q", "");
        }
        if (fromRow === 0 && fromCol === 7) {
          this.castlingAbility = this.castlingAbility.replace("k", "");
        }
      }
    }

    if (piece.name === "p") {
      if (piece.color === "white" && fromRow === 1) {
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        return 1;
      }
      if (piece.color === "black" && fromRow === 6) {
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        return 1;
      }
    }

    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;

    return 0;
  }

  getAttackedSquares(color) {
    const attackedSquares = [];

    // console.log("Calculating attacked squares for color:", color);
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.getPiece(r, c);
        if (piece && piece.color === color) {
          const pieceAttacks = piece.getMoves(this, r, c);
          // console.log("Piece at", r, c, "attacks:", pieceAttacks);
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
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];
    for (const [dx, dy] of directions) {
      let new_x = x + dx;
      let new_y = y + dy;

      while (this.inBounds(new_x, new_y)) {
        const target = this.getPiece(new_x, new_y);

        if (target) {
          if (target.color !== color) {
            const targetMoves = target.getMoves(this, new_x, new_y);
            for (const move of targetMoves) {
              if (move[0] === x && move[1] === y) {
                return true;
              }
            }
          }
        }
        new_x += dx;
        new_y += dy;
      }
    }

    const knightMoves = [
      [2, 1],
      [2, -1],
      [-2, 1],
      [-2, -1],
      [1, 2],
      [1, -2],
      [-1, 2],
      [-1, -2],
    ];

    for (const [dx, dy] of knightMoves) {
      const knight_x = x + dx;
      const knight_y = y + dy;

      if (this.inBounds(knight_x, knight_y)) {
        const target = this.getPiece(knight_x, knight_y);
        if (target && target.color !== color && target.name === "n") {
          return true;
        }
      }
    }

    return false;
  }

  promotePiece(fromCoordinate, toCoordinate, color, pieceType) {
    const [fromRow, fromCol] = fromCoordinate;
    const [toRow, toCol] = toCoordinate;

    this.board[toRow][toCol] = new Queen(color, "q");
    this.board[fromRow][fromCol] = null;
  }
}

// let boardInstance = new Board([
//   "rnbqkbnr/8/8/8/8/8/8/RNBQKBNR",
//   "w",
//   "KQkq",
//   "-",
//   "0",
//   "1",
// ]);
// boardInstance.setBoard();

// const piece = boardInstance.getPiece(0, 0);
// console.log(boardInstance.isSquareAttacked(0, 0, "black"));
