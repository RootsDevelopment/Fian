import Piece from "./piece.js";

export default class Bishop extends Piece {
  getMoves(board, x, y) {
    const moves = [];
    const directions = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];

    for (const [dx, dy] of directions) {
      let new_x = x + dx;
      let new_y = y + dy;

      while (board.inBounds(new_x, new_y)) {
        const target = board.getPiece(new_x, new_y);

        if (!target) {
          moves.push([new_x, new_y]);
        } else {
          if (target.color !== this.color) {
            moves.push([new_x, new_y]);
          }
          break;
        }
        new_x += dx;
        new_y += dy;
      }
    }
    return moves;
  }
}
