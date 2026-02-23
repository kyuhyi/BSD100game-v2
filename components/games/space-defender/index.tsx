"use client";

import { useState, useCallback, useEffect, useRef } from "react";

type Bullet = { id: number; x: number; y: number };
type Enemy = { id: number; x: number; y: number; type: "normal" | "fast" | "big"; hp: number };
type Particle = { id: number; x: number; y: number; vx: number; vy: number; life: number; color: string };

const ENEMY_TYPES = {
  normal: { speed: 2, hp: 1, score: 10, color: "#ef4444", size: 24 },
  fast: { speed: 4, hp: 1, score: 15, color: "#f97316", size: 18 },
  big: { speed: 1.5, hp: 3, score: 30, color: "#a855f7", size: 36 },
};

export default function SpaceDefenderGame() {
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [playerX, setPlayerX] = useState(50);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const bulletIdRef = useRef(0);
  const enemyIdRef = useRef(0);
  const particleIdRef = useRef(0);
  const lastShotRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Game loop
  useEffect(() => {
    if (!started || gameOver) return;

    const loop = setInterval(() => {
      // Move bullets
      setBullets((prev) => prev.map((b) => ({ ...b, y: b.y - 8 })).filter((b) => b.y > -5));

      // Move enemies
      setEnemies((prev) => {
        const moved = prev.map((e) => ({ ...e, y: e.y + ENEMY_TYPES[e.type].speed * (1 + wave * 0.1) }));
        
        // Check if any enemy reached bottom
        const reached = moved.filter((e) => e.y > 95);
        if (reached.length > 0) {
          setLives((l) => {
            const newLives = l - reached.length;
            if (newLives <= 0) setGameOver(true);
            return Math.max(0, newLives);
          });
        }
        
        return moved.filter((e) => e.y <= 95);
      });

      // Spawn enemies
      if (Math.random() < 0.03 + wave * 0.005) {
        const types: Array<"normal" | "fast" | "big"> = ["normal", "normal", "fast", "big"];
        const type = types[Math.floor(Math.random() * types.length)];
        setEnemies((prev) => [...prev, {
          id: enemyIdRef.current++,
          x: 5 + Math.random() * 90,
          y: -5,
          type,
          hp: ENEMY_TYPES[type].hp,
        }]);
      }

      // Update particles
      setParticles((prev) => prev
        .map((p) => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.2, life: p.life - 0.05 }))
        .filter((p) => p.life > 0)
      );

      // Check collisions
      setBullets((prevBullets) => {
        let remainingBullets = [...prevBullets];
        
        setEnemies((prevEnemies) => {
          return prevEnemies.map((enemy) => {
            const hitBullet = remainingBullets.find((b) => {
              const dx = Math.abs(b.x - enemy.x);
              const dy = Math.abs(b.y - enemy.y);
              return dx < 5 && dy < 5;
            });
            
            if (hitBullet) {
              remainingBullets = remainingBullets.filter((b) => b.id !== hitBullet.id);
              const newHp = enemy.hp - 1;
              
              if (newHp <= 0) {
                // Enemy destroyed - spawn particles
                const config = ENEMY_TYPES[enemy.type];
                for (let i = 0; i < 8; i++) {
                  const angle = (i / 8) * Math.PI * 2;
                  setParticles((p) => [...p, {
                    id: particleIdRef.current++,
                    x: enemy.x,
                    y: enemy.y,
                    vx: Math.cos(angle) * (2 + Math.random() * 2),
                    vy: Math.sin(angle) * (2 + Math.random() * 2),
                    life: 1,
                    color: config.color,
                  }]);
                }
                setScore((s) => s + config.score * wave);
                return { ...enemy, hp: 0 };
              }
              return { ...enemy, hp: newHp };
            }
            return enemy;
          }).filter((e) => e.hp > 0);
        });
        
        return remainingBullets;
      });

      // Wave progression
      setScore((s) => {
        if (s > 0 && s % 300 === 0) {
          setWave((w) => w + 1);
        }
        return s;
      });
    }, 33);

    return () => clearInterval(loop);
  }, [started, gameOver, wave]);

  // Controls
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current || !started || gameOver) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPlayerX(Math.max(5, Math.min(95, x)));
  }, [started, gameOver]);

  const shoot = useCallback(() => {
    if (!started || gameOver) return;
    const now = Date.now();
    if (now - lastShotRef.current < 150) return;
    lastShotRef.current = now;
    setBullets((prev) => [...prev, { id: bulletIdRef.current++, x: playerX, y: 88 }]);
  }, [started, gameOver, playerX]);

  useEffect(() => {
    if (!started || gameOver) return;
    const interval = setInterval(shoot, 200);
    return () => clearInterval(interval);
  }, [started, gameOver, shoot]);

  const restart = () => {
    setStarted(true);
    setGameOver(false);
    setScore(0);
    setPlayerX(50);
    setBullets([]);
    setEnemies([]);
    setParticles([]);
    setLives(3);
    setWave(1);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl touch-none select-none"
      style={{ height: "min(70vh, 560px)", background: "linear-gradient(180deg, #030014 0%, #0a0520 50%, #150a30 100%)" }}
      onMouseMove={(e) => handleMove(e.clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onClick={shoot}
    >
      {/* Stars background */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.3 + Math.random() * 0.5,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {!started && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-3xl font-black text-white mb-2">스페이스 디펜더</h2>
          <p className="text-cyan-300/80 text-sm mb-8">적을 격추하고 지구를 지켜라!</p>
          <button 
            onClick={() => setStarted(true)}
            className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/30 hover:scale-105 transition-all"
          >
            출격!
          </button>
        </div>
      )}

      {gameOver && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
          <h2 className="text-3xl font-black text-rose-400 mb-2">임무 실패</h2>
          <div className="bg-white/10 backdrop-blur rounded-2xl px-8 py-6 mb-6 text-center border border-white/20">
            <div className="text-cyan-300 text-sm">최종 점수</div>
            <div className="text-5xl font-black text-white">{score}</div>
            <div className="text-white/50 text-sm mt-2">도달 웨이브: {wave}</div>
          </div>
          <button 
            onClick={restart}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:scale-105 transition-all"
          >
            재출격
          </button>
        </div>
      )}

      {started && !gameOver && (
        <>
          {/* HUD */}
          <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start">
            <div className="bg-black/50 backdrop-blur rounded-lg px-3 py-2 border border-white/20">
              <div className="text-cyan-300 text-xs">점수</div>
              <div className="text-xl font-black text-white">{score}</div>
            </div>
            <div className="bg-black/50 backdrop-blur rounded-lg px-3 py-2 border border-yellow-500/30">
              <div className="text-yellow-300 text-xs">웨이브</div>
              <div className="text-xl font-black text-yellow-400">{wave}</div>
            </div>
            <div className="bg-black/50 backdrop-blur rounded-lg px-3 py-2 border border-rose-500/30">
              <div className="text-rose-300 text-xs">생명</div>
              <div className="text-xl font-black text-rose-400">{"❤️".repeat(lives)}</div>
            </div>
          </div>

          {/* Bullets */}
          {bullets.map((b) => (
            <div
              key={b.id}
              className="absolute w-1 h-4 bg-cyan-400 rounded-full"
              style={{ left: `${b.x}%`, top: `${b.y}%`, transform: "translateX(-50%)", boxShadow: "0 0 10px #00ffff" }}
            />
          ))}

          {/* Enemies */}
          {enemies.map((e) => {
            const config = ENEMY_TYPES[e.type];
            return (
              <div
                key={e.id}
                className="absolute rounded-lg"
                style={{
                  left: `${e.x}%`,
                  top: `${e.y}%`,
                  width: config.size,
                  height: config.size,
                  transform: "translate(-50%, -50%)",
                  background: `linear-gradient(135deg, ${config.color}, ${config.color}88)`,
                  boxShadow: `0 0 20px ${config.color}80`,
                }}
              />
            );
          })}

          {/* Particles */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                backgroundColor: p.color,
                opacity: p.life,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}

          {/* Player */}
          <div
            className="absolute bottom-[8%]"
            style={{ left: `${playerX}%`, transform: "translateX(-50%)" }}
          >
            <div className="relative">
              <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[30px] border-l-transparent border-r-transparent border-b-cyan-400" style={{ filter: "drop-shadow(0 0 10px #00ffff)" }} />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-6 bg-gradient-to-b from-orange-400 to-transparent rounded-b-full animate-pulse" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
