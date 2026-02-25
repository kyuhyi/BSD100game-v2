"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Enemy = { x: number; y: number; type: number; alive: boolean };
type Bullet = { x: number; y: number; isPlayer: boolean };
type Explosion = { x: number; y: number; frame: number };

export default function GalagaGame() {
  const [playerX, setPlayerX] = useState(50);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 웨이브 시작
  const startWave = useCallback((waveNum: number) => {
    const newEnemies: Enemy[] = [];
    const rows = Math.min(3 + Math.floor(waveNum / 2), 5);
    const cols = Math.min(6 + waveNum, 10);
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        newEnemies.push({
          x: 10 + c * (80 / cols),
          y: 5 + r * 8,
          type: r % 3,
          alive: true,
        });
      }
    }
    setEnemies(newEnemies);
  }, []);

  // 게임 시작
  const startGame = () => {
    setStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setWave(1);
    setPlayerX(50);
    setBullets([]);
    setExplosions([]);
    startWave(1);
  };

  // 이동
  const move = (dir: number) => {
    if (gameOver) return;
    setPlayerX((x) => Math.max(5, Math.min(95, x + dir * 5)));
  };

  // 발사
  const shoot = () => {
    if (gameOver) return;
    setBullets((b) => [...b, { x: playerX, y: 85, isPlayer: true }]);
  };

  // 게임 루프
  useEffect(() => {
    if (!started || gameOver) return;

    const interval = setInterval(() => {
      // 총알 이동
      setBullets((prev) => {
        const moved = prev
          .map((b) => ({
            ...b,
            y: b.isPlayer ? b.y - 4 : b.y + 3,
          }))
          .filter((b) => b.y > -5 && b.y < 105);
        return moved;
      });

      // 적 이동 & 공격
      setEnemies((prev) => {
        const alive = prev.filter((e) => e.alive);
        if (alive.length === 0) {
          // 다음 웨이브
          setTimeout(() => {
            setWave((w) => {
              const next = w + 1;
              startWave(next);
              return next;
            });
          }, 1000);
          return prev;
        }

        // 적 발사 (랜덤)
        if (Math.random() < 0.02 * wave) {
          const shooter = alive[Math.floor(Math.random() * alive.length)];
          setBullets((b) => [...b, { x: shooter.x, y: shooter.y + 3, isPlayer: false }]);
        }

        // 적 좌우 이동
        return prev.map((e) => ({
          ...e,
          x: e.x + Math.sin(Date.now() / 500 + e.y) * 0.3,
        }));
      });

      // 폭발 애니메이션
      setExplosions((prev) =>
        prev.map((ex) => ({ ...ex, frame: ex.frame + 1 })).filter((ex) => ex.frame < 10)
      );

      // 충돌 감지
      setBullets((bullets) => {
        let newBullets = [...bullets];

        // 플레이어 총알 → 적
        setEnemies((enemies) => {
          return enemies.map((e) => {
            if (!e.alive) return e;
            const hit = newBullets.find(
              (b) => b.isPlayer && Math.abs(b.x - e.x) < 5 && Math.abs(b.y - e.y) < 5
            );
            if (hit) {
              newBullets = newBullets.filter((b) => b !== hit);
              setScore((s) => s + (e.type + 1) * 100);
              setExplosions((ex) => [...ex, { x: e.x, y: e.y, frame: 0 }]);
              return { ...e, alive: false };
            }
            return e;
          });
        });

        // 적 총알 → 플레이어
        const playerHit = newBullets.find(
          (b) => !b.isPlayer && Math.abs(b.x - playerX) < 5 && b.y > 82
        );
        if (playerHit) {
          newBullets = newBullets.filter((b) => b !== playerHit);
          setExplosions((ex) => [...ex, { x: playerX, y: 90, frame: 0 }]);
          setLives((l) => {
            const newLives = l - 1;
            if (newLives <= 0) setGameOver(true);
            return newLives;
          });
        }

        return newBullets;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [started, gameOver, playerX, wave, startWave]);

  // 키보드
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") move(-1);
      if (e.key === "ArrowRight") move(1);
      if (e.key === " " || e.key === "ArrowUp") shoot();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameOver]);

  const enemyColors = ["#ff6b6b", "#4ecdc4", "#ffe66d"];

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <span>점수: {score}</span>
        <span>웨이브: {wave}</span>
        <span>목숨: {"❤️".repeat(lives)}</span>
      </div>

      <div
        ref={containerRef}
        className="relative mx-auto h-[400px] w-full max-w-md overflow-hidden rounded-xl border border-purple-500/30 bg-gradient-to-b from-[#0a0a20] via-[#1a1a40] to-[#0a0a20]"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 20% 30%, white 1%, transparent 1%),
            radial-gradient(1px 1px at 40% 70%, white 1%, transparent 1%),
            radial-gradient(1px 1px at 60% 50%, white 1%, transparent 1%),
            radial-gradient(1px 1px at 80% 20%, white 1%, transparent 1%),
            radial-gradient(1px 1px at 10% 90%, white 1%, transparent 1%)
          `,
        }}
      >
        {!started ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <h2 className="text-3xl font-bold text-yellow-400">🚀 갤러그</h2>
            <p className="text-white/70">적기 편대를 격추하라!</p>
            <button
              onClick={startGame}
              className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 font-bold text-white transition hover:scale-105"
            >
              게임 시작
            </button>
          </div>
        ) : gameOver ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <h2 className="text-3xl font-bold text-red-400">GAME OVER</h2>
            <p className="text-xl text-white">최종 점수: {score}</p>
            <p className="text-white/70">웨이브 {wave} 도달</p>
            <button
              onClick={startGame}
              className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 font-bold text-white"
            >
              다시 시작
            </button>
          </div>
        ) : (
          <>
            {/* 적 */}
            {enemies.filter((e) => e.alive).map((e, i) => (
              <div
                key={i}
                className="absolute transition-all duration-75"
                style={{
                  left: `${e.x}%`,
                  top: `${e.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className="h-6 w-8 animate-pulse"
                  style={{
                    background: enemyColors[e.type],
                    clipPath: "polygon(50% 0%, 100% 40%, 80% 100%, 20% 100%, 0% 40%)",
                    boxShadow: `0 0 10px ${enemyColors[e.type]}`,
                  }}
                />
              </div>
            ))}

            {/* 총알 */}
            {bullets.map((b, i) => (
              <div
                key={i}
                className="absolute h-4 w-1 rounded-full"
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  background: b.isPlayer
                    ? "linear-gradient(to top, #00ff00, #88ff88)"
                    : "linear-gradient(to bottom, #ff0000, #ff8888)",
                  boxShadow: b.isPlayer ? "0 0 8px #00ff00" : "0 0 8px #ff0000",
                  transform: "translateX(-50%)",
                }}
              />
            ))}

            {/* 폭발 */}
            {explosions.map((ex, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${ex.x}%`,
                  top: `${ex.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: `${10 + ex.frame * 4}px`,
                    height: `${10 + ex.frame * 4}px`,
                    background: `radial-gradient(circle, #ffff00 0%, #ff6600 50%, transparent 100%)`,
                    opacity: 1 - ex.frame / 10,
                  }}
                />
              </div>
            ))}

            {/* 플레이어 */}
            <div
              className="absolute bottom-4 transition-all duration-100"
              style={{ left: `${playerX}%`, transform: "translateX(-50%)" }}
            >
              <div
                className="h-8 w-10"
                style={{
                  background: "linear-gradient(to top, #00aaff, #00ffff)",
                  clipPath: "polygon(50% 0%, 100% 100%, 75% 85%, 25% 85%, 0% 100%)",
                  boxShadow: "0 0 15px #00ffff",
                }}
              />
              <div className="absolute -bottom-1 left-1/2 h-2 w-4 -translate-x-1/2 animate-pulse rounded-full bg-orange-500" />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-center gap-3">
        <button
          className="rounded-lg bg-white/10 px-6 py-3 text-lg active:bg-white/20"
          onClick={() => move(-1)}
        >
          ◀
        </button>
        <button
          className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-3 text-lg font-bold active:scale-95"
          onClick={shoot}
        >
          발사
        </button>
        <button
          className="rounded-lg bg-white/10 px-6 py-3 text-lg active:bg-white/20"
          onClick={() => move(1)}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
