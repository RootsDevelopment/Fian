export class ControlPanel {
  constructor(element) {
    this.element = element;
    this.element.classList.add("controls-panel");
    this.element.id = "controls-panel";

    // Add the initialize method to the DOM element
    this.element.initialize = (appState) => {
      this.appState = appState;
      this.render();
      this.attachEvents();
    };
  }

  render() {
    this.element.innerHTML = `
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
                <div class="control-item" data-action="analyze">
                    <span>🎓</span>
                    Analyze
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
  }

  attachEvents() {
    this.element.addEventListener("click", (event) => {
      const actionElement = event.target.closest("[data-action]");
      if (!actionElement) return;
      const action = actionElement.dataset.action;
      switch (action) {
        case "new-game":
          console.log("New Game clicked");
          break;
        case "open":
          console.log("Open clicked");
          break;
        case "save":
          console.log("Save clicked");
          break;
        case "undo":
          console.log("Undo clicked");
          break;
        case "redo":
          console.log("Redo clicked");
          break;
        case "flip-board":
          console.log("Flip Board clicked");
          break;
        case "analyze":
          console.log("Analyze clicked");
          break;
        default:
          console.warn("Unknown action:", action);
      }
    });
  }
}
