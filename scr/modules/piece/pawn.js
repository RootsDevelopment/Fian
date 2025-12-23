import Piece from "./piece.js";

export default class Pawn extends Piece {
  getMoves(board, x, y) {
    const directions = [
      [1, 0],
      [-1, 0],
    ];

    for (const [dx, dy] of directions) {
      let new_x = x + dx;
      let new_y = y + dy;

      while (board.inBounds(new_x, new_y)) {
        const target = board.getPiece(new_x, new_y);

        if (!target) {
          this.moves.push([new_x, new_y]);
        } else {
          if (target.color !== this.color) {
            this.moves.push([new_x, new_y]);
          }
          break;
        }
        new_x += dx;
        new_y += dy;
      }
    }
    return this.moves;
  }
}
