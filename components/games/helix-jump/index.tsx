"use client";

import { useState, useCallback, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const RING_COUNT = 20;
const RING_SPACING = 1.2;
const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316", "#22c55e", "#06b6d4"];

type Ring = { y: number; gapStart: number; gapSize: number; color: string };

function generateRings(): Ring[] {
  return Array.from({ length: RING_COUNT }, (_, i) => ({
    y: -i * RING_SPACING - 3,
    gapStart: Math.random() * Math.PI * 2,
    gapSize: 0.8 + Math.random() * 0.6,
    color: COLORS[i % COLORS.length],
  }));
}

function PlatformRing({ ring, rotation }: { ring: Ring; rotation: number }) {
  const segments = 32;
  const radius = 2.2;
  const meshes = [];

  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2 + rotation;
    const relAngle = ((angle - ring.gapStart) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    if (relAngle < ring.gapSize) continue;

    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    meshes.push(
      <mesh key={i} position={[x, ring.y, z]} rotation={[0, -angle, 0]}>
        <boxGeometry args={[0.5, 0.2, 0.8]} />
        <meshPhysicalMaterial
          color={ring.color}
          metalness={0.2}
          roughness={0.1}
          transmission={0.4}
          thickness={0.2}
          clearcoat={1}
        />
      </mesh>
    );
  }
  return <group>{meshes}</group>;
}

function CenterPole() {
  return (
    <mesh position={[0, -RING_COUNT * RING_SPACING / 2, 0]}>
      <cylinderGeometry args={[0.15, 0.15, RING_COUNT * RING_SPACING + 10, 16]} />
      <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
    </mesh>
  );
}

function Ball({ ballY, ballAngle }: { ballY: number; ballAngle: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const targetY = useRef(ballY);
  const targetAngle = useRef(ballAngle);

  useEffect(() => { targetY.current = ballY; targetAngle.current = ballAngle; }, [ballY, ballAngle]);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.y += (targetY.current - ref.current.position.y) * 0.15;
    const x = Math.cos(targetAngle.current) * 2.2;
    const z = Math.sin(targetAngle.current) * 2.2;
    ref.current.position.x += (x - ref.current.position.x) * 0.15;
    ref.current.position.z += (z - ref.current.position.z) * 0.15;
  });

  return (
    <mesh ref={ref} position={[Math.cos(ballAngle) * 2.2, ballY, Math.sin(ballAngle) * 2.2]}>
      <sphereGeometry args={[0.25, 32, 32]} />
      <meshPhysicalMaterial color="#f43f5e" metalness={0.3} roughness={0.05} clearcoat={1} emissive="#f43f5e" emissiveIntensity={0.5} />
    </mesh>
  );
}

function CameraTracker({ targetY }: { targetY: number }) {
  useFrame(({ camera }) => {
    const ty = targetY + 4;
    camera.position.y += (ty - camera.position.y) * 0.05;
    camera.lookAt(0, targetY - 2, 0);
  });
  return null;
}

function Scene({ rings, rotation, ballY, ballAngle }: {
  rings: Ring[];
  rotation: number;
  ballY: number;
  ballAngle: number;
}) {
  return (
    <Canvas camera={{ position: [5, 3, 5], fov: 50 }} gl={{ antialias: true }} dpr={[1, 2]}>
      <color attach="background" args={["#0a0a12"]} />
      <fog attach="fog" args={["#0a0a12", 10, 25]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={1} color="#e0e0ff" />
      <pointLight position={[0, ballY + 2, 0]} intensity={1} color="#f43f5e" />
      <Suspense fallback={null}>
        <CenterPole />
        {rings.map((r, i) => (
          <PlatformRing key={i} ring={r} rotation={rotation} />
        ))}
        <Ball ballY={ballY} ballAngle={ballAngle} />
        <Environment preset="night" />
      </Suspense>
      <CameraTracker targetY={ballY} />
      <EffectComposer>
        <Bloom luminanceThreshold={0.4} intensity={0.6} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}

export default function HelixJumpGame() {
  const [rings] = useState<Ring[]>(generateRings);
  const [rotation, setRotation] = useState(0);
  const [ballLevel, setBallLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const dragging = useRef(false);
  const lastX = useRef(0);

  const ballAngle = 0;
  const ballY = ballLevel === 0 ? 0 : (rings[ballLevel - 1]?.y ?? 0) + 0.35;

  // Ball falling logic
  useEffect(() => {
    if (!started || gameOver) return;
    const interval = setInterval(() => {
      setBallLevel((prev) => {
        const nextLevel = prev + 1;
        if (nextLevel > rings.length) {
          setGameOver(true);
          return prev;
        }
        // Check if ball hits platform or goes through gap
        const ring = rings[nextLevel - 1];
        if (!ring) return prev;
        const ballAng = ((ballAngle - rotation) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const relAngle = ((ballAng - ring.gapStart) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        if (relAngle < ring.gapSize) {
          // Through the gap!
          setScore((s) => s + 1);
          return nextLevel;
        } else {
          // Hit platform - game over
          setGameOver(true);
          return prev;
        }
      });
    }, 600);
    return () => clearInterval(interval);
  }, [started, gameOver, rings, rotation, ballAngle]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || gameOver) return;
    const dx = e.clientX - lastX.current;
    setRotation((r) => r + dx * 0.01);
    lastX.current = e.clientX;
  }, [gameOver]);

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const handleRestart = useCallback(() => {
    setBallLevel(0);
    setScore(0);
    setGameOver(false);
    setRotation(0);
    setStarted(true);
  }, []);

  const isWin = score >= RING_COUNT;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl select-none"
      style={{ height: "min(70vh, 560px)", background: "#0a0a12", touchAction: "none" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Scene rings={rings} rotation={rotation} ballY={ballY} ballAngle={ballAngle} />

      {!started && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a12]/85 backdrop-blur-xl">
          <h2 className="text-4xl font-extralight uppercase tracking-[0.3em] text-slate-200 sm:text-5xl" style={{ textShadow: "0 0 40px rgba(244,63,94,0.6)" }}>
            Helix Jump
          </h2>
          <p className="mt-2 text-xs font-light uppercase tracking-[0.5em] text-rose-400">Drag to Rotate</p>
          <button onClick={() => setStarted(true)} className="mt-8 rounded-xl border border-rose-500/40 bg-rose-500/15 px-8 py-3 text-sm uppercase tracking-[0.3em] text-slate-200 transition-all hover:bg-rose-500/30 hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]">
            Start Game
          </button>
        </div>
      )}

      {(gameOver || isWin) && started && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a12]/90 backdrop-blur-2xl">
          <h2 className={`text-3xl font-extralight uppercase tracking-[0.25em] ${isWin ? "text-emerald-500" : "text-rose-400"}`}>
            {isWin ? "You Win!" : "Game Over"}
          </h2>
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-[#0f0f1e]/70 px-6 py-3 text-center backdrop-blur-xl">
            <div className="text-[0.6rem] uppercase tracking-[0.25em] text-rose-400">Floors</div>
            <div className="text-3xl font-extralight text-slate-200">{score}</div>
          </div>
          <button onClick={handleRestart} className="mt-6 rounded-xl border border-rose-500/40 bg-rose-500/15 px-8 py-3 text-sm uppercase tracking-[0.3em] text-slate-200 transition-all hover:bg-rose-500/30">
            Play Again
          </button>
        </div>
      )}

      {started && !gameOver && !isWin && (
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex justify-center p-4">
          <div className="rounded-xl border border-rose-500/20 bg-[#0f0f1e]/70 px-6 py-2 backdrop-blur-xl">
            <div className="text-center text-2xl font-extralight tracking-wider text-slate-200">{score}/{RING_COUNT}</div>
          </div>
        </div>
      )}
    </div>
  );
}
