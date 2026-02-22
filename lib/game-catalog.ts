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
  | "crystal-puzzle";

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
  { id: "crystal-puzzle", title: "크리스탈 퍼즐", thumbnail: "/assets/crystal-puzzle.svg", description: "크리스탈 블록을 밀어 순서대로 맞추는 고급 3D 슬라이딩 퍼즐", mode: "crystal-puzzle" }
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
