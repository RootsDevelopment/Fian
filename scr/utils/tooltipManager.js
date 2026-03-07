// utils/tooltipManager.js
export class TooltipManager {
  constructor(boardElement) {
    this.boardElement = boardElement;
    this.tooltip = this.createTooltip();
    this.activeHighlight = null;
    this.pinnedHighlight = null;
    this.isPinned = false;
    this.conceptVisualizers = new Map();

    // Bind all methods
    // Bind methods
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleBoardClick = this.handleBoardClick.bind(this);
    this.unpinHighlight = this.unpinHighlight.bind(this);
    this.handleUnpinClick = this.handleUnpinClick.bind(this);
    // Add board click listener
    this.boardElement.addEventListener("click", this.handleBoardClick);
    document.addEventListener("click", this.handleDocumentClick);
  }

  createTooltip() {
    let tooltip = document.querySelector(".chess-tooltip");
    if (tooltip) {
      return tooltip;
    }

    tooltip = document.createElement("div");
    tooltip.className = "chess-tooltip";
    tooltip.style.cssText = `
      position: absolute;
      display: none;
      background: rgba(0, 0, 0, 0.95);
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      font-size: 14px;
      max-width: 320px;
      z-index: 10000;
      pointer-events: none;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      backdrop-filter: blur(4px);
      border: 1px solid rgba(255,255,255,0.1);
      transition: opacity 0.15s ease;
    `;
    document.body.appendChild(tooltip);
    return tooltip;
  }

  handleBoardClick(e) {
    const highlightEl = e.target.closest("[data-highlight]");

    if (highlightEl) {
      e.stopPropagation();

      const concept = highlightEl.getAttribute("data-concept");
      const type = highlightEl.getAttribute("data-type");

      // Find the highlight (you might need to pass highlights from main)
      // For now, use activeHighlight from last hover
      if (this.activeHighlight) {
        // Check if this is the same highlight
        if (
          this.activeHighlight.concept === concept &&
          this.activeHighlight.metadata?.type === type
        ) {
          this.pinHighlight(this.activeHighlight, e);
        }
      }
    }
  }
  handleDocumentClick(e) {
    // Clicked outside the tooltip and not on a highlight
    if (
      !e.target.closest(".chess-tooltip") &&
      !e.target.closest("[data-highlight]")
    ) {
      this.unpinHighlight();
    }
  }

  show(highlight, event, isPinned = true) {
    if (this.isPinned && !isPinned) return;
    console.log("Showing tooltip for highlight:", highlight);

    if (!highlight.description) {
      return;
    }

    let descObj;
    if (typeof highlight.description === "string") {
      descObj = {
        label: highlight.label || "Chess Concept",
        strength: "info",
        description: highlight.description,
        advice: "",
      };
    } else {
      descObj = {
        label:
          highlight.label || highlight.description.label || "Chess Concept",
        strength: highlight.description.strength || "info",
        description:
          highlight.description.description || "No description available",
        advice: highlight.description.advice || "",
      };
    }

    // Set border color based on strength
    const borderColor =
      descObj.strength === "strength"
        ? "#4CAF50"
        : descObj.strength === "weakness"
          ? "#f44336"
          : "#FFC107";

    this.tooltip.style.borderLeft = `4px solid ${borderColor}`;

    // Build enhanced content
    let content = this.buildEnhancedContent(highlight, descObj);

    if (isPinned) {
      console.log("Pinning highlight:", highlight);
      content = this.addPinButton(content);
      this.tooltip.style.pointerEvents = "auto";
      this.tooltip.classList.add("pinned");
    } else {
      this.tooltip.style.pointerEvents = "none";
      this.tooltip.classList.remove("pinned");
    }

    this.tooltip.innerHTML = content;
    this.tooltip.style.display = "block";

    if (!isPinned) {
      this.updatePosition(event);
    } else {
      // Center in viewport when pinned
      this.centerInViewport();
    }
    // this.updatePosition(event);
    this.activeHighlight = highlight;
  }

  // 4. Update addPinButton to use bound method
  addPinButton(content) {
    return `
    <div style="position: relative;">
      <button class="unpin-btn" style="
        position: absolute;
        top: -8px;
        right: -8px;
        background: #333;
        border: 1px solid #555;
        color: white;
        cursor: pointer;
        font-size: 14px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: auto;
        z-index: 10001;
        transition: all 0.2s;
      " title="Unpin (click to close)">
        ✕
      </button>
      ${content}
    </div>
  `;
  }

  buildEnhancedContent(highlight, descObj) {
    console.log("Building enhanced content for highlight:", highlight, descObj);
    const metadata = highlight.metadata || {};
    const type = metadata.type || "";

    // Get icon based on concept and type
    const icon = this.getIconForType(highlight.concept, type);

    // Build metadata badges
    const metadataBadges = this.buildMetadataBadges(metadata);

    // Build evaluation if available
    const evalHtml =
      metadata.staticEvaluation !== undefined
        ? this.buildEvaluationBadge(metadata.staticEvaluation)
        : "";

    return `
      <div style="display: flex; align-items: center; margin-bottom: 12px; gap: 10px;">
        <span style="font-size: 24px;">${icon}</span>
        <div style="flex: 1;">
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 2px;">
            ${descObj.label}
          </div>
          ${type ? `<div style="font-size: 12px; color: #aaa; text-transform: capitalize;">${type.replace(/([A-Z])/g, " $1").trim()}</div>` : ""}
        </div>
        ${evalHtml}
      </div>
      
      ${
        metadataBadges
          ? `
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
          ${metadataBadges}
        </div>
      `
          : ""
      }
      
      <div style="margin-bottom: 16px; color: #e0e0e0; font-size: 14px; line-height: 1.6;">
        ${descObj.description}
      </div>
      
      ${metadata.plans ? this.buildPlansSection(metadata) : ""}
      
      ${
        descObj.advice
          ? `
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #333; display: flex; gap: 10px; align-items: flex-start; background: rgba(76, 175, 80, 0.1); padding: 12px; border-radius: 8px; margin-top: 12px;">
          <span style="font-size: 20px;">💡</span>
          <div style="color: #a5d6a7; font-size: 13px; line-height: 1.5;">
            ${descObj.advice}
          </div>
        </div>
      `
          : ""
      }
      
      ${metadata.explanation ? this.buildExplanationSection(metadata) : ""}
    `;
  }

  getIconForType(concept, type) {
    const icons = {
      pawnStructure: {
        isolatedPawn: "🛡️",
        doubledPawn: "⚔️",
        passedPawn: "🏃",
        backwardPawn: "🔙",
        pawnChain: "⛓️",
        pawnIsland: "🏝️",
        hangingPawn: "🎯",
        protectedPawn: "🛡️",
        lever: "🔧",
      },
    };

    // Default icons by concept
    const defaultIcons = {
      pawnStructure: "♟️",
      pieceActivity: "♘",
      kingSafety: "♔",
      space: "📏",
      development: "⏱️",
    };

    return icons[concept]?.[type] || defaultIcons[concept] || "📌";
  }

  buildMetadataBadges(metadata) {
    const badges = [];

    if (metadata.owner) {
      badges.push(`
        <span style="
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
          font-size: 12px;
          border-left: 2px solid ${metadata.owner === "white" ? "#fff" : "#666"};
        ">
          <span>${metadata.owner === "white" ? "♔" : "♚"}</span>
          <span>${metadata.owner}</span>
        </span>
      `);
    }

    if (metadata.structural !== undefined) {
      badges.push(`
        <span style="
          padding: 4px 10px;
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
          font-size: 12px;
        ">
          ${metadata.structural ? "🏗️ Structural" : "⚡ Dynamic"}
        </span>
      `);
    }

    if (metadata.difficulty) {
      const colors = {
        beginner: "#4CAF50",
        intermediate: "#FF9800",
        advanced: "#f44336",
      };
      badges.push(`
        <span style="
          padding: 4px 10px;
          background: ${colors[metadata.difficulty]}20;
          border-radius: 20px;
          font-size: 12px;
          color: ${colors[metadata.difficulty]};
        ">
          ${metadata.difficulty}
        </span>
      `);
    }

    return badges.join("");
  }

  buildEvaluationBadge(evaluation) {
    const evalValue = typeof evaluation === "number" ? evaluation : 0;
    const color =
      evalValue > 0.3
        ? "#4CAF50"
        : evalValue > 0
          ? "#8BC34A"
          : evalValue > -0.3
            ? "#FFC107"
            : evalValue > -0.7
              ? "#FF9800"
              : "#f44336";
    const sign = evalValue > 0 ? "+" : "";

    return `
      <span style="
        padding: 4px 10px;
        background: ${color}20;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        color: ${color};
      ">
        ${sign}${evalValue.toFixed(1)}
      </span>
    `;
  }

  buildPlansSection(metadata) {
    const plans = metadata.plans;
    const owner = metadata.owner || "white";
    const opponent = owner === "white" ? "black" : "white";

    let html = `
      <div style="margin: 16px 0; background: rgba(255,255,255,0.02); border-radius: 8px; padding: 12px;">
      <div style="font-weight: 600; margin-bottom: 12px; font-size: 13px; color: #aaa; text-transform: uppercase; letter-spacing: 0.5px;">
        Strategic Plans
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
    `;

    if (plans.forOwner) {
      html += `
        <div style="background: rgba(255,255,255,0.03); border-radius: 6px; padding: 10px;">
          <div style="font-weight: 600; margin-bottom: 8px; font-size: 13px; color: #fff; display: flex; align-items: center; gap: 4px;">
            <span>${owner === "white" ? "♔" : "♚"}</span> For ${owner}
          </div>
          <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #ccc;">
            ${plans.forOwner.map((plan) => `<li style="margin-bottom: 4px;">${plan}</li>`).join("")}
          </ul>
        </div>
      `;
    }

    if (plans.againstOwner) {
      html += `
        <div style="background: rgba(0,0,0,0.2); border-radius: 6px; padding: 10px;">
          <div style="font-weight: 600; margin-bottom: 8px; font-size: 13px; color: #aaa; display: flex; align-items: center; gap: 4px;">
            <span>${opponent === "white" ? "♔" : "♚"}</span> For ${opponent}
          </div>
          <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #aaa;">
            ${plans.againstOwner.map((plan) => `<li style="margin-bottom: 4px;">${plan}</li>`).join("")}
          </ul>
        </div>
      `;
    }

    html += "</div></div>";
    return html;
  }

  buildExplanationSection(metadata) {
    if (!metadata.explanation) return "";

    // Just show advanced explanation if available, otherwise intermediate/beginner
    const explanationText =
      metadata.explanation.advanced ||
      metadata.explanation.intermediate ||
      metadata.explanation.beginner ||
      "";

    if (!explanationText) return "";

    return `
      <details style="margin-top: 12px;">
        <summary style="cursor: pointer; color: #888; font-size: 12px; padding: 8px 0;">
          📚 Learn more
        </summary>
        <div style="margin-top: 8px; padding: 12px; background: rgba(255,255,255,0.02); border-radius: 8px; font-size: 12px; color: #bbb; line-height: 1.6;">
          ${explanationText}
        </div>
      </details>
    `;
  }

  updatePosition(event) {
    const padding = 20;
    let x = event.clientX + padding;
    let y = event.clientY + padding;

    const tooltipRect = this.tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (x + tooltipRect.width > viewportWidth - padding) {
      x = event.clientX - tooltipRect.width - padding;
    }

    if (y + tooltipRect.height > viewportHeight - padding) {
      y = event.clientY - tooltipRect.height - padding;
    }

    this.tooltip.style.left = Math.max(padding, x) + "px";
    this.tooltip.style.top = Math.max(padding, y) + "px";
  }

  // 5. Add unpin click handler
  handleUnpinClick(e) {
    e.stopPropagation();
    this.unpinHighlight();
  }

  // 6. Update pinHighlight method
  pinHighlight(highlight, event) {
    this.isPinned = true;
    this.pinnedHighlight = highlight;
    this.show(highlight, event, true);

    // Add click handler to unpin button
    const unpinBtn = this.tooltip.querySelector(".unpin-btn");
    if (unpinBtn) {
      unpinBtn.addEventListener("click", this.handleUnpinClick);
    }
  }

  // 7. Update unpinHighlight method
  unpinHighlight() {
    this.isPinned = false;
    this.pinnedHighlight = null;
    this.tooltip.style.pointerEvents = "none";
    this.tooltip.classList.remove("pinned");
    this.hide();
  }

  // 8. Update hide method
  hide() {
    // Don't hide if pinned
    if (this.isPinned) return;

    this.tooltip.style.display = "none";
    this.activeHighlight = null;
  }

  unpinHighlight() {
    this.isPinned = false;
    this.pinnedHighlight = null;
    this.tooltip.style.pointerEvents = "none";
    this.tooltip.classList.remove("pinned");
    this.hide();
  }
  // 9. Add destroy method for cleanup
  destroy() {
    this.boardElement.removeEventListener("click", this.handleBoardClick);
    document.removeEventListener("click", this.handleDocumentClick);
  }

  centerInViewport() {
    const tooltipRect = this.tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const left = (viewportWidth - tooltipRect.width) / 2;
    const top = (viewportHeight - tooltipRect.height) / 2;

    this.tooltip.style.left = left + "px";
    this.tooltip.style.top = top + "px";
  }
}
