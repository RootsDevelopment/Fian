// ui/insights/InsightList.js
export class InsightList {
  constructor(container, appState) {
    this.container = container;
    this.appState = appState;
    this.insights = [];
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div style="padding: var(--space-md);">
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-lg);
        ">
          <div style="
            color: var(--color-text-secondary);
            font-size: var(--font-size-xs);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          ">INSIGHTS <span class="insight-count">(0)</span></div>
          <button class="refresh-insights" style="
            background: transparent;
            border: none;
            color: var(--color-text-muted);
            cursor: pointer;
            font-size: 16px;
          ">↻</button>
        </div>
        
        <div class="insights-container" style="
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        ">
          ${this.renderInsights()}
        </div>
        
        <div class="pinned-section" style="margin-top: var(--space-xl);">
          <div style="
            color: var(--color-text-muted);
            font-size: var(--font-size-xs);
            text-transform: uppercase;
            margin-bottom: var(--space-sm);
          ">PINNED</div>
          <div class="pinned-container">
            ${this.renderPinned()}
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  renderInsights() {
    if (!this.insights || this.insights.length === 0) {
      return `
        <div style="
          color: var(--color-text-muted);
          font-size: var(--font-size-sm);
          text-align: center;
          padding: var(--space-xl);
          border: 1px dashed var(--color-border);
          border-radius: var(--border-radius-md);
        ">
          Click Analyze to find insights
        </div>
      `;
    }

    return this.insights
      .map(
        (insight, index) => `
      <div class="insight-item" data-index="${index}" style="
        padding: var(--space-sm) var(--space-md);
        background: var(--color-bg-tertiary);
        border-radius: var(--border-radius-md);
        border-left: 3px solid ${this.getTypeColor(insight.metadata?.type)};
        cursor: pointer;
        transition: all 0.1s ease;
      ">
        <div style="display: flex; align-items: center; gap: var(--space-sm);">
          <span style="font-size: 18px;">${this.getIcon(insight)}</span>
          <div style="flex: 1;">
            <div style="
              font-weight: 600;
              color: var(--color-text-primary);
              font-size: var(--font-size-sm);
            ">${this.getTitle(insight)}</div>
            <div style="
              color: var(--color-text-muted);
              font-size: var(--font-size-xs);
            ">${insight.squares?.[0] || ""} · ${this.getEval(insight)}</div>
          </div>
          <button class="pin-btn" data-index="${index}" style="
            background: transparent;
            border: none;
            color: var(--color-text-muted);
            cursor: pointer;
            font-size: 14px;
            padding: 4px;
          " title="Pin insight">📌</button>
        </div>
      </div>
    `,
      )
      .join("");
  }

  renderPinned() {
    if (
      !this.appState.pinnedInsights ||
      this.appState.pinnedInsights.length === 0
    ) {
      return `
        <div style="
          color: var(--color-text-muted);
          font-size: var(--font-size-xs);
          padding: var(--space-sm);
        ">
          No pinned insights
        </div>
      `;
    }

    return this.appState.pinnedInsights
      .map(
        (insight, index) => `
      <div class="pinned-item" data-pinned-index="${index}" style="
        padding: var(--space-xs) var(--space-sm);
        background: var(--color-bg-secondary);
        border-radius: var(--border-radius-sm);
        margin-bottom: var(--space-xs);
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        cursor: pointer;
      ">
        <span style="font-size: 14px;">${this.getIcon(insight)}</span>
        <span style="flex: 1; color: var(--color-text-muted); font-size: var(--font-size-xs);">
          ${this.getShortTitle(insight)}
        </span>
        <button class="unpin-btn" data-pinned-index="${index}" style="
          background: transparent;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          font-size: 12px;
          padding: 2px;
        ">✕</button>
      </div>
    `,
      )
      .join("");
  }

  attachEvents() {
    // Refresh button
    this.container
      .querySelector(".refresh-insights")
      ?.addEventListener("click", () => {
        if (this.appState.callbacks?.onAnalyze) {
          this.appState.callbacks.onAnalyze();
        }
      });

    // Insight items
    this.container.querySelectorAll(".insight-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        if (e.target.classList.contains("pin-btn")) return;

        const index = item.dataset.index;
        const insight = this.insights[index];
        if (insight && this.appState.topInsightBar) {
          // Find this insight in the list and show it
          const insightIndex =
            this.appState.topInsightBar.insightsList.findIndex(
              (i) => i.id === insight.id,
            );
          if (insightIndex >= 0) {
            this.appState.topInsightBar.currentIndex = insightIndex;
            this.appState.topInsightBar.currentInsight = insight;
            this.appState.topInsightBar.updateContent();
            this.appState.topInsightBar.showOnBoard();
          }
        }
      });
    });

    // Pin buttons
    this.container.querySelectorAll(".pin-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const index = btn.dataset.index;
        const insight = this.insights[index];

        if (insight) {
          if (!this.appState.pinnedInsights) {
            this.appState.pinnedInsights = [];
          }

          const exists = this.appState.pinnedInsights.some(
            (i) => i.id === insight.id,
          );
          if (!exists) {
            this.appState.pinnedInsights.push(insight);
            this.render(); // Re-render
          }
        }
      });
    });

    // Pinned items
    this.container.querySelectorAll(".pinned-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        if (e.target.classList.contains("unpin-btn")) return;

        const index = item.dataset.pinnedIndex;
        const insight = this.appState.pinnedInsights[index];
        if (insight && this.appState.topInsightBar) {
          // Find in main list
          const mainIndex = this.appState.topInsightBar.insightsList.findIndex(
            (i) => i.id === insight.id,
          );
          if (mainIndex >= 0) {
            this.appState.topInsightBar.currentIndex = mainIndex;
            this.appState.topInsightBar.currentInsight = insight;
            this.appState.topInsightBar.updateContent();
            this.appState.topInsightBar.showOnBoard();
            this.appState.topInsightBar.show();
          }
        }
      });
    });

    // Unpin buttons
    this.container.querySelectorAll(".unpin-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const index = btn.dataset.pinnedIndex;
        this.appState.pinnedInsights.splice(index, 1);
        this.render(); // Re-render
      });
    });
  }

  updateInsights(insights) {
    this.insights = insights || [];
    this.render();
  }

  updatePinned() {
    this.render();
  }

  getIcon(insight) {
    const type = insight.metadata?.type || "";
    const icons = {
      passedPawn: "🏃",
      isolatedPawn: "🛡️",
      doubledPawn: "⚔️",
      backwardPawn: "🔙",
    };
    return icons[type] || "♟️";
  }

  getTypeColor(type) {
    const colors = {
      passedPawn: "var(--color-success, #6a9955)",
      isolatedPawn: "var(--color-error, #f48771)",
      doubledPawn: "var(--color-warning, #dcdcaa)",
      backwardPawn: "var(--color-info, #9cdcfe)",
    };
    return colors[type] || "var(--color-accent-blue)";
  }

  getTitle(insight) {
    const type = insight.metadata?.type || "Concept";
    return type.replace(/([A-Z])/g, " $1").trim();
  }

  getShortTitle(insight) {
    const type = insight.metadata?.type || "Concept";
    const square = insight.squares?.[0] || "";
    return `${type} ${square}`;
  }

  getEval(insight) {
    const evalValue = insight.metadata?.staticEvaluation;
    if (evalValue === undefined) return "?";
    const sign = evalValue > 0 ? "+" : "";
    return `${sign}${evalValue.toFixed(1)}`;
  }
}
