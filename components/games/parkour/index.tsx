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
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const MOVE_SPEED = 5;
const MAX_JUMPS = 2; // Double jump

// Level definitions
const LEVELS: { platforms: Omit<Platform, "originalX">[]; goal: { x: number; y: number } }[] = [
  // Level 1 - Easy intro
  {
    platforms: [
      { x: 0, y: 350, width: 150, height: 20, type: "normal" },
      { x: 200, y: 320, width: 80, height: 20, type: "normal" },
      { x: 330, y: 280, width: 80, height: 20, type: "normal" },
      { x: 450, y: 240, width: 100, height: 20, type: "normal" },
    ],
    goal: { x: 520, y: 200 },
  },
  // Level 2 - Moving platforms
  {
    platforms: [
      { x: 0, y: 350, width: 100, height: 20, type: "normal" },
      { x: 150, y: 300, width: 80, height: 20, type: "moving", moveRange: 100, moveSpeed: 2 },
      { x: 350, y: 250, width: 80, height: 20, type: "normal" },
      { x: 450, y: 200, width: 80, height: 20, type: "moving", moveRange: 80, moveSpeed: 3 },
    ],
    goal: { x: 520, y: 160 },
  },
  // Level 3 - Bounce pads
  {
    platforms: [
      { x: 0, y: 350, width: 100, height: 20, type: "normal" },
      { x: 130, y: 350, width: 60, height: 20, type: "bounce" },
      { x: 280, y: 280, width: 80, height: 20, type: "normal" },
      { x: 400, y: 350, width: 60, height: 20, type: "bounce" },
      { x: 500, y: 180, width: 80, height: 20, type: "normal" },
    ],
    goal: { x: 540, y: 140 },
  },
  // Level 4 - Mixed challenge
  {
    platforms: [
      { x: 0, y: 350, width: 80, height: 20, type: "normal" },
      { x: 120, y: 310, width: 60, height: 20, type: "fragile" },
      { x: 220, y: 270, width: 70, height: 20, type: "moving", moveRange: 60, moveSpeed: 2.5 },
      { x: 350, y: 230, width: 50, height: 20, type: "bounce" },
      { x: 420, y: 150, width: 60, height: 20, type: "fragile" },
      { x: 520, y: 120, width: 70, height: 20, type: "normal" },
    ],
    goal: { x: 550, y: 80 },
  },
  // Level 5 - Ultimate challenge
  {
    platforms: [
      { x: 0, y: 350, width: 60, height: 20, type: "normal" },
      { x: 100, y: 320, width: 50, height: 20, type: "moving", moveRange: 50, moveSpeed: 3 },
      { x: 200, y: 280, width: 40, height: 20, type: "fragile" },
      { x: 280, y: 240, width: 40, height: 20, type: "bounce" },
      { x: 350, y: 180, width: 50, height: 20, type: "moving", moveRange: 70, moveSpeed: 4 },
      { x: 450, y: 130, width: 40, height: 20, type: "fragile" },
      { x: 530, y: 80, width: 60, height: 20, type: "normal" },
    ],
    goal: { x: 550, y: 40 },
  },
];

export default function ParkourGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"ready" | "playing" | "win" | "gameover">("ready");
  const [level, setLevel] = useState(1);
  const [deaths, setDeaths] = useState(0);
  const [timer, setTimer] = useState(0);
  
  const playerRef = useRef<Player>({ x: 50, y: 300, vx: 0, vy: 0, onGround: false, jumpCount: 0 });
  const platformsRef = useRef<Platform[]>([]);
  const keysRef = useRef<Set<string>>(new Set());
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const fragilePlatformsRef = useRef<Map<number, number>>(new Map()); // index -> breakTime

  const initLevel = useCallback((levelNum: number) => {
    const levelData = LEVELS[levelNum - 1];
    if (!levelData) {
      setGameState("win");
      return;
    }
    
    // Initialize platforms
    platformsRef.current = levelData.platforms.map(p => ({
      ...p,
      originalX: p.x,
    }));
    
    // Reset player
    playerRef.current = {
      x: 50,
      y: 300,
      vx: 0,
      vy: 0,
      onGround: false,
      jumpCount: 0,
    };
    
    fragilePlatformsRef.current.clear();
    setLevel(levelNum);
    setGameState("playing");
    
    if (levelNum === 1) {
      startTimeRef.current = Date.now();
      setDeaths(0);
    }
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const levelData = LEVELS[level - 1];
    if (!levelData) return;

    const gameLoop = () => {
      const player = playerRef.current;
      const platforms = platformsRef.current;
      const now = Date.now();
      
      // Update timer
      setTimer(Math.floor((now - startTimeRef.current) / 1000));
      
      // Handle input
      player.vx = 0;
      if (keysRef.current.has("arrowleft") || keysRef.current.has("a")) player.vx = -MOVE_SPEED;
      if (keysRef.current.has("arrowright") || keysRef.current.has("d")) player.vx = MOVE_SPEED;
      
      // Apply gravity
      player.vy += GRAVITY;
      
      // Update position
      player.x += player.vx;
      player.y += player.vy;
      
      // Update moving platforms
      platforms.forEach(p => {
        if (p.type === "moving" && p.moveRange && p.moveSpeed && p.originalX !== undefined) {
          p.x = p.originalX + Math.sin(now / 500 * p.moveSpeed) * p.moveRange;
        }
      });
      
      // Check fragile platforms
      fragilePlatformsRef.current.forEach((breakTime, idx) => {
        if (now >= breakTime && platforms[idx]) {
          platforms[idx].y = 9999; // Move off screen
        }
      });
      
      // Platform collision
      player.onGround = false;
      platforms.forEach((p, idx) => {
        if (
          player.x + PLAYER_WIDTH / 2 > p.x &&
          player.x - PLAYER_WIDTH / 2 < p.x + p.width &&
          player.y + PLAYER_HEIGHT > p.y &&
          player.y + PLAYER_HEIGHT < p.y + p.height + 15 &&
          player.vy > 0
        ) {
          player.y = p.y - PLAYER_HEIGHT;
          player.vy = 0;
          player.onGround = true;
          player.jumpCount = 0;
          
          // Handle special platforms
          if (p.type === "bounce") {
            player.vy = JUMP_FORCE * 1.5;
            player.onGround = false;
          }
          
          if (p.type === "fragile" && !fragilePlatformsRef.current.has(idx)) {
            fragilePlatformsRef.current.set(idx, now + 500);
          }
        }
      });
      
      // Boundary check
      player.x = Math.max(PLAYER_WIDTH / 2, Math.min(CANVAS_WIDTH - PLAYER_WIDTH / 2, player.x));
      
      // Death check (fell off screen)
      if (player.y > CANVAS_HEIGHT + 50) {
        setDeaths(d => d + 1);
        initLevel(level);
        return;
      }
      
      // Goal check
      const goal = levelData.goal;
      if (
        Math.abs(player.x - goal.x) < 30 &&
        Math.abs(player.y - goal.y) < 40
      ) {
        if (level >= LEVELS.length) {
          setGameState("win");
        } else {
          initLevel(level + 1);
        }
        return;
      }
      
      // Draw
      // Background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      bgGradient.addColorStop(0, "#1e1b4b");
      bgGradient.addColorStop(1, "#312e81");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Draw platforms
      platforms.forEach((p, idx) => {
        if (p.y > CANVAS_HEIGHT) return;
        
        let color = "#4ade80"; // Normal - green
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
          if (isBreaking) {
            ctx.globalAlpha = 0.5 + Math.sin(now / 30) * 0.5;
          }
        }
        
        ctx.fillStyle = color;
        ctx.fillRect(p.x, p.y, p.width, p.height);
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x, p.y, p.width, p.height);
        ctx.globalAlpha = 1;
        
        // Bounce pad indicator
        if (p.type === "bounce") {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.moveTo(p.x + p.width / 2 - 10, p.y + 5);
          ctx.lineTo(p.x + p.width / 2, p.y - 5);
          ctx.lineTo(p.x + p.width / 2 + 10, p.y + 5);
          ctx.fill();
        }
      });
      
      // Draw goal
      ctx.fillStyle = "#fbbf24";
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(goal.x, goal.y, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("⭐", goal.x, goal.y + 6);
      ctx.shadowBlur = 0;
      
      // Draw player
      ctx.fillStyle = "#3b82f6";
      ctx.shadowColor = "#3b82f6";
      ctx.shadowBlur = 10;
      ctx.fillRect(player.x - PLAYER_WIDTH / 2, player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
      ctx.shadowBlur = 0;
      
      // Player face
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(player.x - 6, player.y + 8, 4, 4);
      ctx.fillRect(player.x + 2, player.y + 8, 4, 4);
      ctx.fillRect(player.x - 4, player.y + 18, 8, 3);
      
      // Level info
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`Level ${level}/${LEVELS.length}`, 10, 25);
      
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [gameState, level, initLevel]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", " "].includes(key)) {
        e.preventDefault();
        keysRef.current.add(key);
        
        // Jump
        if ((key === "arrowup" || key === "w" || key === " ") && gameState === "playing") {
          const player = playerRef.current;
          if (player.jumpCount < MAX_JUMPS) {
            player.vy = JUMP_FORCE;
            player.jumpCount++;
            player.onGround = false;
          }
        }
      }
      
      if (key === "r" && gameState === "playing") {
        setDeaths(d => d + 1);
        initLevel(level);
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
  }, [gameState, level, initLevel]);

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
            <p className="text-white/70 mb-2">플랫폼을 점프해서 건너세요!</p>
            <p className="text-white/70 mb-1">🟢 일반 | 🟡 이동 | ⬜ 부서짐 | 🩷 점프대</p>
            <p className="text-white/70 mb-6">더블 점프 가능!</p>
            <button
              onClick={() => initLevel(1)}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
            >
              게임 시작
            </button>
            <p className="text-white/50 text-sm mt-4">방향키/WASD 이동 | 스페이스 점프 | R 리스타트</p>
          </div>
        )}
        
        {gameState === "win" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">🏆 ALL CLEAR!</h2>
            <p className="text-xl text-white mb-2">클리어 시간: <span className="text-cyan-400">{timer}초</span></p>
            <p className="text-lg text-white mb-6">사망 횟수: <span className="text-red-400">{deaths}회</span></p>
            <button
              onClick={() => {
                setTimer(0);
                initLevel(1);
              }}
              className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
            >
              다시 도전
            </button>
          </div>
        )}
      </div>
      
      {/* Mobile controls */}
      <div className="flex gap-4 md:hidden mt-4">
        <button
          className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center text-2xl active:bg-white/20"
          onTouchStart={() => keysRef.current.add("a")}
          onTouchEnd={() => keysRef.current.delete("a")}
        >
          ⬅️
        </button>
        <button
          className="w-20 h-16 bg-green-500/30 rounded-xl flex items-center justify-center text-2xl active:bg-green-500/50"
          onTouchStart={() => {
            const player = playerRef.current;
            if (player.jumpCount < MAX_JUMPS) {
              player.vy = JUMP_FORCE;
              player.jumpCount++;
              player.onGround = false;
            }
          }}
        >
          ⬆️
        </button>
        <button
          className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center text-2xl active:bg-white/20"
          onTouchStart={() => keysRef.current.add("d")}
          onTouchEnd={() => keysRef.current.delete("d")}
        >
          ➡️
        </button>
      </div>
    </div>
  );
}
