export type GameMode =
  | "tetris"
  | "omok"
  | "jigsaw"
  | "hidden"
  | "difference"
  | "airplane"
  | "whack"
  | "chess"
  | "runner3d"
  | "rhythm"
  | "crystal-puzzle"
  | "neon-stack"
  | "crystal-memory"
  | "helix-jump"
  | "cube-runner"
  | "gem-catcher"
  | "breakout-3d";

export type GameMeta = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  mode: GameMode;
};

export const GAMES: GameMeta[] = [
  { id: "omok", title: "오목", thumbnail: "/assets/omok.svg", description: "AI와 두는 3D 감성 오목 대전", mode: "omok" },
  { id: "jigsaw-puzzle", title: "퍼즐 맞추기", thumbnail: "/assets/jigsaw.svg", description: "숫자 타일을 순서대로 맞추는 슬라이드 퍼즐", mode: "jigsaw" },
  { id: "tetris", title: "테트리스", thumbnail: "/assets/tetris.png", description: "회전/이동/즉시드롭으로 줄을 지우는 클래식 블록 퍼즐", mode: "tetris" },
  { id: "crystal-puzzle", title: "크리스탈 퍼즐", thumbnail: "/assets/crystal-puzzle.svg", description: "크리스탈 블록을 밀어 순서대로 맞추는 고급 3D 슬라이딩 퍼즐", mode: "crystal-puzzle" },
  { id: "neon-stack", title: "네온 스택", thumbnail: "/assets/neon-stack.svg", description: "정확한 타이밍에 블록을 쌓는 3D 스태킹 게임", mode: "neon-stack" },
  { id: "crystal-memory", title: "크리스탈 메모리", thumbnail: "/assets/crystal-memory.svg", description: "3D 카드를 뒤집어 같은 짝을 찾는 메모리 게임", mode: "crystal-memory" },
  { id: "helix-jump", title: "헬릭스 점프", thumbnail: "/assets/helix-jump.svg", description: "나선 플랫폼의 틈새로 공을 떨어뜨리는 3D 게임", mode: "helix-jump" },
  { id: "cube-runner", title: "큐브 러너", thumbnail: "/assets/cube-runner.svg", description: "3D 트랙 위 큐브로 장애물을 피하는 러닝 게임", mode: "cube-runner" },
  { id: "gem-catcher", title: "젬 캐처", thumbnail: "/assets/gem-catcher.svg", description: "하늘에서 떨어지는 3D 보석을 바구니로 받는 게임", mode: "gem-catcher" },
  { id: "breakout-3d", title: "3D 벽돌깨기", thumbnail: "/assets/breakout-3d.svg", description: "클래식 벽돌깨기를 3D로 즐기는 아케이드 게임", mode: "breakout-3d" },
];

export const THUMBNAILS = GAMES.map((g) => g.thumbnail);

export function thumbnailToId(src: string) {
  const hit = GAMES.find((g) => g.thumbnail === src);
  if (hit) return hit.id;
  const file = src.split("/").pop() ?? "";
  return file.replace(/\.[^.]+$/, "").replace(/-local$/, "");
}

export function getGameById(id: string) {
  return GAMES.find((g) => g.id === id);
}
