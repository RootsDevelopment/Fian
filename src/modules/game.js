import { selectPiece } from "../ui/render.js";
import Board from "./board.js";

export default class Game {
  constructor(fenArray) {
    const [placement, activeColor, castling, enPassant, halfMove, fullMove] =
      fenArray;

    this.board = new Board(placement);

    this.turn = activeColor === "w" ? "white" : "black";
    this.castlingRights = castling;
    this.enPassantTarget = enPassant !== "-" ? enPassant : null;
    this.halfMoveClock = parseInt(halfMove);
    this.fullMoveNumber = parseInt(fullMove);

    this.history = [];
    this.status = "active";
  }

  getLegalMoves(row, col) {
    const piece = this.board.getPiece(row, col);

    if (!piece || piece.color !== this.turn) return [];

    const pseudoMoves = piece.getMoves(this, row, col);

    const legalMoves = [];

    for (const move of pseudoMoves) {
      const testBoard = this.board.clone();
      testBoard.movePiece([row, col], move);

      if (!testBoard.isKingInCheck(piece.color)) {
        legalMoves.push(move);
      }
    }
    return legalMoves;
  }

  async makeMove(from, to) {
    const piece = this.board.getPiece(from[0], from[1]);
    if (!piece || piece.color !== this.turn) return false;

    const legalMoves = this.getLegalMoves(from[0], from[1]);
    const isLegal = legalMoves.some(([r, c]) => r === to[0] && c === to[1]);
    if (!isLegal) return false;

    this.saveHistory({
      from,
      to,
      piece: piece.name,
      color: piece.color,
      fen: this.generateFEN(),
    });

    if (
      piece.name === "p" &&
      this.enPassantTarget &&
      this.coordsToAlgebraic(to[0], to[1]) === this.enPassantTarget
    ) {
      const direction = piece.color === "white" ? 1 : -1;
      this.board.removePiece(to[0] + direction, to[1]);
    }

    this.board.movePiece(from, to);

    if (piece.name === "k" && Math.abs(to[1] - from[1]) === 2) {
      this.handleCastlingRookMove(from, to);
    }

    this.updateCastlingRights(piece, from);

    if (piece.name === "p") {
      if (
        (piece.color === "white" && to[0] === 0) ||
        (piece.color === "black" && to[0] === 7)
      ) {
        await this.handlePromotion(to, piece.color);
      }
    }

    if (piece.name === "p") {
      this.halfMoveClock = 0;
    } else {
      this.halfMoveClock++;
    }

    if (this.turn === "black") {
      this.fullMoveNumber++;
    }

    this.enPassantTarget = null;

    if (piece.name === "p" && Math.abs(to[0] - from[0]) === 2) {
      const direction = piece.color === "white" ? -1 : 1;
      const targetRow = from[0] + direction;
      const targetCol = from[1];
      this.enPassantTarget = this.coordsToAlgebraic(targetRow, targetCol);
    }

    this.switchTurn();
    this.updateGameStatus();
    console.log(this.generateFEN());

    return true;
  }

  coordsToAlgebraic(row, col) {
    const files = "abcdefgh";
    return files[col] + (8 - row);
  }

  algebraicToCoords(square) {
    const files = "abcdefgh";
    const col = files.indexOf(square[0]);
    const row = 8 - parseInt(square[1]);
    return [row, col];
  }

  async handlePromotion(position, color) {
    const [row, col] = position;

    const choice = await selectPiece(color[0]);

    let PieceClass;

    switch (choice) {
      case "q":
        PieceClass = (await import("./piece/queen.js")).default;
        break;
      case "r":
        PieceClass = (await import("./piece/rook.js")).default;
        break;
      case "b":
        PieceClass = (await import("./piece/bishop.js")).default;
        break;
      case "n":
        PieceClass = (await import("./piece/knight.js")).default;
        break;
    }

    this.board.replacePiece(row, col, new PieceClass(color, choice));
  }

  updateCastlingRights(piece, from) {
    const [fromRow, fromCol] = from;

    if (piece.name === "k") {
      if (piece.color === "white") {
        this.castlingRights = this.castlingRights
          .replace("K", "")
          .replace("Q", "");
      } else {
        this.castlingRights = this.castlingRights
          .replace("k", "")
          .replace("q", "");
      }
    }

    if (piece.name === "r") {
      if (piece.color === "white") {
        if (fromRow === 7 && fromCol === 0) {
          this.castlingRights = this.castlingRights.replace("Q", "");
        }
        if (fromRow === 7 && fromCol === 7) {
          this.castlingRights = this.castlingRights.replace("K", "");
        }
      } else {
        if (fromRow === 0 && fromCol === 0) {
          this.castlingRights = this.castlingRights.replace("q", "");
        }
        if (fromRow === 0 && fromCol === 7) {
          this.castlingRights = this.castlingRights.replace("k", "");
        }
      }
    }
  }

  handleCastlingRookMove(from, to) {
    const row = from[0];

    if (to[1] === 6) {
      // short castle
      this.board.movePiece([row, 7], [row, 5]);
    } else {
      // long castle
      this.board.movePiece([row, 0], [row, 3]);
    }
  }

  getCastlingAbility() {
    const castlingRights = {
      whiteShort: this.castlingRights.includes("K"),
      whiteLong: this.castlingRights.includes("Q"),
      blackShort: this.castlingRights.includes("k"),
      blackLong: this.castlingRights.includes("q"),
    };

    return castlingRights;
  }

  updateMoveCounters(moveData) {
    this.halfMoveClock++;
    if (this.turn === "black") {
      this.fullMoveNumber++;
    }
  }

  switchTurn() {
    this.turn = this.turn === "white" ? "black" : "white";
  }

  saveHistory(moveData) {
    this.history.push({
      ...moveData,
    });
  }

  undo() {
    if (!this.history.length) return;

    const previous = this.history.pop();
    this.loadFromFEN(previous.fen);
  }

  loadFromFEN(fenString) {
    const [placement, activeColor, castling, enPassant, halfMove, fullMove] =
      fenString.split(" ");

    this.board = new Board(placement);
    this.turn = activeColor === "w" ? "white" : "black";
    this.castlingRights = castling === "-" ? "" : castling;
    this.enPassantTarget = enPassant === "-" ? null : enPassant;
    this.halfMoveClock = parseInt(halfMove);
    this.fullMoveNumber = parseInt(fullMove);
  }

  generateFEN() {
    const placement = this.generatePlacementFEN();
    const activeColor = this.turn === "white" ? "w" : "b";
    const castling = this.castlingRights.length ? this.castlingRights : "-";
    const enPassant = this.enPassantTarget ? this.enPassantTarget : "-";

    return `${placement} ${activeColor} ${castling} ${enPassant} ${this.halfMoveClock} ${this.fullMoveNumber}`;
  }

  generatePlacementFEN() {
    let fen = "";

    for (let r = 0; r < 8; r++) {
      let emptyCount = 0;

      for (let c = 0; c < 8; c++) {
        const piece = this.board.getPiece(r, c);

        if (!piece) {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            fen += emptyCount;
            emptyCount = 0;
          }

          const symbol =
            piece.color === "white" ? piece.name.toUpperCase() : piece.name;

          fen += symbol;
        }
      }

      if (emptyCount > 0) fen += emptyCount;
      if (r < 7) fen += "/";
    }

    return fen;
  }

  hasAnyLegalMoves(color) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.board.getPiece(r, c);

        if (piece && piece.color === color) {
          const moves = this.getLegalMoves(r, c);
          if (moves.length > 0) {
            return true;
          }
        }
      }
    }

    return false;
  }

  updateGameStatus() {
    const inCheck = this.board.isKingInCheck(this.turn);
    const hasMoves = this.hasAnyLegalMoves(this.turn);

    if (inCheck && !hasMoves) {
      this.status = "checkmate";
      console.log(`Checkmate! ${this.turn} loses.`);
      return;
    }

    if (!inCheck && !hasMoves) {
      this.status = "stalemate";
      console.log("Stalemate!");
      return;
    }

    if (this.halfMoveClock >= 100) {
      this.status = "draw-50move";
      console.log("Draw by 50-move rule.");
      return;
    }

    this.status = "active";
  }

  async makeRandomMove() {
    const moves = [];

    // 1. Collect all legal moves for the current turn
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.board.getPiece(r, c);
        if (piece && piece.color === this.turn) {
          const legal = this.getLegalMoves(r, c);
          for (const move of legal) {
            moves.push({ from: [r, c], to: move });
          }
        }
      }
    }

    // 2. No moves? Game over
    if (moves.length === 0) return false;

    // 3. Pick a random move
    const randomMove = moves[Math.floor(Math.random() * moves.length)];

    // 4. Execute it
    await this.makeMove(randomMove.from, randomMove.to);
    return true;
  }
}
