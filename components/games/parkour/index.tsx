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
const MAX_JUMPS = 2; // Double jump

// Level definitions - 난이도 완화!
const LEVELS: { platforms: Omit<Platform, "originalX">[]; goal: { x: number; y: number } }[] = [
  // Level 1 - 쉬운 입문
  {
    platforms: [
      { x: 0, y: 350, width: 180, height: 20, type: "normal" },
      { x: 220, y: 330, width: 120, height: 20, type: "normal" },
      { x: 380, y: 300, width: 120, height: 20, type: "normal" },
      { x: 500, y: 260, width: 100, height: 20, type: "normal" },
    ],
    goal: { x: 550, y: 220 },
  },
  // Level 2 - 움직이는 플랫폼 소개
  {
    platforms: [
      { x: 0, y: 350, width: 150, height: 20, type: "normal" },
      { x: 180, y: 320, width: 100, height: 20, type: "moving", moveRange: 60, moveSpeed: 1.5 },
      { x: 350, y: 280, width: 120, height: 20, type: "normal" },
      { x: 480, y: 240, width: 110, height: 20, type: "normal" },
    ],
    goal: { x: 540, y: 200 },
  },
  // Level 3 - 점프대 소개
  {
    platforms: [
      { x: 0, y: 350, width: 130, height: 20, type: "normal" },
      { x: 160, y: 350, width: 80, height: 20, type: "bounce" },
      { x: 300, y: 250, width: 120, height: 20, type: "normal" },
      { x: 450, y: 200, width: 100, height: 20, type: "normal" },
    ],
    goal: { x: 500, y: 160 },
  },
  // Level 4 - 부서지는 플랫폼 소개
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
  // Level 5 - 종합
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
  
  const playerRef = useRef<Player>({ x: 50, y: 300, vx: 0, vy: 0, onGround: false, jumpCount: 0 });
  const platformsRef = useRef<Platform[]>([]);
  const keysRef = useRef<Set<string>>(new Set());
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const fragilePlatformsRef = useRef<Map<number, number>>(new Map());

  const initLevel = useCallback((levelNum: number, resetDeaths: boolean = false) => {
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = 0;
    }
    
    if (levelNum > LEVELS.length) {
      setGameState("win");
      return;
    }
    
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
    
    // Reset player to start position
    playerRef.current = {
      x: 60,
      y: 280,
      vx: 0,
      vy: 0,
      onGround: false,
      jumpCount: 0,
    };
    
    fragilePlatformsRef.current.clear();
    setLevel(levelNum);
    
    if (resetDeaths || levelNum === 1) {
      startTimeRef.current = Date.now();
      setDeaths(0);
    }
    
    setGameState("playing");
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

    let isRunning = true;

    const gameLoop = () => {
      if (!isRunning) return;
      
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
      if (player.vy > 15) player.vy = 15; // Terminal velocity
      
      // Update position
      player.x += player.vx;
      player.y += player.vy;
      
      // Update moving platforms
      platforms.forEach(p => {
        if (p.type === "moving" && p.moveRange && p.moveSpeed && p.originalX !== undefined) {
          p.x = p.originalX + Math.sin(now / 1000 * p.moveSpeed) * p.moveRange;
        }
      });
      
      // Check fragile platforms
      fragilePlatformsRef.current.forEach((breakTime, idx) => {
        if (now >= breakTime && platforms[idx]) {
          platforms[idx].y = 9999;
        }
      });
      
      // Platform collision
      player.onGround = false;
      platforms.forEach((p, idx) => {
        if (p.y > CANVAS_HEIGHT) return;
        
        // Check if player is above platform and falling
        if (
          player.x + PLAYER_WIDTH / 2 > p.x &&
          player.x - PLAYER_WIDTH / 2 < p.x + p.width &&
          player.y + PLAYER_HEIGHT >= p.y &&
          player.y + PLAYER_HEIGHT <= p.y + p.height + 10 &&
          player.vy >= 0
        ) {
          player.y = p.y - PLAYER_HEIGHT;
          player.vy = 0;
          player.onGround = true;
          player.jumpCount = 0;
          
          // Handle special platforms
          if (p.type === "bounce") {
            player.vy = JUMP_FORCE * 1.6;
            player.onGround = false;
          }
          
          if (p.type === "fragile" && !fragilePlatformsRef.current.has(idx)) {
            fragilePlatformsRef.current.set(idx, now + 800); // 0.8초 후 부서짐
          }
        }
      });
      
      // Boundary check
      player.x = Math.max(PLAYER_WIDTH / 2, Math.min(CANVAS_WIDTH - PLAYER_WIDTH / 2, player.x));
      
      // Death check (fell off screen)
      if (player.y > CANVAS_HEIGHT + 50) {
        isRunning = false;
        setDeaths(d => d + 1);
        // 딜레이 후 재시작
        setTimeout(() => {
          initLevel(level, false);
        }, 300);
        return;
      }
      
      // Goal check
      const goal = levelData.goal;
      if (
        Math.abs(player.x - goal.x) < 35 &&
        Math.abs(player.y - goal.y) < 45
      ) {
        isRunning = false;
        if (level >= LEVELS.length) {
          setGameState("win");
        } else {
          setTimeout(() => {
            initLevel(level + 1, false);
          }, 500);
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
      
      // Draw death zone indicator
      ctx.fillStyle = "rgba(239, 68, 68, 0.1)";
      ctx.fillRect(0, CANVAS_HEIGHT - 30, CANVAS_WIDTH, 30);
      
      // Draw platforms
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
          ctx.moveTo(p.x + p.width / 2 - 12, p.y + 5);
          ctx.lineTo(p.x + p.width / 2, p.y - 8);
          ctx.lineTo(p.x + p.width / 2 + 12, p.y + 5);
          ctx.fill();
        }
      });
      
      // Draw goal
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
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`Level ${level}/${LEVELS.length}`, 10, 28);
      
      // Platform legend
      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#4ade80";
      ctx.fillText("●", 10, 50);
      ctx.fillStyle = "#ffffff80";
      ctx.fillText(" 일반", 22, 50);
      
      ctx.fillStyle = "#fbbf24";
      ctx.fillText("●", 60, 50);
      ctx.fillStyle = "#ffffff80";
      ctx.fillText(" 이동", 72, 50);
      
      ctx.fillStyle = "#f472b6";
      ctx.fillText("●", 110, 50);
      ctx.fillStyle = "#ffffff80";
      ctx.fillText(" 점프", 122, 50);
      
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("●", 160, 50);
      ctx.fillStyle = "#ffffff80";
      ctx.fillText(" 부서짐", 172, 50);
      
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      isRunning = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
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
        initLevel(level, false);
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

  const handleJump = () => {
    if (gameState !== "playing") return;
    const player = playerRef.current;
    if (player.jumpCount < MAX_JUMPS) {
      player.vy = JUMP_FORCE;
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
              onClick={() => initLevel(1, true)}
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
              onClick={() => initLevel(1, true)}
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
          onTouchStart={handleJump}
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
