export default class Piece {
  constructor(color, name) {
    this.color = color;
    this.name = name;
  }

  getMoves(board, x, y) {
    return [];
  }
}
