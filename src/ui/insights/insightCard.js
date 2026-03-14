// ui/insights/InsightCard.js
export class InsightCard {
  constructor(appState) {
    this.appState = appState;
    this.currentInsight = null;
    this.element = null;
  }

  show(insight) {
    this.currentInsight = insight;

    const card = document.createElement("div");
    card.className = "insight-card-modal";
    card.innerHTML = this.buildHTML(insight);

    // Style the card
    Object.assign(card.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "520px",
      maxWidth: "90vw",
      maxHeight: "80vh",
      overflowY: "auto",
      background: "var(--color-bg-secondary, #252526)",
      border: "1px solid var(--color-border, #3e3e42)",
      borderRadius: "var(--border-radius-lg, 4px)",
      boxShadow: "var(--shadow-lg, 0 10px 15px rgba(0,0,0,0.3))",
      zIndex: "20000",
      fontFamily: "var(--font-family, -apple-system, monospace)",
      color: "var(--color-text-primary, #cccccc)",
    });

    // Remove existing card
    const existing = document.querySelector(".insight-card-modal");
    if (existing) existing.remove();

    document.body.appendChild(card);
    this.element = card;
    this.attachEvents();
  }

  buildHTML(insight) {
    const m = insight.metadata || {};
    const type = m.type || "";
    const square = insight.squares?.[0] || "";

    return `
      <!-- Header -->
      <div style="
        position: sticky;
        top: 0;
        background: var(--color-bg-tertiary, #2d2d30);
        padding: 16px 20px;
        border-bottom: 1px solid var(--color-border, #3e3e42);
        display: flex;
        gap: 16px;
        align-items: center;
      ">
        <span style="font-size: 32px;">${this.getIcon(insight)}</span>
        <div style="flex: 1;">
          <h2 style="margin: 0; color: var(--color-text-secondary, #9cdcfe); font-size: 18px;">
            ${this.formatType(type)}
          </h2>
          <p style="margin: 4px 0 0; color: var(--color-text-muted, #6e7681); font-size: 13px;">
            ${m.owner || ""} · Square ${square}
          </p>
        </div>
        <button class="close-card" style="
          background: transparent;
          border: none;
          color: var(--color-text-muted, #6e7681);
          font-size: 20px;
          cursor: pointer;
          padding: 4px 8px;
        ">✕</button>
      </div>
      
      ${this.buildEvaluation(m)}
      
      <!-- Why it matters -->
      <div style="padding: 16px 20px; border-bottom: 1px solid var(--color-border, #3e3e42);">
        <h3 style="margin: 0 0 8px; color: var(--color-text-secondary, #9cdcfe); font-size: 14px;">
          📚 Why it matters
        </h3>
        <p style="margin: 0; color: var(--color-text-primary, #cccccc); font-size: 13px; line-height: 1.6;">
          ${this.getExplanation(m)}
        </p>
      </div>
      
      ${this.buildPlans(m)}
      
      ${this.buildKeySquares(m)}
      
      <!-- Actions -->
      <div style="
        padding: 16px 20px;
        background: var(--color-bg-tertiary, #2d2d30);
        border-top: 1px solid var(--color-border, #3e3e42);
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        position: sticky;
        bottom: 0;
      ">
        <button class="btn-show" style="
          background: var(--color-accent-blue, #0078d4);
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: var(--border-radius-sm, 3px);
          font-size: 13px;
          cursor: pointer;
        ">🔍 Show on Board</button>
        <button class="btn-pin" style="
          background: transparent;
          border: 1px solid var(--color-border, #3e3e42);
          color: var(--color-text-primary, #cccccc);
          padding: 8px 16px;
          border-radius: var(--border-radius-sm, 3px);
          font-size: 13px;
          cursor: pointer;
        ">📌 Pin Insight</button>
      </div>
    `;
  }

  buildEvaluation(metadata) {
    if (metadata.staticEvaluation === undefined) return "";

    const evalValue = metadata.staticEvaluation;
    const percentage = (evalValue + 5) * 10; // Scale -5 to +5 to 0-100
    const color = evalValue > 0 ? "#4CAF50" : "#f44336";

    return `
      <div style="padding: 16px 20px; border-bottom: 1px solid var(--color-border, #3e3e42);">
        <h3 style="margin: 0 0 12px; color: var(--color-text-secondary, #9cdcfe); font-size: 14px;">
          📊 Evaluation
        </h3>
        <div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: var(--color-text-muted, #6e7681);">Black</span>
            <span style="color: ${color};">${evalValue > 0 ? "+" : ""}${evalValue.toFixed(1)}</span>
            <span style="color: var(--color-text-muted, #6e7681);">White</span>
          </div>
          <div style="
            height: 8px;
            background: var(--color-bg-tertiary, #2d2d30);
            border-radius: 4px;
            overflow: hidden;
          ">
            <div style="width: ${percentage}%; height: 100%; background: ${color};"></div>
          </div>
        </div>
      </div>
    `;
  }

  buildPlans(metadata) {
    if (!metadata.plans) return "";

    const plans = metadata.plans;
    const owner = metadata.owner || "white";
    const opponent = owner === "white" ? "black" : "white";

    return `
      <div style="padding: 16px 20px; border-bottom: 1px solid var(--color-border, #3e3e42);">
        <h3 style="margin: 0 0 12px; color: var(--color-text-secondary, #9cdcfe); font-size: 14px;">
          📋 Strategic Plans
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          ${this.buildPlanColumn(owner, plans.forOwner, true)}
          ${this.buildPlanColumn(opponent, plans.againstOwner, false)}
        </div>
      </div>
    `;
  }

  buildPlanColumn(player, planList, isMain) {
    if (!planList) return "";

    return `
      <div>
        <h4 style="
          margin: 0 0 8px;
          color: ${isMain ? "var(--color-text-primary, #cccccc)" : "var(--color-text-muted, #6e7681)"};
          font-size: 13px;
        ">
          ${player === "white" ? "♔" : "♚"} For ${player}
        </h4>
        <ul style="margin: 0; padding-left: 20px;">
          ${planList
            .map(
              (p) => `
            <li style="
              margin-bottom: 4px;
              color: var(--color-text-muted, #6e7681);
              font-size: 12px;
            ">${p}</li>
          `,
            )
            .join("")}
        </ul>
      </div>
    `;
  }

  buildKeySquares(metadata) {
    if (!metadata.keySquares) return "";

    return `
      <div style="padding: 16px 20px; border-bottom: 1px solid var(--color-border, #3e3e42);">
        <h3 style="margin: 0 0 12px; color: var(--color-text-secondary, #9cdcfe); font-size: 14px;">
          🔑 Key Squares
        </h3>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${Object.entries(metadata.keySquares)
            .map(
              ([role, sq]) => `
            <div class="key-square" data-square="${sq}" style="
              background: var(--color-bg-tertiary, #2d2d30);
              padding: 4px 12px;
              border-radius: 16px;
              font-size: 12px;
              border-left: 3px solid ${this.getRoleColor(role)};
              cursor: pointer;
            ">
              <span style="color: var(--color-text-muted, #6e7681); text-transform: capitalize;">${role}:</span>
              <span style="color: var(--color-text-secondary, #9cdcfe); margin-left: 4px;">${sq}</span>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    `;
  }

  getRoleColor(role) {
    const colors = {
      promotion: "#FFC107",
      blockade: "#f44336",
      supportPoints: "#2196F3",
      keySquares: "#9C27B0",
    };
    return colors[role] || "#4CAF50";
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

  formatType(type) {
    return type.replace(/([A-Z])/g, " $1").trim();
  }

  getExplanation(metadata) {
    return (
      metadata.explanation?.advanced ||
      metadata.explanation?.intermediate ||
      metadata.explanation?.beginner ||
      "This concept affects the position significantly."
    );
  }

  attachEvents() {
    if (!this.element) return;

    this.element.querySelector(".close-card").addEventListener("click", () => {
      this.element.remove();
    });

    this.element.querySelector(".btn-show").addEventListener("click", () => {
      if (this.appState.topInsightBar && this.currentInsight) {
        // Find this insight in top bar
        const index = this.appState.topInsightBar.insightsList.findIndex(
          (i) => i.id === this.currentInsight.id,
        );
        if (index >= 0) {
          this.appState.topInsightBar.currentIndex = index;
          this.appState.topInsightBar.currentInsight = this.currentInsight;
          this.appState.topInsightBar.updateContent();
          this.appState.topInsightBar.showOnBoard();
          this.appState.topInsightBar.show();
        }
      }
      this.element.remove();
    });

    this.element.querySelector(".btn-pin").addEventListener("click", () => {
      if (this.appState.topInsightBar && this.currentInsight) {
        this.appState.topInsightBar.keepInsight();
      }
      this.element.remove();
    });

    this.element.querySelectorAll(".key-square").forEach((el) => {
      el.addEventListener("click", () => {
        const square = el.dataset.square;
        if (square && this.appState.highlightManager) {
          // Highlight just this square temporarily
          console.log("Highlight square:", square);
          // You can implement this in your highlight system
        }
      });
    });
  }
}
