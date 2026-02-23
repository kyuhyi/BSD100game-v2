"use client";

import { useState, useCallback, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, RoundedBox } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const GAME_TIME = 60;
const FIELD_W = 6;

type FallingItem = {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: "gem" | "bomb";
  color: string;
  rotation: number;
};

const GEM_COLORS = ["#8b5cf6", "#eab308", "#ec4899", "#06b6d4", "#22c55e", "#f97316"];

function Gem({ item }: { item: FallingItem }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 2;
    ref.current.rotation.x += delta * 1.2;
  });

  return (
    <mesh ref={ref} position={[item.x, item.y, 0]}>
      <octahedronGeometry args={[0.35, 0]} />
      <meshPhysicalMaterial
        color={item.color}
        metalness={0.1}
        roughness={0.05}
        transmission={0.6}
        thickness={0.5}
        clearcoat={1}
        ior={2.4}
        emissive={item.color}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function Bomb({ item }: { item: FallingItem }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 3;
    ref.current.rotation.z += delta * 2;
  });

  return (
    <mesh ref={ref} position={[item.x, item.y, 0]}>
      <dodecahedronGeometry args={[0.35, 0]} />
      <meshPhysicalMaterial
        color="#ef4444"
        metalness={0.3}
        roughness={0.1}
        emissive="#ef4444"
        emissiveIntensity={0.6}
        clearcoat={1}
      />
    </mesh>
  );
}

function Basket({ basketX }: { basketX: number }) {
  const ref = useRef<THREE.Group>(null);
  const targetX = useRef(basketX);

  useEffect(() => {
    targetX.current = basketX;
  }, [basketX]);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x += (targetX.current - ref.current.position.x) * 0.2;
  });

  return (
    <group ref={ref} position={[basketX, -3.5, 0]}>
      <RoundedBox args={[1.4, 0.3, 0.8]} radius={0.05} smoothness={4}>
        <meshPhysicalMaterial
          color="#8b5cf6"
          metalness={0.7}
          roughness={0.1}
          clearcoat={1}
          emissive="#8b5cf6"
          emissiveIntensity={0.15}
        />
      </RoundedBox>
      {/* Left wall */}
      <RoundedBox args={[0.1, 0.5, 0.8]} radius={0.03} smoothness={4} position={[-0.65, 0.25, 0]}>
        <meshPhysicalMaterial color="#7c3aed" metalness={0.6} roughness={0.1} clearcoat={1} />
      </RoundedBox>
      {/* Right wall */}
      <RoundedBox args={[0.1, 0.5, 0.8]} radius={0.03} smoothness={4} position={[0.65, 0.25, 0]}>
        <meshPhysicalMaterial color="#7c3aed" metalness={0.6} roughness={0.1} clearcoat={1} />
      </RoundedBox>
    </group>
  );
}

function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0, 9);
    camera.lookAt(0, -0.5, 0);
  }, [camera]);
  return null;
}

function GameScene({ items, basketX }: { items: FallingItem[]; basketX: number }) {
  return (
    <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
      <color attach="background" args={["#0a0a12"]} />
      <fog attach="fog" args={["#0a0a12", 12, 25]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 8, 5]} intensity={0.8} color="#e0e0ff" />
      <pointLight position={[basketX, -2, 3]} intensity={0.8} color="#8b5cf6" distance={8} />
      <pointLight position={[0, 3, 3]} intensity={0.5} color="#eab308" distance={10} />
      <Suspense fallback={null}>
        <CameraSetup />
        <Basket basketX={basketX} />
        {items.map((item) =>
          item.type === "gem" ? (
            <Gem key={item.id} item={item} />
          ) : (
            <Bomb key={item.id} item={item} />
          )
        )}
        {/* Back wall */}
        <mesh position={[0, 0, -2]} rotation={[0, 0, 0]}>
          <planeGeometry args={[14, 12]} />
          <meshStandardMaterial color="#0a0a18" metalness={0.9} roughness={0.3} />
        </mesh>
        <Environment preset="night" />
      </Suspense>
      <EffectComposer>
        <Bloom luminanceThreshold={0.3} intensity={0.6} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}

export default function GemCatcherGame() {
  const [items, setItems] = useState<FallingItem[]>([]);
  const [basketX, setBasketX] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const nextId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const basketXRef = useRef(0);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);

  useEffect(() => {
    basketXRef.current = basketX;
  }, [basketX]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!started || gameOver) return;
      if (e.key === "ArrowLeft" || e.key === "a") {
        setBasketX((prev) => Math.max(-FIELD_W, prev - 0.5));
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        setBasketX((prev) => Math.min(FIELD_W, prev + 0.5));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [started, gameOver]);

  // Timer
  useEffect(() => {
    if (!started || gameOver) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started, gameOver]);

  // Game loop
  useEffect(() => {
    if (!started || gameOver) return;
    let spawnAccum = 0;
    let lastTime = performance.now();

    const loop = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      const elapsed = GAME_TIME - timeLeft;
      const spawnRate = Math.max(0.3, 0.8 - elapsed * 0.008);

      spawnAccum += delta;
      if (spawnAccum >= spawnRate) {
        spawnAccum = 0;
        const isBomb = Math.random() < 0.2;
        const color = GEM_COLORS[Math.floor(Math.random() * GEM_COLORS.length)];
        const newItem: FallingItem = {
          id: nextId.current++,
          x: (Math.random() - 0.5) * FIELD_W * 1.6,
          y: 5,
          speed: 2.5 + elapsed * 0.03,
          type: isBomb ? "bomb" : "gem",
          color,
          rotation: 0,
        };
        setItems((prev) => [...prev, newItem]);
      }

      // Move & catch
      setItems((prev) => {
        const alive: FallingItem[] = [];
        for (const item of prev) {
          const ny = item.y - item.speed * delta;
          // Check catch
          if (ny < -3.2 && ny > -4 && Math.abs(item.x - basketXRef.current) < 0.8) {
            if (item.type === "gem") {
              comboRef.current += 1;
              const multiplier = Math.min(comboRef.current, 5);
              scoreRef.current += 10 * multiplier;
              setScore(scoreRef.current);
              setCombo(comboRef.current);
            } else {
              comboRef.current = 0;
              scoreRef.current = Math.max(0, scoreRef.current - 30);
              setScore(scoreRef.current);
              setCombo(0);
            }
            continue;
          }
          if (ny < -5) {
            if (item.type === "gem") {
              comboRef.current = 0;
              setCombo(0);
            }
            continue;
          }
          alive.push({ ...item, y: ny });
        }
        return alive;
      });

      if (!gameOver) requestAnimationFrame(loop);
    };

    const frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [started, gameOver, timeLeft]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!started || gameOver || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const newX = (relX - 0.5) * FIELD_W * 1.8;
      setBasketX(Math.max(-FIELD_W, Math.min(FIELD_W, newX)));
    },
    [started, gameOver]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!started || gameOver || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relX = (e.touches[0].clientX - rect.left) / rect.width;
      const newX = (relX - 0.5) * FIELD_W * 1.8;
      setBasketX(Math.max(-FIELD_W, Math.min(FIELD_W, newX)));
    },
    [started, gameOver]
  );

  const handleRestart = useCallback(() => {
    setItems([]);
    setBasketX(0);
    setScore(0);
    setCombo(0);
    setTimeLeft(GAME_TIME);
    setGameOver(false);
    setStarted(true);
    scoreRef.current = 0;
    comboRef.current = 0;
    nextId.current = 0;
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl select-none"
      style={{ height: "min(70vh, 560px)", background: "#0a0a12", touchAction: "none" }}
      onPointerMove={handlePointerMove}
      onTouchMove={handleTouchMove}
    >
      <GameScene items={items} basketX={basketX} />

      {!started && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a12]/85 backdrop-blur-xl">
          <h2
            className="text-4xl font-extralight uppercase tracking-[0.3em] text-slate-200 sm:text-5xl"
            style={{ textShadow: "0 0 40px rgba(139,92,246,0.6)" }}
          >
            Gem Catcher
          </h2>
          <p className="mt-2 text-xs font-light uppercase tracking-[0.5em] text-purple-400">
            Catch the Gems
          </p>
          <button
            onClick={() => setStarted(true)}
            className="mt-8 rounded-xl border border-purple-500/40 bg-purple-500/15 px-8 py-3 text-sm uppercase tracking-[0.3em] text-slate-200 transition-all hover:bg-purple-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]"
          >
            Start Game
          </button>
        </div>
      )}

      {gameOver && started && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a12]/90 backdrop-blur-2xl">
          <h2
            className="text-3xl font-extralight uppercase tracking-[0.25em] text-amber-400"
            style={{ textShadow: "0 0 40px rgba(234,179,8,0.5)" }}
          >
            Time&apos;s Up!
          </h2>
          <div className="mt-4 rounded-xl border border-purple-500/30 bg-[#0f0f1e]/70 px-6 py-3 text-center backdrop-blur-xl">
            <div className="text-[0.6rem] uppercase tracking-[0.25em] text-purple-400">Score</div>
            <div className="text-3xl font-extralight text-slate-200">{score}</div>
          </div>
          <button
            onClick={handleRestart}
            className="mt-6 rounded-xl border border-purple-500/40 bg-purple-500/15 px-8 py-3 text-sm uppercase tracking-[0.3em] text-slate-200 transition-all hover:bg-purple-500/30"
          >
            Play Again
          </button>
        </div>
      )}

      {started && !gameOver && (
        <>
          <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex justify-between p-4">
            <div className="rounded-xl border border-purple-500/20 bg-[#0f0f1e]/70 px-4 py-2 backdrop-blur-xl">
              <div className="text-[0.6rem] uppercase tracking-[0.25em] text-purple-400">Score</div>
              <div className="text-lg font-extralight text-slate-200">{score}</div>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-[#0f0f1e]/70 px-4 py-2 backdrop-blur-xl">
              <div className="text-[0.6rem] uppercase tracking-[0.25em] text-amber-400">Combo</div>
              <div className="text-lg font-extralight text-slate-200">x{combo}</div>
            </div>
            <div className="rounded-xl border border-purple-500/20 bg-[#0f0f1e]/70 px-4 py-2 backdrop-blur-xl">
              <div className="text-[0.6rem] uppercase tracking-[0.25em] text-purple-400">Time</div>
              <div className="text-lg font-extralight text-slate-200">{timeLeft}s</div>
            </div>
          </div>
          {/* Mobile button controls */}
          <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-between px-4">
            <button
              onPointerDown={() => setBasketX((prev) => Math.max(-FIELD_W, prev - 0.8))}
              className="flex h-16 w-20 items-center justify-center rounded-2xl border-2 border-purple-400/50 bg-gradient-to-b from-purple-500/30 to-purple-600/20 text-3xl text-purple-200 shadow-[0_0_20px_rgba(139,92,246,0.3)] backdrop-blur-xl active:scale-95 active:bg-purple-500/50"
            >
              ◀
            </button>
            <div className="rounded-lg bg-black/40 px-3 py-1 text-xs text-purple-400/70 backdrop-blur-sm self-center">
              드래그 또는 ← → 키
            </div>
            <button
              onPointerDown={() => setBasketX((prev) => Math.min(FIELD_W, prev + 0.8))}
              className="flex h-16 w-20 items-center justify-center rounded-2xl border-2 border-purple-400/50 bg-gradient-to-b from-purple-500/30 to-purple-600/20 text-3xl text-purple-200 shadow-[0_0_20px_rgba(139,92,246,0.3)] backdrop-blur-xl active:scale-95 active:bg-purple-500/50"
            >
              ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
}
