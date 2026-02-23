"use client";

import { useState, useCallback, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const GAME_TIME = 60;
const BALLOON_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"];

type Balloon = {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  color: string;
  scale: number;
  popped: boolean;
};

type Arrow = {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
};

function BalloonMesh({ balloon }: { balloon: Balloon }) {
  const ref = useRef<THREE.Group>(null);
  const wobble = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    if (!ref.current || balloon.popped) return;
    wobble.current += delta * 1.5;
    ref.current.position.x = balloon.x + Math.sin(wobble.current) * 0.15;
    ref.current.position.y = balloon.y + Math.cos(wobble.current * 1.3) * 0.1;
    ref.current.position.z = balloon.z;
    ref.current.rotation.z = Math.sin(wobble.current * 0.5) * 0.15;
  });

  if (balloon.popped) return null;

  return (
    <group ref={ref} position={[balloon.x, balloon.y, balloon.z]}>
      {/* Balloon body - bigger */}
      <mesh scale={[balloon.scale, balloon.scale * 1.3, balloon.scale]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshPhysicalMaterial
          color={balloon.color}
          metalness={0.1}
          roughness={0.2}
          transmission={0.3}
          thickness={0.2}
          clearcoat={1}
          emissive={balloon.color}
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Balloon knot */}
      <mesh position={[0, -0.45 * balloon.scale, 0]} scale={balloon.scale * 0.35}>
        <coneGeometry args={[0.2, 0.3, 8]} />
        <meshStandardMaterial color={balloon.color} />
      </mesh>
      {/* String */}
      <mesh position={[0, -0.7 * balloon.scale, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.6 * balloon.scale, 4]} />
        <meshBasicMaterial color="#888888" />
      </mesh>
    </group>
  );
}

function ArrowMesh({ arrow }: { arrow: Arrow }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.set(arrow.x, arrow.y, arrow.z);
    // Point arrow in direction of travel
    const dir = new THREE.Vector3(arrow.vx, arrow.vy, arrow.vz).normalize();
    ref.current.lookAt(
      arrow.x + dir.x,
      arrow.y + dir.y,
      arrow.z + dir.z
    );
  });

  return (
    <group ref={ref}>
      {/* Arrow shaft */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Arrow head */}
      <mesh position={[0, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.1, 0.25, 8]} />
        <meshPhysicalMaterial
          color="#fbbf24"
          metalness={0.9}
          roughness={0.1}
          emissive="#fbbf24"
          emissiveIntensity={0.8}
        />
      </mesh>
      {/* Trail effect - simple glow */}
      <mesh position={[0, 0, -0.3]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function Crosshair({ targetX, targetY }: { targetX: number; targetY: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x = targetX;
    ref.current.position.y = targetY;
  });

  return (
    <group ref={ref} position={[0, 0, -8]}>
      {/* Outer ring */}
      <mesh>
        <ringGeometry args={[0.3, 0.38, 32]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} />
      </mesh>
      {/* Inner dot */}
      <mesh>
        <circleGeometry args={[0.08, 16]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      {/* Cross lines */}
      <mesh position={[0, 0.5, 0]}>
        <planeGeometry args={[0.04, 0.3]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <planeGeometry args={[0.04, 0.3]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0.5, 0, 0]}>
        <planeGeometry args={[0.3, 0.04]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.7} />
      </mesh>
      <mesh position={[-0.5, 0, 0]}>
        <planeGeometry args={[0.3, 0.04]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

function GameScene({
  balloons,
  arrows,
  targetX,
  targetY,
}: {
  balloons: Balloon[];
  arrows: Arrow[];
  targetX: number;
  targetY: number;
}) {
  return (
    <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
      <color attach="background" args={["#1a1a2e"]} />
      <fog attach="fog" args={["#1a1a2e", 20, 40]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} color="#fff5e0" />
      <pointLight position={[0, 5, 0]} intensity={0.6} color="#fbbf24" distance={20} />
      <Suspense fallback={null}>
        <CameraSetup />
        {balloons.map((b) => (
          <BalloonMesh key={b.id} balloon={b} />
        ))}
        {arrows.map((a) => (
          <ArrowMesh key={a.id} arrow={a} />
        ))}
        <Crosshair targetX={targetX} targetY={targetY} />
        {/* Background - night sky */}
        <mesh position={[0, 0, -15]}>
          <planeGeometry args={[50, 30]} />
          <meshBasicMaterial color="#0f0f1e" />
        </mesh>
        {/* Stars */}
        {Array.from({ length: 80 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 40,
              (Math.random() - 0.5) * 25,
              -14,
            ]}
          >
            <circleGeometry args={[0.03 + Math.random() * 0.03, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.3 + Math.random() * 0.5} />
          </mesh>
        ))}
        <Environment preset="night" />
      </Suspense>
      <EffectComposer>
        <Bloom luminanceThreshold={0.4} intensity={0.4} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}

export default function BalloonArcherGame() {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [targetX, setTargetX] = useState(0);
  const [targetY, setTargetY] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const nextBalloonId = useRef(0);
  const nextArrowId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const balloonsRef = useRef<Balloon[]>([]);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);

  useEffect(() => {
    balloonsRef.current = balloons;
  }, [balloons]);

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

  // Spawn balloons - VERY SLOW
  useEffect(() => {
    if (!started || gameOver) return;
    const spawnBalloon = () => {
      const balloon: Balloon = {
        id: nextBalloonId.current++,
        x: (Math.random() - 0.5) * 12, // spread across screen
        y: -6 + Math.random() * 2, // start from bottom
        z: -8 - Math.random() * 4, // in the distance
        vx: (Math.random() - 0.5) * 0.3, // very slow horizontal drift
        vy: 0.2 + Math.random() * 0.15, // very slow rise
        color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
        scale: 1.0 + Math.random() * 0.4, // bigger balloons
        popped: false,
      };
      setBalloons((prev) => [...prev, balloon]);
    };
    const interval = setInterval(spawnBalloon, 1500); // less frequent
    // Spawn initial balloons
    for (let i = 0; i < 5; i++) {
      setTimeout(() => spawnBalloon(), i * 300);
    }
    return () => clearInterval(interval);
  }, [started, gameOver]);

  // Game loop
  useEffect(() => {
    if (!started || gameOver) return;
    let lastTime = performance.now();

    const loop = () => {
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Move balloons - very slowly
      setBalloons((prev) =>
        prev
          .map((b) => ({
            ...b,
            x: b.x + b.vx * delta,
            y: b.y + b.vy * delta,
          }))
          .filter((b) => !b.popped && b.y < 10 && Math.abs(b.x) < 15)
      );

      // Move arrows and check collisions
      setArrows((prev) => {
        const remaining: Arrow[] = [];
        for (const arrow of prev) {
          const newArrow = {
            ...arrow,
            x: arrow.x + arrow.vx * delta,
            y: arrow.y + arrow.vy * delta,
            z: arrow.z + arrow.vz * delta,
          };

          // Check collision with balloons
          let hit = false;
          setBalloons((balloons) => {
            const updated = balloons.map((b) => {
              if (b.popped) return b;
              const dist = Math.sqrt(
                (newArrow.x - b.x) ** 2 +
                (newArrow.y - b.y) ** 2 +
                (newArrow.z - b.z) ** 2
              );
              // Very generous hit detection
              if (dist < 1.2 * b.scale) {
                hit = true;
                comboRef.current += 1;
                const multiplier = Math.min(comboRef.current, 5);
                scoreRef.current += 10 * multiplier;
                setScore(scoreRef.current);
                setCombo(comboRef.current);
                return { ...b, popped: true };
              }
              return b;
            });
            return updated;
          });

          // Keep arrow if still in bounds
          if (!hit && newArrow.z > -20 && newArrow.y > -10 && newArrow.y < 15) {
            remaining.push(newArrow);
          } else if (!hit && newArrow.z <= -20) {
            // Missed - reset combo
            comboRef.current = 0;
            setCombo(0);
          }
        }
        return remaining;
      });

      if (!gameOver) requestAnimationFrame(loop);
    };

    const frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [started, gameOver]);

  // Mouse/touch aim - WIDE RANGE
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!started || gameOver || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;
      // Map to much wider range (-8 to 8 for X, -5 to 5 for Y)
      setTargetX((relX - 0.5) * 16);
      setTargetY((0.5 - relY) * 10);
    },
    [started, gameOver]
  );

  // Shoot arrow
  const shoot = useCallback(() => {
    if (!started || gameOver) return;
    
    // Arrow starts from bottom center and goes toward target
    const arrow: Arrow = {
      id: nextArrowId.current++,
      x: 0,
      y: -4,
      z: 8,
      vx: targetX * 1.5, // horizontal direction to target
      vy: targetY * 1.5 + 3, // vertical direction to target
      vz: -20, // forward speed
    };
    setArrows((prev) => [...prev, arrow]);
  }, [started, gameOver, targetX, targetY]);

  // Keyboard controls
  useEffect(() => {
    const step = 0.8;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!started || gameOver) return;
      if (e.key === "ArrowLeft" || e.key === "a") setTargetX((v) => Math.max(-8, v - step));
      if (e.key === "ArrowRight" || e.key === "d") setTargetX((v) => Math.min(8, v + step));
      if (e.key === "ArrowUp" || e.key === "w") setTargetY((v) => Math.min(5, v + step));
      if (e.key === "ArrowDown" || e.key === "s") setTargetY((v) => Math.max(-5, v - step));
      if (e.key === " ") shoot();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [started, gameOver, shoot]);

  const handleRestart = useCallback(() => {
    setBalloons([]);
    setArrows([]);
    setTargetX(0);
    setTargetY(0);
    setScore(0);
    setCombo(0);
    setTimeLeft(GAME_TIME);
    setGameOver(false);
    setStarted(true);
    scoreRef.current = 0;
    comboRef.current = 0;
    nextBalloonId.current = 0;
    nextArrowId.current = 0;
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl select-none"
      style={{ height: "min(70vh, 560px)", background: "#1a1a2e", touchAction: "none" }}
      onPointerMove={handlePointerMove}
      onClick={shoot}
    >
      <GameScene
        balloons={balloons}
        arrows={arrows}
        targetX={targetX}
        targetY={targetY}
      />

      {!started && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#1a1a2e]/90 backdrop-blur-xl">
          <h2
            className="text-4xl font-bold text-white sm:text-5xl"
            style={{ textShadow: "0 0 40px rgba(251,191,36,0.6)" }}
          >
            🎯 풍선 사냥꾼
          </h2>
          <p className="mt-2 text-sm text-amber-400">
            Balloon Archer
          </p>
          <div className="mt-6 text-center text-sm text-white/70">
            <p>마우스로 조준 → 클릭으로 발사!</p>
            <p className="mt-1 text-xs text-white/50">키보드: WASD/방향키 + 스페이스</p>
          </div>
          <button
            onClick={() => setStarted(true)}
            className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/20 px-8 py-3 text-lg font-bold text-white transition-all hover:bg-amber-500/40"
          >
            게임 시작
          </button>
        </div>
      )}

      {gameOver && started && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#1a1a2e]/90 backdrop-blur-2xl">
          <h2 className="text-3xl font-bold text-amber-400">
            🎉 게임 종료!
          </h2>
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-black/30 px-8 py-4 text-center">
            <div className="text-sm text-amber-400">최종 점수</div>
            <div className="text-5xl font-bold text-white">{score}</div>
          </div>
          <button
            onClick={handleRestart}
            className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/20 px-8 py-3 font-bold text-white transition-all hover:bg-amber-500/40"
          >
            다시 하기
          </button>
        </div>
      )}

      {started && !gameOver && (
        <>
          {/* HUD */}
          <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex justify-between p-4">
            <div className="rounded-xl bg-black/50 px-4 py-2 backdrop-blur">
              <div className="text-xs text-amber-400">점수</div>
              <div className="text-2xl font-bold text-white">{score}</div>
            </div>
            <div className="rounded-xl bg-black/50 px-4 py-2 backdrop-blur">
              <div className="text-xs text-rose-400">콤보</div>
              <div className="text-2xl font-bold text-white">x{combo}</div>
            </div>
            <div className="rounded-xl bg-black/50 px-4 py-2 backdrop-blur">
              <div className="text-xs text-cyan-400">시간</div>
              <div className="text-2xl font-bold text-white">{timeLeft}s</div>
            </div>
          </div>

          {/* Mobile fire button */}
          <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
            <button
              onPointerDown={shoot}
              className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-red-500 bg-gradient-to-b from-red-500 to-red-700 text-4xl shadow-[0_0_30px_rgba(239,68,68,0.5)] active:scale-90"
            >
              🏹
            </button>
          </div>

          {/* D-pad for mobile */}
          <div className="absolute bottom-4 left-4 z-10 grid grid-cols-3 gap-1">
            <div />
            <button
              onPointerDown={() => setTargetY((v) => Math.min(5, v + 1))}
              className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 text-xl backdrop-blur active:bg-white/40"
            >
              ▲
            </button>
            <div />
            <button
              onPointerDown={() => setTargetX((v) => Math.max(-8, v - 1))}
              className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 text-xl backdrop-blur active:bg-white/40"
            >
              ◀
            </button>
            <button
              onPointerDown={() => setTargetY((v) => Math.max(-5, v - 1))}
              className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 text-xl backdrop-blur active:bg-white/40"
            >
              ▼
            </button>
            <button
              onPointerDown={() => setTargetX((v) => Math.min(8, v + 1))}
              className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 text-xl backdrop-blur active:bg-white/40"
            >
              ▶
            </button>
          </div>

          {/* Instructions */}
          <div className="pointer-events-none absolute bottom-4 right-4 z-10 rounded-lg bg-black/40 px-3 py-2 text-xs text-white/60 backdrop-blur">
            마우스 조준 + 클릭 발사
          </div>
        </>
      )}
    </div>
  );
}
