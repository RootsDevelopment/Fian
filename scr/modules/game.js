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

    this.board.movePiece(from, to);

    if (piece.name === "k" && Math.abs(to[1] - from[1]) === 2) {
      this.handleCastlingRookMove(from, to);
    }

    this.updateCastlingRights(piece, from);

    const movedPiece = this.board.getPiece(to[0], to[1]);
    if (movedPiece.name === "p") {
      if (
        (movedPiece.color === "white" && to[0] === 0) ||
        (movedPiece.color === "black" && to[0] === 7)
      ) {
        await this.handlePromotion(to, movedPiece.color);
      }
    }

    // this.saveHistory();

    // this.switchTurn();

    return true;
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

  saveHistory() {
    this.history.push({
      board: this.board.clone(),
      turn: this.turn,
      castlingRights: this.castlingRights,
      enPassantTarget: this.enPassantTarget,
      halfMoveClock: this.halfMoveClock,
      fullMoveNumber: this.fullMoveNumber,
    });
  }

  undo() {
    if (!this.history.length) return;

    const previous = this.history.pop();

    this.board = previous.board;
    this.turn = previous.turn;
    this.castlingRights = previous.castlingRights;
    this.enPassantTarget = previous.enPassantTarget;
    this.halfMoveClock = previous.halfMoveClock;
    this.fullMoveNumber = previous.fullMoveNumber;
  }
}

/*constructor(initState) {
    this.state = initState;
    this.piecePlacement = initState[0];
    this.activeColor = initState[1];
    this.castlingAbility = initState[2];
    this.enpassent = initState[3];
    this.fiftyRule = initState[4];
    this.numberOfMoves = initState[5];
  }


    if (piece.name === "k") {
      if (piece.color === "white") {
        this.castlingAbility = this.castlingAbility
          .replace("K", "")
          .replace("Q", "");
      } else {
        this.castlingAbility = this.castlingAbility
          .replace("k", "")
          .replace("q", "");
      }

      if (Math.abs(toCol - fromCol) === 2) {
        if (toCol === 6) {
          const rook = this.getPiece(fromRow, 7);
          this.board[fromRow][5] = rook;
          this.board[fromRow][7] = null;
        } else if (toCol === 2) {
          const rook = this.getPiece(fromRow, 0);
          this.board[fromRow][3] = rook;
          this.board[fromRow][0] = null;
        }

        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        return 0;
      }
    }

    if (piece.name === "r") {
      if (piece.color === "white") {
        if (fromRow === 7 && fromCol === 0) {
          this.castlingAbility = this.castlingAbility.replace("Q", "");
        }
        if (fromRow === 7 && fromCol === 7) {
          this.castlingAbility = this.castlingAbility.replace("K", "");
        }
      } else {
        if (fromRow === 0 && fromCol === 0) {
          this.castlingAbility = this.castlingAbility.replace("q", "");
        }
        if (fromRow === 0 && fromCol === 7) {
          this.castlingAbility = this.castlingAbility.replace("k", "");
        }
      }
    }

    if (piece.name === "p") {
      if (piece.color === "white" && fromRow === 1) {
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        return 1;
      }
      if (piece.color === "black" && fromRow === 6) {
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        return 1;
      }
    }

    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;

    return 0;
  }


    getAttackedSquares(color) {
    const attackedSquares = [];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.getPiece(r, c);
        if (piece && piece.color === color) {
          const pieceAttacks = piece.getMoves(this, r, c);
          attackedSquares.push(...pieceAttacks);
        }
      }
    }
    return attackedSquares;
  }

  getActiveColor() {
    return this.activeColor;
  }

  switchActiveColor() {
    this.activeColor = this.activeColor === "w" ? "b" : "w";
  }

  getCastlingAbility() {
    const castlingRights = {
      whiteShort: this.castlingAbility.includes("K"),
      whiteLong: this.castlingAbility.includes("Q"),
      blackShort: this.castlingAbility.includes("k"),
      blackLong: this.castlingAbility.includes("q"),
    };

    return castlingRights;
  }

  setCastlingAbility(newAbility) {
    this.castlingAbility = newAbility;
  }*/
