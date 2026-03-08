export function normalizeHighlights(highlights) {
  const seen = new Set();
  const result = [];

  highlights
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .forEach((h) => {
      const key = `${h.type || ""}-${h.squares?.join(",") || ""}`;

      if (!seen.has(key)) {
        seen.add(key);
        result.push(h);
      }
    });

  return result;
}
