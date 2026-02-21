export function registerShortcuts(engine, highlightManager) {
  const shortcutMap = {
    p: "pawnStructure",
    t: "tacticalThreats",
    c: "kingSafety",
    s: "spaceAdvantage",
    f: "filesAndRooks",
  };

  window.addEventListener("keydown", (e) => {
    if (!e.ctrlKey) return;

    const key = e.key.toLowerCase();
    const conceptName = shortcutMap[key];
    if (!conceptName) return;

    e.preventDefault();

    const highlights = engine.run(conceptName);
    console.log(`Toggled concept: ${conceptName}`, highlights);
    highlightManager.toggleConcept(conceptName, highlights);
  });
}
