import { ControlPanel } from "./controls/control.js";
import { LeftPanel } from "./leftPanel/leftPanel.js";
import { RightPanel } from "./rightPanel/rightPanel.js";

export class LayoutBuilder {
  constructor() {
    this.app = document.getElementById("fian_app");
  }

  build() {
    this.app.innerHTML = "";

    const mainContent = document.createElement("div");
    mainContent.className = "app-main";

    const leftPanel = new LeftPanel(document.createElement("div")).element;
    const boardContainer = this.createBoardContainer();
    const rightPanel = new RightPanel(document.createElement("div")).element;
    const controlsPanel = new ControlPanel(document.createElement("div"))
      .element;

    mainContent.appendChild(leftPanel);
    mainContent.appendChild(boardContainer);
    mainContent.appendChild(rightPanel);

    this.app.appendChild(mainContent);
    this.app.appendChild(controlsPanel);

    return {
      leftPanel,
      boardContainer,
      rightPanel,
      controlsPanel,
    };
  }

  createBoardContainer() {
    const container = document.createElement("div");
    container.className = "board-container";

    const board = document.getElementById("board");
    if (board) {
      container.appendChild(board);
    } else {
      const newBoard = document.createElement("div");
      newBoard.id = "board";
      container.appendChild(newBoard);
    }

    return container;
  }
}
