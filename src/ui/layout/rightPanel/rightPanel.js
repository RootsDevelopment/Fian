export class RightPanel {
  constructor(element) {
    this.element = element;
    this.element.classList.add("right-panel");
    this.element.id = "right-panel";

    // Add the initialize method to the DOM element
    this.element.initialize = (appState) => {
      this.appState = appState;
      this.render();
      this.attachEvents();
    };

    this.highlightManager = null;
    this.engine = null;
    this.game = null;
    this.currentView = "pawn-structure";

    this.aiCoach = null;
    this.pawnStructureView = null;

    this.render();
  }

  render() {
    this.element.innerHTML = `
            <div class="right-panel__header">
                <span>PAWN STRUCTURE</span>
            </div>
            <div class="right-panel__content">
                <div class="feature-card">
                    <div class="feature-card__title">Position Analysis</div>
                    <div class="feature-card__description">
                        Analyze the current position to detect concepts and get AI insights
                    </div>
                    <button class="btn btn--primary" id="analyze-position" style="width: 100%;">
                        <span>🔍</span>
                        Analyze Position
                    </button>
                </div>
                
                <div id="ai-coach-container"></div>
                <div id="concept-details-container"></div>
            </div>
        `;

    // Initialize AI Coach
    // const aiContainer = document.getElementById("ai-coach-container");
    // this.aiCoach = new AICoach(aiContainer, this.highlightManager);

    // Initialize Pawn Structure View
    const conceptContainer = document.getElementById(
      "concept-details-container",
    );
    // this.pawnStructureView = new PawnStructureView(
    //   conceptContainer,
    //   this.highlightManager,
    //   this.engine,
    // );

    this.attachEvents();
  }

  attachEvents() {
    const analyzeBtn = document.getElementById("analyze-position");
    if (analyzeBtn) {
      analyzeBtn.addEventListener("click", () => this.analyzePosition());
    }

    // Listen for AI coach highlight events
    if (this.aiCoach) {
      this.aiCoach.container.addEventListener("coach-highlight-square", (e) => {
        this.highlightSquare(e.detail.square);
      });

      this.aiCoach.container.addEventListener(
        "coach-highlight-concept",
        (e) => {
          this.highlightConcept(e.detail.squares, e.detail.concept);
        },
      );
    }
  }

  async analyzePosition() {
    // Clear previous highlights
    this.highlightManager.clearHighlights();

    // Show thinking state in AI coach
    await this.aiCoach.analyzePosition(this.engine, this.game);

    // Update pawn structure view with analysis
    const analysis = this.engine.analyzeConcept("pawnStructure");
    this.pawnStructureView.update(analysis);

    // Automatically show highlights
    this.highlightManager.toggleConcept("pawnStructure");
    this.pawnStructureView.setHighlightButtonState(true);

    // Update status
    this.updateStatus("Analysis complete");
  }

  highlightSquare(square) {
    // Convert algebraic to row/col and highlight
    // This integrates with your existing highlight system
    console.log("Highlight square from coach:", square);

    // You can trigger your highlight manager here
    // For now, we'll just emit an event that main.js can handle
    const event = new CustomEvent("highlight-square", {
      detail: { square },
    });
    this.container.dispatchEvent(event);
  }

  highlightConcept(squares, concept) {
    console.log("Highlight concept from coach:", concept, squares);

    const event = new CustomEvent("highlight-concept", {
      detail: { squares, concept },
    });
    this.container.dispatchEvent(event);
  }

  updateStatus(message) {
    const statusEl = document.getElementById("position-status");
    if (statusEl) {
      statusEl.textContent = message;
    }
  }

  switchView(viewName) {
    this.currentView = viewName;
    const header = this.container.querySelector(".right-panel__header span");
    if (header) {
      header.textContent = viewName.toUpperCase().replace("-", " ");
    }
  }
}
