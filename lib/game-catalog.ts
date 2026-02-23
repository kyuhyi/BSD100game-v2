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
  | "breakout-3d"
  | "orbital-dash"
  | "neon-pong"
  | "prism-shooter"
  | "proverb-quiz"
  | "color-rush-game"
  | "space-defender"
  | "math-blitz"
  | "reflex-master"
  | "beat-catcher"
  | "emoji-match"
  | "word-scramble"
  | "simon-says"
  | "tap-frenzy"
  | "tnt-run"
  | "spleef"
  | "parkour"
  | "target-shooter"
  | "obstacle-race"
  | "balloon-archer"
  | "iframe";

export type GameMeta = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  mode: GameMode;
  url?: string;  // iframe 게임용 외부 URL
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
  { id: "orbital-dash", title: "오비탈 대시", thumbnail: "/assets/orbital-dash.svg", description: "회전하는 궤도 위에서 장애물을 피하는 3D 러너", mode: "orbital-dash" },
  { id: "neon-pong", title: "네온 핑퐁", thumbnail: "/assets/neon-pong.svg", description: "화려한 네온 스타일의 3D 핑퐁 대전", mode: "neon-pong" },
  { id: "prism-shooter", title: "프리즘 슈터", thumbnail: "/assets/prism-shooter.svg", description: "빛나는 크리스탈을 클릭해서 파괴하는 슈팅 게임", mode: "prism-shooter" },
  { id: "proverb-quiz", title: "한글 속담 퀴즈", thumbnail: "/assets/proverb-quiz.svg", description: "빈칸에 들어갈 속담을 맞춰보세요", mode: "proverb-quiz" },
  { id: "color-rush-game", title: "컬러 러시", thumbnail: "/assets/color-rush-game.svg", description: "글자의 뜻과 색이 같은지 빠르게 판단하세요", mode: "color-rush-game" },
  { id: "space-defender", title: "스페이스 디펜더", thumbnail: "/assets/space-defender.svg", description: "적을 격추하고 지구를 지켜라", mode: "space-defender" },
  { id: "math-blitz", title: "넘버 크런치", thumbnail: "/assets/math-blitz.svg", description: "빠르게 암산하고 정답을 고르세요", mode: "math-blitz" },
  { id: "reflex-master", title: "반응속도 마스터", thumbnail: "/assets/reflex-master.svg", description: "초록색이 되면 최대한 빨리 클릭", mode: "reflex-master" },
  { id: "beat-catcher", title: "비트 캐처", thumbnail: "/assets/beat-catcher.svg", description: "떨어지는 노트를 타이밍 맞춰 눌러요", mode: "beat-catcher" },
  { id: "emoji-match", title: "이모지 매칭", thumbnail: "/assets/emoji-match.svg", description: "같은 이모지 짝을 찾아 뒤집으세요", mode: "emoji-match" },
  { id: "word-scramble", title: "단어 뒤집기", thumbnail: "/assets/word-scramble.svg", description: "섞인 글자를 원래 단어로 맞춰보세요", mode: "word-scramble" },
  { id: "simon-says", title: "사이먼 세즈", thumbnail: "/assets/simon-says.svg", description: "색깔 순서를 기억하고 따라 하세요", mode: "simon-says" },
  { id: "tap-frenzy", title: "탭 프렌지", thumbnail: "/assets/tap-frenzy.svg", description: "나타나는 타겟을 빠르게 터치하세요", mode: "tap-frenzy" },
  { id: "tnt-run", title: "TNT 런", thumbnail: "/assets/tnt-run.svg", description: "밟은 바닥이 사라져요! 최대한 오래 버티세요!", mode: "tnt-run" },
  { id: "spleef", title: "스플리프", thumbnail: "/assets/spleef.svg", description: "클릭으로 블록을 파괴하고 AI를 떨어뜨려라!", mode: "spleef" },
  { id: "parkour", title: "파쿠르", thumbnail: "/assets/parkour.svg", description: "플랫폼을 점프해서 건너라! 더블점프 가능!", mode: "parkour" },
  { id: "target-shooter", title: "타겟 슈팅", thumbnail: "/assets/target-shooter.svg", description: "움직이는 타겟을 조준해서 맞추는 슈팅 게임!", mode: "target-shooter" },
  { id: "obstacle-race", title: "장애물 레이스", thumbnail: "/assets/obstacle-race.svg", description: "장애물을 피해 달리고 코인을 모아라!", mode: "obstacle-race" },
  { id: "balloon-archer", title: "풍선 사냥꾼", thumbnail: "/assets/balloon-archer.svg", description: "화살로 떠다니는 풍선을 터뜨리는 3D 슈팅 게임!", mode: "balloon-archer" },
  // 새로 추가된 게임들 (iframe)
  { id: "flappy-bird", title: "플래피 버드", thumbnail: "/assets/flappy-bird.svg", description: "클릭으로 새를 조종해 파이프를 통과하세요!", mode: "iframe", url: "https://bird-game-two.vercel.app" },
  { id: "rocket-jump", title: "로켓 점프", thumbnail: "/assets/rocket-jump.svg", description: "운석을 피하며 우주를 날아가세요!", mode: "iframe", url: "https://rocket-game-nine.vercel.app" },
  { id: "balloon-fly", title: "풍선 플라이", thumbnail: "/assets/balloon-fly.svg", description: "별을 모으고 가시를 피하는 풍선 게임!", mode: "iframe", url: "https://balloon-game-omega.vercel.app" },
  { id: "dino-runner", title: "점프 러너", thumbnail: "/assets/dino-runner.svg", description: "장애물을 점프로 피해 달려가세요!", mode: "iframe", url: "https://dino-game-topaz.vercel.app" },
  { id: "pacman-classic", title: "팩맨", thumbnail: "/assets/pacman.svg", description: "점을 먹고 유령을 피하는 클래식 게임!", mode: "iframe", url: "https://pacman-game-mocha.vercel.app" },
  { id: "bubble-bobble", title: "보글보글", thumbnail: "/assets/bubble-bobble.svg", description: "버블로 적을 가두고 터뜨리세요!", mode: "iframe", url: "https://bubble-game-virid-ten.vercel.app" },
  { id: "snow-bros", title: "스노우볼", thumbnail: "/assets/snow-bros.svg", description: "눈으로 적을 얼리고 굴려버리세요!", mode: "iframe", url: "https://snow-game.vercel.app" },
  { id: "minesweeper", title: "지뢰찾기", thumbnail: "/assets/minesweeper.svg", description: "지뢰를 피해 모든 칸을 열어라!", mode: "iframe", url: "https://minesweeper-game-theta.vercel.app" },
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
