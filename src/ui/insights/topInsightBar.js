// ui/insights/TopInsightBar.js
export class TopInsightBar {
  constructor(container, appState) {
    this.container = container;
    this.appState = appState;
    this.currentInsight = null;
    this.insightsList = [];
    this.currentIndex = 0;
    this.isVisible = false;

    this.element = this.create();
    this.container.appendChild(this.element);
    this.attachEvents();
  }

  create() {
    console.log("Creating TopInsightBar element");
    const bar = document.createElement("div");
    bar.id = "top-insight-bar";
    bar.style.cssText = `
      display: none;
      width: 100%;
      background: var(--color-bg-tertiary, #2d2d30);
      border-bottom: 1px solid var(--color-border, #3e3e42);
      padding: 12px 20px;
      align-items: center;
      justify-content: space-between;
      font-family: var(--font-family, -apple-system, monospace);
      height: 70px;
      transition: all 0.2s ease;
    `;

    bar.innerHTML = `
      <div style="display: flex; align-items: center; gap: 16px; flex: 1;">
        <div class="insight-icon" style="
          width: 36px;
          height: 36px;
          background: var(--color-accent-blue, #0078d4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: white;
        ">⚡</div>
        
        <div style="flex: 1;">
          <div class="insight-title" style="
            font-weight: 600;
            color: var(--color-text-secondary, #9cdcfe);
            margin-bottom: 4px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          ">TOP INSIGHT · <span class="insight-counter">1/1</span></div>
          <div class="insight-description" style="
            color: var(--color-text-primary, #cccccc);
            font-size: 13px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 500px;
          ">Analyzing position...</div>
        </div>
      </div>
      
      <div style="display: flex; gap: 8px;">
        <button class="insight-btn-show" style="
          background: var(--color-accent-blue, #0078d4);
          border: none;
          color: white;
          padding: 6px 12px;
          border-radius: var(--border-radius-sm, 3px);
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        "><span>🔍</span> Show</button>
        
        <button class="insight-btn-learn" style="
          background: transparent;
          border: 1px solid var(--color-border, #3e3e42);
          color: var(--color-text-primary, #cccccc);
          padding: 6px 12px;
          border-radius: var(--border-radius-sm, 3px);
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        "><span>📚</span> Learn</button>
        
        <button class="insight-btn-next" style="
          background: transparent;
          border: 1px solid var(--color-border, #3e3e42);
          color: var(--color-text-primary, #cccccc);
          padding: 6px 12px;
          border-radius: var(--border-radius-sm, 3px);
          font-size: 12px;
          cursor: pointer;
        ">➡️ Next</button>
        
        <button class="insight-btn-keep" style="
          background: transparent;
          border: 1px solid var(--color-border, #3e3e42);
          color: var(--color-text-primary, #cccccc);
          padding: 6px 10px;
          border-radius: var(--border-radius-sm, 3px);
          font-size: 14px;
          cursor: pointer;
        " title="Keep insight">📌</button>
        
        <button class="insight-btn-close" style="
          background: transparent;
          border: none;
          color: var(--color-text-muted, #6e7681);
          padding: 6px;
          border-radius: var(--border-radius-sm, 3px);
          font-size: 16px;
          cursor: pointer;
          margin-left: 4px;
        ">✕</button>
      </div>
    `;

    return bar;
  }

  attachEvents() {
    this.element
      .querySelector(".insight-btn-show")
      .addEventListener("click", () => {
        this.showOnBoard();
      });

    this.element
      .querySelector(".insight-btn-learn")
      .addEventListener("click", () => {
        this.learnMore();
      });

    this.element
      .querySelector(".insight-btn-next")
      .addEventListener("click", () => {
        this.nextInsight();
      });

    this.element
      .querySelector(".insight-btn-keep")
      .addEventListener("click", () => {
        this.keepInsight();
      });

    this.element
      .querySelector(".insight-btn-close")
      .addEventListener("click", () => {
        this.hide();
      });
  }

  show(insights) {
    console.log("🎯 TopInsightBar.show called with", insights);

    if (!insights || insights.length === 0) {
      return;
    }

    this.insightsList = insights;
    this.currentIndex = 0;
    this.currentInsight = insights[0];
    this.isVisible = true;

    this.element.style.display = "flex";

    this.updateContent();
  }

  // Also update hide method:
  hide() {
    this.isVisible = false;
    this.element.style.display = "none"; // Make sure this sets to none
  }

  updateContent() {
    if (!this.currentInsight) return;

    const insight = this.currentInsight;
    const metadata = insight.metadata || {};
    const type = metadata.type || "Concept";
    const owner = metadata.owner || "";
    const square = insight.squares?.[0] || "";

    const iconEl = this.element.querySelector(".insight-icon");
    iconEl.innerHTML = this.getIcon(insight);
    iconEl.style.background = this.getColor(metadata.type);

    this.element.querySelector(".insight-counter").textContent =
      `${this.currentIndex + 1}/${this.insightsList.length}`;

    const title = `${type.replace(/([A-Z])/g, " $1").trim()}${square ? ` · ${square}` : ""}${owner ? ` · ${owner}` : ""}`;

    const description =
      insight.description?.description ||
      metadata.explanation?.beginner ||
      `${type} detected. Click Learn to understand more.`;

    let titleEl = this.element.querySelector(".insight-title");
    let descEl = this.element.querySelector(".insight-description");

    if (titleEl) {
      titleEl.innerHTML = `TOP INSIGHT · <span class="insight-counter">${this.currentIndex + 1}/${this.insightsList.length}</span>`;
    }
    if (descEl) {
      descEl.textContent = description;
    }
  }

  getIcon(insight) {
    const type = insight.metadata?.type || "";
    const icons = {
      passedPawn: "🏃",
      isolatedPawn: "🛡️",
      doubledPawn: "⚔️",
      backwardPawn: "🔙",
      pawnChain: "⛓️",
      pawnIsland: "🏝️",
    };
    return icons[type] || "♟️";
  }

  getColor(type) {
    const colors = {
      passedPawn: "var(--color-success, #6a9955)",
      isolatedPawn: "var(--color-error, #f48771)",
      doubledPawn: "var(--color-warning, #dcdcaa)",
      backwardPawn: "var(--color-info, #9cdcfe)",
    };
    return colors[type] || "var(--color-accent-blue, #0078d4)";
  }

  showOnBoard() {
    if (!this.currentInsight || !this.appState.highlightManager) return;

    // Clear existing
    // this.appState.highlightManager.clearHighlights();

    // Highlight this concept
    this.appState.highlightManager.applyConcept(this.currentInsight.concept);

    // If passed pawn, show path
    if (this.currentInsight.metadata?.type === "PASSED") {
      this.showPawnPath();
    }
  }

  showPawnPath() {
    const insight = this.currentInsight;
    const square = insight.squares[0];
    const file = square[0];
    const startRank = parseInt(square[1]);
    const owner = insight.metadata?.owner || "white";
    const direction = owner === "white" ? 1 : -1;

    // Create path squares
    const pathSquares = [];
    for (
      let i = 1;
      i <= (owner === "white" ? 8 - startRank : startRank - 1);
      i++
    ) {
      const rank = startRank + i * direction;
      pathSquares.push(`${file}${rank}`);
    }

    // You'll implement actual path rendering in BoardHighlights
    console.log("Path to promotion:", pathSquares);
  }

  learnMore() {
    if (!this.currentInsight || !this.appState.insightCard) return;

    // Show insight card
    this.appState.insightCard.show(this.currentInsight);
  }

  nextInsight() {
    if (this.insightsList.length === 0) return;

    this.currentIndex = (this.currentIndex + 1) % this.insightsList.length;
    this.currentInsight = this.insightsList[this.currentIndex];
    this.updateContent();
    this.showOnBoard();
  }

  keepInsight() {
    if (!this.currentInsight) return;

    // Add to pinned insights in appState
    if (!this.appState.pinnedInsights) {
      this.appState.pinnedInsights = [];
    }

    // Check if already pinned
    const exists = this.appState.pinnedInsights.some(
      (i) => i.id === this.currentInsight.id,
    );

    if (!exists) {
      this.appState.pinnedInsights.push(this.currentInsight);

      // Update insight list if it exists
      if (this.appState.insightList) {
        this.appState.insightList.updatePinned();
      }

      // Visual feedback
      const btn = this.element.querySelector(".insight-btn-keep");
      btn.style.background = "var(--color-accent-blue)";
      btn.style.color = "white";
      setTimeout(() => {
        btn.style.background = "transparent";
        btn.style.color = "var(--color-text-primary)";
      }, 200);
    }
  }
}
