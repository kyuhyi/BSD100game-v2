"use client";

import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, RoundedBox } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

type Block = { x: number; z: number; w: number; d: number; y: number };

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6"];

function StackBlock({ block, index, total }: { block: Block; index: number; total: number }) {
  const color = COLORS[index % COLORS.length];
  const isTop = index === total - 1;
  return (
    <RoundedBox args={[block.w, 0.3, block.d]} radius={0.03} smoothness={4} position={[block.x, block.y, block.z]}>
      <meshPhysicalMaterial
        color={color}
        metalness={0.2}
        roughness={0.1}
        transmission={isTop ? 0.6 : 0.3}
        thickness={0.3}
        clearcoat={1}
        envMapIntensity={1.5}
      />
    </RoundedBox>
  );
}

function MovingBlock({ block, direction, speed }: { block: Block; direction: "x" | "z"; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const color = COLORS[(block.y / 0.3) % COLORS.length];

  useFrame((_, delta) => {
    if (!ref.current) return;
    if (direction === "x") {
      ref.current.position.x += speed * delta;
      if (ref.current.position.x > 3) speed = -Math.abs(speed);
      if (ref.current.position.x < -3) speed = Math.abs(speed);
      // Store speed on userData for reading back
      ref.current.userData.speed = speed;
    } else {
      ref.current.position.z += speed * delta;
      if (ref.current.position.z > 3) speed = -Math.abs(speed);
      if (ref.current.position.z < -3) speed = Math.abs(speed);
      ref.current.userData.speed = speed;
    }
  });

  return (
    <RoundedBox
      ref={ref}
      args={[block.w, 0.3, block.d]}
      radius={0.03}
      smoothness={4}
      position={[block.x, block.y, block.z]}
    >
      <meshPhysicalMaterial
        color={color}
        metalness={0.2}
        roughness={0.05}
        transmission={0.7}
        thickness={0.3}
        clearcoat={1}
        emissive={color}
        emissiveIntensity={0.3}
        envMapIntensity={2}
      />
    </RoundedBox>
  );
}

function CameraFollow({ targetY }: { targetY: number }) {
  useFrame(({ camera }) => {
    const ty = Math.max(targetY + 4, 5);
    camera.position.y += (ty - camera.position.y) * 0.05;
    camera.lookAt(0, targetY - 1, 0);
  });
  return null;
}

function Scene({ stack, moving, direction, speed, targetY }: {
  stack: Block[];
  moving: Block | null;
  direction: "x" | "z";
  speed: number;
  targetY: number;
}) {
  return (
    <Canvas camera={{ position: [4, 5, 4], fov: 50 }} gl={{ antialias: true }} dpr={[1, 2]}>
      <color attach="background" args={["#0a0a12"]} />
      <fog attach="fog" args={["#0a0a12", 15, 30]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={1} color="#e0e0ff" />
      <pointLight position={[0, targetY + 3, 0]} intensity={1} color="#6366f1" />
      <Suspense fallback={null}>
        {stack.map((b, i) => (
          <StackBlock key={i} block={b} index={i} total={stack.length} />
        ))}
        {moving && <MovingBlock block={moving} direction={direction} speed={speed} />}
        <Environment preset="night" />
      </Suspense>
      <CameraFollow targetY={targetY} />
      <EffectComposer>
        <Bloom luminanceThreshold={0.5} intensity={0.6} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}

export default function NeonStackGame() {
  const [stack, setStack] = useState<Block[]>([{ x: 0, z: 0, w: 2.5, d: 2.5, y: 0 }]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const speedRef = useRef(3);
  const dirRef = useRef<"x" | "z">("x");

  const top = stack[stack.length - 1];
  const movingY = top.y + 0.3;
  const moving = started && !gameOver ? {
    x: dirRef.current === "x" ? -3 : top.x,
    z: dirRef.current === "z" ? -3 : top.z,
    w: top.w,
    d: top.d,
    y: movingY,
  } : null;

  const handleDrop = useCallback(() => {
    if (gameOver) return;
    if (!started) { setStarted(true); return; }

    // Simulate where block currently is (approximate)
    const elapsed = performance.now() / 1000;
    const period = 6 / speedRef.current;
    const phase = (elapsed % period) / period;
    const pos = -3 + phase * 6;
    const currentPos = pos > 3 ? 6 - pos : pos;

    const prev = stack[stack.length - 1];
    let newBlock: Block;

    if (dirRef.current === "x") {
      const overlap = prev.w - Math.abs(currentPos - prev.x);
      if (overlap <= 0) { setGameOver(true); return; }
      const newX = (currentPos + prev.x) / 2 + (currentPos > prev.x ? overlap / 4 : -overlap / 4);
      newBlock = { x: newX, z: prev.z, w: Math.min(overlap, prev.w), d: prev.d, y: movingY };
    } else {
      const overlap = prev.d - Math.abs(currentPos - prev.z);
      if (overlap <= 0) { setGameOver(true); return; }
      const newZ = (currentPos + prev.z) / 2 + (currentPos > prev.z ? overlap / 4 : -overlap / 4);
      newBlock = { x: prev.x, z: newZ, w: prev.w, d: Math.min(overlap, prev.d), y: movingY };
    }

    setStack((s) => [...s, newBlock]);
    setScore((s) => s + 1);
    dirRef.current = dirRef.current === "x" ? "z" : "x";
    speedRef.current = Math.min(3 + score * 0.15, 8);
  }, [stack, score, gameOver, started, movingY]);

  const handleRestart = useCallback(() => {
    setStack([{ x: 0, z: 0, w: 2.5, d: 2.5, y: 0 }]);
    setScore(0);
    setGameOver(false);
    setStarted(true);
    speedRef.current = 3;
    dirRef.current = "x";
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ height: "min(70vh, 560px)", background: "#0a0a12" }} onClick={started && !gameOver ? handleDrop : undefined}>
      <Scene stack={stack} moving={moving} direction={dirRef.current} speed={speedRef.current} targetY={top.y} />

      {!started && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a12]/85 backdrop-blur-xl">
          <h2 className="text-4xl font-extralight uppercase tracking-[0.3em] text-slate-200 sm:text-5xl" style={{ textShadow: "0 0 40px rgba(99,102,241,0.6)" }}>
            Neon Stack
          </h2>
          <p className="mt-2 text-xs font-light uppercase tracking-[0.5em] text-indigo-400">3D Block Stacking</p>
          <button onClick={() => setStarted(true)} className="mt-8 rounded-xl border border-indigo-500/40 bg-indigo-500/15 px-8 py-3 text-sm uppercase tracking-[0.3em] text-slate-200 backdrop-blur-md transition-all hover:bg-indigo-500/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]">
            Tap to Start
          </button>
        </div>
      )}

      {gameOver && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a12]/90 backdrop-blur-2xl">
          <h2 className="text-3xl font-extralight uppercase tracking-[0.25em] text-rose-400" style={{ textShadow: "0 0 40px rgba(244,63,94,0.5)" }}>
            Game Over
          </h2>
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-[#0f0f1e]/70 px-6 py-3 text-center backdrop-blur-xl">
            <div className="text-[0.6rem] uppercase tracking-[0.25em] text-rose-400">Score</div>
            <div className="text-3xl font-extralight text-slate-200">{score}</div>
          </div>
          <button onClick={handleRestart} className="mt-6 rounded-xl border border-indigo-500/40 bg-indigo-500/15 px-8 py-3 text-sm uppercase tracking-[0.3em] text-slate-200 transition-all hover:bg-indigo-500/30">
            Play Again
          </button>
        </div>
      )}

      {started && !gameOver && (
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex justify-center p-4">
          <div className="rounded-xl border border-indigo-500/20 bg-[#0f0f1e]/70 px-6 py-2 backdrop-blur-xl">
            <div className="text-center text-2xl font-extralight tracking-wider text-slate-200">{score}</div>
          </div>
        </div>
      )}
    </div>
  );
}
