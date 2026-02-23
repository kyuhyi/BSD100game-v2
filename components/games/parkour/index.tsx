"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "normal" | "moving" | "fragile" | "bounce";
  moveRange?: number;
  moveSpeed?: number;
  originalX?: number;
}

interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  onGround: boolean;
  jumpCount: number;
}

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PLAYER_WIDTH = 24;
const PLAYER_HEIGHT = 32;
const GRAVITY = 0.5;
const JUMP_FORCE = -11;
const MOVE_SPEED = 5;
const AIR_CONTROL = 0.3;
const MAX_JUMPS = 2;

const LEVELS: { platforms: Omit<Platform, "originalX">[]; goal: { x: number; y: number } }[] = [
  {
    platforms: [
      { x: 0, y: 350, width: 180, height: 20, type: "normal" },
      { x: 220, y: 330, width: 120, height: 20, type: "normal" },
      { x: 380, y: 300, width: 120, height: 20, type: "normal" },
      { x: 500, y: 260, width: 100, height: 20, type: "normal" },
    ],
    goal: { x: 550, y: 220 },
  },
  {
    platforms: [
      { x: 0, y: 350, width: 150, height: 20, type: "normal" },
      { x: 180, y: 320, width: 100, height: 20, type: "moving", moveRange: 60, moveSpeed: 1.5 },
      { x: 350, y: 280, width: 120, height: 20, type: "normal" },
      { x: 480, y: 240, width: 110, height: 20, type: "normal" },
    ],
    goal: { x: 540, y: 200 },
  },
  {
    platforms: [
      { x: 0, y: 350, width: 130, height: 20, type: "normal" },
      { x: 160, y: 350, width: 80, height: 20, type: "bounce" },
      { x: 300, y: 250, width: 120, height: 20, type: "normal" },
      { x: 450, y: 200, width: 100, height: 20, type: "normal" },
    ],
    goal: { x: 500, y: 160 },
  },
  {
    platforms: [
      { x: 0, y: 350, width: 120, height: 20, type: "normal" },
      { x: 160, y: 320, width: 100, height: 20, type: "fragile" },
      { x: 300, y: 280, width: 110, height: 20, type: "normal" },
      { x: 440, y: 240, width: 100, height: 20, type: "fragile" },
      { x: 520, y: 200, width: 80, height: 20, type: "normal" },
    ],
    goal: { x: 550, y: 160 },
  },
  {
    platforms: [
      { x: 0, y: 350, width: 100, height: 20, type: "normal" },
      { x: 140, y: 320, width: 80, height: 20, type: "moving", moveRange: 40, moveSpeed: 1.5 },
      { x: 280, y: 280, width: 70, height: 20, type: "bounce" },
      { x: 380, y: 200, width: 90, height: 20, type: "fragile" },
      { x: 500, y: 160, width: 90, height: 20, type: "normal" },
    ],
    goal: { x: 540, y: 120 },
  },
];

export default function ParkourGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"ready" | "playing" | "win">("ready");
  const [level, setLevel] = useState(1);
  const [deaths, setDeaths] = useState(0);
  const [timer, setTimer] = useState(0);
  const [restartKey, setRestartKey] = useState(0); // 강제 리렌더링용
  
  const playerRef = useRef<Player>({ x: 60, y: 280, vx: 0, vy: 0, onGround: false, jumpCount: 0 });
  const platformsRef = useRef<Platform[]>([]);
  const keysRef = useRef<Set<string>>(new Set());
  const startTimeRef = useRef<number>(0);
  const fragilePlatformsRef = useRef<Map<number, number>>(new Map());

  const createPlatforms = useCallback((levelNum: number) => {
    const levelData = LEVELS[levelNum - 1];
    if (!levelData) return [];
    return levelData.platforms.map(p => ({
      ...p,
      originalX: p.x,
    }));
  }, []);

  const startGame = useCallback((levelNum: number, resetTimer: boolean = false) => {
    if (levelNum > LEVELS.length) {
      setGameState("win");
      return;
    }
    
    // 플랫폼 새로 생성
    platformsRef.current = createPlatforms(levelNum);
    
    // 플레이어 리셋
    playerRef.current = {
      x: 60,
      y: 280,
      vx: 0,
      vy: 0,
      onGround: false,
      jumpCount: 0,
    };
    
    // 부서지는 플랫폼 리셋
    fragilePlatformsRef.current.clear();
    
    // 키 상태 리셋
    keysRef.current.clear();
    
    setLevel(levelNum);
    
    if (resetTimer) {
      startTimeRef.current = Date.now();
      setDeaths(0);
    }
    
    // 강제 리렌더링으로 useEffect 재실행
    setRestartKey(k => k + 1);
    setGameState("playing");
  }, [createPlatforms]);

  // Game loop - restartKey 의존성 추가
  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const levelData = LEVELS[level - 1];
    if (!levelData) return;

    let animationId: number;
    let dead = false;

    const gameLoop = () => {
      if (dead) return;
      
      const player = playerRef.current;
      const platforms = platformsRef.current;
      const now = Date.now();
      
      setTimer(Math.floor((now - startTimeRef.current) / 1000));
      
      // Input
      const inputX = (keysRef.current.has("arrowleft") || keysRef.current.has("a") ? -1 : 0) +
                     (keysRef.current.has("arrowright") || keysRef.current.has("d") ? 1 : 0);
      
      if (player.onGround) {
        player.vx = inputX * MOVE_SPEED;
      } else {
        player.vx += inputX * AIR_CONTROL;
        player.vx = Math.max(-MOVE_SPEED, Math.min(MOVE_SPEED, player.vx));
        player.vx *= 0.98;
      }
      
      player.vy += GRAVITY;
      if (player.vy > 15) player.vy = 15;
      
      player.x += player.vx;
      player.y += player.vy;
      
      // Moving platforms
      platforms.forEach(p => {
        if (p.type === "moving" && p.moveRange && p.moveSpeed && p.originalX !== undefined) {
          p.x = p.originalX + Math.sin(now / 1000 * p.moveSpeed) * p.moveRange;
        }
      });
      
      // Fragile platforms
      fragilePlatformsRef.current.forEach((breakTime, idx) => {
        if (now >= breakTime && platforms[idx]) {
          platforms[idx].y = 9999;
        }
      });
      
      // Collision
      player.onGround = false;
      platforms.forEach((p, idx) => {
        if (p.y > CANVAS_HEIGHT) return;
        
        if (
          player.x + PLAYER_WIDTH / 2 > p.x &&
          player.x - PLAYER_WIDTH / 2 < p.x + p.width &&
          player.y + PLAYER_HEIGHT >= p.y &&
          player.y + PLAYER_HEIGHT <= p.y + p.height + 10 &&
          player.vy >= 0
        ) {
          player.y = p.y - PLAYER_HEIGHT;
          player.vy = 0;
          player.vx = 0;
          player.onGround = true;
          player.jumpCount = 0;
          
          if (p.type === "bounce") {
            player.vy = JUMP_FORCE * 1.6;
            player.onGround = false;
          }
          
          if (p.type === "fragile" && !fragilePlatformsRef.current.has(idx)) {
            fragilePlatformsRef.current.set(idx, now + 800);
          }
        }
      });
      
      player.x = Math.max(PLAYER_WIDTH / 2, Math.min(CANVAS_WIDTH - PLAYER_WIDTH / 2, player.x));
      
      // Death
      if (player.y > CANVAS_HEIGHT + 50) {
        dead = true;
        setDeaths(d => d + 1);
        setTimeout(() => {
          startGame(level, false);
        }, 500);
        return;
      }
      
      // Goal
      const goal = levelData.goal;
      if (Math.abs(player.x - goal.x) < 35 && Math.abs(player.y - goal.y) < 45) {
        dead = true;
        if (level >= LEVELS.length) {
          setGameState("win");
        } else {
          setTimeout(() => {
            startGame(level + 1, false);
          }, 300);
        }
        return;
      }
      
      // Draw
      const bgGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      bgGradient.addColorStop(0, "#1e1b4b");
      bgGradient.addColorStop(1, "#312e81");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = "rgba(239, 68, 68, 0.1)";
      ctx.fillRect(0, CANVAS_HEIGHT - 30, CANVAS_WIDTH, 30);
      
      // Platforms
      platforms.forEach((p, idx) => {
        if (p.y > CANVAS_HEIGHT) return;
        
        let color = "#4ade80";
        let borderColor = "#22c55e";
        
        if (p.type === "moving") {
          color = "#fbbf24";
          borderColor = "#f59e0b";
        } else if (p.type === "bounce") {
          color = "#f472b6";
          borderColor = "#ec4899";
        } else if (p.type === "fragile") {
          const isBreaking = fragilePlatformsRef.current.has(idx);
          color = isBreaking ? "#ef4444" : "#94a3b8";
          borderColor = isBreaking ? "#dc2626" : "#64748b";
          if (isBreaking) ctx.globalAlpha = 0.5 + Math.sin(now / 30) * 0.5;
        }
        
        ctx.fillStyle = color;
        ctx.fillRect(p.x, p.y, p.width, p.height);
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x, p.y, p.width, p.height);
        ctx.globalAlpha = 1;
        
        if (p.type === "bounce") {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.moveTo(p.x + p.width / 2 - 12, p.y + 5);
          ctx.lineTo(p.x + p.width / 2, p.y - 8);
          ctx.lineTo(p.x + p.width / 2 + 12, p.y + 5);
          ctx.fill();
        }
      });
      
      // Goal
      ctx.fillStyle = "#fbbf24";
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(goal.x, goal.y, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("⭐", goal.x, goal.y + 7);
      ctx.shadowBlur = 0;
      
      // Player
      ctx.fillStyle = "#3b82f6";
      ctx.shadowColor = "#3b82f6";
      ctx.shadowBlur = 10;
      ctx.fillRect(player.x - PLAYER_WIDTH / 2, player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(player.x - 6, player.y + 8, 4, 4);
      ctx.fillRect(player.x + 2, player.y + 8, 4, 4);
      ctx.fillRect(player.x - 4, player.y + 18, 8, 3);
      
      // UI
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`Level ${level}/${LEVELS.length}`, 10, 28);
      
      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      dead = true;
      cancelAnimationFrame(animationId);
    };
  }, [gameState, level, restartKey, startGame]);

  // Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", " "].includes(key)) {
        e.preventDefault();
        keysRef.current.add(key);
        
        if ((key === "arrowup" || key === "w" || key === " ") && gameState === "playing") {
          const player = playerRef.current;
          if (player.jumpCount < MAX_JUMPS) {
            player.vy = JUMP_FORCE;
            player.vx *= 0.5;
            player.jumpCount++;
            player.onGround = false;
          }
        }
      }
      
      if (key === "r" && gameState === "playing") {
        setDeaths(d => d + 1);
        startGame(level, false);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState, level, startGame]);

  const handleJump = () => {
    if (gameState !== "playing") return;
    const player = playerRef.current;
    if (player.jumpCount < MAX_JUMPS) {
      player.vy = JUMP_FORCE;
      player.vx *= 0.5;
      player.jumpCount++;
      player.onGround = false;
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 text-white">
        <div className="text-lg">⏱️ <span className="font-bold text-cyan-400">{timer}s</span></div>
        <div className="text-lg">💀 <span className="font-bold text-red-400">{deaths}</span></div>
        <div className="text-lg">🏔️ <span className="font-bold text-yellow-400">Lv.{level}</span></div>
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="rounded-xl border-2 border-white/20"
        />
        
        {gameState === "ready" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
            <h2 className="text-3xl font-bold text-white mb-4">🏃 Parkour</h2>
            <p className="text-white/70 mb-2">플랫폼을 점프해서 ⭐에 도달하세요!</p>
            <p className="text-white/70 mb-1 text-sm">🟢일반 🟡이동 ⬜부서짐 🩷점프대</p>
            <p className="text-cyan-400 mb-6">✨ 더블 점프 가능!</p>
            <button
              onClick={() => startGame(1, true)}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
            >
              게임 시작
            </button>
            <p className="text-white/50 text-sm mt-4">← → 이동 | ↑/Space 점프 | R 리스타트</p>
          </div>
        )}
        
        {gameState === "win" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">🏆 ALL CLEAR!</h2>
            <p className="text-xl text-white mb-2">클리어 시간: <span className="text-cyan-400">{timer}초</span></p>
            <p className="text-lg text-white mb-6">사망 횟수: <span className="text-red-400">{deaths}회</span></p>
            <button
              onClick={() => startGame(1, true)}
              className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
            >
              다시 도전
            </button>
          </div>
        )}
      </div>
      
      <div className="flex gap-4 md:hidden mt-4">
        <button
          className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center text-2xl active:bg-white/20"
          onTouchStart={() => keysRef.current.add("a")}
          onTouchEnd={() => keysRef.current.delete("a")}
        >⬅️</button>
        <button
          className="w-20 h-16 bg-green-500/30 rounded-xl flex items-center justify-center text-2xl active:bg-green-500/50"
          onTouchStart={handleJump}
        >⬆️</button>
        <button
          className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center text-2xl active:bg-white/20"
          onTouchStart={() => keysRef.current.add("d")}
          onTouchEnd={() => keysRef.current.delete("d")}
        >➡️</button>
      </div>
    </div>
  );
}
