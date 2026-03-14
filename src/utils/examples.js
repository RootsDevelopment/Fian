// Example positions for quick loading
export const examples = {
  italian: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
  sicilian: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2",
  french: "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
  caro: "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
  start: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
};

// Optional: Named collection with metadata
export const exampleCollection = [
  {
    name: "Italian Game",
    fen: examples.italian,
    description: "Classic opening",
  },
  {
    name: "Sicilian Defense",
    fen: examples.sicilian,
    description: "Sharp counter-attacking",
  },
  {
    name: "French Defense",
    fen: examples.french,
    description: "Solid structure",
  },
  {
    name: "Caro-Kann",
    fen: examples.caro,
    description: "Hyper-solid",
  },
  {
    name: "Starting Position",
    fen: examples.start,
    description: "Fresh game",
  },
];
