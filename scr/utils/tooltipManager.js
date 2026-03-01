// utils/tooltipManager.js
export class TooltipManager {
  constructor(boardElement) {
    this.boardElement = boardElement;
    this.tooltip = this.createTooltip();
    this.activeHighlight = null;
    this.conceptVisualizers = new Map();
  }

  registerConceptVisualizer(conceptName, visualizer) {
    this.conceptVisualizers.set(conceptName, visualizer);
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
      border-left: 4px solid #4CAF50;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      backdrop-filter: blur(4px);
      border: 1px solid rgba(255,255,255,0.1);
    `;
    document.body.appendChild(tooltip);
    return tooltip;
  }

  show(highlight, event) {
    // console.log("Showing tooltip for highlight:", highlight);

    if (!highlight.description) {
      // console.log("❌ No description in highlight");
      return;
    }

    let descObj;
    if (typeof highlight.description === "string") {
      // If it's a string, create a default object
      descObj = {
        label: highlight.label || "Chess Concept",
        strength: "info",
        description: highlight.description,
        advice: "",
      };
    } else {
      // It's already an object
      descObj = {
        label:
          highlight.description.label || highlight.label || "Chess Concept",
        strength: highlight.description.strength || "info",
        description:
          highlight.description.description || "No description available",
        advice: highlight.description.advice || "",
      };
    }
    const borderColor =
      descObj.strength === "strength"
        ? "#4CAF50"
        : descObj.strength === "weakness"
          ? "#f44336"
          : "#FFC107";

    this.tooltip.style.borderLeftColor = borderColor;

    let content = `
    <div style="font-weight: bold; margin-bottom: 10px; font-size: 16px;">
      ${descObj.label || "Chess Concept"}
    </div>
    <div style="margin-bottom: 12px; color: #e0e0e0;">
      ${descObj.description || "No description available."}
    </div>
  `;

    if (descObj.advice) {
      content += `
      <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #333; color: #4CAF50;">
        <span style="font-weight: bold;">💡 Tip:</span> ${descObj.advice}
      </div>
    `;
    }

    this.tooltip.innerHTML = content;
    this.tooltip.style.display = "block";
    // console.log("Tooltip display set to block");

    this.updatePosition(event);

    this.activeHighlight = highlight;
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

  hide() {
    this.tooltip.style.display = "none";
    this.activeHighlight = null;
  }
}
