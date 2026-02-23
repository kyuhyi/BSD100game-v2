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
  | "iframe";

export type GameMeta = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  mode: GameMode;
  url?: string;
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
  { id: "anagram-sprint", title: "아나그램 스프린트", thumbnail: "https://ggems.web.app/assets/anagram-sprint.png", description: "섞인 글자를 올바른 단어 순서로 빠르게 완성해 60초 최고 점수를 노리는 단어 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/anagram-sprint" },
  { id: "angle-snap", title: "앵글 스냅", thumbnail: "https://ggems.web.app/assets/angle-snap.png", description: "회전하는 바늘을 목표 각도에 최대한 가깝게 멈춰 콤보를 쌓는 60초 타이밍 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/angle-snap" },
  { id: "aurora-basket", title: "오로라 바구니", thumbnail: "https://ggems.web.app/assets/aurora-basket.svg", description: "양쪽 버튼으로 바구니를 이동해 떨어지는 오로라 파편을 받아 점수를 올리는 캐주얼 게임입니다.", mode: "iframe", url: "https://ggems.web.app/aurora-basket" },
  { id: "balance-beam", title: "밸런스 빔", thumbnail: "https://ggems.web.app/assets/balance-beam.png", description: "빔을 기울여 공의 균형을 잡고 떨어지는 상자 충격을 버텨 최고 시간을 노리는 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/balance-beam" },
  { id: "bottle-flip-hop", title: "보틀 플립 홉", thumbnail: "https://ggems.web.app/assets/bottle-flip-hop.png", description: "길게 눌러 점프 파워를 모아 병을 다음 발판에 착지시키는 타이밍 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/bottle-flip-hop" },
  { id: "bubble-pop", title: "버블 팝", thumbnail: "bubble-pop-local.svg", description: "같은 색 버블 3개를 연결해 터뜨리는 조준 퍼즐 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/bubble-pop" },
  { id: "clip-line", title: "클립 라인", thumbnail: "https://ggems.web.app/assets/clip-line.png", description: "움직이는 셔츠가 3개 집게 구역에 들어올 때 탭해 고득점을 노리는 45초 타이밍 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/clip-line" },
  { id: "cloud-hop", title: "클라우드 홉", thumbnail: "https://ggems.web.app/assets/cloud-hop.png", description: "움직이는 구름을 밟으며 하늘로 끝없이 올라가는 점프 아케이드 게임", mode: "iframe", url: "https://ggems.web.app/cloud-hop" },
  { id: "coin-conveyor", title: "코인 컨베이어", thumbnail: "https://ggems.web.app/assets/coin-conveyor.png", description: "3개 레인 게이트를 좌우로 옮겨 코인은 받고 폭탄은 피하는 60초 캐주얼 반사신경 게임!", mode: "iframe", url: "https://ggems.web.app/coin-conveyor" },
  { id: "cozy-thermostat", title: "코지 서모스탯", thumbnail: "https://ggems.web.app/assets/cozy-thermostat.png", description: "버튼을 눌러 온도를 조절하고 움직이는 쾌적 구간에 오래 유지하는 원터치 집중 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/cozy-thermostat" },
  { id: "cup-shuffle", title: "컵 셔플 챌린지", thumbnail: "https://ggems.web.app/assets/cup-shuffle.png", description: "컵이 섞인 뒤 보석이 숨은 컵을 맞히는 집중력 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/cup-shuffle" },
  { id: "desk-curling", title: "데스크 컬링", thumbnail: "https://ggems.web.app/assets/desk-curling.png", description: "드래그로 스톤을 튕겨 점수 구역에 멈추는 5라운드 캐주얼 컬링 게임", mode: "iframe", url: "https://ggems.web.app/desk-curling" },
  { id: "drift-ice", title: "드리프트 아이스", thumbnail: "https://ggems.web.app/assets/drift-ice.png", description: "빙판 위에서 펭귄을 미끄러뜨려 물고기를 모으는 슬라이딩 퍼즐 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/drift-ice" },
  { id: "elevator-rush", title: "엘리베이터 러시", thumbnail: "https://ggems.web.app/assets/elevator-rush.png", description: "층 버튼을 빠르게 눌러 승객을 목적층에 배달하는 60초 운영 캐주얼 게임", mode: "iframe", url: "https://ggems.web.app/elevator-rush" },
  { id: "fan-flick", title: "팬 플릭", thumbnail: "https://ggems.web.app/assets/fan-flick.svg", description: "좌우 바람을 튕겨 풍선을 중앙에 오래 유지하세요.", mode: "iframe", url: "https://ggems.web.app/fan-flick" },
  { id: "firefly-funnel", title: "파이어플라이 퍼널", thumbnail: "https://ggems.web.app/assets/firefly-funnel.png", description: "45초 동안 랜턴을 드래그해 내려오는 반딧불을 모으는 원터치 아케이드 게임", mode: "iframe", url: "https://ggems.web.app/firefly-funnel" },
  { id: "grid-sweeper", title: "그리드 스위퍼", thumbnail: "https://ggems.web.app/assets/grid-sweeper.png", description: "격자를 돌며 쌓이는 먼지를 빠르게 청소해 45초 최고 점수를 노리는 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/grid-sweeper" },
  { id: "knot-untangler", title: "매듭 풀기", thumbnail: "https://ggems.web.app/assets/knot-untangler.png", description: "노드를 드래그해 선 교차를 모두 없애는 직관적인 그래프 퍼즐 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/knot-untangler" },
  { id: "lantern-drift", title: "랜턴 드리프트", thumbnail: "https://ggems.web.app/assets/lantern-drift.png", description: "좌우 바람을 조절해 밤하늘 랜턴으로 반딧불을 모으고 새를 피하는 45초 캐주얼 생존 게임", mode: "iframe", url: "https://ggems.web.app/lantern-drift" },
  { id: "lantern-liftoff", title: "랜턴 리프트오프", thumbnail: "https://ggems.web.app/assets/lantern-liftoff.svg", description: "3개 레인에서 바람을 피하고 반딧불이를 모아 점수를 올리는 원터치 회피 캐주얼 게임", mode: "iframe", url: "https://ggems.web.app/lantern-liftoff" },
  { id: "laser-mirror-pop", title: "레이저 미러 팝", thumbnail: "https://ggems.web.app/assets/laser-mirror-pop.png", description: "거울 각도를 바꿔 레이저를 튕기고 목표 코어를 모두 맞히는 퍼즐 캐주얼 게임", mode: "iframe", url: "https://ggems.web.app/laser-mirror-pop" },
  { id: "leaf-glider", title: "리프 글라이더", thumbnail: "https://ggems.web.app/assets/leaf-glider.png", description: "바람을 타는 나뭇잎을 좌우로 조종해 가지를 피하고 반딧불 점수를 모으세요!", mode: "iframe", url: "https://ggems.web.app/leaf-glider" },
  { id: "lighthouse-blink", title: "등대 번쩍", thumbnail: "https://ggems.web.app/assets/lighthouse-blink.png", description: "회전하는 등대 빔 안의 붉은 부표만 탭해서 45초 동안 콤보를 올리는 캐주얼 게임", mode: "iframe", url: "https://ggems.web.app/lighthouse-blink" },
  { id: "mirror-wipe", title: "미러 와이프", thumbnail: "https://ggems.web.app/assets/mirror-wipe.png", description: "김 서린 거울을 손가락으로 닦아 60초 동안 가장 높은 청결도를 유지하는 캐주얼 아케이드 게임!", mode: "iframe", url: "https://ggems.web.app/mirror-wipe" },
  { id: "moon-lander-lite", title: "문 랜더 라이트", thumbnail: "https://ggems.web.app/assets/moon-lander-lite.png", description: "탭으로 추력을 조절해 달 착륙 패드에 부드럽게 내려앉는 원탭 랜딩 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/moon-lander-lite" },
  { id: "morse-match", title: "모스 매치", thumbnail: "https://ggems.web.app/assets/morse-match.png", description: "제시된 모스 코드 패턴을 DOT/DASH 버튼으로 빠르게 맞춰 60초 최고 점수를 노리는 반응형 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/morse-match" },
  { id: "neon-sorter", title: "네온 소터", thumbnail: "https://ggems.web.app/assets/neon-sorter.png", description: "떨어지는 블록 색과 슬롯 색을 순식간에 맞추는 컬러 정렬 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/neon-sorter" },
  { id: "orbital-shift", title: "오비탈 런", thumbnail: "https://ggems.web.app/assets/orbital-shift.png", description: "공을 빠르게 회전시켜 고리의 구멍을 통과하는 원형 원샷 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/orbital-shift" },
  { id: "paper-plane-post", title: "페이퍼 플레인 포스트", thumbnail: "https://ggems.web.app/assets/paper-plane-post.png", description: "드래그로 종이비행기 각도와 세기를 조절해 움직이는 우체통 슬롯에 정확히 꽂아 넣는 원샷 배달 게임!", mode: "iframe", url: "https://ggems.web.app/paper-plane-post" },
  { id: "parking-panic", title: "파킹 패닉", thumbnail: "https://ggems.web.app/assets/parking-panic.png", description: "차량을 한 칸씩 밀어 빨간 차를 출구로 탈출시키는 러시아워 스타일 캐주얼 퍼즐 게임.", mode: "iframe", url: "https://ggems.web.app/parking-panic" },
  { id: "pebble-skip", title: "페블 스킵", thumbnail: "https://ggems.web.app/assets/pebble-skip.png", description: "길게 눌러 돌의 파워를 모아 물수제비로 부표를 맞추는 45초 스코어 어택 게임!", mode: "iframe", url: "https://ggems.web.app/pebble-skip" },
  { id: "plank-pivot", title: "플랭크 피벗", thumbnail: "https://ggems.web.app/assets/plank-pivot.png", description: "길게 눌러 다리 길이를 만들고 정확히 건너는 스틱 브리지 타이밍 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/plank-pivot" },
  { id: "prism-rain", title: "프리즘 빗물", thumbnail: "https://ggems.web.app/assets/prism-rain.svg", description: "빗방울의 색깔을 프리즘으로 맞춰 60초 동안 최고 점수를 노리는 캐주얼 게임", mode: "iframe", url: "https://ggems.web.app/prism-rain" },
  { id: "pulse-brewer", title: "Pulse Brewer", thumbnail: "https://ggems.web.app/assets/pulse-brewer.png", description: "세 가지 브루잉 게이지를 안정 구간에 유지해 점수를 쌓는 멀티미터 반사신경 게임", mode: "iframe", url: "https://ggems.web.app/pulse-brewer" },
  { id: "pulse-lane", title: "펄스 레인", thumbnail: "https://ggems.web.app/assets/pulse-lane.svg", description: "좌우로 레인을 바꿔 장벽을 피하며 60초 점수를 쌓는 리듬형 캐주얼 회피 게임", mode: "iframe", url: "https://ggems.web.app/pulse-lane" },
  { id: "pulse-lock", title: "펄스 락", thumbnail: "https://ggems.web.app/assets/pulse-lock.png", description: "회전하는 바늘을 초록 구간에 멈춰 콤보를 이어가는 원탭 타이밍 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/pulse-lock" },
  { id: "queue-keeper", title: "큐 키퍼", thumbnail: "https://ggems.web.app/assets/queue-keeper.png", description: "좌우 대기열을 빠르게 처리해 폭주를 막는 순발력 운영 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/queue-keeper" },
  { id: "rain-barrel-balance", title: "레인 배럴 밸런스", thumbnail: "https://ggems.web.app/assets/rain-barrel-balance.png", description: "빗물 유입을 좌우 밸브로 조절해 3개 배럴 수위를 동시에 안정 구간에 유지하는 실시간 밸런싱 캐주얼 게임.", mode: "iframe", url: "https://ggems.web.app/rain-barrel-balance" },
  { id: "sandwich-stacker", title: "샌드위치 스태커", thumbnail: "https://ggems.web.app/assets/sandwich-stacker.svg", description: "움직이는 재료를 타이밍 좋게 눌러 주문 순서대로 쌓는 45초 원버튼 캐주얼 게임", mode: "iframe", url: "https://ggems.web.app/sandwich-stacker" },
  { id: "shadow-shift", title: "섀도우 쉬프트", thumbnail: "https://ggems.web.app/assets/shadow-shift.png", description: "광원의 각도를 좌우로 조절해 움직이는 물체의 그림자를 목표 구간에 오래 맞추는 집중 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/shadow-shift" },
  { id: "shell-sweep", title: "셸 스윕", thumbnail: "https://ggems.web.app/assets/shell-sweep.png", description: "모래를 쓸어 숨은 조개를 찾고 게를 피하며 60초 최고 점수를 노리는 스와이프 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/shell-sweep" },
  { id: "simmer-sync", title: "시머 싱크", thumbnail: "https://ggems.web.app/assets/simmer-sync.png", description: "가열/냉각 버튼을 눌러 냄비 온도를 완벽한 구간에 오래 유지하는 타이밍 캐주얼 게임.", mode: "iframe", url: "https://ggems.web.app/simmer-sync" },
  { id: "sprout-keeper", title: "새싹 지키기", thumbnail: "https://ggems.web.app/assets/sprout-keeper.png", description: "세 개의 화분 수분을 적정 구간으로 유지하며 60초 동안 새싹을 건강하게 지키는 캐주얼 탭 게임", mode: "iframe", url: "https://ggems.web.app/sprout-keeper" },
  { id: "street-dash", title: "스트리트 대시", thumbnail: "https://ggems.web.app/assets/street-dash.png", description: "차가 오가는 도로를 한 칸씩 건너 맨 위 안전지대에 도달하는 순발력 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/street-dash" },
  { id: "target-ten", title: "타겟 텐", thumbnail: "https://ggems.web.app/assets/target-ten.png", description: "숫자 버블을 골라 합을 정확히 10으로 맞추는 60초 순발력 두뇌 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/target-ten" },
  { id: "toast-landing", title: "토스트 랜딩", thumbnail: "https://ggems.web.app/assets/toast-landing.png", description: "움직이는 접시를 노려 토스트를 발사하고 연속 착지 기록에 도전하세요.", mode: "iframe", url: "https://ggems.web.app/toast-landing" },
  { id: "toast-timing", title: "토스트 타이밍", thumbnail: "https://ggems.web.app/assets/toast-timing.svg", description: "움직이는 굽기 바를 황금 구간에 맞춰 45초 동안 토스트를 완성하는 원터치 캐주얼 게임", mode: "iframe", url: "https://ggems.web.app/toast-timing" },
  { id: "vowel-vault", title: "모음 금고", thumbnail: "https://ggems.web.app/assets/vowel-vault.png", description: "나오는 알파벳을 모음/자음으로 분류해 45초 최고 점수를 노리는 초간단 두뇌 반응 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/vowel-vault" },
  { id: "wind-post", title: "윈드 포스트", thumbnail: "https://ggems.web.app/assets/wind-post.png", description: "바람 다이얼을 돌려 떠다니는 편지를 움직이는 우체통에 넣는 60초 캐주얼 배달 게임!", mode: "iframe", url: "https://ggems.web.app/wind-post" },
  { id: "wind-ribbon", title: "윈드 리본 러시", thumbnail: "https://ggems.web.app/assets/wind-ribbon.png", description: "짧은 스와이프로 리본의 방향을 바꿔 움직이는 바람 게이트를 통과하고 별을 모으는 60초 캐주얼 게임", mode: "iframe", url: "https://ggems.web.app/wind-ribbon" },
  { id: "window-washer", title: "윈도우 워셔", thumbnail: "https://ggems.web.app/assets/window-washer.png", description: "45초 동안 유리창 얼룩을 드래그로 쓱쓱 닦아 콤보 점수를 쌓는 청소 아케이드 게임", mode: "iframe", url: "https://ggems.web.app/window-washer" },
  { id: "2048", title: "2048", thumbnail: "https://ggems.web.app/assets/2048.png", description: "방향키로 타일을 밀어 2048을 만들어라!", mode: "iframe", url: "https://ggems.web.app/2048" },
  { id: "breakout", title: "벽돌깨기", thumbnail: "https://ggems.web.app/assets/breakout.png", description: "공을 튕겨 모든 벽돌을 부셔라!", mode: "iframe", url: "https://ggems.web.app/breakout" },
  { id: "color-rush", title: "컬러 러시", thumbnail: "https://ggems.web.app/assets/color-rush.png", description: "뜻과 글자색이 같은지 YES/NO로 빠르게 판단하는 30초 두뇌 반사 게임!", mode: "iframe", url: "https://ggems.web.app/color-rush" },
  { id: "dino-runner", title: "점프 러너", thumbnail: "https://ggems.web.app/assets/dino-runner.png", description: "장애물을 점프로 피해 최대한 멀리 달려라!", mode: "iframe", url: "https://ggems.web.app/dino-runner" },
  { id: "flappy-bird", title: "플래피버드", thumbnail: "https://ggems.web.app/assets/flappy-bird.png", description: "터치/스페이스바로 새를 날려 파이프를 통과하라!", mode: "iframe", url: "https://ggems.web.app/flappy-bird" },
  { id: "memory-match", title: "카드 매칭", thumbnail: "https://ggems.web.app/assets/memory-match.png", description: "같은 그림의 카드 쌍을 찾아라!", mode: "iframe", url: "https://ggems.web.app/memory-match" },
  { id: "minesweeper", title: "지뢰찾기", thumbnail: "https://ggems.web.app/assets/minesweeper.png", description: "지뢰를 피해 모든 칸을 열어라!", mode: "iframe", url: "https://ggems.web.app/minesweeper" },
  { id: "odd-one-pop", title: "오드원 팝", thumbnail: "https://ggems.web.app/assets/odd-one-pop.png", description: "색이 살짝 다른 칸 하나를 빠르게 찾아 탭하는 집중력 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/odd-one-pop" },
  { id: "orbit-keeper", title: "오빗 키퍼", thumbnail: "https://ggems.web.app/assets/orbit-keeper.png", description: "회전 방어막으로 유성을 튕겨내며 중심 코어를 지켜라!", mode: "iframe", url: "https://ggems.web.app/orbit-keeper" },
  { id: "pattern-pulse", title: "패턴 펄스", thumbnail: "https://ggems.web.app/assets/pattern-pulse.png", description: "패턴을 기억해 같은 순서로 탭하며 한계 레벨에 도전하세요!", mode: "iframe", url: "https://ggems.web.app/pattern-pulse" },
  { id: "perfect-pour", title: "퍼펙트 푸어", thumbnail: "https://ggems.web.app/assets/perfect-pour.png", description: "눌러서 음료를 따르고 목표 구간에 딱 맞추는 타이밍 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/perfect-pour" },
  { id: "reaction-test", title: "반응속도 테스트", thumbnail: "https://ggems.web.app/assets/reaction-test.png", description: "초록색이 되면 최대한 빨리 클릭하라!", mode: "iframe", url: "https://ggems.web.app/reaction-test" },
  { id: "snake", title: "스네이크", thumbnail: "https://ggems.web.app/assets/snake.png", description: "방향키로 뱀을 조종해 먹이를 먹어라!", mode: "iframe", url: "https://ggems.web.app/snake" },
  { id: "space-shooter", title: "우주 슈팅", thumbnail: "https://ggems.web.app/assets/space-shooter.png", description: "우주선을 조종해 적을 물리쳐라!", mode: "iframe", url: "https://ggems.web.app/space-shooter" },
  { id: "stack-snap", title: "스택 스냅", thumbnail: "https://ggems.web.app/assets/stack-snap.png", description: "움직이는 블록을 딱 맞춰 쌓아 올리는 원탭 캐주얼 스택 게임!", mode: "iframe", url: "https://ggems.web.app/stack-snap" },
  { id: "star-catcher", title: "별 수집가", thumbnail: "https://ggems.web.app/assets/star-catcher.png", description: "내려오는 별을 바구니로 받아 최고 점수에 도전하세요!", mode: "iframe", url: "https://ggems.web.app/star-catcher" },
  { id: "tap-master", title: "탭 마스터", thumbnail: "https://ggems.web.app/assets/tap-master.png", description: "1부터 25까지 순서대로 탭해 최고 기록에 도전하세요!", mode: "iframe", url: "https://ggems.web.app/tap-master" },
  { id: "tic-tac-toe", title: "틱택토", thumbnail: "https://ggems.web.app/assets/tic-tac-toe.png", description: "AI와 대결! 3개를 먼저 한 줄로 만들어라!", mode: "iframe", url: "https://ggems.web.app/tic-tac-toe" },
  { id: "trail-link", title: "트레일 링크", thumbnail: "https://ggems.web.app/assets/trail-link.png", description: "숫자 체크포인트를 순서대로 밟아 목표 지점까지 도달하는 경로 퍼즐 게임!", mode: "iframe", url: "https://ggems.web.app/trail-link" },
  { id: "whack-a-mole", title: "두더지잡기", thumbnail: "https://ggems.web.app/assets/whack-a-mole.png", description: "올라오는 두더지를 빠르게 잡아라!", mode: "iframe", url: "https://ggems.web.app/whack-a-mole" },
  { id: "chord-catch", title: "코드 캐치", thumbnail: "https://ggems.web.app/assets/chord-catch.png", description: "3개 라인에서 떨어지는 노트를 타이밍 맞춰 탭하며 콤보를 쌓는 리듬 반응 캐주얼 게임.", mode: "iframe", url: "https://ggems.web.app/chord-catch" },
  { id: "crosslight-control", title: "크로스라이트 컨트롤", thumbnail: "https://ggems.web.app/assets/crosslight-control.png", description: "교차로 신호를 바꿔가며 차량 충돌 없이 흐름을 유지하는 실시간 반응형 게임", mode: "iframe", url: "https://ggems.web.app/crosslight-control" },
  { id: "frost-trace", title: "프로스트 트레이스", thumbnail: "https://ggems.web.app/assets/frost-trace.png", description: "얼음 선을 정확히 따라 그려 시간 안에 스테이지를 연속 클리어하는 트레이싱 게임.", mode: "iframe", url: "https://ggems.web.app/frost-trace" },
  { id: "gravity-gate", title: "중력 게이트", thumbnail: "https://ggems.web.app/assets/gravity-gate.png", description: "중력을 뒤집어 게이트 사이를 통과하며 오래 버티세요.", mode: "iframe", url: "https://ggems.web.app/gravity-gate" },
  { id: "light-out-lab", title: "라이트 아웃 랩", thumbnail: "https://ggems.web.app/assets/light-out-lab.png", description: "타일을 눌러 십자 방향 불빛을 토글해 모든 불을 끄는 퍼즐 캐주얼 게임.", mode: "iframe", url: "https://ggems.web.app/light-out-lab" },
  { id: "magnet-drift", title: "마그넷 드리프트", thumbnail: "https://ggems.web.app/assets/magnet-drift.png", description: "자석을 켜고 끄며 금속 조각을 끌어모으고 폭탄을 피하는 45초 리스크-리워드 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/magnet-drift" },
  { id: "marble-maze-rush", title: "마블 메이즈 러시", thumbnail: "https://ggems.web.app/assets/marble-maze-rush.png", description: "미로에서 구슬을 움직여 별 3개를 모으고 출구까지 도달하는 45초 스피드 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/marble-maze-rush" },
  { id: "orbit-painter", title: "오빗 페인터", thumbnail: "https://ggems.web.app/assets/orbit-painter.png", description: "회전하는 브러시를 길게 눌러 목표 링 패턴을 칠해 점수를 쌓는 원터치 아케이드 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/orbit-painter" },
  { id: "parcel-pivot", title: "택배 피벗", thumbnail: "https://ggems.web.app/assets/parcel-pivot.png", description: "떨어지는 택배 박스의 색에 맞춰 하단 수거함을 빠르게 회전시키는 반응형 캐주얼 게임.", mode: "iframe", url: "https://ggems.web.app/parcel-pivot" },
  { id: "phase-flip", title: "페이즈 플립", thumbnail: "https://ggems.web.app/assets/phase-flip.png", description: "중심 구체의 위상을 바꿔 들어오는 입자와 색을 맞추며 60초를 버티는 원탭 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/phase-flip" },
  { id: "pipe-panic", title: "파이프 패닉", thumbnail: "https://ggems.web.app/assets/pipe-panic.png", description: "타일을 돌려 물길을 연결하고 제한 시간 안에 연속 성공을 노리는 캐주얼 퍼즐 게임!", mode: "iframe", url: "https://ggems.web.app/pipe-panic" },
  { id: "pocket-putt", title: "포켓 퍼트", thumbnail: "https://ggems.web.app/assets/pocket-putt.png", description: "드래그로 공을 쳐 장애물을 피해 홀에 넣는 60초 타임어택 미니 퍼팅 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/pocket-putt" },
  { id: "puddle-hop", title: "퍼들 홉", thumbnail: "https://ggems.web.app/assets/puddle-hop.png", description: "길게 눌러 점프를 충전해 돌판 위를 연속 착지하며 버티는 원터치 타이밍 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/puddle-hop" },
  { id: "ripple-rescue", title: "리플 레스큐", thumbnail: "https://ggems.web.app/assets/ripple-rescue.png", description: "중심 파동을 터뜨려 떠다니는 오리들을 소용돌이에서 밀어내며 생존 시간을 늘리는 원탭 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/ripple-rescue" },
  { id: "signal-sweep", title: "시그널 스윕", thumbnail: "https://ggems.web.app/assets/signal-sweep.svg", description: "움직이는 전파 구간에 다이얼을 맞춰 60초 동안 콤보 점수를 쌓는 라디오 튜닝 캐주얼 게임", mode: "iframe", url: "https://ggems.web.app/signal-sweep" },
  { id: "stamp-sorter", title: "스탬프 소터", thumbnail: "https://ggems.web.app/assets/stamp-sorter.svg", description: "도착하는 우편물의 스탬프 색을 보고 맞는 우체통을 고르는 초간단 순발력 게임", mode: "iframe", url: "https://ggems.web.app/stamp-sorter" },
  { id: "sushi-slicer", title: "스시 슬라이서", thumbnail: "https://ggems.web.app/assets/sushi-slicer.png", description: "날아오르는 스시를 손가락으로 쓱 베어 점수를 쌓고 폭탄을 피하는 45초 스와이프 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/sushi-slicer" },
  { id: "umbrella-guard", title: "엄브렐라 가드", thumbnail: "https://ggems.web.app/assets/umbrella-guard.png", description: "우산 각도를 빠르게 맞춰 몰려오는 빗방울을 막고 생존 점수를 올리세요.", mode: "iframe", url: "https://ggems.web.app/umbrella-guard" },
  { id: "zipline-rush", title: "집라인 러시", thumbnail: "https://ggems.web.app/assets/zipline-rush.svg", description: "세 개의 집라인을 오가며 택배를 받고 새를 피하는 순발력 아케이드 게임", mode: "iframe", url: "https://ggems.web.app/zipline-rush" },
  { id: "laundry-line-rush", title: "런드리 라인 러시", thumbnail: "https://ggems.web.app/assets/laundry-line-rush.svg", description: "날아오는 빨래를 정확한 타이밍에 집게로 고정해 콤보를 쌓는 45초 캐주얼 아케이드", mode: "iframe", url: "https://ggems.web.app/laundry-line-rush" },
  { id: "color-mixer-challenge", title: "컬러 믹서 챌린지", thumbnail: "https://ggems.web.app/assets/color-mixer-challenge.svg", description: "목표 색상을 보고 RGB 버튼으로 비율을 맞춰 제한 시간 안에 최대 점수를 얻는 캐주얼 컬러 매칭 게임!", mode: "iframe", url: "https://ggems.web.app/color-mixer-challenge" },
  { id: "sum-sprint", title: "썸 스프린트", thumbnail: "https://ggems.web.app/assets/sum-sprint.svg", description: "수식이 맞는지 빠르게 판별하는 60초 두뇌 반응 게임!", mode: "iframe", url: "https://ggems.web.app/sum-sprint" },
  { id: "lane-harvest", title: "레인 하베스트", thumbnail: "https://ggems.web.app/assets/lane-harvest.svg", description: "3개 레인을 오가며 과일은 수집하고 폭탄은 피하는 아케이드 게임!", mode: "iframe", url: "https://ggems.web.app/lane-harvest" },
  { id: "gyro-stack", title: "자이로 스택", thumbnail: "https://ggems.web.app/assets/gyro-stack.svg", description: "좌우 밸런스를 조절해 흔들리는 타워를 무너지지 않게 버티는 집중 게임!", mode: "iframe", url: "https://ggems.web.app/gyro-stack" },
  { id: "symbol-sync", title: "심볼 싱크", thumbnail: "https://ggems.web.app/assets/symbol-sync.svg", description: "제시된 목표 심볼과 같은 버튼을 연속으로 맞히는 스피드 매칭 게임!", mode: "iframe", url: "https://ggems.web.app/symbol-sync" },
  { id: "tempo-tapper", title: "템포 탭퍼", thumbnail: "https://ggems.web.app/assets/tempo-tapper.svg", description: "비트 타이밍에 맞춰 탭해 콤보를 이어가는 리듬 캐주얼 게임!", mode: "iframe", url: "https://ggems.web.app/tempo-tapper" },
  { id: "vector-vault", title: "벡터 볼트", thumbnail: "https://ggems.web.app/assets/vector-vault.svg", description: "화살표 방향과 같은 입력을 빠르게 스와이프/키 입력하는 순발력 게임!", mode: "iframe", url: "https://ggems.web.app/vector-vault" },
  { id: "pixel-painter", title: "픽셀 페인터", thumbnail: "https://ggems.web.app/assets/pixel-painter.svg", description: "목표 픽셀을 제한 시간 안에 빠르게 칠해 점수를 쌓는 탭 퍼즐 게임!", mode: "iframe", url: "https://ggems.web.app/pixel-painter" },
  { id: "flappy-bird", title: "플래피 버드", thumbnail: "/assets/flappy-bird.svg", description: "클릭으로 새를 조종해 파이프를 통과하세요!", mode: "iframe", url: "https://ggems.web.app/flappy-bird" },
  { id: "rocket-jump", title: "로켓 점프", thumbnail: "/assets/rocket-jump.svg", description: "운석을 피하며 우주를 날아가는 아케이드 게임!", mode: "iframe", url: "https://ggems.web.app/rocket-jump" },
  { id: "balloon-fly", title: "풍선 플라이", thumbnail: "/assets/balloon-fly.svg", description: "별을 모으고 가시를 피하는 풍선 게임!", mode: "iframe", url: "https://ggems.web.app/balloon-fly" },
  { id: "dino-runner", title: "점프 러너", thumbnail: "/assets/dino-runner.svg", description: "장애물을 점프로 피해 달려가는 러닝 게임!", mode: "iframe", url: "https://ggems.web.app/dino-runner" },
  { id: "pacman-classic", title: "팩맨", thumbnail: "/assets/pacman.svg", description: "점을 먹고 유령을 피하는 클래식 아케이드!", mode: "iframe", url: "https://ggems.web.app/pacman-classic" },
  { id: "bubble-bobble", title: "보글보글", thumbnail: "/assets/bubble-bobble.svg", description: "버블로 적을 가두고 터뜨리는 클래식 게임!", mode: "iframe", url: "https://ggems.web.app/bubble-bobble" },
  { id: "snow-bros", title: "스노우볼", thumbnail: "/assets/snow-bros.svg", description: "눈으로 적을 얼리고 굴려버리는 아케이드!", mode: "iframe", url: "https://ggems.web.app/snow-bros" },
  { id: "minesweeper", title: "지뢰찾기", thumbnail: "/assets/minesweeper.svg", description: "지뢰를 피해 모든 칸을 열어라!", mode: "iframe", url: "https://ggems.web.app/minesweeper" },
  { id: "ladder", title: "사다리 게임", thumbnail: "/assets/ladder.svg", description: "참여자와 결과를 설정하고 사다리를 타는 랜덤 추첨 게임!", mode: "iframe", url: "/ladder.html" },
  { id: "sudoku", title: "스도쿠", thumbnail: "/assets/sudoku.svg", description: "9x9 격자에 1-9 숫자를 겹치지 않게 채우는 클래식 두뇌 퍼즐!", mode: "iframe", url: "https://ggems.web.app/sudoku" },
  { id: "ball-sort", title: "볼 소트 퍼즐", thumbnail: "/assets/ball-sort.svg", description: "같은 색 공을 한 튜브에 모아 정렬하는 중독성 퍼즐 게임!", mode: "iframe", url: "https://ggems.web.app/ball-sort" },
  { id: "piano-tiles", title: "피아노 타일", thumbnail: "/assets/piano-tiles.svg", description: "검은 타일만 빠르게 터치해 리듬에 맞춰 연주하는 음악 게임!", mode: "iframe", url: "https://ggems.web.app/piano-tiles" },
  { id: "fruit-slice", title: "과일 자르기", thumbnail: "/assets/fruit-slice.svg", description: "날아오는 과일을 스와이프로 자르고 폭탄을 피하는 액션 게임!", mode: "iframe", url: "https://ggems.web.app/fruit-slice" },
  { id: "solitaire", title: "솔리테어", thumbnail: "/assets/solitaire.svg", description: "카드를 규칙에 맞게 정렬하는 클래식 1인용 카드 게임!", mode: "iframe", url: "https://ggems.web.app/solitaire" },
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
