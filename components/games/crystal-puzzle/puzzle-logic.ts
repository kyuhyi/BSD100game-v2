const GRID_SIZE = 4;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;

export type PuzzleState = {
  tiles: number[];
  emptyIndex: number;
  moves: number;
  startTime: number | null;
  isComplete: boolean;
};

export function createInitialState(): PuzzleState {
  const tiles = Array.from({ length: TOTAL_TILES - 1 }, (_, i) => i + 1);
  tiles.push(0);
  return { tiles, emptyIndex: TOTAL_TILES - 1, moves: 0, startTime: null, isComplete: false };
}

export function shufflePuzzle(state: PuzzleState): PuzzleState {
  const tiles = [...state.tiles];
  let emptyIndex = state.emptyIndex;
  for (let i = 0; i < 200; i++) {
    const neighbors = getMovableNeighbors(emptyIndex);
    const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
    [tiles[emptyIndex], tiles[pick]] = [tiles[pick], tiles[emptyIndex]];
    emptyIndex = pick;
  }
  return { ...state, tiles, emptyIndex, moves: 0, startTime: Date.now(), isComplete: false };
}

export function getMovableNeighbors(emptyIndex: number): number[] {
  const row = Math.floor(emptyIndex / GRID_SIZE);
  const col = emptyIndex % GRID_SIZE;
  const neighbors: number[] = [];
  if (row > 0) neighbors.push(emptyIndex - GRID_SIZE);
  if (row < GRID_SIZE - 1) neighbors.push(emptyIndex + GRID_SIZE);
  if (col > 0) neighbors.push(emptyIndex - 1);
  if (col < GRID_SIZE - 1) neighbors.push(emptyIndex + 1);
  return neighbors;
}

export function canMove(tileIndex: number, emptyIndex: number): boolean {
  return getMovableNeighbors(emptyIndex).includes(tileIndex);
}

export function moveTile(state: PuzzleState, tileIndex: number): PuzzleState {
  if (!canMove(tileIndex, state.emptyIndex)) return state;
  const tiles = [...state.tiles];
  [tiles[state.emptyIndex], tiles[tileIndex]] = [tiles[tileIndex], tiles[state.emptyIndex]];
  const isComplete = checkWin(tiles);
  return { ...state, tiles, emptyIndex: tileIndex, moves: state.moves + 1, isComplete };
}

function checkWin(tiles: number[]): boolean {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] !== i + 1) return false;
  }
  return tiles[tiles.length - 1] === 0;
}

export function getTilePosition(index: number) {
  return { row: Math.floor(index / GRID_SIZE), col: index % GRID_SIZE };
}

export function formatTime(ms: number): string {
  if (!ms) return "00:00";
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export { GRID_SIZE };
