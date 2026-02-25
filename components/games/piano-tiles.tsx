"use client";

import { useEffect, useState, useCallback, useRef } from "react";

type Tile = {
  id: number;
  lane: number;
  y: number;
  hit: boolean;
  missed: boolean;
};

const LANES = 4;
const TILE_HEIGHT = 25;

export default function PianoTilesGame() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(2);
  const tileIdRef = useRef(0);
  const lastSpawnRef = useRef(0);

  // 타일 생성
  const spawnTile = useCallback(() => {
    const lane = Math.floor(Math.random() * LANES);
    tileIdRef.current += 1;
    return {
      id: tileIdRef.current,
      lane,
      y: -TILE_HEIGHT,
      hit: false,
      missed: false,
    };
  }, []);

  // 게임 시작
  const startGame = () => {
    setTiles([spawnTile()]);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setGameOver(false);
    setStarted(true);
    setSpeed(2);
    tileIdRef.current = 1;
    lastSpawnRef.current = 0;
  };

  // 타일 터치
  const hitTile = (lane: number) => {
    if (gameOver) return;

    setTiles((prev) => {
      const hitZoneStart = 65;
      const hitZoneEnd = 95;
      
      // 해당 레인에서 히트 가능한 타일 찾기
      const targetTile = prev.find(
        (t) =>
          t.lane === lane &&
          !t.hit &&
          !t.missed &&
          t.y >= hitZoneStart - 10 &&
          t.y <= hitZoneEnd
      );

      if (targetTile) {
        // 성공
        setScore((s) => s + 10 + combo);
        setCombo((c) => {
          const newCombo = c + 1;
          setMaxCombo((m) => Math.max(m, newCombo));
          return newCombo;
        });
        // 속도 증가
        setSpeed((sp) => Math.min(sp + 0.02, 5));
        
        return prev.map((t) =>
          t.id === targetTile.id ? { ...t, hit: true } : t
        );
      } else {
        // 미스 - 빈 곳 터치
        setCombo(0);
        return prev;
      }
    });
  };

  // 게임 루프
  useEffect(() => {
    if (!started || gameOver) return;

    const interval = setInterval(() => {
      setTiles((prev) => {
        // 타일 이동
        let moved = prev.map((t) => ({ ...t, y: t.y + speed }));

        // 놓친 타일 체크
        const missed = moved.find((t) => !t.hit && !t.missed && t.y > 95);
        if (missed) {
          setGameOver(true);
          return moved;
        }

        // 화면 밖 타일 제거
        moved = moved.filter((t) => t.y < 120);

        // 새 타일 생성
        const topTile = moved.find((t) => !t.hit && !t.missed);
        if (!topTile || topTile.y > 15) {
          moved = [spawnTile(), ...moved];
        }

        return moved;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [started, gameOver, speed, spawnTile]);

  // 키보드
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "d" || e.key === "1") hitTile(0);
      if (e.key === "f" || e.key === "2") hitTile(1);
      if (e.key === "j" || e.key === "3") hitTile(2);
      if (e.key === "k" || e.key === "4") hitTile(3);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameOver]);

  const laneColors = ["#ff6b6b", "#4ecdc4", "#ffe66d", "#a29bfe"];

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <span>점수: {score}</span>
        <span className={combo >= 10 ? "animate-pulse text-yellow-400" : ""}>
          콤보: {combo}x
        </span>
        <span>최고 콤보: {maxCombo}</span>
      </div>

      <div
        className="relative mx-auto h-[450px] w-full max-w-sm overflow-hidden rounded-xl border-2 border-white/20"
        style={{
          background: "linear-gradient(to bottom, #1a1a2e 0%, #16213e 100%)",
        }}
      >
        {/* 레인 구분선 */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: LANES }).map((_, i) => (
            <div
              key={i}
              className="flex-1 border-r border-white/10 last:border-r-0"
            />
          ))}
        </div>

        {/* 히트 존 표시 */}
        <div
          className="absolute left-0 right-0 border-t-2 border-b-2 border-white/30"
          style={{
            top: "70%",
            height: "20%",
            background: "rgba(255,255,255,0.05)",
          }}
        >
          <div className="flex h-full items-center justify-center text-white/30 text-xs">
            TAP HERE
          </div>
        </div>

        {!started ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <h2 className="text-3xl font-bold text-white">🎹 피아노 타일</h2>
            <p className="text-white/70">검은 타일만 터치하세요!</p>
            <p className="text-sm text-white/50">키보드: D F J K 또는 1 2 3 4</p>
            <button
              onClick={startGame}
              className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 font-bold text-white transition hover:scale-105"
            >
              게임 시작
            </button>
          </div>
        ) : gameOver ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 bg-black/50">
            <h2 className="text-3xl font-bold text-red-400">GAME OVER</h2>
            <p className="text-xl text-white">점수: {score}</p>
            <p className="text-white/70">최고 콤보: {maxCombo}x</p>
            <button
              onClick={startGame}
              className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 font-bold text-white"
            >
              다시 시작
            </button>
          </div>
        ) : (
          <>
            {/* 타일 */}
            {tiles.map((tile) => (
              <div
                key={tile.id}
                className="absolute transition-all duration-75"
                style={{
                  left: `${(tile.lane / LANES) * 100}%`,
                  top: `${tile.y}%`,
                  width: `${100 / LANES}%`,
                  height: `${TILE_HEIGHT}%`,
                  padding: "2px",
                }}
              >
                <div
                  className={`h-full w-full rounded-lg transition-all ${
                    tile.hit
                      ? "scale-90 opacity-50"
                      : "hover:brightness-110"
                  }`}
                  style={{
                    background: tile.hit
                      ? laneColors[tile.lane]
                      : "linear-gradient(145deg, #2d2d2d 0%, #1a1a1a 100%)",
                    boxShadow: tile.hit
                      ? `0 0 20px ${laneColors[tile.lane]}`
                      : "0 4px 15px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                />
              </div>
            ))}

            {/* 콤보 표시 */}
            {combo >= 5 && (
              <div className="absolute left-1/2 top-1/4 -translate-x-1/2 text-center">
                <div
                  className={`text-4xl font-bold ${
                    combo >= 20
                      ? "animate-bounce text-yellow-400"
                      : combo >= 10
                      ? "text-orange-400"
                      : "text-white"
                  }`}
                >
                  {combo}x
                </div>
                {combo >= 10 && (
                  <div className="text-sm text-yellow-300">
                    {combo >= 30 ? "LEGENDARY!" : combo >= 20 ? "AMAZING!" : "GREAT!"}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* 터치 영역 */}
        {started && !gameOver && (
          <div className="absolute inset-0 flex">
            {Array.from({ length: LANES }).map((_, i) => (
              <button
                key={i}
                className="flex-1 active:bg-white/10"
                onClick={() => hitTile(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 하단 버튼 (모바일용) */}
      {started && !gameOver && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: LANES }).map((_, i) => (
            <button
              key={i}
              className="h-14 w-16 rounded-lg font-bold text-white transition active:scale-95"
              style={{
                background: `linear-gradient(145deg, ${laneColors[i]}, ${laneColors[i]}99)`,
                boxShadow: `0 4px 15px ${laneColors[i]}50`,
              }}
              onClick={() => hitTile(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
