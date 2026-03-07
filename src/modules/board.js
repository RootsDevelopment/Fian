import Bishop from "./piece/bishop.js";
import King from "./piece/king.js";
import Knight from "./piece/knight.js";
import Pawn from "./piece/pawn.js";
import Queen from "./piece/queen.js";
import Rook from "./piece/rook.js";

export default class Board {
  constructor(fen) {
    this.board = [];
    this.loadFromFEN(fen);
  }

  loadFromFEN(fen) {
    this.board = [];
    const rows = fen.split("/");

    for (let row = 0; row < 8; row++) {
      let currRow = rows[row];

      let boardRow = [];

      for (let char of currRow) {
        if (!isNaN(char)) {
          for (let i = 0; i < parseInt(char); i++) {
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
    return this.board[x][y] || null;
  }

  inBounds(x, y) {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
  }

  movePiece(fromCoordinate, toCoordinate) {
    const [fromRow, fromCol] = fromCoordinate;
    const [toRow, toCol] = toCoordinate;

    const piece = this.getPiece(fromRow, fromCol);

    if (!piece) return false;

    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;
    return true;
  }

  replacePiece(row, col, newPiece) {
    this.board[row][col] = newPiece;
  }

  removePiece(row, col) {
    this.board[row][col] = null;
  }

  isSquareAttacked(x, y, color) {
    const opponent = color === "white" ? "black" : "white";

    const rookDirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    const bishopDirs = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];

    for (const [dx, dy] of [...rookDirs, ...bishopDirs]) {
      let nx = x + dx;
      let ny = y + dy;

      while (this.inBounds(nx, ny)) {
        const target = this.getPiece(nx, ny);

        if (target) {
          if (target.color === opponent) {
            if (
              (dx === 0 || dy === 0) &&
              (target.name === "r" || target.name === "q")
            )
              return true;

            if (
              dx !== 0 &&
              dy !== 0 &&
              (target.name === "b" || target.name === "q")
            )
              return true;
          }
          break;
        }

        nx += dx;
        ny += dy;
      }
    }

    // Knight attacks
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
      const nx = x + dx;
      const ny = y + dy;
      if (!this.inBounds(nx, ny)) continue;
      const target = this.getPiece(nx, ny);
      if (target && target.color === opponent && target.name === "n")
        return true;
    }

    const pawnDir = opponent === "white" ? -1 : 1;
    for (const dy of [-1, 1]) {
      const nx = x + pawnDir;
      const ny = y + dy;
      if (!this.inBounds(nx, ny)) continue;
      const target = this.getPiece(nx, ny);
      if (target && target.color === opponent && target.name === "p")
        return true;
    }

    const kingMoves = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];

    for (const [dx, dy] of kingMoves) {
      const nx = x + dx;
      const ny = y + dy;
      if (!this.inBounds(nx, ny)) continue;
      const target = this.getPiece(nx, ny);
      if (target && target.color === opponent && target.name === "k")
        return true;
    }

    return false;
  }

  isKingInCheck(color) {
    let kingPos = null;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.getPiece(r, c);
        if (piece && piece.color === color && piece.name === "k") {
          kingPos = [r, c];
          break;
        }
      }
    }
    if (!kingPos) return false;
    return this.isSquareAttacked(kingPos[0], kingPos[1], color);
  }

  clone() {
    const newBoard = new Board("8/8/8/8/8/8/8/8");

    newBoard.board = this.board.map((row) =>
      row.map((piece) => (piece ? piece.clone() : null)),
    );

    return newBoard;
  }
}
