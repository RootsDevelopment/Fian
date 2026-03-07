export class LayoutBuilder {
  constructor() {
    this.app = document.getElementById("fian_app");
  }

  build() {
    this.app.innerHTML = "";

    const mainContent = document.createElement("div");
    mainContent.className = "app-main";

    const leftPanel = this.createLeftPanel();
    const boardContainer = this.createBoardContainer();
    const rightPanel = this.createRightPanel();
    const controlsPanel = this.createControlsPanel();

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

  createLeftPanel() {
    const panel = document.createElement("div");
    panel.className = "left-panel";

    panel.innerHTML = `
            <div class="left-panel__header">
                <span>EXPLORER</span>
            </div>
            <div class="left-panel__content">
                <ul class="nav-menu">
                    <li class="nav-menu__item nav-menu__item--active" data-tool="pawn-structure">
                        <span class="nav-menu__icon">♟️</span>
                        Pawn Structure
                        <span class="nav-menu__badge">Ctrl+P</span>
                    </li>
                    <li class="nav-menu__item" data-tool="position-analysis">
                        <span class="nav-menu__icon">📊</span>
                        Position Analysis
                    </li>
                    <li class="nav-menu__item" data-tool="tactics">
                        <span class="nav-menu__icon">⚡</span>
                        Tactics Finder
                    </li>
                    <li class="nav-menu__item" data-tool="endgames">
                        <span class="nav-menu__icon">👑</span>
                        Endgame Guide
                    </li>
                    <li class="nav-menu__item" data-tool="openings">
                        <span class="nav-menu__icon">📚</span>
                        Opening Explorer
                    </li>
                </ul>
                
                <div class="section-title">Recent</div>
                
                <ul class="nav-menu">
                    <li class="nav-menu__item" data-tool="game-1">
                        <span class="nav-menu__icon">📄</span>
                        game_vs_magnus.pgn
                    </li>
                    <li class="nav-menu__item" data-tool="game-2">
                        <span class="nav-menu__icon">📄</span>
                        training_session.pgn
                    </li>
                </ul>
            </div>
        `;

    return panel;
  }

  createRightPanel() {
    const panel = document.createElement("div");
    panel.className = "right-panel";

    panel.innerHTML = `
            <div class="right-panel__header">
                <span>PAWN STRUCTURE</span>
            </div>
            <div class="right-panel__content" id="tool-content">
                <!-- Content will be loaded by JS -->
            </div>
        `;

    return panel;
  }

  createControlsPanel() {
    const panel = document.createElement("div");
    panel.className = "controls-panel"; // We'll add this CSS next

    panel.innerHTML = `
            <div class="control-group">
                <div class="control-item" data-action="new-game">
                    <span>📄</span>
                    New
                </div>
                <div class="control-item" data-action="open">
                    <span>📂</span>
                    Open
                </div>
                <div class="control-item" data-action="save">
                    <span>💾</span>
                    Save
                </div>
                <div class="control-divider"></div>
                <div class="control-item" data-action="undo">
                    <span>↩</span>
                    Undo
                </div>
                <div class="control-item" data-action="redo">
                    <span>↪</span>
                    Redo
                </div>
                <div class="control-divider"></div>
                <div class="control-item" data-action="flip-board">
                    <span>🔄</span>
                    Flip
                </div>
            </div>
            <div class="status-indicator">
                <span class="indicator-dot"></span>
                <span id="position-status">Starting position</span>
                <span class="kbd-shortcut">
                    <span class="kbd">Ctrl</span>
                    <span class="kbd">P</span>
                </span>
            </div>
        `;

    return panel;
  }
}
