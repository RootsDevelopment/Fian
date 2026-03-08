export class LeftPanel {
  constructor(element) {
    this.element = element;
    this.element.classList.add("left-panel");
    this.element.id = "left-panel";

    // Add the initialize method to the DOM element
    this.element.initialize = (appState) => {
      this.appState = appState;
      this.render();
      this.attachEvents();
    };

    // Add utility methods
    this.element.setActiveTool = (toolId) => this.setActiveTool(toolId);
    this.element.toggleFenInput = (show) => this.toggleFenInput(show);
  }

  render() {
    const recentGames = this.appState?.recentGames || [
      { id: 1, name: "Italian Game" },
      { id: 2, name: "Sicilian Defense" },
    ];

    this.element.innerHTML = `
            <div class="left-panel__header">
                <span>EXPLORER</span>
            </div>
            <div class="left-panel__content">
                <!-- POSITION Section -->
                <div class="left-panel__section">
                    <div class="left-panel__section-title">POSITION</div>
                    <div class="action-buttons">
                        <button class="action-btn" data-action="load-fen">
                            <span class="action-btn__icon">📋</span>
                            <span class="action-btn__label">Load FEN</span>
                        </button>
                        <button class="action-btn" data-action="load-example">
                            <span class="action-btn__icon">📂</span>
                            <span class="action-btn__label">Load Example</span>
                        </button>
                        <button class="action-btn" data-action="reset-board">
                            <span class="action-btn__icon">↺</span>
                            <span class="action-btn__label">Reset Board</span>
                        </button>
                        <button class="action-btn" data-action="flip-board">
                            <span class="action-btn__icon">🔄</span>
                            <span class="action-btn__label">Flip Board</span>
                        </button>
                    </div>
                    
                    <div class="fen-input-container" id="fen-input-container">
                        <input type="text" class="fen-input" id="fen-input" 
                               placeholder="Enter FEN string..." 
                               value="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1">
                        <div class="fen-input-actions">
                            <button class="btn fen-btn" id="fen-apply">Apply</button>
                            <button class="btn fen-btn" id="fen-cancel">Cancel</button>
                        </div>
                    </div>
                </div>
                
                <div class="left-panel__divider"></div>
                
                <!-- ANALYSIS Section -->
                <div class="left-panel__section">
                    <div class="left-panel__section-title">ANALYSIS</div>
                    <ul class="nav-menu">
                        <li class="nav-menu__item nav-menu__item--active" data-tool="pawn-structure">
                            <span class="nav-menu__icon">♟️</span>
                            <span class="nav-menu__label">Pawn Structure</span>
                            <span class="nav-menu__badge">Ctrl+P</span>
                        </li>
                        <li class="nav-menu__item" data-tool="position-analysis">
                            <span class="nav-menu__icon">📊</span>
                            <span class="nav-menu__label">Position Analysis</span>
                        </li>
                        <li class="nav-menu__item" data-tool="tactics">
                            <span class="nav-menu__icon">⚡</span>
                            <span class="nav-menu__label">Tactics Finder</span>
                            <span class="nav-menu__badge">Beta</span>
                        </li>
                    </ul>
                </div>
                
                <div class="left-panel__divider"></div>
                
                <!-- STUDY Section -->
                <div class="left-panel__section">
                    <div class="left-panel__section-title">STUDY</div>
                    <ul class="nav-menu">
                        <li class="nav-menu__item" data-tool="endgames">
                            <span class="nav-menu__icon">👑</span>
                            <span class="nav-menu__label">Endgame Guide</span>
                        </li>
                        <li class="nav-menu__item" data-tool="openings">
                            <span class="nav-menu__icon">📚</span>
                            <span class="nav-menu__label">Opening Explorer</span>
                        </li>
                        <li class="nav-menu__item" data-tool="training">
                            <span class="nav-menu__icon">🎯</span>
                            <span class="nav-menu__label">Training Mode</span>
                            <span class="nav-menu__badge">Soon</span>
                        </li>
                    </ul>
                </div>
                
                <div class="left-panel__divider"></div>
                
                <!-- RECENT Section -->
                <div class="left-panel__section">
                    <div class="left-panel__section-title">RECENT</div>
                    <ul class="nav-menu">
                        ${recentGames
                          .map(
                            (game) => `
                            <li class="nav-menu__item" data-recent="${game.id}">
                                <span class="nav-menu__icon">📄</span>
                                <span class="nav-menu__label">${game.name}</span>
                            </li>
                        `,
                          )
                          .join("")}
                    </ul>
                </div>
            </div>
        `;
  }

  attachEvents() {
    // Load FEN button
    this.element
      .querySelector('[data-action="load-fen"]')
      .addEventListener("click", () => {
        this.toggleFenInput(true);
      });

    // Load Example button
    this.element
      .querySelector('[data-action="load-example"]')
      .addEventListener("click", () => {
        if (this.appState.callbacks?.onLoadExample) {
          this.appState.callbacks.onLoadExample();
        }
      });

    // Reset Board button
    this.element
      .querySelector('[data-action="reset-board"]')
      .addEventListener("click", () => {
        if (this.appState.callbacks?.onResetBoard) {
          this.appState.callbacks.onResetBoard();
        }
      });

    // Flip Board button
    this.element
      .querySelector('[data-action="flip-board"]')
      .addEventListener("click", () => {
        if (this.appState.callbacks?.onFlipBoard) {
          this.appState.callbacks.onFlipBoard();
        }
      });

    // FEN Apply button
    this.element.querySelector("#fen-apply").addEventListener("click", () => {
      const fen = this.element.querySelector("#fen-input").value;
      if (this.appState.callbacks?.onLoadFEN) {
        this.appState.callbacks.onLoadFEN(fen);
      }
      this.toggleFenInput(false);
    });

    // FEN Cancel button
    this.element.querySelector("#fen-cancel").addEventListener("click", () => {
      this.toggleFenInput(false);
    });

    // Tool selection
    this.element.querySelectorAll("[data-tool]").forEach((item) => {
      item.addEventListener("click", (e) => {
        const tool = e.currentTarget.dataset.tool;
        this.setActiveTool(tool);

        if (this.appState.callbacks?.onSelectTool) {
          this.appState.callbacks.onSelectTool(tool);
        }
      });
    });

    // Recent items
    this.element.querySelectorAll("[data-recent]").forEach((item) => {
      item.addEventListener("click", (e) => {
        const recentId = e.currentTarget.dataset.recent;
        if (this.appState.callbacks?.onLoadRecent) {
          this.appState.callbacks.onLoadRecent(recentId);
        }
      });
    });
  }

  setActiveTool(toolId) {
    this.element.querySelectorAll("[data-tool]").forEach((item) => {
      item.classList.remove("nav-menu__item--active");
      if (item.dataset.tool === toolId) {
        item.classList.add("nav-menu__item--active");
      }
    });
  }

  toggleFenInput(show) {
    const container = this.element.querySelector("#fen-input-container");
    if (!container) return;

    if (show) {
      container.classList.add("fen-input-container--visible");
      this.element.querySelector("#fen-input").focus();
    } else {
      container.classList.remove("fen-input-container--visible");
    }
  }
}
