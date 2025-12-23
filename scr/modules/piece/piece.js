export default class Piece {
  constructor(color, name) {
    this.color = color;
    this.name = name;
    this.moves = [];
  }

  getMoves(board, x, y) {
    return [];
  }
}
