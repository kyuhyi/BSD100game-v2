"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Obstacle {
  lane: number; // -1, 0, 1
  z: number;
  type: "block" | "low" | "high" | "coin";
  collected?: boolean;
}

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 400;
const GROUND_Y = 320;
const LANE_WIDTH = 100;

export default function ObstacleRaceGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"ready" | "playing" | "gameover">("ready");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [restartKey, setRestartKey] = useState(0);
  
  const playerRef = useRef({
    lane: 0,
    y: 0,
    vy: 0,
    isJumping: false,
    isSliding: false,
    slideTimer: 0,
  });
  const obstaclesRef = useRef<Obstacle[]>([]);
  const speedRef = useRef(6);
  const frameRef = useRef(0);

  const startGame = useCallback(() => {
    playerRef.current = {
      lane: 0,
      y: 0,
      vy: 0,
      isJumping: false,
      isSliding: false,
      slideTimer: 0,
    };
    obstaclesRef.current = [];
    speedRef.current = 6;
    frameRef.current = 0;
    setScore(0);
    setCoins(0);
    setRestartKey(k => k + 1);
    setGameState("playing");
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let running = true;

    const gameLoop = () => {
      if (!running) return;
      
      const player = playerRef.current;
      frameRef.current++;
      
      // Increase speed over time
      if (frameRef.current % 300 === 0) {
        speedRef.current = Math.min(12, speedRef.current + 0.3);
      }
      
      // Spawn obstacles
      if (frameRef.current % Math.max(40, 80 - Math.floor(speedRef.current * 2)) === 0) {
        const types: Array<"block" | "low" | "high" | "coin"> = ["block", "low", "high", "coin", "coin"];
        const type = types[Math.floor(Math.random() * types.length)];
        const lane = Math.floor(Math.random() * 3) - 1;
        
        obstaclesRef.current.push({
          lane,
          z: 500,
          type,
          collected: false,
        });
      }
      
      // Update player
      if (player.isJumping) {
        player.vy += 1.2;
        player.y += player.vy;
        if (player.y >= 0) {
          player.y = 0;
          player.isJumping = false;
          player.vy = 0;
        }
      }
      
      if (player.isSliding) {
        player.slideTimer--;
        if (player.slideTimer <= 0) {
          player.isSliding = false;
        }
      }
      
      // Update obstacles and check collision
      let hit = false;
      obstaclesRef.current = obstaclesRef.current.filter(obs => {
        obs.z -= speedRef.current;
        
        // Check collision when close
        if (obs.z < 80 && obs.z > 0 && obs.lane === player.lane && !obs.collected) {
          if (obs.type === "coin") {
            obs.collected = true;
            setCoins(c => c + 1);
            setScore(s => s + 50);
          } else if (obs.type === "block") {
            // Must avoid (change lane or jump)
            if (!player.isJumping || player.y > -40) {
              hit = true;
            }
          } else if (obs.type === "low") {
            // Must jump
            if (!player.isJumping || player.y > -30) {
              hit = true;
            }
          } else if (obs.type === "high") {
            // Must slide
            if (!player.isSliding) {
              hit = true;
            }
          }
        }
        
        return obs.z > -50;
      });
      
      if (hit) {
        running = false;
        if (score > highScore) setHighScore(score);
        setGameState("gameover");
        return;
      }
      
      // Update score
      setScore(s => s + 1);
      
      // Draw
      // Sky
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Stars
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 30; i++) {
        const x = (i * 73 + frameRef.current * 0.1) % CANVAS_WIDTH;
        const y = (i * 37) % (GROUND_Y - 50);
        ctx.fillRect(x, y, 2, 2);
      }
      
      // Ground with gradient
      const groundGradient = ctx.createLinearGradient(0, GROUND_Y, 0, CANVAS_HEIGHT);
      groundGradient.addColorStop(0, "#3d4a5c");
      groundGradient.addColorStop(1, "#1e2836");
      ctx.fillStyle = groundGradient;
      ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);
      
      // Lane backgrounds (3 lanes: -1, 0, 1)
      const centerX = CANVAS_WIDTH / 2;
      const laneColors = ["#2a3548", "#323d52", "#2a3548"];
      for (let i = -1; i <= 1; i++) {
        const laneX = centerX + i * LANE_WIDTH - LANE_WIDTH / 2;
        ctx.fillStyle = laneColors[i + 1];
        ctx.fillRect(laneX, GROUND_Y, LANE_WIDTH, CANVAS_HEIGHT - GROUND_Y);
      }
      
      // Lane divider rails - glowing cyan lines
      ctx.shadowColor = "#06b6d4";
      ctx.shadowBlur = 8;
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 4;
      ctx.setLineDash([]);
      
      // Left rail
      ctx.beginPath();
      ctx.moveTo(centerX - LANE_WIDTH, GROUND_Y);
      ctx.lineTo(centerX - LANE_WIDTH, CANVAS_HEIGHT);
      ctx.stroke();
      
      // Right rail
      ctx.beginPath();
      ctx.moveTo(centerX + LANE_WIDTH, GROUND_Y);
      ctx.lineTo(centerX + LANE_WIDTH, CANVAS_HEIGHT);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.setLineDash([]);
      
      // Outer edge rails
      ctx.strokeStyle = "#4a90a4";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - LANE_WIDTH * 1.5, GROUND_Y);
      ctx.lineTo(centerX - LANE_WIDTH * 1.5, CANVAS_HEIGHT);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(centerX + LANE_WIDTH * 1.5, GROUND_Y);
      ctx.lineTo(centerX + LANE_WIDTH * 1.5, CANVAS_HEIGHT);
      ctx.stroke();
      
      // Draw obstacles
      obstaclesRef.current.forEach(obs => {
        if (obs.z < 0 || obs.z > 500) return;
        
        const scale = Math.max(0.2, 1 - obs.z / 500);
        const x = centerX + obs.lane * LANE_WIDTH * scale;
        const y = GROUND_Y - 60 * scale;
        const w = 50 * scale;
        const h = 50 * scale;
        
        if (obs.type === "coin" && !obs.collected) {
          ctx.fillStyle = "#fbbf24";
          ctx.shadowColor = "#fbbf24";
          ctx.shadowBlur = 10 * scale;
          ctx.beginPath();
          ctx.arc(x, y + h / 2, w / 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (obs.type === "block") {
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(x - w / 2, y, w, h);
          ctx.strokeStyle = "#b91c1c";
          ctx.lineWidth = 2 * scale;
          ctx.strokeRect(x - w / 2, y, w, h);
        } else if (obs.type === "low") {
          ctx.fillStyle = "#f97316";
          ctx.fillRect(x - w / 2, GROUND_Y - h * 0.4, w, h * 0.4);
          ctx.fillStyle = "#fff";
          ctx.font = `bold ${Math.max(8, 10 * scale)}px sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText("JUMP", x, GROUND_Y - h * 0.15);
        } else if (obs.type === "high") {
          ctx.fillStyle = "#8b5cf6";
          ctx.fillRect(x - w / 2, y - h * 0.3, w, h * 0.5);
          ctx.fillStyle = "#fff";
          ctx.font = `bold ${Math.max(8, 10 * scale)}px sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText("SLIDE", x, y - h * 0.1);
        }
      });
      
      // Draw player
      const px = centerX + player.lane * LANE_WIDTH;
      const playerHeight = player.isSliding ? 25 : 50;
      const py = GROUND_Y - playerHeight + player.y;
      
      ctx.fillStyle = "#3b82f6";
      ctx.shadowColor = "#3b82f6";
      ctx.shadowBlur = 15;
      ctx.fillRect(px - 20, py, 40, playerHeight);
      ctx.shadowBlur = 0;
      
      // Face
      if (!player.isSliding) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(px - 10, py + 10, 6, 6);
        ctx.fillRect(px + 4, py + 10, 6, 6);
        ctx.fillRect(px - 6, py + 22, 12, 4);
      }
      
      // Speed indicator
      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`Speed: ${speedRef.current.toFixed(1)}`, 10, 30);
      
      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      running = false;
      cancelAnimationFrame(animationId);
    };
  }, [gameState, highScore, score, restartKey]);

  // Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      const player = playerRef.current;
      
      if (e.key === "ArrowLeft" || e.key === "a") {
        if (player.lane > -1) player.lane--;
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        if (player.lane < 1) player.lane++;
      }
      if ((e.key === "ArrowUp" || e.key === "w" || e.key === " ") && !player.isJumping) {
        player.isJumping = true;
        player.vy = -18;
      }
      if ((e.key === "ArrowDown" || e.key === "s") && !player.isSliding && !player.isJumping) {
        player.isSliding = true;
        player.slideTimer = 25;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  // Touch controls
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 text-white">
        <div className="text-lg">🎯 <span className="font-bold text-yellow-400">{score}</span></div>
        <div className="text-lg">🪙 <span className="font-bold text-amber-400">{coins}</span></div>
        <div className="text-lg">🏆 <span className="font-bold text-purple-400">{highScore}</span></div>
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="rounded-xl border-2 border-white/20"
          onTouchStart={(e) => {
            touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          }}
          onTouchEnd={(e) => {
            if (!touchStartRef.current || gameState !== "playing") return;
            const player = playerRef.current;
            const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
            const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
            
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
              if (dx > 0 && player.lane < 1) player.lane++;
              if (dx < 0 && player.lane > -1) player.lane--;
            } else if (Math.abs(dy) > 30) {
              if (dy < 0 && !player.isJumping) {
                player.isJumping = true;
                player.vy = -18;
              }
              if (dy > 0 && !player.isSliding && !player.isJumping) {
                player.isSliding = true;
                player.slideTimer = 25;
              }
            }
            touchStartRef.current = null;
          }}
        />
        
        {gameState === "ready" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
            <h2 className="text-3xl font-bold text-white mb-4">🏃 장애물 레이스</h2>
            <p className="text-white/70 mb-4">장애물을 피해 달리세요!</p>
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <span className="text-red-400">🟥 블록 → 피하기/점프</span>
              <span className="text-orange-400">🟧 낮은장애물 → 점프</span>
              <span className="text-purple-400">🟪 높은장애물 → 슬라이드</span>
              <span className="text-yellow-400">🪙 코인 → 수집!</span>
            </div>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
            >
              게임 시작
            </button>
            <p className="text-white/50 text-sm mt-4">← → 이동 | ↑ 점프 | ↓ 슬라이드</p>
          </div>
        )}
        
        {gameState === "gameover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
            <h2 className="text-3xl font-bold text-red-400 mb-4">💥 Game Over!</h2>
            <p className="text-xl text-white mb-2">점수: <span className="text-yellow-400">{score}</span></p>
            <p className="text-lg text-white/70 mb-4">코인: <span className="text-amber-400">{coins}개</span></p>
            {score >= highScore && score > 0 && (
              <p className="text-yellow-400 mb-4">🎉 새로운 최고 기록!</p>
            )}
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
            >
              다시 도전
            </button>
          </div>
        )}
      </div>
      
      {/* Mobile controls */}
      <div className="grid grid-cols-3 gap-2 md:hidden mt-2">
        <button
          className="h-14 w-full bg-gradient-to-b from-blue-500/30 to-blue-600/20 rounded-xl border border-blue-400/40 flex items-center justify-center text-2xl text-blue-200 active:scale-95"
          onTouchStart={() => { if (gameState === "playing") { const p = playerRef.current; if (p.lane > -1) p.lane--; } }}
        >
          ◀
        </button>
        <div className="flex flex-col gap-1">
          <button
            className="flex-1 bg-gradient-to-b from-green-500/30 to-green-600/20 rounded-xl border border-green-400/40 flex items-center justify-center text-lg text-green-200 active:scale-95"
            onTouchStart={() => { if (gameState === "playing") { const p = playerRef.current; if (!p.isJumping) { p.isJumping = true; p.vy = -18; } } }}
          >
            점프↑
          </button>
          <button
            className="flex-1 bg-gradient-to-b from-purple-500/30 to-purple-600/20 rounded-xl border border-purple-400/40 flex items-center justify-center text-lg text-purple-200 active:scale-95"
            onTouchStart={() => { if (gameState === "playing") { const p = playerRef.current; if (!p.isSliding && !p.isJumping) { p.isSliding = true; p.slideTimer = 25; } } }}
          >
            슬라이드↓
          </button>
        </div>
        <button
          className="h-14 w-full bg-gradient-to-b from-blue-500/30 to-blue-600/20 rounded-xl border border-blue-400/40 flex items-center justify-center text-2xl text-blue-200 active:scale-95"
          onTouchStart={() => { if (gameState === "playing") { const p = playerRef.current; if (p.lane < 1) p.lane++; } }}
        >
          ▶
        </button>
      </div>
      <p className="text-white/50 text-xs md:hidden mt-2">← → 이동 | ↑ 점프 | ↓ 슬라이드</p>
    </div>
  );
}
