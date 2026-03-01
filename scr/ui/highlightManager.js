export class HighlightManager {
  constructor(renderer, engine) {
    if (!renderer) {
      console.error("HighlightRenderer is required but was not provided");
    }

    if (!engine) {
      console.error("Engine is required but was not provided");
    }
    this.renderer = renderer;
    this.engine = engine;
    this.activeConcepts = new Set();
    this.lastHighlights = [];
    this.tooltipManager = null;

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  setTooltipManager(tooltipManager) {
    this.tooltipManager = tooltipManager;
  }

  toggleConcept(name) {
    if (this.activeConcepts.has(name)) {
      this.activeConcepts.delete(name);
      this.removeConcept(name);
    } else {
      this.activeConcepts.add(name);
      this.applyConcept(name);
    }
  }

  applyConcept(name) {
    const highlights = this.engine.getConceptHighlights(name);

    if (!Array.isArray(highlights)) {
      console.error(
        `Expected array of highlights from ${name}, got:`,
        highlights,
      );
      return;
    }

    this.lastHighlights = [...this.lastHighlights, ...highlights];

    this.renderer.renderMany(highlights);

    if (this.tooltipManager) {
      setTimeout(() => this.attachTooltipEvents(), 50);
    }
  }

  removeConcept(name) {
    // Clear all and re-render remaining concepts
    this.renderer.clear();
    this.lastHighlights = [];

    // Re-render all active concepts except the one being removed
    this.activeConcepts.forEach((conceptName) => {
      if (conceptName !== name) {
        const highlights = this.engine.getConceptHighlights(conceptName);
        this.lastHighlights = [...this.lastHighlights, ...highlights];
        this.renderer.renderMany(highlights);
      }
    });

    if (this.tooltipManager) {
      setTimeout(() => this.attachTooltipEvents(), 50);
    }
  }

  attachTooltipEvents() {
    // Find all highlight elements
    const highlightElements = document.querySelectorAll("[data-highlight]");

    highlightElements.forEach((element, index) => {
      // Remove existing listeners to avoid duplicates
      element.removeEventListener("mouseenter", this.handleMouseEnter);
      element.removeEventListener("mouseleave", this.handleMouseLeave);
      element.removeEventListener("mousemove", this.handleMouseMove);

      // Add new listeners
      element.addEventListener("mouseenter", this.handleMouseEnter.bind(this));
      element.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
      element.addEventListener("mousemove", this.handleMouseMove.bind(this));

      // Store the highlight index
      element.setAttribute("data-highlight-index", index);

      // element.style.outline = "2px solid red";
      // element.style.outlineOffset = "2px";
    });
  }

  handleMouseEnter(event) {
    const element = event.currentTarget;
    const index = parseInt(element.getAttribute("data-highlight-index"));
    const highlight = this.lastHighlights[index];

    // console.log("Mouse entered highlight element:", {
    //   element,
    //   index,
    //   highlight,
    // });
    if (highlight && this.tooltipManager) {
      const concept = highlight.concept;
      const conceptObj = this.engine.getConcept(concept);

      if (conceptObj && conceptObj.getVisualizer) {
        const visualizer = conceptObj.getVisualizer();
        if (visualizer && visualizer.getEducationalContent) {
          const educational = visualizer.getEducationalContent(highlight);
          if (educational) {
            highlight.description = educational.description;
            highlight.label = educational.label;
          }
        }
      }

      this.tooltipManager.show(highlight, event);
    }
  }

  handleMouseLeave() {
    // console.log("Mouse left highlight element");
    if (this.tooltipManager) {
      this.tooltipManager.hide();
    }
  }

  handleMouseMove(event) {
    if (this.tooltipManager && this.tooltipManager.activeHighlight) {
      this.tooltipManager.updatePosition(event);
    }
  }

  getLastHighlights() {
    return this.lastHighlights;
  }
}
