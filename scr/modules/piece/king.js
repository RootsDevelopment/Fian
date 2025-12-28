import Piece from "./piece.js";

export default class King extends Piece {
  getMoves(board, x, y) {
    const moves = [];
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

      if (board.inBounds(new_x, new_y)) {
        const target = board.getPiece(new_x, new_y);

        if (!target) {
          moves.push([new_x, new_y]);
        } else {
          if (target.color !== this.color) {
            moves.push([new_x, new_y]);
          }
        }
        new_x += dx;
        new_y += dy;
      }
    }

    if (this.color === "white") {
      const castlingRights = board.getCastlingAbility();
      const row = 7;
      if (y === 4 && x === row) {
        console.log(board.getPiece(row, 7));
        if (
          castlingRights.whiteShort &&
          board.getPiece(row, 5) === null &&
          board.getPiece(row, 6) === null &&
          board.getPiece(row, 7).name === "r" &&
          board.getPiece(row, 7).color === this.color
        ) {
          moves.push([row, 6]);
        }

        if (
          castlingRights.whiteLong &&
          board.getPiece(row, 3) === null &&
          board.getPiece(row, 2) === null &&
          board.getPiece(row, 1) === null &&
          board.getPiece(row, 0).name === "r" &&
          board.getPiece(row, 0).color === this.color
        ) {
          moves.push([row, 2]);
        }
      }
      if (this.color === "black") {
        const castlingRights = board.getCastlingAbility();
        const row = 0;
        if (y === 4 && x === row) {
          if (
            castlingRights.blackShort &&
            board.getPiece(row, 5) === null &&
            board.getPiece(row, 6) === null &&
            board.getPiece(row, 7).name === "r" &&
            board.getPiece(row, 7).color === this.color
          ) {
            moves.push([row, 6]);
          }
          if (
            castlingRights.blackLong &&
            board.getPiece(row, 3) === null &&
            board.getPiece(row, 2) === null &&
            board.getPiece(row, 1) === null &&
            board.getPiece(row, 0).name === "r" &&
            board.getPiece(row, 0).color === this.color
          ) {
            moves.push([row, 2]);
          }
        }
      }
    }
    return moves;
  }
}
