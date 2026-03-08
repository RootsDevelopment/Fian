export const HighlightType = {
  SQUARE: "square",
  ARROW: "arrow",
  AREA: "area",
  PIECE: "piece",
};

export function createSquareHighlight({
  concept,
  squares,
  color = "rgba(255, 255, 0, 0.4)",
  label = "",
  priority = 1,
  metadata = {},
  description = null,
}) {
  return {
    id: crypto.randomUUID(),
    concept,
    type: HighlightType.SQUARE,
    squares,
    color,
    label,
    priority,
    metadata,
    description,
  };
}

export function createArrowHighlight({
  concept,
  from,
  to,
  color = "rgba(255, 0, 0, 0.6)",
  label = "",
  priority = 1,
  metadata = {},
  description = null,
}) {
  return {
    id: crypto.randomUUID(),
    concept,
    type: HighlightType.ARROW,
    from,
    to,
    color,
    label,
    priority,
    metadata,
    description,
  };
}
