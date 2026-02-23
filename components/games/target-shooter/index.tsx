"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Target {
  x: number;
  y: number;
  z: number; // depth for 3D effect
  size: number;
  speed: number;
  direction: number;
  points: number;
  hit: boolean;
  type: "normal" | "bonus" | "danger";
}

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const GAME_TIME = 30; // seconds

export default function TargetShooterGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"ready" | "playing" | "gameover">("ready");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [combo, setCombo] = useState(0);
  const [shots, setShots] = useState(0);
  const [hits, setHits] = useState(0);
  
  const targetsRef = useRef<Target[]>([]);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const crosshairRef = useRef<{ x: number; y: number }>({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 });

  const spawnTarget = useCallback(() => {
    const types: Array<"normal" | "bonus" | "danger"> = ["normal", "normal", "normal", "bonus", "danger"];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const z = 0.3 + Math.random() * 0.7; // depth 0.3 ~ 1
    const baseSize = type === "bonus" ? 25 : type === "danger" ? 35 : 30;
    const size = baseSize * z;
    
    const target: Target = {
      x: Math.random() * (CANVAS_WIDTH - size * 2) + size,
      y: Math.random() * (CANVAS_HEIGHT - size * 2) + size,
      z,
      size,
      speed: (1 + Math.random() * 2) * (1.2 - z), // closer = slower
      direction: Math.random() * Math.PI * 2,
      points: type === "bonus" ? 50 : type === "danger" ? -30 : Math.floor(30 * z),
      hit: false,
      type,
    };
    
    targetsRef.current.push(target);
  }, []);

  const startGame = useCallback(() => {
    targetsRef.current = [];
    setScore(0);
    setTimeLeft(GAME_TIME);
    setCombo(0);
    setShots(0);
    setHits(0);
    startTimeRef.current = Date.now();
    lastSpawnRef.current = 0;
    
    // Initial targets
    for (let i = 0; i < 5; i++) {
      spawnTarget();
    }
    
    setGameState("playing");
  }, [spawnTarget]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;

    const gameLoop = () => {
      if (!running) return;
      
      const now = Date.now();
      const elapsed = (now - startTimeRef.current) / 1000;
      const remaining = Math.max(0, GAME_TIME - elapsed);
      setTimeLeft(Math.ceil(remaining));
      
      if (remaining <= 0) {
        running = false;
        if (score > highScore) setHighScore(score);
        setGameState("gameover");
        return;
      }
      
      // Spawn targets
      if (now - lastSpawnRef.current > 800) {
        if (targetsRef.current.filter(t => !t.hit).length < 8) {
          spawnTarget();
        }
        lastSpawnRef.current = now;
      }
      
      // Update targets
      targetsRef.current = targetsRef.current.filter(t => {
        if (t.hit) return false;
        
        t.x += Math.cos(t.direction) * t.speed;
        t.y += Math.sin(t.direction) * t.speed;
        
        // Bounce off walls
        if (t.x < t.size || t.x > CANVAS_WIDTH - t.size) {
          t.direction = Math.PI - t.direction;
          t.x = Math.max(t.size, Math.min(CANVAS_WIDTH - t.size, t.x));
        }
        if (t.y < t.size || t.y > CANVAS_HEIGHT - t.size) {
          t.direction = -t.direction;
          t.y = Math.max(t.size, Math.min(CANVAS_HEIGHT - t.size, t.y));
        }
        
        return true;
      });
      
      // Draw
      // Background - 3D gradient
      const bgGradient = ctx.createRadialGradient(
        CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 0,
        CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH
      );
      bgGradient.addColorStop(0, "#1e3a5f");
      bgGradient.addColorStop(1, "#0f172a");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Draw grid for depth effect
      ctx.strokeStyle = "rgba(100, 200, 255, 0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 10; i++) {
        const y = CANVAS_HEIGHT / 2 + (i - 5) * 50;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
      }
      for (let i = 0; i < 12; i++) {
        const x = i * 50;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      
      // Sort targets by z for proper layering
      const sortedTargets = [...targetsRef.current].sort((a, b) => a.z - b.z);
      
      // Draw targets
      sortedTargets.forEach(target => {
        const alpha = 0.4 + target.z * 0.6;
        
        if (target.type === "bonus") {
          // Gold star target
          ctx.fillStyle = `rgba(251, 191, 36, ${alpha})`;
          ctx.shadowColor = "#fbbf24";
          ctx.shadowBlur = 15 * target.z;
          drawStar(ctx, target.x, target.y, target.size, 5);
          ctx.fill();
        } else if (target.type === "danger") {
          // Red X target - don't shoot!
          ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`;
          ctx.shadowColor = "#ef4444";
          ctx.shadowBlur = 10 * target.z;
          ctx.beginPath();
          ctx.arc(target.x, target.y, target.size, 0, Math.PI * 2);
          ctx.fill();
          
          // X mark
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 3 * target.z;
          ctx.beginPath();
          ctx.moveTo(target.x - target.size * 0.5, target.y - target.size * 0.5);
          ctx.lineTo(target.x + target.size * 0.5, target.y + target.size * 0.5);
          ctx.moveTo(target.x + target.size * 0.5, target.y - target.size * 0.5);
          ctx.lineTo(target.x - target.size * 0.5, target.y + target.size * 0.5);
          ctx.stroke();
        } else {
          // Normal target
          ctx.fillStyle = `rgba(34, 211, 238, ${alpha})`;
          ctx.shadowColor = "#22d3ee";
          ctx.shadowBlur = 10 * target.z;
          ctx.beginPath();
          ctx.arc(target.x, target.y, target.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Inner rings
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(target.x, target.y, target.size * 0.6, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(target.x, target.y, target.size * 0.3, 0, Math.PI * 2);
          ctx.stroke();
          
          // Center dot
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(target.x, target.y, target.size * 0.1, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.shadowBlur = 0;
        
        // Points label
        ctx.fillStyle = target.type === "danger" ? "#ff6b6b" : "#ffffff";
        ctx.font = `bold ${12 * target.z}px sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(`${target.points > 0 ? "+" : ""}${target.points}`, target.x, target.y - target.size - 5);
      });
      
      // Draw crosshair
      const ch = crosshairRef.current;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ch.x - 20, ch.y);
      ctx.lineTo(ch.x - 8, ch.y);
      ctx.moveTo(ch.x + 8, ch.y);
      ctx.lineTo(ch.x + 20, ch.y);
      ctx.moveTo(ch.x, ch.y - 20);
      ctx.lineTo(ch.x, ch.y - 8);
      ctx.moveTo(ch.x, ch.y + 8);
      ctx.lineTo(ch.x, ch.y + 20);
      ctx.stroke();
      
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.beginPath();
      ctx.arc(ch.x, ch.y, 25, 0, Math.PI * 2);
      ctx.stroke();
      
      // Combo indicator
      if (combo > 1) {
        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${combo}x COMBO!`, CANVAS_WIDTH / 2, 40);
      }
      
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      running = false;
      cancelAnimationFrame(animationRef.current);
    };
  }, [gameState, highScore, score, spawnTarget]);

  // Draw star shape
  function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, points: number) {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? size : size * 0.5;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  // Mouse/Touch controls
  const handleMove = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    crosshairRef.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const handleShoot = useCallback(() => {
    if (gameState !== "playing") return;
    
    setShots(s => s + 1);
    const ch = crosshairRef.current;
    
    // Check hits (from front to back)
    const sortedTargets = [...targetsRef.current].sort((a, b) => b.z - a.z);
    let hitTarget: Target | null = null;
    
    for (const target of sortedTargets) {
      if (target.hit) continue;
      const dist = Math.hypot(ch.x - target.x, ch.y - target.y);
      if (dist < target.size) {
        hitTarget = target;
        break;
      }
    }
    
    if (hitTarget) {
      hitTarget.hit = true;
      setHits(h => h + 1);
      
      if (hitTarget.type === "danger") {
        setScore(s => Math.max(0, s + hitTarget!.points));
        setCombo(0);
      } else {
        const comboMultiplier = Math.min(combo + 1, 5);
        const points = hitTarget.points * comboMultiplier;
        setScore(s => s + points);
        setCombo(c => c + 1);
      }
    } else {
      setCombo(0);
    }
  }, [gameState, combo]);

  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX, e.clientY);
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 text-white">
        <div className="text-lg">⏱️ <span className={`font-bold ${timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-cyan-400"}`}>{timeLeft}s</span></div>
        <div className="text-lg">🎯 <span className="font-bold text-yellow-400">{score}</span></div>
        <div className="text-lg">🏆 <span className="font-bold text-purple-400">{highScore}</span></div>
        <div className="text-lg">💥 <span className="font-bold text-green-400">{hits}/{shots}</span></div>
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="rounded-xl border-2 border-white/20 cursor-none"
          onMouseMove={handleMouseMove}
          onClick={handleShoot}
          onTouchMove={handleTouchMove}
          onTouchStart={(e) => {
            handleTouchMove(e);
            handleShoot();
          }}
        />
        
        {gameState === "ready" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
            <h2 className="text-3xl font-bold text-white mb-4">🎯 타겟 슈팅</h2>
            <p className="text-white/70 mb-2">움직이는 타겟을 클릭해서 맞추세요!</p>
            <div className="flex gap-4 mb-4 text-sm">
              <span className="text-cyan-400">🔵 일반</span>
              <span className="text-yellow-400">⭐ 보너스</span>
              <span className="text-red-400">❌ 위험!</span>
            </div>
            <p className="text-white/70 mb-6">연속 명중 시 콤보 보너스!</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
            >
              게임 시작
            </button>
          </div>
        )}
        
        {gameState === "gameover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">⏱️ 시간 종료!</h2>
            <p className="text-2xl text-white mb-2">점수: <span className="text-cyan-400">{score}</span></p>
            <p className="text-lg text-white/70 mb-2">명중률: <span className="text-green-400">{shots > 0 ? Math.round((hits / shots) * 100) : 0}%</span></p>
            {score >= highScore && score > 0 && (
              <p className="text-yellow-400 mb-4">🎉 새로운 최고 기록!</p>
            )}
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
            >
              다시 도전
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
