"use client";

import { useState, useCallback, useRef, Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, RoundedBox } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const COLS = 6;
const ROWS = 4;
const BRICK_W = 1.1;
const BRICK_H = 0.45;
const BRICK_GAP = 0.15;
const FIELD_W = (COLS * (BRICK_W + BRICK_GAP)) - BRICK_GAP;
const FIELD_H = 10;
const PADDLE_W = 1.6;
const BALL_R = 0.2;
const BALL_SPEED_INIT = 5.5;

const BRICK_COLORS = [
  ["#f97316", "#f97316", "#f97316", "#f97316", "#f97316", "#f97316"],
  ["#f43f5e", "#f43f5e", "#f43f5e", "#f43f5e", "#f43f5e", "#f43f5e"],
  ["#eab308", "#eab308", "#eab308", "#eab308", "#eab308", "#eab308"],
  ["#22c55e", "#22c55e", "#22c55e", "#22c55e", "#22c55e", "#22c55e"],
];

const BRICK_SCORES = [30, 20, 15, 10];

type Brick = { row: number; col: number; alive: boolean; color: string; score: number };
type Ball = { x: number; y: number; vx: number; vy: number };

function createBricks(): Brick[] {
  const bricks: Brick[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      bricks.push({
        row: r,
        col: c,
        alive: true,
        color: BRICK_COLORS[r][c],
        score: BRICK_SCORES[r],
      });
    }
  }
  return bricks;
}

function brickPosition(row: number, col: number): [number, number] {
  const startX = -(FIELD_W / 2) + BRICK_W / 2;
  const x = startX + col * (BRICK_W + BRICK_GAP);
  const y = 3.5 - row * (BRICK_H + BRICK_GAP);
  return [x, y];
}

function Brick3D({ brick }: { brick: Brick }) {
  if (!brick.alive) return null;
  const [x, y] = brickPosition(brick.row, brick.col);

  return (
    <RoundedBox args={[BRICK_W, BRICK_H, 0.4]} radius={0.04} smoothness={4} position={[x, y, 0]}>
      <meshPhysicalMaterial
        color={brick.color}
        metalness={0.15}
        roughness={0.08}
        transmission={0.45}
        thickness={0.4}
        clearcoat={1}
        emissive={brick.color}
        emissiveIntensity={0.2}
      />
    </RoundedBox>
  );
}

function PaddleMesh({ paddleX }: { paddleX: number }) {
  return (
    <RoundedBox args={[PADDLE_W, 0.25, 0.5]} radius={0.06} smoothness={4} position={[paddleX, -4.2, 0]}>
      <meshPhysicalMaterial
        color="#f97316"
        metalness={0.7}
        roughness={0.1}
        clearcoat={1}
        emissive="#f97316"
        emissiveIntensity={0.15}
      />
    </RoundedBox>
  );
}

function BallMesh({ ball }: { ball: Ball }) {
  return (
    <mesh position={[ball.x, ball.y, 0]}>
      <sphereGeometry args={[BALL_R, 32, 32]} />
      <meshPhysicalMaterial
        color="#ffffff"
        metalness={0.3}
        roughness={0.05}
        clearcoat={1}
        emissive="#f97316"
        emissiveIntensity={0.8}
      />
    </mesh>
  );
}

function Walls() {
  const halfW = FIELD_W / 2 + 0.3;
  return (
    <>
      {/* Left wall */}
      <mesh position={[-halfW, 0, 0]}>
        <boxGeometry args={[0.15, FIELD_H, 0.6]} />
        <meshPhysicalMaterial color="#1e1b4b" metalness={0.5} roughness={0.2} clearcoat={1} />
      </mesh>
      {/* Right wall */}
      <mesh position={[halfW, 0, 0]}>
        <boxGeometry args={[0.15, FIELD_H, 0.6]} />
        <meshPhysicalMaterial color="#1e1b4b" metalness={0.5} roughness={0.2} clearcoat={1} />
      </mesh>
      {/* Top wall */}
      <mesh position={[0, FIELD_H / 2, 0]}>
        <boxGeometry args={[FIELD_W + 0.75, 0.15, 0.6]} />
        <meshPhysicalMaterial color="#1e1b4b" metalness={0.5} roughness={0.2} clearcoat={1} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0, -0.4]}>
        <planeGeometry args={[FIELD_W + 1, FIELD_H + 1]} />
        <meshStandardMaterial color="#0a0a18" metalness={0.9} roughness={0.3} />
      </mesh>
    </>
  );
}

function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0.5, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

function GameScene({
  bricks,
  paddleX,
  ball,
}: {
  bricks: Brick[];
  paddleX: number;
  ball: Ball;
}) {
  return (
    <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
      <color attach="background" args={["#0a0a12"]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 8, 5]} intensity={0.8} color="#e0e0ff" />
      <pointLight position={[ball.x, ball.y, 2]} intensity={1} color="#f97316" distance={6} />
      <pointLight position={[0, 3, 2]} intensity={0.5} color="#f43f5e" distance={8} />
      <Suspense fallback={null}>
        <CameraSetup />
        <Walls />
        {bricks.map((b, i) => (
          <Brick3D key={i} brick={b} />
        ))}
        <PaddleMesh paddleX={paddleX} />
        <BallMesh ball={ball} />
        <Environment preset="night" />
      </Suspense>
      <EffectComposer>
        <Bloom luminanceThreshold={0.35} intensity={0.6} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}

export default function Breakout3DGame() {
  const [bricks, setBricks] = useState<Brick[]>(createBricks);
  const [ball, setBall] = useState<Ball>({ x: 0, y: -3.5, vx: 3, vy: BALL_SPEED_INIT });
  const [paddleX, setPaddleX] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const paddleXRef = useRef(0);
  const bricksRef = useRef(bricks);
  const ballRef = useRef(ball);
  const livesRef = useRef(3);
  const scoreRef = useRef(0);

  useEffect(() => { paddleXRef.current = paddleX; }, [paddleX]);
  useEffect(() => { bricksRef.current = bricks; }, [bricks]);
  useEffect(() => { ballRef.current = ball; }, [ball]);
  useEffect(() => { livesRef.current = lives; }, [lives]);

  // Game loop
  useEffect(() => {
    if (!started || gameOver || cleared) return;
    let lastTime = performance.now();

    const loop = () => {
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const b = { ...ballRef.current };
      b.x += b.vx * delta;
      b.y += b.vy * delta;

      const halfW = FIELD_W / 2 + 0.15;

      // Wall collisions
      if (b.x - BALL_R < -halfW) { b.x = -halfW + BALL_R; b.vx = Math.abs(b.vx); }
      if (b.x + BALL_R > halfW) { b.x = halfW - BALL_R; b.vx = -Math.abs(b.vx); }
      if (b.y + BALL_R > FIELD_H / 2) { b.y = FIELD_H / 2 - BALL_R; b.vy = -Math.abs(b.vy); }

      // Paddle collision
      if (
        b.vy < 0 &&
        b.y - BALL_R < -4.05 &&
        b.y - BALL_R > -4.4 &&
        b.x > paddleXRef.current - PADDLE_W / 2 - 0.1 &&
        b.x < paddleXRef.current + PADDLE_W / 2 + 0.1
      ) {
        b.vy = Math.abs(b.vy);
        const hitPos = (b.x - paddleXRef.current) / (PADDLE_W / 2);
        b.vx = hitPos * 5;
        b.y = -4.05 + BALL_R;
      }

      // Brick collision
      let newBricks = [...bricksRef.current];
      let hit = false;
      for (let i = 0; i < newBricks.length; i++) {
        const brick = newBricks[i];
        if (!brick.alive) continue;
        const [bx, by] = brickPosition(brick.row, brick.col);
        if (
          b.x + BALL_R > bx - BRICK_W / 2 &&
          b.x - BALL_R < bx + BRICK_W / 2 &&
          b.y + BALL_R > by - BRICK_H / 2 &&
          b.y - BALL_R < by + BRICK_H / 2
        ) {
          newBricks[i] = { ...brick, alive: false };
          scoreRef.current += brick.score;
          setScore(scoreRef.current);
          hit = true;

          // Determine bounce direction
          const dx = b.x - bx;
          const dy = b.y - by;
          if (Math.abs(dx / (BRICK_W / 2)) > Math.abs(dy / (BRICK_H / 2))) {
            b.vx = dx > 0 ? Math.abs(b.vx) : -Math.abs(b.vx);
          } else {
            b.vy = dy > 0 ? Math.abs(b.vy) : -Math.abs(b.vy);
          }
          break;
        }
      }
      if (hit) {
        setBricks(newBricks);
        bricksRef.current = newBricks;
        // Check clear
        if (newBricks.every((br) => !br.alive)) {
          setCleared(true);
          return;
        }
      }

      // Ball lost
      if (b.y < -5.5) {
        const newLives = livesRef.current - 1;
        setLives(newLives);
        livesRef.current = newLives;
        if (newLives <= 0) {
          setGameOver(true);
          return;
        }
        // Reset ball
        b.x = 0;
        b.y = -3.5;
        b.vx = (Math.random() - 0.5) * 4;
        b.vy = BALL_SPEED_INIT;
      }

      setBall(b);
      ballRef.current = b;

      if (!gameOver && !cleared) requestAnimationFrame(loop);
    };

    const frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [started, gameOver, cleared]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!started || gameOver || cleared || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const halfW = FIELD_W / 2;
      const newX = (relX - 0.5) * FIELD_W * 1.8;
      setPaddleX(Math.max(-halfW + PADDLE_W / 2, Math.min(halfW - PADDLE_W / 2, newX)));
    },
    [started, gameOver, cleared]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!started || gameOver || cleared || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relX = (e.touches[0].clientX - rect.left) / rect.width;
      const halfW = FIELD_W / 2;
      const newX = (relX - 0.5) * FIELD_W * 1.8;
      setPaddleX(Math.max(-halfW + PADDLE_W / 2, Math.min(halfW - PADDLE_W / 2, newX)));
    },
    [started, gameOver, cleared]
  );

  const handleRestart = useCallback(() => {
    setBricks(createBricks());
    setBall({ x: 0, y: -3.5, vx: (Math.random() - 0.5) * 4, vy: BALL_SPEED_INIT });
    setPaddleX(0);
    setScore(0);
    setLives(3);
    setGameOver(false);
    setCleared(false);
    setStarted(true);
    scoreRef.current = 0;
    livesRef.current = 3;
  }, []);

  const aliveBricks = bricks.filter((b) => b.alive).length;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl select-none"
      style={{ height: "min(70vh, 560px)", background: "#0a0a12", touchAction: "none" }}
      onPointerMove={handlePointerMove}
      onTouchMove={handleTouchMove}
    >
      <GameScene bricks={bricks} paddleX={paddleX} ball={ball} />

      {!started && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a12]/85 backdrop-blur-xl">
          <h2
            className="text-4xl font-extralight uppercase tracking-[0.3em] text-slate-200 sm:text-5xl"
            style={{ textShadow: "0 0 40px rgba(249,115,22,0.6)" }}
          >
            Breakout 3D
          </h2>
          <p className="mt-2 text-xs font-light uppercase tracking-[0.5em] text-orange-400">
            Smash All Bricks
          </p>
          <button
            onClick={() => setStarted(true)}
            className="mt-8 rounded-xl border border-orange-500/40 bg-orange-500/15 px-8 py-3 text-sm uppercase tracking-[0.3em] text-slate-200 transition-all hover:bg-orange-500/30 hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]"
          >
            Start Game
          </button>
        </div>
      )}

      {(gameOver || cleared) && started && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a12]/90 backdrop-blur-2xl">
          <h2
            className={`text-3xl font-extralight uppercase tracking-[0.25em] ${cleared ? "text-emerald-500" : "text-rose-400"}`}
            style={{ textShadow: `0 0 40px ${cleared ? "rgba(34,197,94,0.5)" : "rgba(244,63,94,0.5)"}` }}
          >
            {cleared ? "Clear!" : "Game Over"}
          </h2>
          <div className="mt-4 rounded-xl border border-orange-500/30 bg-[#0f0f1e]/70 px-6 py-3 text-center backdrop-blur-xl">
            <div className="text-[0.6rem] uppercase tracking-[0.25em] text-orange-400">Score</div>
            <div className="text-3xl font-extralight text-slate-200">{score}</div>
          </div>
          <button
            onClick={handleRestart}
            className="mt-6 rounded-xl border border-orange-500/40 bg-orange-500/15 px-8 py-3 text-sm uppercase tracking-[0.3em] text-slate-200 transition-all hover:bg-orange-500/30"
          >
            Play Again
          </button>
        </div>
      )}

      {started && !gameOver && !cleared && (
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex justify-between p-4">
          <div className="rounded-xl border border-orange-500/20 bg-[#0f0f1e]/70 px-4 py-2 backdrop-blur-xl">
            <div className="text-[0.6rem] uppercase tracking-[0.25em] text-orange-400">Score</div>
            <div className="text-lg font-extralight text-slate-200">{score}</div>
          </div>
          <div className="rounded-xl border border-orange-500/20 bg-[#0f0f1e]/70 px-4 py-2 backdrop-blur-xl">
            <div className="text-[0.6rem] uppercase tracking-[0.25em] text-orange-400">Bricks</div>
            <div className="text-lg font-extralight text-slate-200">{aliveBricks}/{ROWS * COLS}</div>
          </div>
          <div className="rounded-xl border border-rose-500/20 bg-[#0f0f1e]/70 px-4 py-2 backdrop-blur-xl">
            <div className="text-[0.6rem] uppercase tracking-[0.25em] text-rose-400">Lives</div>
            <div className="text-lg font-extralight text-slate-200">{"❤️".repeat(lives)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
