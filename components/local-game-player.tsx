"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { GameMeta, GameMode } from "@/lib/game-catalog";

const CrystalPuzzleGame = dynamic(() => import("@/components/games/crystal-puzzle"), {
  ssr: false,
  loading: () => <div className="flex h-96 items-center justify-center text-white/50">3D 로딩중...</div>,
});
const NeonStackGame = dynamic(() => import("@/components/games/neon-stack"), {
  ssr: false,
  loading: () => <div className="flex h-96 items-center justify-center text-white/50">3D 로딩중...</div>,
});
const CrystalMemoryGame = dynamic(() => import("@/components/games/crystal-memory"), {
  ssr: false,
  loading: () => <div className="flex h-96 items-center justify-center text-white/50">3D 로딩중...</div>,
});
const HelixJumpGame = dynamic(() => import("@/components/games/helix-jump"), {
  ssr: false,
  loading: () => <div className="flex h-96 items-center justify-center text-white/50">3D 로딩중...</div>,
});
const CubeRunnerGame = dynamic(() => import("@/components/games/cube-runner"), {
  ssr: false,
  loading: () => <div className="flex h-96 items-center justify-center text-white/50">3D 로딩중...</div>,
});
const GemCatcherGame = dynamic(() => import("@/components/games/gem-catcher"), {
  ssr: false,
  loading: () => <div className="flex h-96 items-center justify-center text-white/50">3D 로딩중...</div>,
});
const Breakout3DGame = dynamic(() => import("@/components/games/breakout-3d"), {
  ssr: false,
  loading: () => <div className="flex h-96 items-center justify-center text-white/50">3D 로딩중...</div>,
});

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function rand(seed: number, min: number, max: number) {
  const x = Math.sin(seed) * 10000;
  const r = x - Math.floor(x);
  return Math.floor(r * (max - min + 1)) + min;
}

function cn(...arr: Array<string | false>) {
  return arr.filter(Boolean).join(" ");
}

type Cell = number;

const TETRIS_SHAPES: number[][][] = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [1, 1, 1]]
];

function rotate(shape: number[][]) {
  const rows = shape.length;
  const cols = shape[0].length;
  const out = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      out[c][rows - 1 - r] = shape[r][c];
    }
  }
  return out;
}

function TetrisGame({ seed }: { seed: number }) {
  const W = 8;
  const H = 14;
  const [board, setBoard] = useState<Cell[][]>(() => Array.from({ length: H }, () => Array(W).fill(0)));
  const [piece, setPiece] = useState(() => ({ shape: TETRIS_SHAPES[rand(seed, 0, 6)], x: 2, y: 0 }));
  const [score, setScore] = useState(0);
  const [tick, setTick] = useState(0);
  const [over, setOver] = useState(false);

  const collides = (p: { shape: number[][]; x: number; y: number }, b: Cell[][]) => {
    for (let r = 0; r < p.shape.length; r += 1) {
      for (let c = 0; c < p.shape[r].length; c += 1) {
        if (!p.shape[r][c]) continue;
        const nx = p.x + c;
        const ny = p.y + r;
        if (nx < 0 || nx >= W || ny >= H) return true;
        if (ny >= 0 && b[ny][nx]) return true;
      }
    }
    return false;
  };

  const merge = (p: { shape: number[][]; x: number; y: number }, b: Cell[][]) => {
    const nb = b.map((row) => [...row]);
    for (let r = 0; r < p.shape.length; r += 1) {
      for (let c = 0; c < p.shape[r].length; c += 1) {
        if (p.shape[r][c]) {
          const y = p.y + r;
          const x = p.x + c;
          if (y >= 0) nb[y][x] = 1;
        }
      }
    }
    let cleared = 0;
    const filtered = nb.filter((row) => {
      const full = row.every((v) => v === 1);
      if (full) cleared += 1;
      return !full;
    });
    while (filtered.length < H) filtered.unshift(Array(W).fill(0));
    if (cleared) setScore((s) => s + cleared * 100);
    return filtered;
  };

  const spawn = () => {
    const next = { shape: TETRIS_SHAPES[rand(seed + tick * 7, 0, 6)], x: 2, y: 0 };
    if (collides(next, board)) {
      setOver(true);
      return;
    }
    setPiece(next);
  };

  useEffect(() => {
    if (over) return;
    const t = setInterval(() => {
      setPiece((prev) => {
        const d = { ...prev, y: prev.y + 1 };
        if (collides(d, board)) {
          const merged = merge(prev, board);
          setBoard(merged);
          setTick((v) => v + 1);
          const next = { shape: TETRIS_SHAPES[rand(seed + (tick + 1) * 7, 0, 6)], x: 2, y: 0 };
          if (collides(next, merged)) setOver(true);
          else setTimeout(() => setPiece(next), 0);
          return prev;
        }
        return d;
      });
    }, 480);
    return () => clearInterval(t);
  }, [board, over, seed, tick]);

  const view = useMemo(() => {
    const v = board.map((row) => [...row]);
    for (let r = 0; r < piece.shape.length; r += 1) {
      for (let c = 0; c < piece.shape[r].length; c += 1) {
        if (!piece.shape[r][c]) continue;
        const y = piece.y + r;
        const x = piece.x + c;
        if (y >= 0 && y < H && x >= 0 && x < W) v[y][x] = 2;
      }
    }
    return v;
  }, [board, piece]);

  const move = (dx: number) => {
    if (over) return;
    const next = { ...piece, x: piece.x + dx };
    if (!collides(next, board)) setPiece(next);
  };

  const rot = () => {
    if (over) return;
    const next = { ...piece, shape: rotate(piece.shape) };
    if (!collides(next, board)) setPiece(next);
  };

  const drop = () => {
    if (over) return;
    let p = { ...piece };
    while (!collides({ ...p, y: p.y + 1 }, board)) p = { ...p, y: p.y + 1 };
    setPiece(p);
  };

  return (
    <div className="space-y-3">
      <p>테트리스: 가로줄을 완성해 지우세요.</p>
      <div className="grid w-fit grid-cols-8 gap-1 rounded bg-black/40 p-2">
        {view.flat().map((v, i) => (
          <div key={i} className={cn("h-4 w-4 rounded", v === 0 && "bg-white/10", v === 1 && "bg-indigo-500", v === 2 && "bg-cyan-300")} />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="rounded bg-white/10 px-3 py-2" onClick={() => move(-1)}>◀</button>
        <button className="rounded bg-white/10 px-3 py-2" onClick={() => move(1)}>▶</button>
        <button className="rounded bg-white/10 px-3 py-2" onClick={rot}>회전</button>
        <button className="rounded bg-white/10 px-3 py-2" onClick={drop}>드롭</button>
      </div>
      <p>{over ? `게임오버 | 점수 ${score}` : `점수 ${score}`}</p>
    </div>
  );
}

function OmokGame() {
  const N = 13;
  const center = Math.floor(N / 2);
  const dirs = [[1, 0], [0, 1], [1, 1], [1, -1]];
  type Stone = "b" | "w" | null;

  const [board, setBoard] = useState<Stone[][]>(() => Array.from({ length: N }, () => Array(N).fill(null)));
  const [turn, setTurn] = useState<"b" | "w">("b");
  const [msg, setMsg] = useState("흑돌(당신) 선공입니다.");
  const [over, setOver] = useState(false);
  const [last, setLast] = useState<{ r: number; c: number } | null>(null);
  const [history, setHistory] = useState<Array<{ r: number; c: number; t: "b" | "w" }>>([]);

  const inRange = (r: number, c: number) => r >= 0 && r < N && c >= 0 && c < N;

  const five = (b: Stone[][], r: number, c: number, t: "b" | "w") => {
    for (const [dr, dc] of dirs) {
      let cnt = 1;
      for (const s of [-1, 1]) {
        let rr = r + dr * s;
        let cc = c + dc * s;
        while (inRange(rr, cc) && b[rr][cc] === t) {
          cnt += 1;
          rr += dr * s;
          cc += dc * s;
        }
      }
      if (cnt >= 5) return true;
    }
    return false;
  };

  const hasStone = board.some((row) => row.some(Boolean));

  const candidates = (b: Stone[][]) => {
    if (!b.some((row) => row.some(Boolean))) return [{ r: center, c: center }];
    const out: Array<{ r: number; c: number }> = [];
    for (let r = 0; r < N; r += 1) {
      for (let c = 0; c < N; c += 1) {
        if (b[r][c]) continue;
        let near = false;
        for (let rr = r - 2; rr <= r + 2; rr += 1) {
          for (let cc = c - 2; cc <= c + 2; cc += 1) {
            if (inRange(rr, cc) && b[rr][cc]) near = true;
          }
        }
        if (near) out.push({ r, c });
      }
    }
    return out;
  };

  const winningMove = (b: Stone[][], t: "b" | "w") => {
    for (const { r, c } of candidates(b)) {
      const nb = b.map((row) => [...row]);
      nb[r][c] = t;
      if (five(nb, r, c, t)) return { r, c };
    }
    return null;
  };

  const scorePoint = (b: Stone[][], r: number, c: number, t: "b" | "w") => {
    let score = 0;
    for (const [dr, dc] of dirs) {
      let own = 1;
      let open = 0;
      for (const s of [-1, 1]) {
        let rr = r + dr * s;
        let cc = c + dc * s;
        while (inRange(rr, cc) && b[rr][cc] === t) {
          own += 1;
          rr += dr * s;
          cc += dc * s;
        }
        if (inRange(rr, cc) && !b[rr][cc]) open += 1;
      }
      if (own >= 5) score += 100000;
      else if (own === 4 && open === 2) score += 12000;
      else if (own === 4 && open === 1) score += 3800;
      else if (own === 3 && open === 2) score += 1200;
      else if (own === 3 && open === 1) score += 260;
      else if (own === 2 && open === 2) score += 120;
      else score += own * 10;
    }
    return score;
  };

  const chooseAi = (b: Stone[][]) => {
    const winNow = winningMove(b, "w");
    if (winNow) return winNow;
    const blockNow = winningMove(b, "b");
    if (blockNow) return blockNow;

    let best = { r: center, c: center };
    let bestScore = -1;
    for (const p of candidates(b)) {
      const atk = scorePoint(b, p.r, p.c, "w");
      const def = scorePoint(b, p.r, p.c, "b");
      const centerBonus = 10 - (Math.abs(p.r - center) + Math.abs(p.c - center));
      const total = atk * 1.1 + def * 1.05 + centerBonus;
      if (total > bestScore) {
        bestScore = total;
        best = p;
      }
    }
    return best;
  };

  const place = (r: number, c: number) => {
    if (over || turn !== "b" || board[r][c]) return;
    const nb = board.map((row) => [...row]);
    nb[r][c] = "b";
    setBoard(nb);
    setHistory((h) => [...h, { r, c, t: "b" }]);
    setLast({ r, c });

    if (five(nb, r, c, "b")) {
      setOver(true);
      setMsg("승리! 다섯 수 완성");
      return;
    }

    setTurn("w");
    setMsg("AI 생각중...");

    setTimeout(() => {
      const pick = chooseAi(nb);
      const aiBoard = nb.map((row) => [...row]);
      aiBoard[pick.r][pick.c] = "w";
      setBoard(aiBoard);
      setHistory((h) => [...h, { r: pick.r, c: pick.c, t: "w" }]);
      setLast({ r: pick.r, c: pick.c });

      if (five(aiBoard, pick.r, pick.c, "w")) {
        setOver(true);
        setMsg("패배! 다시 도전해보세요");
      } else {
        setTurn("b");
        setMsg("당신 차례");
      }
    }, 240);
  };

  const undo = () => {
    if (history.length < 2 || over) return;
    const nextHistory = history.slice(0, -2);
    const nb: Stone[][] = Array.from({ length: N }, () => Array(N).fill(null));
    nextHistory.forEach((m) => {
      nb[m.r][m.c] = m.t;
    });
    setBoard(nb);
    setHistory(nextHistory);
    setLast(nextHistory.length ? { r: nextHistory[nextHistory.length - 1].r, c: nextHistory[nextHistory.length - 1].c } : null);
    setTurn("b");
    setMsg("한 수 되돌렸습니다");
  };

  const reset = () => {
    setBoard(Array.from({ length: N }, () => Array(N).fill(null)));
    setTurn("b");
    setMsg("흑돌(당신) 선공입니다.");
    setOver(false);
    setLast(null);
    setHistory([]);
  };

  return (
    <div className="space-y-3">
      <p>3D 오목: 모바일 최적화 | AI와 대전</p>
      <div className="w-full overflow-x-auto">
        <div
          className="mx-auto w-fit rounded-2xl border border-amber-200/30 bg-gradient-to-b from-amber-500/55 to-amber-800/65 p-3 shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
          style={{ transform: "perspective(1100px) rotateX(18deg)" }}
        >
          <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}>
            {board.flatMap((row, r) =>
              row.map((v, c) => {
                const isLast = last?.r === r && last?.c === c;
                return (
                  <button
                    key={`${r}-${c}`}
                    className="relative h-6 w-6 rounded-[4px] bg-amber-100/35 sm:h-7 sm:w-7"
                    onClick={() => place(r, c)}
                  >
                    {v && (
                      <span
                        className={cn(
                          "absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[inset_-2px_-3px_6px_rgba(0,0,0,0.35),0_3px_6px_rgba(0,0,0,0.35)] sm:h-6 sm:w-6",
                          v === "b" ? "bg-gradient-to-br from-zinc-200 to-zinc-900" : "bg-gradient-to-br from-white to-zinc-300",
                          isLast && "ring-2 ring-emerald-300"
                        )}
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="rounded bg-white/10 px-3 py-2" onClick={undo}>되돌리기</button>
        <button className="rounded bg-white/10 px-3 py-2" onClick={reset}>새 게임</button>
      </div>
      <p>{msg} {hasStone && !over ? `(진행 수 ${history.length})` : ""}</p>
    </div>
  );
}

function JigsawGame({ seed }: { seed: number }) {
  const [arr, setArr] = useState<number[]>(() => {
    const a = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    for (let i = 0; i < 80; i += 1) {
      const z = a.indexOf(0);
      const r = Math.floor(z / 3);
      const c = z % 3;
      const cand: number[] = [];
      if (r > 0) cand.push(z - 3);
      if (r < 2) cand.push(z + 3);
      if (c > 0) cand.push(z - 1);
      if (c < 2) cand.push(z + 1);
      const t = cand[rand(seed + i * 3, 0, cand.length - 1)];
      [a[z], a[t]] = [a[t], a[z]];
    }
    return a;
  });
  const done = arr.join(",") === "1,2,3,4,5,6,7,8,0";
  const click = (i: number) => {
    const z = arr.indexOf(0);
    const ok = [z - 3, z + 3, z - 1, z + 1].includes(i);
    if (!ok) return;
    const n = [...arr];
    [n[i], n[z]] = [n[z], n[i]];
    setArr(n);
  };
  return (
    <div className="space-y-3">
      <p>퍼즐 맞추기: 숫자를 순서대로 정렬</p>
      <div className="grid w-fit grid-cols-3 gap-2 rounded bg-white/10 p-2">
        {arr.map((v, i) => (
          <button key={i} className={cn("h-14 w-14 rounded text-lg font-bold", v ? "bg-indigo-500" : "bg-transparent")} onClick={() => click(i)}>{v || ""}</button>
        ))}
      </div>
      <p>{done ? "완성!" : "타일 이동 중"}</p>
    </div>
  );
}

function HiddenPictureGame({ seed }: { seed: number }) {
  const sets = ["🍎", "🍏", "🍅"],
    target = sets[rand(seed, 0, 2)],
    odd = sets[(sets.indexOf(target) + 1) % 3];
  const pos = rand(seed + 3, 0, 47);
  const [found, setFound] = useState(false);
  return (
    <div className="space-y-3">
      <p>숨은그림찾기: {odd} 하나를 찾으세요</p>
      <div className="grid grid-cols-8 gap-1 rounded bg-white/10 p-2">
        {Array.from({ length: 48 }, (_, i) => (
          <button key={i} className="h-8 w-8 rounded bg-black/20 text-lg" onClick={() => i === pos && setFound(true)}>{i === pos ? odd : target}</button>
        ))}
      </div>
      <p>{found ? "정답!" : "찾아보세요"}</p>
    </div>
  );
}

function SpotDifferenceGame({ seed }: { seed: number }) {
  const left = useMemo(() => Array.from({ length: 16 }, (_, i) => rand(seed + i, 1, 4)), [seed]);
  const diffIdx = useMemo(() => {
    const a = [rand(seed + 100, 0, 15), rand(seed + 101, 0, 15), rand(seed + 102, 0, 15), rand(seed + 103, 0, 15)];
    return Array.from(new Set(a));
  }, [seed]);
  const right = useMemo(() => left.map((v, i) => (diffIdx.includes(i) ? ((v % 4) + 1) : v)), [left, diffIdx]);
  const [found, setFound] = useState<number[]>([]);
  const emojis = ["", "🔵", "🟢", "🟣", "🟠"];
  return (
    <div className="space-y-3">
      <p>틀린그림찾기: 오른쪽에서 다른 칸 {diffIdx.length}개 찾기</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid grid-cols-4 gap-1 rounded bg-white/10 p-2">
          {left.map((v, i) => <div key={i} className="flex h-9 items-center justify-center rounded bg-black/20">{emojis[v]}</div>)}
        </div>
        <div className="grid grid-cols-4 gap-1 rounded bg-white/10 p-2">
          {right.map((v, i) => (
            <button key={i} className={cn("h-9 rounded", found.includes(i) ? "bg-emerald-500/40" : "bg-black/20")} onClick={() => {
              if (diffIdx.includes(i) && !found.includes(i)) setFound((f) => [...f, i]);
            }}>{emojis[v]}</button>
          ))}
        </div>
      </div>
      <p>{found.length === diffIdx.length ? "모두 찾았어요!" : `${found.length}/${diffIdx.length}`}</p>
    </div>
  );
}

function AirplaneGame({ seed }: { seed: number }) {
  const [x, setX] = useState(50);
  const [bullets, setBullets] = useState<{ x: number; y: number }[]>([]);
  const [enemies, setEnemies] = useState<{ x: number; y: number }[]>([{ x: 20, y: 0 }]);
  const [score, setScore] = useState(0);
  const [alive, setAlive] = useState(true);

  useEffect(() => {
    if (!alive) return;
    const t = setInterval(() => {
      setBullets((b) => b.map((v) => ({ ...v, y: v.y - 6 })).filter((v) => v.y > -10));
      setEnemies((e) => {
        const moved = e.map((v) => ({ ...v, y: v.y + 3 })).filter((v) => v.y < 110);
        if (rand(seed + score + moved.length, 0, 10) > 7) moved.push({ x: rand(seed + score * 9, 6, 94), y: 0 });
        if (moved.some((m) => Math.abs(m.x - x) < 8 && m.y > 88)) setAlive(false);
        return moved;
      });
      setScore((s) => s + 1);
    }, 90);
    return () => clearInterval(t);
  }, [alive, seed, score, x]);

  useEffect(() => {
    setEnemies((e) => e.filter((en) => {
      const hit = bullets.some((b) => Math.abs(b.x - en.x) < 6 && Math.abs(b.y - en.y) < 6);
      if (hit) setScore((s) => s + 40);
      return !hit;
    }));
  }, [bullets]);

  return (
    <div className="space-y-3">
      <p>비행기 게임: 적기를 피하고 격추하세요</p>
      <div className="relative h-56 overflow-hidden rounded-xl border border-white/20 bg-slate-900">
        {bullets.map((b, i) => <div key={i} className="absolute h-3 w-1 bg-cyan-300" style={{ left: `${b.x}%`, top: `${b.y}%` }} />)}
        {enemies.map((e, i) => <div key={i} className="absolute h-4 w-4 rounded bg-rose-400" style={{ left: `${e.x}%`, top: `${e.y}%` }} />)}
        <div className="absolute text-2xl" style={{ left: `${x}%`, top: "90%", transform: "translateX(-50%)" }}>✈️</div>
      </div>
      <div className="flex gap-2">
        <button className="rounded bg-white/10 px-3 py-2" onClick={() => setX((v) => Math.max(5, v - 8))}>◀</button>
        <button className="rounded bg-white/10 px-3 py-2" onClick={() => setBullets((b) => [...b, { x, y: 86 }])}>발사</button>
        <button className="rounded bg-white/10 px-3 py-2" onClick={() => setX((v) => Math.min(95, v + 8))}>▶</button>
      </div>
      <p>{alive ? `점수 ${score}` : `격추됨! 점수 ${score}`}</p>
    </div>
  );
}

function WhackGame({ seed }: { seed: number }) {
  const [active, setActive] = useState(0);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(20);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => {
      setLeft((v) => v - 1);
      setActive(rand(seed + left * 7, 0, 8));
    }, 500);
    return () => clearTimeout(t);
  }, [left, seed]);
  return (
    <div className="space-y-3">
      <p>두더지 게임: 20턴 동안 최대 점수 도전</p>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 9 }, (_, i) => (
          <button key={i} className="h-16 rounded bg-amber-900/60 text-2xl" onClick={() => i === active && setScore((s) => s + 1)}>{i === active ? "🐹" : "🕳️"}</button>
        ))}
      </div>
      <p>남은 턴 {left} | 점수 {score}</p>
    </div>
  );
}

function ChessGame() {
  const N = 6;
  const start = 14;
  const [pos, setPos] = useState(start);
  const [visited, setVisited] = useState<number[]>([start]);
  const moves = useMemo(() => {
    const r = Math.floor(pos / N);
    const c = pos % N;
    const d = [[2, 1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [-1, -2], [1, -2], [2, -1]];
    return d
      .map(([dr, dc]) => [r + dr, c + dc])
      .filter(([rr, cc]) => rr >= 0 && rr < N && cc >= 0 && cc < N)
      .map(([rr, cc]) => rr * N + cc)
      .filter((p) => !visited.includes(p));
  }, [pos, visited]);
  const goal = 14;
  return (
    <div className="space-y-3">
      <p>체스(나이트 투어): 말 이동으로 {goal}칸 방문</p>
      <div className="grid w-fit grid-cols-6 gap-1 rounded bg-white/10 p-2">
        {Array.from({ length: N * N }, (_, i) => (
          <button
            key={i}
            className={cn(
              "h-9 w-9 rounded text-sm",
              pos === i && "bg-cyan-400 text-black",
              visited.includes(i) && pos !== i && "bg-indigo-500/70",
              moves.includes(i) && "ring-2 ring-lime-300",
              !visited.includes(i) && pos !== i && "bg-black/20"
            )}
            onClick={() => {
              if (!moves.includes(i)) return;
              setPos(i);
              setVisited((v) => [...v, i]);
            }}
          >{pos === i ? "♞" : ""}</button>
        ))}
      </div>
      <p>{visited.length >= goal ? "클리어!" : `방문 ${visited.length}/${goal}`}</p>
    </div>
  );
}

function Runner3DGame({ seed }: { seed: number }) {
  const [lane, setLane] = useState(1);
  const [obs, setObs] = useState<{ lane: number; z: number }[]>([{ lane: 1, z: 0 }]);
  const [score, setScore] = useState(0);
  const [alive, setAlive] = useState(true);
  useEffect(() => {
    if (!alive) return;
    const t = setInterval(() => {
      setObs((prev) => {
        const next = prev.map((o) => ({ ...o, z: o.z + 5 })).filter((o) => o.z < 110);
        if (rand(seed + score + prev.length, 0, 10) > 7) next.push({ lane: rand(seed + score, 0, 2), z: 0 });
        if (next.some((o) => o.lane === lane && o.z > 92)) setAlive(false);
        return next;
      });
      setScore((s) => s + 1);
    }, 80);
    return () => clearInterval(t);
  }, [alive, lane, score, seed]);

  return (
    <div className="space-y-3">
      <p>3D 러너: 레인 변경으로 장애물 회피</p>
      <div className="relative h-56 overflow-hidden rounded-xl border border-white/20 bg-gradient-to-b from-slate-900 to-slate-700" style={{ perspective: "600px" }}>
        <div className="absolute inset-x-0 bottom-0 top-0 mx-auto w-3/4" style={{ transform: "rotateX(58deg)", transformOrigin: "bottom" }}>
          {[0, 1, 2].map((l) => <div key={l} className="absolute top-0 h-full w-1/3 border-x border-white/20" style={{ left: `${l * 33.333}%` }} />)}
          {obs.map((o, i) => (
            <div key={i} className="absolute h-5 rounded bg-rose-400" style={{ width: `${20 - o.z * 0.12}%`, left: `${o.lane * 33.333 + 6}%`, top: `${o.z}%` }} />
          ))}
          <div className="absolute bottom-1 h-5 rounded bg-cyan-300" style={{ width: "20%", left: `${lane * 33.333 + 6}%` }} />
        </div>
      </div>
      <div className="flex gap-2">
        <button className="rounded bg-white/10 px-3 py-2" onClick={() => setLane((v) => Math.max(0, v - 1))}>◀</button>
        <button className="rounded bg-white/10 px-3 py-2" onClick={() => setLane((v) => Math.min(2, v + 1))}>▶</button>
      </div>
      <p>{alive ? `거리 ${score}` : `충돌! 기록 ${score}`}</p>
    </div>
  );
}

function RhythmGame({ seed }: { seed: number }) {
  const [bar, setBar] = useState(0);
  const [combo, setCombo] = useState(0);
  const [best, setBest] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setBar((v) => (v + rand(seed + v, 3, 8)) % 100), 70);
    return () => clearInterval(t);
  }, [seed]);
  const good = bar >= 44 && bar <= 56;
  return (
    <div className="space-y-3">
      <p>리듬 탭퍼: 중앙 구간에서 탭</p>
      <div className="h-4 rounded bg-white/10"><div className={cn("h-4 rounded", good ? "bg-emerald-400" : "bg-cyan-400")} style={{ width: `${bar}%` }} /></div>
      <button className="rounded bg-white/10 px-4 py-2" onClick={() => {
        if (good) {
          setCombo((c) => {
            const n = c + 1;
            setBest((b) => Math.max(b, n));
            return n;
          });
        } else setCombo(0);
      }}>비트!</button>
      <p>콤보 {combo} / 최고 {best}</p>
    </div>
  );
}

function EngineView({ mode, seed }: { mode: GameMode; seed: number }) {
  if (mode === "tetris") return <TetrisGame seed={seed} />;
  if (mode === "omok") return <OmokGame />;
  if (mode === "jigsaw") return <JigsawGame seed={seed} />;
  if (mode === "hidden") return <HiddenPictureGame seed={seed} />;
  if (mode === "difference") return <SpotDifferenceGame seed={seed} />;
  if (mode === "airplane") return <AirplaneGame seed={seed} />;
  if (mode === "whack") return <WhackGame seed={seed} />;
  if (mode === "chess") return <ChessGame />;
  if (mode === "runner3d") return <Runner3DGame seed={seed} />;
  if (mode === "rhythm") return <RhythmGame seed={seed} />;
  if (mode === "crystal-puzzle") return <CrystalPuzzleGame />;
  if (mode === "neon-stack") return <NeonStackGame />;
  if (mode === "crystal-memory") return <CrystalMemoryGame />;
  if (mode === "helix-jump") return <HelixJumpGame />;
  if (mode === "cube-runner") return <CubeRunnerGame />;
  if (mode === "gem-catcher") return <GemCatcherGame />;
  if (mode === "breakout-3d") return <Breakout3DGame />;
  return <div>준비중</div>;
}

export default function LocalGamePlayer({ game }: { game: GameMeta }) {
  const seed = hash(game.id);
  return (
    <section className="mx-auto w-full max-w-3xl rounded-2xl border border-white/15 bg-white/5 p-5">
      <div className="mb-4 flex items-center gap-3">
        <img src={game.thumbnail} alt={game.title} className="h-14 w-14 rounded-lg object-cover" />
        <div>
          <h1 className="text-2xl font-bold text-white">{game.title}</h1>
          <p className="text-sm text-white/70">{game.description}</p>
        </div>
      </div>
      <EngineView mode={game.mode} seed={seed} />
    </section>
  );
}
