import Piece from "./piece.js";

export default class Pawn extends Piece {
  getMoves(board, x, y) {
    const moves = [];
    const direction = this.color === "white" ? -1 : 1;
    const startRank = this.color === "white" ? 6 : 1;

    const forwardOneX = x + direction;
    if (board.inBounds(forwardOneX, y) && !board.getPiece(forwardOneX, y)) {
      moves.push([forwardOneX, y]);

      const forwardTwoX = x + 2 * direction;
      if (
        x === startRank &&
        board.inBounds(forwardTwoX, y) &&
        !board.getPiece(forwardTwoX, y)
      ) {
        moves.push([forwardTwoX, y]);
      }
    }

    const captureLeftY = y - 1;
    const captureRightY = y + 1;

    if (board.inBounds(forwardOneX, captureLeftY)) {
      const target = board.getPiece(forwardOneX, captureLeftY);
      if (target && target.color !== this.color) {
        moves.push([forwardOneX, captureLeftY]);
      }
    }

    if (board.inBounds(forwardOneX, captureRightY)) {
      const target = board.getPiece(forwardOneX, captureRightY);
      if (target && target.color !== this.color) {
        moves.push([forwardOneX, captureRightY]);
      }
    }
    return moves;
  }
}
