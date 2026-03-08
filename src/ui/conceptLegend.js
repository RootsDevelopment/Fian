// ui/ConceptLegend.js
export class ConceptLegend {
  constructor(container) {
    this.container = container;
    this.legendElement = null;
    this.conceptSections = new Map();
    this.isVisible = false;
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
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      background: var(--color-bg-secondary, #252526);
      border: 1px solid var(--color-border, #3e3e42);
      border-radius: var(--border-radius-lg, 4px);
      box-shadow: var(--shadow-lg, 0 10px 15px rgba(0,0,0,0.3));
      padding: var(--space-lg, 16px);
      width: 300px;
      max-height: 80vh;
      overflow-y: auto;
      font-family: var(--font-family, -apple-system, monospace);
      z-index: 1000;
      color: var(--color-text-primary, #cccccc);
      display: ${this.isVisible ? "block" : "none"};
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
      margin-bottom: var(--space-md, 12px);
      position: sticky;
      top: 0;
      background: var(--color-bg-tertiary, #2d2d30);
      padding: var(--space-sm, 8px) var(--space-md, 12px);
      border-bottom: 1px solid var(--color-border, #3e3e42);
      border-radius: var(--border-radius-sm, 2px) var(--border-radius-sm, 2px) 0 0;
    `;

    header.innerHTML = `
      <h3 style="margin: 0; font-size: var(--font-size-sm, 12px); color: var(--color-text-secondary, #9cdcfe); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
        📚 Chess Concepts
      </h3>
      <button class="legend-close" style="background: none; border: 1px solid var(--color-border, #3e3e42); color: var(--color-text-muted, #6e7681); font-size: 16px; cursor: pointer; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: var(--border-radius-sm, 2px);">✕</button>
    `;

    header
      .querySelector(".legend-close")
      .addEventListener("click", () => this.hide());

    const closeBtn = header.querySelector(".legend-close");
    closeBtn.addEventListener("mouseenter", () => {
      closeBtn.style.backgroundColor = "var(--color-bg-hover, #2a2a2a)";
      closeBtn.style.color = "var(--color-text-primary, #cccccc)";
    });
    closeBtn.addEventListener("mouseleave", () => {
      closeBtn.style.backgroundColor = "transparent";
      closeBtn.style.color = "var(--color-text-muted, #6e7681)";
    });
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

    wrapper.style.marginBottom = "var(--space-lg, 16px)";

    // Group items by strength
    const strengths = section.items.filter((i) => i.strength === "strength");
    const weaknesses = section.items.filter((i) => i.strength === "weakness");
    const others = section.items.filter(
      (i) => !i.strength || i.strength === "info",
    );

    wrapper.innerHTML = `
      <h4 style="margin: 0 0 var(--space-sm, 8px) 0; font-size: var(--font-size-xs, 11px); color: var(--color-text-muted, #6e7681); text-transform: uppercase; letter-spacing: 0.5px;">
        ${section.name.replace(/([A-Z])/g, " $1").trim()}
      </h4>
      ${this.renderItemGroup("✅ Strengths", strengths, "var(--color-success, #6a9955)")}
      ${this.renderItemGroup("⚠️ Weaknesses", weaknesses, "var(--color-error, #f48771)")}
      ${this.renderItemGroup("ℹ️ Other", others, "var(--color-warning, #dcdcaa)")}
    `;

    return wrapper;
  }

  renderItemGroup(title, items, color) {
    if (!items.length) return "";

    return `
      <div style="margin-bottom: var(--space-sm, 8px);">
        <div style="font-size: var(--font-size-xs, 11px); font-weight: 600; color: ${color}; margin-bottom: var(--space-xs, 4px);">${title}</div>
        ${items
          .map(
            (item) => `
          <div style="display: flex; align-items: center; gap: var(--space-sm, 8px); padding: var(--space-xs, 4px); background: var(--color-bg-tertiary, #2d2d30); border-radius: var(--border-radius-sm, 2px); margin-bottom: 2px;">
            <div style="width: 16px; height: 16px; background: ${item.color}; border-radius: 3px; border: 1px solid var(--color-border, #3e3e42);"></div>
            <span style="font-size: var(--font-size-xs, 11px); color: var(--color-text-primary, #cccccc);">${item.label}</span>
          </div>
        `,
          )
          .join("")}
      </div>
    `;
  }

  toggle() {
    this.isVisible = !this.isVisible;
    if (this.legendElement) {
      this.legendElement.style.display = this.isVisible ? "block" : "none";
    } else {
      this.render(); // Render if not yet rendered
    }
  }

  show() {
    this.isVisible = true;
    if (this.legendElement) {
      this.legendElement.style.display = "block";
    } else {
      this.render();
    }
  }

  hide() {
    this.isVisible = false;
    if (this.legendElement) {
      this.legendElement.style.display = "none";
    }
  }
}
