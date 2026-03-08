import renderBoard from "../ui/render.js";
import Game from "../modules/game.js";

export function initializeGame(appState, fenString) {
  const fenParts = fenString.split(" ");
  const defaultParts = ["w", "KQkq", "-", "0", "1"];

  const fullFenParts = [
    fenParts[0],
    fenParts[1] || defaultParts[0],
    fenParts[2] || defaultParts[1],
    fenParts[3] || defaultParts[2],
    fenParts[4] || defaultParts[3],
    fenParts[5] || defaultParts[4],
  ];

  appState.game = new Game(fullFenParts);
  renderBoard(appState.game.board);

  return appState.game;
}

export async function makeMove(appState, fromSquare, toSquare) {
  const from = [+fromSquare.dataset.row, +fromSquare.dataset.col];
  const to = [+toSquare.dataset.row, +toSquare.dataset.col];

  const moved = await appState.game.makeMove(from, to);

  if (moved) {
    renderBoard(appState.game.board);
    updateStatusBar(appState);
  }

  return moved;
}

export async function makeAIMove(appState) {
  if (appState.game.turn === "black" && appState.game.status === "active") {
    console.log("AI is thinking...");
    await new Promise((r) => setTimeout(r, 200));
    await appState.game.makeRandomMove();
    renderBoard(appState.game.board);
    updateStatusBar(appState);
  }
}

export function updateStatusBar(appState) {
  const statusEl = document.getElementById("position-status");
  if (statusEl && appState.game) {
    const turn = appState.game.turn === "w" ? "White" : "Black";
    statusEl.textContent = `${turn} to move`;
    statusEl.style.color = "";
  }
}

export function flipBoard() {
  const board = document.getElementById("board");
  board.classList.toggle("flipped");

  const statusEl = document.getElementById("position-status");
  if (statusEl) {
    statusEl.textContent = board.classList.contains("flipped")
      ? "Board flipped"
      : "Board normal";
    setTimeout(() => updateStatusBar(appState), 1500);
  }
}
