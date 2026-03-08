// ui/ConceptLegend.js
export class ConceptLegend {
  constructor(container) {
    this.container = container;
    this.legendElement = null;
    this.conceptSections = new Map();
  }

  addConceptSection(conceptName, visualizer) {
    const legendData = visualizer.getLegendData();
    this.conceptSections.set(conceptName, {
      name: conceptName,
      visualizer,
      items: legendData,
    });
  }

  render() {
    if (this.legendElement) {
      this.legendElement.remove();
    }

    this.legendElement = document.createElement("div");
    this.legendElement.className = "concept-legend";
    this.legendElement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      padding: 20px;
      width: 320px;
      max-height: 80vh;
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      z-index: 1000;
    `;

    const header = this.createHeader();
    const content = this.createContent();

    this.legendElement.appendChild(header);
    this.legendElement.appendChild(content);

    this.container.appendChild(this.legendElement);
  }

  createHeader() {
    const header = document.createElement("div");
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      position: sticky;
      top: 0;
      background: white;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    `;

    header.innerHTML = `
      <h3 style="margin: 0; font-size: 18px; color: #1a1a1a;">📚 Chess Concepts</h3>
      <button class="legend-close" style="background: none; border: none; font-size: 20px; cursor: pointer;">✕</button>
    `;

    header
      .querySelector(".legend-close")
      .addEventListener("click", () => this.hide());
    return header;
  }

  createContent() {
    const content = document.createElement("div");

    this.conceptSections.forEach((section, conceptName) => {
      const sectionEl = this.createConceptSection(section);
      content.appendChild(sectionEl);
    });

    return content;
  }

  createConceptSection(section) {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "24px";

    // Group items by strength
    const strengths = section.items.filter((i) => i.strength === "strength");
    const weaknesses = section.items.filter((i) => i.strength === "weakness");
    const others = section.items.filter(
      (i) => !i.strength || i.strength === "info",
    );

    wrapper.innerHTML = `
      <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #333; text-transform: capitalize;">
        ${section.name.replace(/([A-Z])/g, " $1").trim()}
      </h4>
      ${this.renderItemGroup("✅ Strengths", strengths, "#4CAF50")}
      ${this.renderItemGroup("⚠️ Weaknesses", weaknesses, "#f44336")}
      ${this.renderItemGroup("ℹ️ Other", others, "#FFC107")}
    `;

    return wrapper;
  }

  renderItemGroup(title, items, color) {
    if (!items.length) return "";

    return `
      <div style="margin-bottom: 12px;">
        <div style="font-size: 13px; font-weight: 600; color: ${color}; margin-bottom: 6px;">${title}</div>
        ${items
          .map(
            (item) => `
          <div style="display: flex; align-items: center; gap: 8px; padding: 6px; background: #f8f9fa; border-radius: 6px; margin-bottom: 4px;">
            <div style="width: 16px; height: 16px; background: ${item.color}; border-radius: 3px;"></div>
            <span style="font-size: 13px; color: #333;">${item.label}</span>
          </div>
        `,
          )
          .join("")}
      </div>
    `;
  }

  toggle() {
    if (this.legendElement.style.display === "none") {
      this.show();
    } else {
      this.hide();
    }
  }

  show() {
    this.legendElement.style.display = "block";
  }

  hide() {
    this.legendElement.style.display = "none";
  }
}
