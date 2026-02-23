"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type Target = { id: number; x: number; y: number; size: number; points: number; color: string; expiresAt: number };

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"];

export default function TapFrenzyGame() {
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<Target[]>([]);
  const [combo, setCombo] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const targetIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const spawnTarget = useCallback(() => {
    const isGolden = Math.random() < 0.1;
    const size = isGolden ? 50 : 30 + Math.random() * 30;
    const x = 10 + Math.random() * 80;
    const y = 10 + Math.random() * 70;
    const points = isGolden ? 50 : Math.round(60 / size * 10);
    const color = isGolden ? "#fbbf24" : COLORS[Math.floor(Math.random() * COLORS.length)];
    const lifespan = isGolden ? 1500 : 2000 + Math.random() * 1000;
    
    setTargets(prev => [...prev, {
      id: targetIdRef.current++,
      x,
      y,
      size,
      points,
      color,
      expiresAt: Date.now() + lifespan,
    }]);
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;
    
    // Timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Spawn targets
    const spawner = setInterval(() => {
      if (targets.length < 6) {
        spawnTarget();
      }
    }, 400);

    // Remove expired targets
    const cleaner = setInterval(() => {
      const now = Date.now();
      setTargets(prev => {
        const expired = prev.filter(t => t.expiresAt <= now);
        if (expired.length > 0) {
          setMisses(m => m + expired.length);
          setCombo(0);
        }
        return prev.filter(t => t.expiresAt > now);
      });
    }, 100);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
      clearInterval(cleaner);
    };
  }, [started, gameOver, targets.length, spawnTarget]);

  const handleTargetClick = (targetId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = targets.find(t => t.id === targetId);
    if (!target) return;

    setTargets(prev => prev.filter(t => t.id !== targetId));
    setHits(h => h + 1);
    setCombo(c => c + 1);
    
    const comboMultiplier = 1 + Math.min(combo, 10) * 0.1;
    const finalPoints = Math.round(target.points * comboMultiplier);
    setScore(s => s + finalPoints);
  };

  const handleMissClick = () => {
    if (!started || gameOver) return;
    setMisses(m => m + 1);
    setCombo(0);
  };

  const restart = () => {
    if (score > highScore) setHighScore(score);
    setStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(30);
    setTargets([]);
    setCombo(0);
    setHits(0);
    setMisses(0);
  };

  const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;

  return (
    <div 
      ref={containerRef}
      className="w-full rounded-2xl overflow-hidden relative"
      style={{ minHeight: "520px", background: "linear-gradient(180deg, #0c0c0c 0%, #1a1a1a 100%)" }}
      onClick={handleMissClick}
    >
      {!started && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/80">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">탭 프렌지</h2>
          <p className="text-zinc-400 text-sm mb-4 text-center px-4">나타나는 타겟을 빠르게 터치하세요!<br/>작을수록 고득점, 🟡 황금타겟 50점!</p>
          {highScore > 0 && (
            <div className="mb-4 text-yellow-400 text-sm">🏆 최고: {highScore}점</div>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); restart(); }}
            className="px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-all text-lg"
          >
            시작!
          </button>
        </div>
      )}

      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/90">
          <h2 className="text-2xl sm:text-3xl font-black text-orange-400 mb-4">타임 오버!</h2>
          <div className="bg-white/10 backdrop-blur rounded-2xl px-8 py-6 mb-6 text-center border border-orange-500/30">
            <div className="text-orange-300 text-sm mb-1">최종 점수</div>
            <div className="text-5xl font-black text-white mb-2">{score}</div>
            <div className="flex gap-4 text-sm text-white/60 justify-center">
              <span>명중: {hits}</span>
              <span>정확도: {accuracy}%</span>
            </div>
            {score > highScore && score > 0 && (
              <div className="mt-2 text-yellow-400 text-sm">🎉 새 기록!</div>
            )}
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); restart(); }}
            className="px-8 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl hover:scale-105 transition-all"
          >
            다시 하기
          </button>
        </div>
      )}

      {started && !gameOver && (
        <>
          {/* HUD */}
          <div className="absolute top-4 left-4 right-4 z-10 flex justify-between pointer-events-none">
            <div className="bg-black/60 backdrop-blur rounded-xl px-4 py-2">
              <span className="text-orange-400 text-xs block">점수</span>
              <span className="text-2xl font-black text-white">{score}</span>
            </div>
            {combo > 2 && (
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl px-4 py-2 border border-yellow-500/40">
                <span className="text-yellow-400 font-bold text-lg">🔥 x{combo}</span>
              </div>
            )}
            <div className="bg-black/60 backdrop-blur rounded-xl px-4 py-2">
              <span className="text-rose-400 text-xs block">시간</span>
              <span className={`text-2xl font-black ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>{timeLeft}</span>
            </div>
          </div>

          {/* Targets */}
          {targets.map(target => (
            <button
              key={target.id}
              onClick={(e) => handleTargetClick(target.id, e)}
              className="absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 active:scale-90 animate-pulse"
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                width: target.size,
                height: target.size,
                background: `radial-gradient(circle at 30% 30%, ${target.color}, ${target.color}88)`,
                boxShadow: `0 0 ${target.size/2}px ${target.color}80, inset 0 0 ${target.size/4}px rgba(255,255,255,0.3)`,
                border: target.points === 50 ? '3px solid #fef08a' : 'none',
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
