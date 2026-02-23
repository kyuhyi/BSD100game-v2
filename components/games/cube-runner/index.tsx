"use client";

import { useState, useCallback, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, RoundedBox } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const LANES = [-1.5, 0, 1.5];
const OBSTACLE_SPEED_INIT = 8;
const SPAWN_INTERVAL_INIT = 1.2;

type Obstacle = { id: number; lane: number; z: number };

function Player({ lane }: { lane: number }) {
  const ref = useRef<THREE.Group>(null);
  const targetX = LANES[lane];

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.x += (targetX - ref.current.position.x) * Math.min(1, delta * 15);
    ref.current.rotation.z = (targetX - ref.current.position.x) * 0.3;
  });

  return (
    <group ref={ref} position={[targetX, 0.5, 0]}>
      <RoundedBox args={[0.8, 0.8, 0.8]} radius={0.08} smoothness={4}>
        <meshPhysicalMaterial
          color="#06b6d4"
          metalness={0.3}
          roughness={0.05}
          clearcoat={1}
          emissive="#06b6d4"
          emissiveIntensity={0.4}
          transmission={0.3}
          thickness={0.5}
        />
      </RoundedBox>
      {/* Glow core */}
      <mesh>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

function ObstacleMesh({ obstacle, speed }: { obstacle: Obstacle; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const x = LANES[obstacle.lane];

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.z += speed * delta;
  });

  return (
    <RoundedBox
      ref={ref}
      args={[0.9, 1.2, 0.9]}
      radius={0.06}
      smoothness={4}
      position={[x, 0.6, obstacle.z]}
    >
      <meshPhysicalMaterial
        color="#ef4444"
        metalness={0.2}
        roughness={0.1}
        transmission={0.5}
        thickness={0.3}
        clearcoat={1}
        emissive="#ef4444"
        emissiveIntensity={0.2}
      />
    </RoundedBox>
  );
}

function Track() {
  const ref = useRef<THREE.Group>(null);

  return (
    <group ref={ref}>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -20]}>
        <planeGeometry args={[6, 80]} />
        <meshStandardMaterial color="#0a0a1a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Lane divider rails - more visible */}
      {[-2.25, -0.75, 0.75, 2.25].map((x, i) => (
        <group key={i}>
          {/* Main rail line */}
          <mesh position={[x, 0.02, -20]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.08, 80]} />
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.7} />
          </mesh>
          {/* Glow effect for rails */}
          <mesh position={[x, 0.015, -20]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.2, 80]} />
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.2} />
          </mesh>
        </group>
      ))}
      {/* Lane center markers */}
      {LANES.map((x, i) => (
        <mesh key={`lane${i}`} position={[x, 0.01, -20]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.8, 80]} />
          <meshBasicMaterial color={i === 1 ? "#1e3a5f" : "#0f1729"} transparent opacity={0.5} />
        </mesh>
      ))}
      {/* Moving ground lines for speed effect */}
      {Array.from({ length: 40 }, (_, i) => (
        <mesh key={`g${i}`} position={[0, 0.01, -i * 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.5, 0.03]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.25} />
        </mesh>
      ))}
    </group>
  );
}

function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 3.5, 5);
    camera.lookAt(0, 0.5, -8);
  }, [camera]);
  return null;
}

function GameScene({
  lane,
  obstacles,
  speed,
}: {
  lane: number;
  obstacles: Obstacle[];
  speed: number;
}) {
  return (
    <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
      <color attach="background" args={["#0a0a12"]} />
      <fog attach="fog" args={["#0a0a12", 15, 45]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 8, 5]} intensity={0.8} color="#e0e0ff" />
      <pointLight position={[LANES[lane], 2, 0]} intensity={1.2} color="#06b6d4" distance={8} />
      <Suspense fallback={null}>
        <CameraSetup />
        <Track />
        <Player lane={lane} />
        {obstacles.map((o) => (
          <ObstacleMesh key={o.id} obstacle={o} speed={speed} />
        ))}
        <Environment preset="night" />
      </Suspense>
      <EffectComposer>
        <Bloom luminanceThreshold={0.4} intensity={0.7} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}

export default function CubeRunnerGame() {
  const [lane, setLane] = useState(1);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const nextId = useRef(0);
  const speed = useRef(OBSTACLE_SPEED_INIT);
  const spawnTimer = useRef(0);
  const scoreRef = useRef(0);
  const laneRef = useRef(1);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    laneRef.current = lane;
  }, [lane]);

  // Game loop
  useEffect(() => {
    if (!started || gameOver) return;
    let lastTime = performance.now();

    const loop = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Increase speed over time
      speed.current = OBSTACLE_SPEED_INIT + scoreRef.current * 0.005;
      const spawnInterval = Math.max(0.4, SPAWN_INTERVAL_INIT - scoreRef.current * 0.002);

      // Spawn
      spawnTimer.current += delta;
      if (spawnTimer.current >= spawnInterval) {
        spawnTimer.current = 0;
        const obLane = Math.floor(Math.random() * 3);
        setObstacles((prev) => [...prev, { id: nextId.current++, lane: obLane, z: -50 }]);
      }

      // Move & collision
      setObstacles((prev) => {
        const moved = prev
          .map((o) => ({ ...o, z: o.z + speed.current * delta }))
          .filter((o) => o.z < 10);

        // Check collision
        for (const o of moved) {
          if (o.lane === laneRef.current && o.z > -1 && o.z < 1.5) {
            setGameOver(true);
            return moved;
          }
        }
        return moved;
      });

      // Score
      scoreRef.current += delta * 10;
      setScore(Math.floor(scoreRef.current));

      if (!gameOver) requestAnimationFrame(loop);
    };

    const frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [started, gameOver]);

  const moveLeft = useCallback(() => {
    if (gameOver) return;
    setLane((l) => Math.max(0, l - 1));
  }, [gameOver]);

  const moveRight = useCallback(() => {
    if (gameOver) return;
    setLane((l) => Math.min(2, l + 1));
  }, [gameOver]);

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") moveLeft();
      if (e.key === "ArrowRight" || e.key === "d") moveRight();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [moveLeft, moveRight]);

  const handleRestart = useCallback(() => {
    setLane(1);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
    setStarted(true);
    scoreRef.current = 0;
    speed.current = OBSTACLE_SPEED_INIT;
    spawnTimer.current = 0;
    nextId.current = 0;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStart.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStart.current;
      if (Math.abs(dx) > 30) {
        if (dx < 0) moveLeft();
        else moveRight();
      }
      touchStart.current = null;
    },
    [moveLeft, moveRight]
  );

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl select-none"
      style={{ height: "min(70vh, 560px)", background: "#0a0a12", touchAction: "none" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <GameScene lane={lane} obstacles={obstacles} speed={speed.current} />

      {!started && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a12]/85 backdrop-blur-xl">
          <h2
            className="text-4xl font-extralight uppercase tracking-[0.3em] text-slate-200 sm:text-5xl"
            style={{ textShadow: "0 0 40px rgba(6,182,212,0.6)" }}
          >
            Cube Runner
          </h2>
          <p className="mt-2 text-xs font-light uppercase tracking-[0.5em] text-cyan-400">
            Dodge the Obstacles
          </p>
          <button
            onClick={() => setStarted(true)}
            className="mt-8 rounded-xl border border-cyan-500/40 bg-cyan-500/15 px-8 py-3 text-sm uppercase tracking-[0.3em] text-slate-200 transition-all hover:bg-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
          >
            Start Game
          </button>
        </div>
      )}

      {gameOver && started && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a12]/90 backdrop-blur-2xl">
          <h2
            className="text-3xl font-extralight uppercase tracking-[0.25em] text-rose-400"
            style={{ textShadow: "0 0 40px rgba(244,63,94,0.5)" }}
          >
            Game Over
          </h2>
          <div className="mt-4 rounded-xl border border-cyan-500/30 bg-[#0f0f1e]/70 px-6 py-3 text-center backdrop-blur-xl">
            <div className="text-[0.6rem] uppercase tracking-[0.25em] text-cyan-400">Distance</div>
            <div className="text-3xl font-extralight text-slate-200">{score}m</div>
          </div>
          <button
            onClick={handleRestart}
            className="mt-6 rounded-xl border border-cyan-500/40 bg-cyan-500/15 px-8 py-3 text-sm uppercase tracking-[0.3em] text-slate-200 transition-all hover:bg-cyan-500/30"
          >
            Play Again
          </button>
        </div>
      )}

      {started && !gameOver && (
        <>
          <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex justify-between p-4">
            <div className="rounded-xl border border-cyan-500/20 bg-[#0f0f1e]/70 px-4 py-2 backdrop-blur-xl">
              <div className="text-[0.6rem] uppercase tracking-[0.25em] text-cyan-400">Distance</div>
              <div className="text-lg font-extralight text-slate-200">{score}m</div>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-[#0f0f1e]/70 px-4 py-2 backdrop-blur-xl">
              <div className="text-[0.6rem] uppercase tracking-[0.25em] text-cyan-400">Speed</div>
              <div className="text-lg font-extralight text-slate-200">{speed.current.toFixed(1)}</div>
            </div>
          </div>
          {/* Mobile controls - enhanced visibility */}
          <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-4">
            <button
              onClick={moveLeft}
              className="flex h-16 w-20 items-center justify-center rounded-2xl border-2 border-cyan-400/50 bg-gradient-to-b from-cyan-500/30 to-cyan-600/20 text-3xl text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-xl active:scale-95 active:bg-cyan-500/50"
            >
              ◀
            </button>
            <button
              onClick={moveRight}
              className="flex h-16 w-20 items-center justify-center rounded-2xl border-2 border-cyan-400/50 bg-gradient-to-b from-cyan-500/30 to-cyan-600/20 text-3xl text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-xl active:scale-95 active:bg-cyan-500/50"
            >
              ▶
            </button>
          </div>
          {/* Keyboard hint */}
          <div className="pointer-events-none absolute bottom-24 left-0 right-0 z-10 flex justify-center">
            <div className="rounded-lg bg-black/40 px-3 py-1 text-xs text-cyan-400/70 backdrop-blur-sm">
              ← → 또는 A D 키로 이동
            </div>
          </div>
        </>
      )}
    </div>
  );
}
