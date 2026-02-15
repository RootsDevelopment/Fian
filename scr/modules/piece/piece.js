export default class Piece {
  constructor(color, name) {
    this.color = color;
    this.name = name;
  }

  getMoves(game, x, y) {
    return [];
  }

  clone() {
    return new this.constructor(this.color, this.name);
  }
}
