"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Tile {
  x: number;
  y: number;
  active: boolean;
}

interface Entity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  onGround: boolean;
  fallen: boolean;
}

const TILE_SIZE = 50;
const GRID_WIDTH = 10;
const GRID_HEIGHT = 8;
const PLAYER_SIZE = 20;
const GRAVITY = 0.3;
const MOVE_SPEED = 4;
const JUMP_FORCE = -8;

export default function SpleefGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"ready" | "playing" | "win" | "lose">("ready");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  
  const tilesRef = useRef<Tile[][]>([]);
  const playerRef = useRef<Entity>({ x: 100, y: 50, vx: 0, vy: 0, onGround: false, fallen: false });
  const aiRef = useRef<Entity>({ x: 400, y: 50, vx: 0, vy: 0, onGround: false, fallen: false });
  const keysRef = useRef<Set<string>>(new Set());
  const animationRef = useRef<number>(0);
  const lastAiActionRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  const initGame = useCallback((newRound: number = 1) => {
    // Initialize tiles
    const tiles: Tile[][] = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
      const row: Tile[] = [];
      for (let x = 0; x < GRID_WIDTH; x++) {
        row.push({ x, y, active: true });
      }
      tiles.push(row);
    }
    tilesRef.current = tiles;
    
    // Reset player
    playerRef.current = {
      x: TILE_SIZE * 1.5,
      y: 50,
      vx: 0,
      vy: 0,
      onGround: false,
      fallen: false,
    };
    
    // Reset AI
    aiRef.current = {
      x: TILE_SIZE * (GRID_WIDTH - 1.5),
      y: 50,
      vx: 0,
      vy: 0,
      onGround: false,
      fallen: false,
    };
    
    setRound(newRound);
    setGameState("playing");
  }, []);

  // Check if entity is on a tile
  const isOnTile = useCallback((entity: Entity): boolean => {
    const tiles = tilesRef.current;
    const tileY = Math.floor((entity.y + PLAYER_SIZE + 5) / TILE_SIZE);
    const tileX = Math.floor(entity.x / TILE_SIZE);
    
    if (tileY < 0 || tileY >= GRID_HEIGHT || tileX < 0 || tileX >= GRID_WIDTH) {
      return false;
    }
    
    const tile = tiles[tileY]?.[tileX];
    return tile?.active ?? false;
  }, []);

  // Break tile at position
  const breakTile = useCallback((worldX: number, worldY: number) => {
    const tileX = Math.floor(worldX / TILE_SIZE);
    const tileY = Math.floor(worldY / TILE_SIZE);
    
    if (tileY >= 0 && tileY < GRID_HEIGHT && tileX >= 0 && tileX < GRID_WIDTH) {
      const tile = tilesRef.current[tileY]?.[tileX];
      if (tile?.active) {
        tile.active = false;
        return true;
      }
    }
    return false;
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = GRID_WIDTH * TILE_SIZE;
    const canvasHeight = GRID_HEIGHT * TILE_SIZE + 100; // Extra space for falling

    const updateEntity = (entity: Entity) => {
      // Apply gravity
      entity.vy += GRAVITY;
      
      // Update position
      entity.x += entity.vx;
      entity.y += entity.vy;
      
      // Check ground collision
      const onTile = isOnTile(entity);
      if (onTile && entity.vy > 0) {
        const tileY = Math.floor((entity.y + PLAYER_SIZE + 5) / TILE_SIZE);
        entity.y = tileY * TILE_SIZE - PLAYER_SIZE - 1;
        entity.vy = 0;
        entity.onGround = true;
      } else {
        entity.onGround = false;
      }
      
      // Clamp X position
      entity.x = Math.max(PLAYER_SIZE, Math.min(canvasWidth - PLAYER_SIZE, entity.x));
      
      // Check if fallen
      if (entity.y > canvasHeight - 50) {
        entity.fallen = true;
      }
    };

    const gameLoop = () => {
      const player = playerRef.current;
      const ai = aiRef.current;
      const now = Date.now();
      
      // Handle player input
      player.vx = 0;
      if (keysRef.current.has("arrowleft") || keysRef.current.has("a")) player.vx = -MOVE_SPEED;
      if (keysRef.current.has("arrowright") || keysRef.current.has("d")) player.vx = MOVE_SPEED;
      if ((keysRef.current.has("arrowup") || keysRef.current.has("w") || keysRef.current.has(" ")) && player.onGround) {
        player.vy = JUMP_FORCE;
      }
      
      // AI behavior - moves toward player and breaks tiles
      if (!ai.fallen && now - lastAiActionRef.current > 300 + Math.random() * 200) {
        lastAiActionRef.current = now;
        
        // Move toward player
        if (player.x < ai.x - 20) ai.vx = -MOVE_SPEED * 0.7;
        else if (player.x > ai.x + 20) ai.vx = MOVE_SPEED * 0.7;
        else ai.vx = 0;
        
        // Jump occasionally
        if (ai.onGround && Math.random() < 0.3) {
          ai.vy = JUMP_FORCE;
        }
        
        // Break tiles near player (aggressive AI)
        const targetX = player.x + (Math.random() - 0.5) * TILE_SIZE * 2;
        const targetY = Math.floor(player.y / TILE_SIZE + 1) * TILE_SIZE + TILE_SIZE / 2;
        breakTile(targetX, targetY);
      }
      
      // Update entities
      updateEntity(player);
      updateEntity(ai);
      
      // Check win/lose
      if (player.fallen && !ai.fallen) {
        setGameState("lose");
        return;
      }
      if (ai.fallen && !player.fallen) {
        setScore(prev => prev + round * 100);
        setGameState("win");
        return;
      }
      if (player.fallen && ai.fallen) {
        // Both fell - player loses
        setGameState("lose");
        return;
      }
      
      // Draw
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw pit (death zone)
      ctx.fillStyle = "#1e1b4b";
      ctx.fillRect(0, GRID_HEIGHT * TILE_SIZE, canvas.width, 100);
      ctx.fillStyle = "#312e81";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("☠️ VOID ☠️", canvas.width / 2, GRID_HEIGHT * TILE_SIZE + 60);
      
      // Draw tiles (snow/ice blocks)
      tilesRef.current.forEach((row, gy) => {
        row.forEach((tile, gx) => {
          if (tile.active) {
            const px = gx * TILE_SIZE;
            const py = gy * TILE_SIZE;
            
            // Snow block gradient
            const gradient = ctx.createLinearGradient(px, py, px, py + TILE_SIZE);
            gradient.addColorStop(0, "#e0f2fe");
            gradient.addColorStop(1, "#7dd3fc");
            
            ctx.fillStyle = gradient;
            ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            
            // Border
            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 2;
            ctx.strokeRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            
            // Snow texture dots
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(px + 15, py + 15, 3, 0, Math.PI * 2);
            ctx.arc(px + 35, py + 25, 2, 0, Math.PI * 2);
            ctx.arc(px + 20, py + 35, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      });
      
      // Draw player (blue)
      if (!player.fallen) {
        ctx.fillStyle = "#3b82f6";
        ctx.shadowColor = "#3b82f6";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(player.x, player.y, PLAYER_SIZE, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Player label
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("YOU", player.x, player.y - 25);
      }
      
      // Draw AI (red)
      if (!ai.fallen) {
        ctx.fillStyle = "#ef4444";
        ctx.shadowColor = "#ef4444";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(ai.x, ai.y, PLAYER_SIZE, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // AI label
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("AI", ai.x, ai.y - 25);
      }
      
      // Draw mouse target (for clicking)
      if (mouseRef.current) {
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(
          Math.floor(mouseRef.current.x / TILE_SIZE) * TILE_SIZE + 2,
          Math.floor(mouseRef.current.y / TILE_SIZE) * TILE_SIZE + 2,
          TILE_SIZE - 4,
          TILE_SIZE - 4
        );
        ctx.setLineDash([]);
      }
      
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [gameState, round, isOnTile, breakTile]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", " "].includes(key)) {
        e.preventDefault();
        keysRef.current.add(key);
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
  }, []);

  // Mouse controls for breaking tiles
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== "playing") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    breakTile(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current = null;
  };

  // Touch controls
  const handleTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (gameState !== "playing") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    breakTile(x, y);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-8 text-white">
        <div className="text-lg">🏆 <span className="font-bold text-yellow-400">{score}</span></div>
        <div className="text-lg">🎯 <span className="font-bold text-cyan-400">Round {round}</span></div>
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={GRID_WIDTH * TILE_SIZE}
          height={GRID_HEIGHT * TILE_SIZE + 100}
          className="rounded-xl border-2 border-white/20 cursor-crosshair"
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouch}
        />
        
        {gameState === "ready" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
            <h2 className="text-3xl font-bold text-white mb-4">⛏️ Spleef</h2>
            <p className="text-white/70 mb-2">클릭으로 블록을 파괴하세요!</p>
            <p className="text-white/70 mb-6">AI를 먼저 떨어뜨리면 승리!</p>
            <button
              onClick={() => initGame(1)}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
            >
              게임 시작
            </button>
            <p className="text-white/50 text-sm mt-4">방향키: 이동 | 스페이스: 점프 | 클릭: 파괴</p>
          </div>
        )}
        
        {gameState === "win" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
            <h2 className="text-3xl font-bold text-green-400 mb-4">🎉 승리!</h2>
            <p className="text-xl text-white mb-2">Round {round} 클리어!</p>
            <p className="text-yellow-400 mb-6">+{round * 100}점</p>
            <button
              onClick={() => initGame(round + 1)}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
            >
              다음 라운드
            </button>
          </div>
        )}
        
        {gameState === "lose" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
            <h2 className="text-3xl font-bold text-red-500 mb-4">💀 패배!</h2>
            <p className="text-xl text-white mb-2">총 점수: <span className="text-yellow-400">{score}</span></p>
            <p className="text-white/70 mb-6">Round {round}에서 탈락</p>
            <button
              onClick={() => {
                setScore(0);
                initGame(1);
              }}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
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
          className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center text-2xl active:bg-white/20"
          onTouchStart={() => keysRef.current.add(" ")}
          onTouchEnd={() => keysRef.current.delete(" ")}
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
      <p className="text-white/50 text-sm md:hidden">화면 터치로 블록 파괴!</p>
    </div>
  );
}
