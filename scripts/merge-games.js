const fs = require('fs');
const path = require('path');

// games-registry.js 읽기
const registryPath = path.join(__dirname, '..', 'games-registry.js');
const registryContent = fs.readFileSync(registryPath, 'utf8');
const match = registryContent.match(/window\.GAME_REGISTRY\s*=\s*(\[[\s\S]*\]);?/);
const registry = eval(match[1]);

// 기존 catalog의 네이티브 게임들 (유지)
const nativeGames = [
  { id: 'omok', title: '오목', thumbnail: '/assets/omok.svg', description: 'AI와 두는 3D 감성 오목 대전', mode: 'omok' },
  { id: 'jigsaw-puzzle', title: '퍼즐 맞추기', thumbnail: '/assets/jigsaw.svg', description: '숫자 타일을 순서대로 맞추는 슬라이드 퍼즐', mode: 'jigsaw' },
  { id: 'tetris', title: '테트리스', thumbnail: '/assets/tetris.png', description: '회전/이동/즉시드롭으로 줄을 지우는 클래식 블록 퍼즐', mode: 'tetris' },
  { id: 'crystal-puzzle', title: '크리스탈 퍼즐', thumbnail: '/assets/crystal-puzzle.svg', description: '크리스탈 블록을 밀어 순서대로 맞추는 고급 3D 슬라이딩 퍼즐', mode: 'crystal-puzzle' },
  { id: 'neon-stack', title: '네온 스택', thumbnail: '/assets/neon-stack.svg', description: '정확한 타이밍에 블록을 쌓는 3D 스태킹 게임', mode: 'neon-stack' },
  { id: 'crystal-memory', title: '크리스탈 메모리', thumbnail: '/assets/crystal-memory.svg', description: '3D 카드를 뒤집어 같은 짝을 찾는 메모리 게임', mode: 'crystal-memory' },
  { id: 'helix-jump', title: '헬릭스 점프', thumbnail: '/assets/helix-jump.svg', description: '나선 플랫폼의 틈새로 공을 떨어뜨리는 3D 게임', mode: 'helix-jump' },
  { id: 'cube-runner', title: '큐브 러너', thumbnail: '/assets/cube-runner.svg', description: '3D 트랙 위 큐브로 장애물을 피하는 러닝 게임', mode: 'cube-runner' },
  { id: 'gem-catcher', title: '젬 캐처', thumbnail: '/assets/gem-catcher.svg', description: '하늘에서 떨어지는 3D 보석을 바구니로 받는 게임', mode: 'gem-catcher' },
  { id: 'breakout-3d', title: '3D 벽돌깨기', thumbnail: '/assets/breakout-3d.svg', description: '클래식 벽돌깨기를 3D로 즐기는 아케이드 게임', mode: 'breakout-3d' },
  { id: 'orbital-dash', title: '오비탈 대시', thumbnail: '/assets/orbital-dash.svg', description: '회전하는 궤도 위에서 장애물을 피하는 3D 러너', mode: 'orbital-dash' },
  { id: 'neon-pong', title: '네온 핑퐁', thumbnail: '/assets/neon-pong.svg', description: '화려한 네온 스타일의 3D 핑퐁 대전', mode: 'neon-pong' },
  { id: 'prism-shooter', title: '프리즘 슈터', thumbnail: '/assets/prism-shooter.svg', description: '빛나는 크리스탈을 클릭해서 파괴하는 슈팅 게임', mode: 'prism-shooter' },
  { id: 'proverb-quiz', title: '한글 속담 퀴즈', thumbnail: '/assets/proverb-quiz.svg', description: '빈칸에 들어갈 속담을 맞춰보세요', mode: 'proverb-quiz' },
  { id: 'color-rush-game', title: '컬러 러시', thumbnail: '/assets/color-rush-game.svg', description: '글자의 뜻과 색이 같은지 빠르게 판단하세요', mode: 'color-rush-game' },
  { id: 'space-defender', title: '스페이스 디펜더', thumbnail: '/assets/space-defender.svg', description: '적을 격추하고 지구를 지켜라', mode: 'space-defender' },
  { id: 'math-blitz', title: '넘버 크런치', thumbnail: '/assets/math-blitz.svg', description: '빠르게 암산하고 정답을 고르세요', mode: 'math-blitz' },
  { id: 'reflex-master', title: '반응속도 마스터', thumbnail: '/assets/reflex-master.svg', description: '초록색이 되면 최대한 빨리 클릭', mode: 'reflex-master' },
  { id: 'beat-catcher', title: '비트 캐처', thumbnail: '/assets/beat-catcher.svg', description: '떨어지는 노트를 타이밍 맞춰 눌러요', mode: 'beat-catcher' },
  { id: 'emoji-match', title: '이모지 매칭', thumbnail: '/assets/emoji-match.svg', description: '같은 이모지 짝을 찾아 뒤집으세요', mode: 'emoji-match' },
  { id: 'word-scramble', title: '단어 뒤집기', thumbnail: '/assets/word-scramble.svg', description: '섞인 글자를 원래 단어로 맞춰보세요', mode: 'word-scramble' },
  { id: 'simon-says', title: '사이먼 세즈', thumbnail: '/assets/simon-says.svg', description: '색깔 순서를 기억하고 따라 하세요', mode: 'simon-says' },
  { id: 'tap-frenzy', title: '탭 프렌지', thumbnail: '/assets/tap-frenzy.svg', description: '나타나는 타겟을 빠르게 터치하세요', mode: 'tap-frenzy' },
];

// 네이티브 게임 ID 목록
const nativeIds = new Set(nativeGames.map(g => g.id));

// registry에서 iframe 게임으로 변환 (중복 제외)
const iframeGames = registry
  .filter(g => !nativeIds.has(g.id))
  .map(g => ({
    id: g.id,
    title: g.title,
    thumbnail: g.thumbnail,
    description: g.description,
    mode: 'iframe',
    url: g.external || ('https://ggems.web.app/' + g.id)
  }));

const allGames = [...nativeGames, ...iframeGames];

// TypeScript 파일 생성
const modeTypes = [...new Set(nativeGames.map(g => g.mode)), 'iframe'];

let output = `export type GameMode =
  | ${modeTypes.map(m => JSON.stringify(m)).join('\n  | ')};

export type GameMeta = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  mode: GameMode;
  url?: string;
};

export const GAMES: GameMeta[] = [
`;

allGames.forEach((g) => {
  const urlPart = g.url ? `, url: ${JSON.stringify(g.url)}` : '';
  output += `  { id: ${JSON.stringify(g.id)}, title: ${JSON.stringify(g.title)}, thumbnail: ${JSON.stringify(g.thumbnail)}, description: ${JSON.stringify(g.description)}, mode: ${JSON.stringify(g.mode)}${urlPart} },\n`;
});

output += `];

export const THUMBNAILS = GAMES.map((g) => g.thumbnail);

export function thumbnailToId(src: string) {
  const hit = GAMES.find((g) => g.thumbnail === src);
  if (hit) return hit.id;
  const file = src.split("/").pop() ?? "";
  return file.replace(/\\.[^.]+$/, "").replace(/-local$/, "");
}

export function getGameById(id: string) {
  return GAMES.find((g) => g.id === id);
}
`;

const outputPath = path.join(__dirname, '..', 'lib', 'game-catalog.ts');
fs.writeFileSync(outputPath, output);
console.log('✅ Done! Total games:', allGames.length);
console.log('   Native:', nativeGames.length);
console.log('   Iframe:', iframeGames.length);
