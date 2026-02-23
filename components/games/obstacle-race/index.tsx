"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Obstacle {
  x: number;
  z: number;
  width: number;
  height: number;
  type: "block" | "jump" | "slide" | "coin";
  collected?: boolean;
}

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 60;
const GROUND_Y = 320;
const LANE_WIDTH = 150;
const LANES = [-1, 0, 1]; // left, center, right

export default function ObstacleRaceGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"ready" | "playing" | "gameover">("ready");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [coins, setCoins] = useState(0);
  
  const playerRef = useRef({
    lane: 0, // -1, 0, 1
    y: GROUND_Y - PLAYER_HEIGHT,
    vy: 0,
    isJumping: false,
    isSliding: false,
    slideTimer: 0,
  });
  const obstaclesRef = useRef<Obstacle[]>([]);
  const animationRef = useRef<number>(0);
  const speedRef = useRef(8);
  const lastObstacleRef = useRef(0);

  const spawnObstacle = useCallback(() => {
    const lane = LANES[Math.floor(Math.random() * LANES.length)];
    const types: Array<"block" | "jump" | "slide" | "coin"> = ["block", "block", "jump", "slide", "coin", "coin"];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const obstacle: Obstacle = {
      x: lane * LANE_WIDTH + CANVAS_WIDTH / 2,
      z: 1000,
      width: type === "coin" ? 30 : 60,
      height: type === "slide" ? 100 : type === "jump" ? 30 : 70,
      type,
      collected: false,
    };
    
    obstaclesRef.current.push(obstacle);
  }, []);

  const startGame = useCallback(() => {
    playerRef.current = {
      lane: 0,
      y: GROUND_Y - PLAYER_HEIGHT,
      vy: 0,
      isJumping: false,
      isSliding: false,
      slideTimer: 0,
    };
    obstaclesRef.current = [];
    speedRef.current = 8;
    lastObstacleRef.current = 0;
    setScore(0);
    setDistance(0);
    setCoins(0);
    setGameState("playing");
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    let frameCount = 0;

    const gameLoop = () => {
      if (!running) return;
      
      frameCount++;
      const player = playerRef.current;
      
      // Update distance and speed
      setDistance(d => d + speedRef.current);
      if (frameCount % 500 === 0) {
        speedRef.current = Math.min(15, speedRef.current + 0.5);
      }
      
      // Spawn obstacles
      if (frameCount - lastObstacleRef.current > 60 + Math.random() * 40) {
        spawnObstacle();
        lastObstacleRef.current = frameCount;
      }
      
      // Update player
      if (player.isJumping) {
        player.vy += 0.8; // gravity
        player.y += player.vy;
        if (player.y >= GROUND_Y - PLAYER_HEIGHT) {
          player.y = GROUND_Y - PLAYER_HEIGHT;
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
      
      // Update obstacles
      const playerX = player.lane * LANE_WIDTH + CANVAS_WIDTH / 2;
      const playerHeight = player.isSliding ? PLAYER_HEIGHT / 2 : PLAYER_HEIGHT;
      const playerY = player.isSliding ? GROUND_Y - playerHeight : player.y;
      
      obstaclesRef.current = obstaclesRef.current.filter(obs => {
        obs.z -= speedRef.current;
        
        // Check collision when in range
        if (obs.z < 100 && obs.z > -50) {
          const obsX = obs.x;
          const inSameLane = Math.abs(playerX - obsX) < LANE_WIDTH / 2;
          
          if (inSameLane && !obs.collected) {
            if (obs.type === "coin") {
              obs.collected = true;
              setCoins(c => c + 1);
              setScore(s => s + 100);
            } else if (obs.type === "block") {
              // Must jump or dodge
              if (!player.isJumping && player.y > GROUND_Y - PLAYER_HEIGHT - obs.height) {
                // Hit!
                running = false;
                if (score > highScore) setHighScore(score);
                setGameState("gameover");
                return false;
              }
            } else if (obs.type === "jump") {
              // Low obstacle - must jump
              if (!player.isJumping) {
                running = false;
                if (score > highScore) setHighScore(score);
                setGameState("gameover");
                return false;
              }
            } else if (obs.type === "slide") {
              // High obstacle - must slide
              if (!player.isSliding) {
                running = false;
                if (score > highScore) setHighScore(score);
                setGameState("gameover");
                return false;
              }
            }
          }
        }
        
        return obs.z > -100;
      });
      
      // Update score
      setScore(s => s + 1);
      
      // Draw
      // Sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      skyGradient.addColorStop(0, "#0f172a");
      skyGradient.addColorStop(0.6, "#1e3a5f");
      skyGradient.addColorStop(1, "#475569");
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Ground with perspective
      ctx.fillStyle = "#334155";
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      ctx.lineTo(CANVAS_WIDTH, GROUND_Y);
      ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.lineTo(0, CANVAS_HEIGHT);
      ctx.fill();
      
      // Lane lines
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 2;
      ctx.setLineDash([20, 20]);
      for (let i = -1; i <= 1; i++) {
        const x = i * LANE_WIDTH + CANVAS_WIDTH / 2;
        ctx.beginPath();
        ctx.moveTo(x - LANE_WIDTH / 2, GROUND_Y);
        ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      
      // Draw obstacles (sorted by z for depth)
      const sortedObs = [...obstaclesRef.current].sort((a, b) => b.z - a.z);
      sortedObs.forEach(obs => {
        const scale = Math.max(0.1, 100 / (obs.z + 100));
        const screenX = obs.x + (obs.x - CANVAS_WIDTH / 2) * (1 - scale) * 0.5;
        const screenY = GROUND_Y - obs.height * scale;
        const w = obs.width * scale;
        const h = obs.height * scale;
        
        if (obs.type === "coin" && !obs.collected) {
          ctx.fillStyle = "#fbbf24";
          ctx.shadowColor = "#fbbf24";
          ctx.shadowBlur = 10 * scale;
          ctx.beginPath();
          ctx.arc(screenX, screenY + h / 2, w / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#fef3c7";
          ctx.beginPath();
          ctx.arc(screenX - w * 0.15, screenY + h / 2 - w * 0.15, w / 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (obs.type === "block") {
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(screenX - w / 2, screenY, w, h);
          ctx.strokeStyle = "#dc2626";
          ctx.lineWidth = 2 * scale;
          ctx.strokeRect(screenX - w / 2, screenY, w, h);
        } else if (obs.type === "jump") {
          ctx.fillStyle = "#f97316";
          ctx.fillRect(screenX - w / 2, GROUND_Y - h, w, h);
          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${12 * scale}px sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText("JUMP", screenX, GROUND_Y - h / 2 + 4 * scale);
        } else if (obs.type === "slide") {
          ctx.fillStyle = "#8b5cf6";
          ctx.fillRect(screenX - w / 2, GROUND_Y - obs.height * scale, w, h * 0.4);
          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${10 * scale}px sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText("SLIDE", screenX, GROUND_Y - obs.height * scale + h * 0.25);
        }
      });
      
      // Draw player
      const px = playerX;
      const py = playerY;
      const pw = PLAYER_WIDTH;
      const ph = playerHeight;
      
      // Body
      ctx.fillStyle = "#3b82f6";
      ctx.shadowColor = "#3b82f6";
      ctx.shadowBlur = 15;
      ctx.fillRect(px - pw / 2, py, pw, ph);
      ctx.shadowBlur = 0;
      
      // Face
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(px - 8, py + 12, 6, 6);
      ctx.fillRect(px + 2, py + 12, 6, 6);
      ctx.fillRect(px - 6, py + 25, 12, 4);
      
      // Speed lines when fast
      if (speedRef.current > 10) {
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
          const ly = Math.random() * CANVAS_HEIGHT;
          ctx.beginPath();
          ctx.moveTo(CANVAS_WIDTH, ly);
          ctx.lineTo(CANVAS_WIDTH - 50 - Math.random() * 100, ly);
          ctx.stroke();
        }
      }
      
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      running = false;
      cancelAnimationFrame(animationRef.current);
    };
  }, [gameState, highScore, score, spawnObstacle]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      const player = playerRef.current;
      
      if ((e.key === "ArrowLeft" || e.key === "a") && player.lane > -1) {
        player.lane--;
      }
      if ((e.key === "ArrowRight" || e.key === "d") && player.lane < 1) {
        player.lane++;
      }
      if ((e.key === "ArrowUp" || e.key === "w" || e.key === " ") && !player.isJumping) {
        player.isJumping = true;
        player.vy = -15;
      }
      if ((e.key === "ArrowDown" || e.key === "s") && !player.isSliding && !player.isJumping) {
        player.isSliding = true;
        player.slideTimer = 30;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  // Touch controls
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || gameState !== "playing") return;
    const player = playerRef.current;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      if (dx > 30 && player.lane < 1) player.lane++;
      if (dx < -30 && player.lane > -1) player.lane--;
    } else {
      // Vertical swipe
      if (dy < -30 && !player.isJumping) {
        player.isJumping = true;
        player.vy = -15;
      }
      if (dy > 30 && !player.isSliding && !player.isJumping) {
        player.isSliding = true;
        player.slideTimer = 30;
      }
    }
    touchStartRef.current = null;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 text-white">
        <div className="text-lg">🏃 <span className="font-bold text-cyan-400">{Math.floor(distance / 100)}m</span></div>
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
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
        
        {gameState === "ready" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
            <h2 className="text-3xl font-bold text-white mb-4">🏃 장애물 레이스</h2>
            <p className="text-white/70 mb-2">장애물을 피해 달려가세요!</p>
            <div className="flex gap-4 mb-4 text-sm">
              <span className="text-red-400">🟥 점프</span>
              <span className="text-orange-400">🟧 점프!</span>
              <span className="text-purple-400">🟪 슬라이드</span>
              <span className="text-yellow-400">🪙 코인</span>
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
            <p className="text-xl text-white mb-2">거리: <span className="text-cyan-400">{Math.floor(distance / 100)}m</span></p>
            <p className="text-lg text-white mb-2">점수: <span className="text-yellow-400">{score}</span></p>
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
      
      {/* Mobile control hints */}
      <p className="text-white/50 text-sm md:hidden">스와이프: ← → 이동 | ↑ 점프 | ↓ 슬라이드</p>
    </div>
  );
}
