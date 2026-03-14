import { ControlPanel } from "./controls/control.js";
import { LeftPanel } from "./leftPanel/leftPanel.js";
import { RightPanel } from "./rightPanel/rightPanel.js";

export class LayoutBuilder {
  constructor() {
    this.app = document.getElementById("fian_app");
  }

  build() {
    this.app.innerHTML = "";

    const topBarContainer = document.createElement("div");
    topBarContainer.id = "top-bar-container";
    topBarContainer.style.width = "100%";
    topBarContainer.style.flexShrink = "0";

    const mainContent = document.createElement("div");
    mainContent.className = "app-main";
    mainContent.style.flexDirection = "column";
    mainContent.style.height = "100%";

    const middleSection = document.createElement("div");
    middleSection.style.display = "flex";
    middleSection.style.flex = "1";
    middleSection.style.minHeight = "0";
    middleSection.style.borderBottom = "1px solid var(--color-border)";

    const leftPanel = new LeftPanel(document.createElement("div")).element;
    const boardContainer = this.createBoardContainer();
    const rightPanel = new RightPanel(document.createElement("div")).element;

    middleSection.appendChild(leftPanel);
    middleSection.appendChild(boardContainer);
    middleSection.appendChild(rightPanel);

    const controlsPanel = new ControlPanel(document.createElement("div"))
      .element;

    mainContent.appendChild(topBarContainer);
    mainContent.appendChild(middleSection);
    mainContent.appendChild(controlsPanel);

    this.app.appendChild(mainContent);

    return {
      topBarContainer,
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
