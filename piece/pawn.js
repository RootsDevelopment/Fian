import Piece from "./piece.js";

export default class Pawn extends Piece {
  getMoves(board, x, y) {
    return this.moves;
  }
}
