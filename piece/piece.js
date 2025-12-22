export default class Piece {
  constructor(color) {
    this.color = color;
    this.moves = [];
  }

  getMoves(board, x, y) {
    return [];
  }
}
