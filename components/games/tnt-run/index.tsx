"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Tile {
  x: number;
  y: number;
  active: boolean;
  fadeTime: number | null;
}

interface Player {
  x: number;
  y: number;
  floor: number;
  vx: number;
  vy: number;
}

const TILE_SIZE = 40;
const GRID_WIDTH = 12;
const GRID_HEIGHT = 12;
const FLOOR_COUNT = 3;
const TILE_FADE_DELAY = 500; // ms before tile disappears
const PLAYER_SPEED = 5;
const GRAVITY = 0.5;
const FLOOR_GAP = 150;

const FLOOR_COLORS = [
  { tile: "#ef4444", border: "#dc2626" }, // Red
  { tile: "#f97316", border: "#ea580c" }, // Orange  
  { tile: "#eab308", border: "#ca8a04" }, // Yellow
];

export default function TntRunGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"ready" | "playing" | "gameover">("ready");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const floorsRef = useRef<Tile[][][]>([]);
  const playerRef = useRef<Player>({ x: 0, y: 0, floor: 0, vx: 0, vy: 0 });
  const keysRef = useRef<Set<string>>(new Set());
  const startTimeRef = useRef<number>(0);
  const animationRef = useRef<number>(0);

  // Initialize floors
  const initGame = useCallback(() => {
    const floors: Tile[][][] = [];
    for (let f = 0; f < FLOOR_COUNT; f++) {
      const floor: Tile[][] = [];
      for (let y = 0; y < GRID_HEIGHT; y++) {
        const row: Tile[] = [];
        for (let x = 0; x < GRID_WIDTH; x++) {
          row.push({ x, y, active: true, fadeTime: null });
        }
        floor.push(row);
      }
      floors.push(floor);
    }
    floorsRef.current = floors;
    
    // Reset player to center of top floor
    const canvasWidth = GRID_WIDTH * TILE_SIZE;
    playerRef.current = {
      x: canvasWidth / 2,
      y: TILE_SIZE / 2,
      floor: 0,
      vx: 0,
      vy: 0,
    };
    
    startTimeRef.current = Date.now();
    setScore(0);
    setGameState("playing");
  }, []);

  // Get tile under player
  const getTileUnderPlayer = useCallback((floor: number, px: number, py: number) => {
    const floorData = floorsRef.current[floor];
    if (!floorData) return null;
    
    const tileX = Math.floor(px / TILE_SIZE);
    const tileY = Math.floor(py / TILE_SIZE);
    
    if (tileX < 0 || tileX >= GRID_WIDTH || tileY < 0 || tileY >= GRID_HEIGHT) {
      return null;
    }
    
    return floorData[tileY]?.[tileX] || null;
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameLoop = () => {
      const player = playerRef.current;
      const now = Date.now();
      
      // Update score (survival time)
      const elapsed = Math.floor((now - startTimeRef.current) / 1000);
      setScore(elapsed);

      // Handle input
      let dx = 0, dy = 0;
      if (keysRef.current.has("ArrowLeft") || keysRef.current.has("a")) dx -= 1;
      if (keysRef.current.has("ArrowRight") || keysRef.current.has("d")) dx += 1;
      if (keysRef.current.has("ArrowUp") || keysRef.current.has("w")) dy -= 1;
      if (keysRef.current.has("ArrowDown") || keysRef.current.has("s")) dy += 1;
      
      // Normalize diagonal movement
      if (dx !== 0 && dy !== 0) {
        dx *= 0.707;
        dy *= 0.707;
      }
      
      player.vx = dx * PLAYER_SPEED;
      player.vy = dy * PLAYER_SPEED;
      
      // Update position
      player.x += player.vx;
      player.y += player.vy;
      
      // Clamp to bounds
      const canvasWidth = GRID_WIDTH * TILE_SIZE;
      const canvasHeight = GRID_HEIGHT * TILE_SIZE;
      player.x = Math.max(10, Math.min(canvasWidth - 10, player.x));
      player.y = Math.max(10, Math.min(canvasHeight - 10, player.y));
      
      // Check tile under player
      const tile = getTileUnderPlayer(player.floor, player.x, player.y);
      
      if (tile && tile.active) {
        // Start fade timer if not already fading
        if (tile.fadeTime === null) {
          tile.fadeTime = now + TILE_FADE_DELAY;
        }
      } else if (!tile || !tile.active) {
        // Fall to next floor
        player.floor++;
        if (player.floor >= FLOOR_COUNT) {
          // Game over
          setGameState("gameover");
          if (elapsed > highScore) {
            setHighScore(elapsed);
          }
          return;
        }
      }
      
      // Update fading tiles
      floorsRef.current.forEach((floor) => {
        floor.forEach((row) => {
          row.forEach((t) => {
            if (t.fadeTime !== null && now >= t.fadeTime) {
              t.active = false;
            }
          });
        });
      });
      
      // Draw
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw current floor tiles
      const currentFloor = floorsRef.current[player.floor];
      if (currentFloor) {
        const colors = FLOOR_COLORS[player.floor];
        currentFloor.forEach((row, gy) => {
          row.forEach((t, gx) => {
            if (t.active) {
              const px = gx * TILE_SIZE;
              const py = gy * TILE_SIZE;
              
              // Check if fading
              const isFading = t.fadeTime !== null;
              const alpha = isFading ? 0.5 + 0.5 * Math.sin(Date.now() / 50) : 1;
              
              ctx.globalAlpha = alpha;
              ctx.fillStyle = colors.tile;
              ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
              ctx.strokeStyle = colors.border;
              ctx.lineWidth = 2;
              ctx.strokeRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
              ctx.globalAlpha = 1;
            }
          });
        });
      }
      
      // Draw player
      ctx.fillStyle = "#22d3ee";
      ctx.shadowColor = "#22d3ee";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(player.x, player.y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Draw floor indicator
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`Floor: ${FLOOR_COUNT - player.floor}`, 10, 25);
      
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [gameState, highScore, getTileUnderPlayer]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(e.key)) {
        e.preventDefault();
        keysRef.current.add(e.key.toLowerCase());
      }
      if (e.key === " " && gameState !== "playing") {
        initGame();
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
  }, [gameState, initGame]);

  // Touch controls
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    
    keysRef.current.clear();
    if (Math.abs(dx) > 10) {
      keysRef.current.add(dx > 0 ? "d" : "a");
    }
    if (Math.abs(dy) > 10) {
      keysRef.current.add(dy > 0 ? "s" : "w");
    }
    
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
    keysRef.current.clear();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-8 text-white">
        <div className="text-lg">⏱️ <span className="font-bold text-cyan-400">{score}s</span></div>
        <div className="text-lg">🏆 <span className="font-bold text-yellow-400">{highScore}s</span></div>
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={GRID_WIDTH * TILE_SIZE}
          height={GRID_HEIGHT * TILE_SIZE}
          className="rounded-xl border-2 border-white/20 bg-[#1a1a2e]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
        
        {gameState === "ready" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
            <h2 className="text-3xl font-bold text-white mb-4">🏃 TNT Run</h2>
            <p className="text-white/70 mb-2">밟은 바닥이 사라져요!</p>
            <p className="text-white/70 mb-6">최대한 오래 버티세요!</p>
            <button
              onClick={initGame}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
            >
              게임 시작
            </button>
            <p className="text-white/50 text-sm mt-4">방향키 / WASD / 터치로 이동</p>
          </div>
        )}
        
        {gameState === "gameover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
            <h2 className="text-3xl font-bold text-red-500 mb-4">💥 Game Over!</h2>
            <p className="text-2xl text-white mb-2">생존 시간: <span className="text-cyan-400">{score}초</span></p>
            {score >= highScore && score > 0 && (
              <p className="text-yellow-400 mb-4">🎉 새로운 최고 기록!</p>
            )}
            <button
              onClick={initGame}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
            >
              다시 하기
            </button>
          </div>
        )}
      </div>
      
      {/* Mobile controls */}
      <div className="grid grid-cols-3 gap-2 md:hidden mt-4">
        <div />
        <button
          className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-2xl active:bg-white/20"
          onTouchStart={() => keysRef.current.add("w")}
          onTouchEnd={() => keysRef.current.delete("w")}
        >
          ⬆️
        </button>
        <div />
        <button
          className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-2xl active:bg-white/20"
          onTouchStart={() => keysRef.current.add("a")}
          onTouchEnd={() => keysRef.current.delete("a")}
        >
          ⬅️
        </button>
        <button
          className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-2xl active:bg-white/20"
          onTouchStart={() => keysRef.current.add("s")}
          onTouchEnd={() => keysRef.current.delete("s")}
        >
          ⬇️
        </button>
        <button
          className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-2xl active:bg-white/20"
          onTouchStart={() => keysRef.current.add("d")}
          onTouchEnd={() => keysRef.current.delete("d")}
        >
          ➡️
        </button>
      </div>
    </div>
  );
}
