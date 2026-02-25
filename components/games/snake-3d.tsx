"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Direction = "up" | "down" | "left" | "right";
type Position = { x: number; y: number };

const GRID_SIZE = 15;
const CELL_SIZE = 100 / GRID_SIZE;

export default function Snake3DGame() {
  const [snake, setSnake] = useState<Position[]>([{ x: 7, y: 7 }]);
  const [food, setFood] = useState<Position>({ x: 10, y: 10 });
  const [direction, setDirection] = useState<Direction>("right");
  const [nextDirection, setNextDirection] = useState<Direction>("right");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(200);
  const dirRef = useRef(direction);

  // 음식 생성
  const spawnFood = useCallback((snakeBody: Position[]) => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snakeBody.some((s) => s.x === newFood.x && s.y === newFood.y));
    return newFood;
  }, []);

  // 게임 시작
  const startGame = () => {
    const initialSnake = [{ x: 7, y: 7 }];
    setSnake(initialSnake);
    setFood(spawnFood(initialSnake));
    setDirection("right");
    setNextDirection("right");
    dirRef.current = "right";
    setScore(0);
    setGameOver(false);
    setStarted(true);
    setSpeed(200);
  };

  // 방향 변경
  const changeDirection = (newDir: Direction) => {
    const opposites: Record<Direction, Direction> = {
      up: "down",
      down: "up",
      left: "right",
      right: "left",
    };
    if (newDir !== opposites[dirRef.current]) {
      setNextDirection(newDir);
    }
  };

  // 게임 루프
  useEffect(() => {
    if (!started || gameOver) return;

    const interval = setInterval(() => {
      setDirection(nextDirection);
      dirRef.current = nextDirection;

      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };

        // 이동
        switch (nextDirection) {
          case "up":
            head.y -= 1;
            break;
          case "down":
            head.y += 1;
            break;
          case "left":
            head.x -= 1;
            break;
          case "right":
            head.x += 1;
            break;
        }

        // 벽 충돌
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          setHighScore((hs) => Math.max(hs, score));
          return prevSnake;
        }

        // 자기 충돌
        if (prevSnake.some((s) => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          setHighScore((hs) => Math.max(hs, score));
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // 음식 먹기
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 10);
          setFood(spawnFood(newSnake));
          setSpeed((sp) => Math.max(80, sp - 5));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [started, gameOver, nextDirection, food, score, speed, spawnFood]);

  // 키보드
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w") changeDirection("up");
      if (e.key === "ArrowDown" || e.key === "s") changeDirection("down");
      if (e.key === "ArrowLeft" || e.key === "a") changeDirection("left");
      if (e.key === "ArrowRight" || e.key === "d") changeDirection("right");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <span>점수: {score}</span>
        <span>최고: {highScore}</span>
        <span>길이: {snake.length}</span>
      </div>

      <div
        className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-xl border-4 border-emerald-500/50"
        style={{
          background: "linear-gradient(145deg, #0a2e1a 0%, #0f3d24 50%, #0a2e1a 100%)",
          boxShadow: "inset 0 0 50px rgba(0,255,100,0.1), 0 0 30px rgba(0,255,100,0.2)",
          perspective: "1000px",
        }}
      >
        {/* 3D 그리드 */}
        <div
          className="absolute inset-0"
          style={{
            transform: "rotateX(20deg) scale(1.1)",
            transformOrigin: "center bottom",
          }}
        >
          {/* 그리드 라인 */}
          <div
            className="absolute inset-2 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(to right, #00ff6640 1px, transparent 1px),
                linear-gradient(to bottom, #00ff6640 1px, transparent 1px)
              `,
              backgroundSize: `${CELL_SIZE}% ${CELL_SIZE}%`,
            }}
          />

          {!started ? (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <h2 className="text-3xl font-bold text-emerald-400">🐍 스네이크 3D</h2>
              <p className="text-white/70">먹이를 먹고 길어져라!</p>
              <button
                onClick={startGame}
                className="rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 px-8 py-3 font-bold text-white transition hover:scale-105"
              >
                게임 시작
              </button>
            </div>
          ) : gameOver ? (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <h2 className="text-3xl font-bold text-red-400">GAME OVER</h2>
              <p className="text-xl text-white">점수: {score}</p>
              <p className="text-white/70">길이: {snake.length}</p>
              <button
                onClick={startGame}
                className="rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 px-8 py-3 font-bold text-white"
              >
                다시 시작
              </button>
            </div>
          ) : (
            <>
              {/* 뱀 */}
              {snake.map((segment, i) => {
                const isHead = i === 0;
                const hue = 120 + i * 3;
                return (
                  <div
                    key={i}
                    className="absolute transition-all duration-100"
                    style={{
                      left: `${segment.x * CELL_SIZE + CELL_SIZE / 2}%`,
                      top: `${segment.y * CELL_SIZE + CELL_SIZE / 2}%`,
                      transform: "translate(-50%, -50%)",
                      zIndex: snake.length - i,
                    }}
                  >
                    <div
                      className={`rounded-lg ${isHead ? "rounded-xl" : ""}`}
                      style={{
                        width: `${isHead ? CELL_SIZE * 1.2 : CELL_SIZE * 0.9}%`,
                        height: `${isHead ? CELL_SIZE * 1.2 : CELL_SIZE * 0.9}%`,
                        minWidth: isHead ? "28px" : "22px",
                        minHeight: isHead ? "28px" : "22px",
                        background: `linear-gradient(145deg, hsl(${hue}, 80%, 50%), hsl(${hue}, 80%, 30%))`,
                        boxShadow: isHead
                          ? "0 4px 15px rgba(0,255,100,0.5), inset 0 2px 10px rgba(255,255,255,0.3)"
                          : "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 5px rgba(255,255,255,0.2)",
                      }}
                    >
                      {isHead && (
                        <div className="flex h-full items-center justify-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-white shadow-lg" />
                          <div className="h-2 w-2 rounded-full bg-white shadow-lg" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* 음식 */}
              <div
                className="absolute animate-bounce"
                style={{
                  left: `${food.x * CELL_SIZE + CELL_SIZE / 2}%`,
                  top: `${food.y * CELL_SIZE + CELL_SIZE / 2}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: "24px",
                    height: "24px",
                    background: "radial-gradient(circle at 30% 30%, #ff6b6b, #c0392b)",
                    boxShadow: "0 0 20px #ff6b6b, 0 4px 10px rgba(0,0,0,0.3)",
                  }}
                >
                  <div className="absolute left-1/2 top-0 h-2 w-1 -translate-x-1/2 -translate-y-1 rounded bg-green-600" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 컨트롤 */}
      <div className="flex flex-col items-center gap-2">
        <button
          className="rounded-lg bg-white/10 px-8 py-3 text-lg active:bg-white/20"
          onClick={() => changeDirection("up")}
        >
          ▲
        </button>
        <div className="flex gap-4">
          <button
            className="rounded-lg bg-white/10 px-8 py-3 text-lg active:bg-white/20"
            onClick={() => changeDirection("left")}
          >
            ◀
          </button>
          <button
            className="rounded-lg bg-white/10 px-8 py-3 text-lg active:bg-white/20"
            onClick={() => changeDirection("right")}
          >
            ▶
          </button>
        </div>
        <button
          className="rounded-lg bg-white/10 px-8 py-3 text-lg active:bg-white/20"
          onClick={() => changeDirection("down")}
        >
          ▼
        </button>
      </div>
    </div>
  );
}
