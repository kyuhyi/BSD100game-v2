"use client";

import { useState, useCallback, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Trail } from "@react-three/drei";
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
    wobble.current += delta * 2;
    ref.current.position.x = balloon.x + Math.sin(wobble.current) * 0.1;
    ref.current.position.y = balloon.y + Math.cos(wobble.current * 1.3) * 0.08;
    ref.current.position.z = balloon.z;
    ref.current.rotation.z = Math.sin(wobble.current * 0.5) * 0.1;
  });

  if (balloon.popped) return null;

  return (
    <group ref={ref} position={[balloon.x, balloon.y, balloon.z]}>
      {/* Balloon body */}
      <mesh scale={[balloon.scale, balloon.scale * 1.2, balloon.scale]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshPhysicalMaterial
          color={balloon.color}
          metalness={0.1}
          roughness={0.2}
          transmission={0.3}
          thickness={0.2}
          clearcoat={1}
          emissive={balloon.color}
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Balloon knot */}
      <mesh position={[0, -0.35 * balloon.scale, 0]} scale={balloon.scale * 0.3}>
        <coneGeometry args={[0.2, 0.3, 8]} />
        <meshStandardMaterial color={balloon.color} />
      </mesh>
      {/* String */}
      <mesh position={[0, -0.6 * balloon.scale, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.5 * balloon.scale, 4]} />
        <meshBasicMaterial color="#888888" />
      </mesh>
    </group>
  );
}

function ArrowMesh({ arrow }: { arrow: Arrow }) {
  const ref = useRef<THREE.Group>(null);
  const direction = new THREE.Vector3(arrow.vx, arrow.vy, arrow.vz).normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, -1),
    direction
  );

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.set(arrow.x, arrow.y, arrow.z);
    ref.current.quaternion.copy(quaternion);
  });

  return (
    <group ref={ref}>
      <Trail width={0.15} length={6} color="#fbbf24" attenuation={(t) => t * t}>
        <group>
          {/* Arrow shaft */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Arrow head */}
          <mesh position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.08, 0.2, 8]} />
            <meshPhysicalMaterial
              color="#c0c0c0"
              metalness={0.9}
              roughness={0.1}
              emissive="#fbbf24"
              emissiveIntensity={0.5}
            />
          </mesh>
          {/* Feathers */}
          {[0, 1, 2].map((i) => (
            <mesh
              key={i}
              position={[Math.cos((i * Math.PI * 2) / 3) * 0.05, 0, 0.35]}
              rotation={[0, (i * Math.PI * 2) / 3, Math.PI / 6]}
            >
              <planeGeometry args={[0.1, 0.15]} />
              <meshBasicMaterial color="#dc2626" side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      </Trail>
    </group>
  );
}

function Bow({ aimX, aimY, charging }: { aimX: number; aimY: number; charging: boolean }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x = aimX * 0.3;
    ref.current.position.y = aimY * 0.3 - 2;
    ref.current.rotation.z = -aimX * 0.2;
    ref.current.rotation.x = aimY * 0.1;
  });

  return (
    <group ref={ref} position={[0, -2, 4]}>
      {/* Bow frame */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.8, 0.04, 8, 32, Math.PI]} />
        <meshStandardMaterial color="#5D3A1A" />
      </mesh>
      {/* Bow string */}
      <mesh position={[charging ? 0.15 : 0, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 1.6, 4]} />
        <meshBasicMaterial color="#f5f5dc" />
      </mesh>
      {/* Arrow on bow when charging */}
      {charging && (
        <mesh position={[0.2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.6, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      )}
    </group>
  );
}

function Crosshair({ aimX, aimY }: { aimX: number; aimY: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x = aimX * 3;
    ref.current.position.y = aimY * 3;
  });

  return (
    <group ref={ref} position={[0, 0, -5]}>
      <mesh>
        <ringGeometry args={[0.15, 0.18, 32]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} />
      </mesh>
      <mesh>
        <ringGeometry args={[0.02, 0.05, 16]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
    </group>
  );
}

function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

function GameScene({
  balloons,
  arrows,
  aimX,
  aimY,
  charging,
}: {
  balloons: Balloon[];
  arrows: Arrow[];
  aimX: number;
  aimY: number;
  charging: boolean;
}) {
  return (
    <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
      <color attach="background" args={["#0f172a"]} />
      <fog attach="fog" args={["#0f172a", 15, 30]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} color="#fff5e0" />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#fbbf24" distance={15} />
      <Suspense fallback={null}>
        <CameraSetup />
        {balloons.map((b) => (
          <BalloonMesh key={b.id} balloon={b} />
        ))}
        {arrows.map((a) => (
          <ArrowMesh key={a.id} arrow={a} />
        ))}
        <Bow aimX={aimX} aimY={aimY} charging={charging} />
        <Crosshair aimX={aimX} aimY={aimY} />
        {/* Background particles */}
        {Array.from({ length: 50 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 15,
              -10 - Math.random() * 10,
            ]}
          >
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
          </mesh>
        ))}
        <Environment preset="sunset" />
      </Suspense>
      <EffectComposer>
        <Bloom luminanceThreshold={0.3} intensity={0.5} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}

export default function BalloonArcherGame() {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [aimX, setAimX] = useState(0);
  const [aimY, setAimY] = useState(0);
  const [charging, setCharging] = useState(false);
  const [chargeTime, setChargeTime] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const nextBalloonId = useRef(0);
  const nextArrowId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const balloonsRef = useRef<Balloon[]>([]);
  const arrowsRef = useRef<Arrow[]>([]);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const chargeStartRef = useRef(0);

  useEffect(() => {
    balloonsRef.current = balloons;
  }, [balloons]);
  useEffect(() => {
    arrowsRef.current = arrows;
  }, [arrows]);

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

  // Spawn balloons - slower and easier
  useEffect(() => {
    if (!started || gameOver) return;
    const spawnBalloon = () => {
      const side = Math.random() < 0.5 ? -1 : 1;
      const balloon: Balloon = {
        id: nextBalloonId.current++,
        x: side * 5,
        y: -2 + Math.random() * 3,
        z: -6 - Math.random() * 3, // closer to player
        vx: -side * (0.15 + Math.random() * 0.25), // much slower horizontal
        vy: 0.1 + Math.random() * 0.15, // much slower vertical
        color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
        scale: 0.9 + Math.random() * 0.4, // bigger balloons
        popped: false,
      };
      setBalloons((prev) => [...prev, balloon]);
    };
    const interval = setInterval(spawnBalloon, 1200); // spawn less frequently
    spawnBalloon();
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

      // Update charge time
      if (charging) {
        setChargeTime(Math.min((now - chargeStartRef.current) / 1000, 1.5));
      }

      // Move balloons
      setBalloons((prev) =>
        prev
          .map((b) => ({
            ...b,
            x: b.x + b.vx * delta,
            y: b.y + b.vy * delta,
          }))
          .filter((b) => !b.popped && b.y < 8 && Math.abs(b.x) < 10)
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
            vy: arrow.vy - 0.5 * delta, // less gravity - arrows fly straighter
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
              // Larger hit area for easier gameplay
              if (dist < 1.0 * b.scale) {
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

          if (!hit && newArrow.z > -20 && newArrow.y > -10) {
            remaining.push(newArrow);
          } else if (!hit) {
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
  }, [started, gameOver, charging]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!started || gameOver || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;
      setAimX((relX - 0.5) * 2);
      setAimY((0.5 - relY) * 2);
    },
    [started, gameOver]
  );

  const handlePointerDown = useCallback(() => {
    if (!started || gameOver) return;
    setCharging(true);
    chargeStartRef.current = performance.now();
  }, [started, gameOver]);

  const handlePointerUp = useCallback(() => {
    if (!started || gameOver || !charging) return;
    setCharging(false);

    const power = Math.min(chargeTime, 1.5) / 1.5;
    const speed = 10 + power * 8; // faster base speed

    // Arrow goes straight toward where you're aiming
    const arrow: Arrow = {
      id: nextArrowId.current++,
      x: 0,
      y: -1.5,
      z: 3,
      vx: aimX * 4, // aim direction
      vy: aimY * 4 + 1, // slight upward arc
      vz: -speed,
    };
    setArrows((prev) => [...prev, arrow]);
    setChargeTime(0);
  }, [started, gameOver, charging, chargeTime, aimX, aimY]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!started || gameOver) return;
      const step = 0.15;
      if (e.key === "ArrowLeft" || e.key === "a") setAimX((v) => Math.max(-1, v - step));
      if (e.key === "ArrowRight" || e.key === "d") setAimX((v) => Math.min(1, v + step));
      if (e.key === "ArrowUp" || e.key === "w") setAimY((v) => Math.min(1, v + step));
      if (e.key === "ArrowDown" || e.key === "s") setAimY((v) => Math.max(-1, v - step));
      if (e.key === " " && !charging) {
        setCharging(true);
        chargeStartRef.current = performance.now();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === " " && charging) {
        handlePointerUp();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [started, gameOver, charging, handlePointerUp]);

  const handleRestart = useCallback(() => {
    setBalloons([]);
    setArrows([]);
    setAimX(0);
    setAimY(0);
    setCharging(false);
    setChargeTime(0);
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
      style={{ height: "min(70vh, 560px)", background: "#0f172a", touchAction: "none" }}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => charging && handlePointerUp()}
    >
      <GameScene
        balloons={balloons}
        arrows={arrows}
        aimX={aimX}
        aimY={aimY}
        charging={charging}
      />

      {!started && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0f172a]/85 backdrop-blur-xl">
          <h2
            className="text-4xl font-extralight uppercase tracking-[0.2em] text-slate-200 sm:text-5xl"
            style={{ textShadow: "0 0 40px rgba(251,191,36,0.6)" }}
          >
            🎯 풍선 사냥꾼
          </h2>
          <p className="mt-2 text-xs font-light uppercase tracking-[0.4em] text-amber-400">
            Balloon Archer
          </p>
          <div className="mt-4 text-center text-sm text-slate-400">
            <p>마우스로 조준, 클릭 후 놓으면 발사!</p>
            <p className="text-xs mt-1">길게 누를수록 강하게 쏩니다</p>
          </div>
          <button
            onClick={() => setStarted(true)}
            className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/15 px-8 py-3 text-sm uppercase tracking-[0.3em] text-slate-200 transition-all hover:bg-amber-500/30 hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]"
          >
            게임 시작
          </button>
        </div>
      )}

      {gameOver && started && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0f172a]/90 backdrop-blur-2xl">
          <h2
            className="text-3xl font-extralight uppercase tracking-[0.2em] text-amber-400"
            style={{ textShadow: "0 0 40px rgba(251,191,36,0.5)" }}
          >
            🎉 시간 종료!
          </h2>
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-[#0f0f1e]/70 px-8 py-4 text-center backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-400">최종 점수</div>
            <div className="text-4xl font-extralight text-slate-200">{score}</div>
          </div>
          <button
            onClick={handleRestart}
            className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/15 px-8 py-3 text-sm uppercase tracking-[0.3em] text-slate-200 transition-all hover:bg-amber-500/30"
          >
            다시 하기
          </button>
        </div>
      )}

      {started && !gameOver && (
        <>
          {/* HUD */}
          <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex justify-between p-4">
            <div className="rounded-xl border border-amber-500/20 bg-[#0f0f1e]/70 px-4 py-2 backdrop-blur-xl">
              <div className="text-[0.6rem] uppercase tracking-[0.2em] text-amber-400">점수</div>
              <div className="text-xl font-extralight text-slate-200">{score}</div>
            </div>
            <div className="rounded-xl border border-rose-500/20 bg-[#0f0f1e]/70 px-4 py-2 backdrop-blur-xl">
              <div className="text-[0.6rem] uppercase tracking-[0.2em] text-rose-400">콤보</div>
              <div className="text-xl font-extralight text-slate-200">x{combo}</div>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-[#0f0f1e]/70 px-4 py-2 backdrop-blur-xl">
              <div className="text-[0.6rem] uppercase tracking-[0.2em] text-cyan-400">시간</div>
              <div className="text-xl font-extralight text-slate-200">{timeLeft}s</div>
            </div>
          </div>

          {/* Charge indicator */}
          {charging && (
            <div className="absolute bottom-24 left-1/2 z-10 -translate-x-1/2">
              <div className="h-3 w-32 overflow-hidden rounded-full border border-amber-500/30 bg-black/50 backdrop-blur-xl">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all"
                  style={{ width: `${(chargeTime / 1.5) * 100}%` }}
                />
              </div>
              <div className="mt-1 text-center text-xs text-amber-400">충전 중...</div>
            </div>
          )}

          {/* Mobile controls */}
          <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2 px-4">
            <div className="grid grid-cols-3 gap-1">
              <div />
              <button
                onPointerDown={() => setAimY((v) => Math.min(1, v + 0.2))}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/20 text-lg text-amber-200 backdrop-blur-xl active:bg-amber-500/40"
              >
                ▲
              </button>
              <div />
              <button
                onPointerDown={() => setAimX((v) => Math.max(-1, v - 0.2))}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/20 text-lg text-amber-200 backdrop-blur-xl active:bg-amber-500/40"
              >
                ◀
              </button>
              <button
                onPointerDown={() => setAimY((v) => Math.max(-1, v - 0.2))}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/20 text-lg text-amber-200 backdrop-blur-xl active:bg-amber-500/40"
              >
                ▼
              </button>
              <button
                onPointerDown={() => setAimX((v) => Math.min(1, v + 0.2))}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/20 text-lg text-amber-200 backdrop-blur-xl active:bg-amber-500/40"
              >
                ▶
              </button>
            </div>
            <button
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              className="ml-4 flex h-16 w-24 items-center justify-center rounded-2xl border-2 border-red-500/50 bg-gradient-to-b from-red-500/40 to-red-600/30 text-2xl text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.3)] backdrop-blur-xl active:scale-95 active:bg-red-500/60"
            >
              🏹
            </button>
          </div>

          {/* Control hint */}
          <div className="pointer-events-none absolute bottom-20 left-0 right-0 z-10 flex justify-center md:bottom-4">
            <div className="rounded-lg bg-black/40 px-3 py-1 text-xs text-amber-400/70 backdrop-blur-sm">
              마우스 드래그로 조준 | 클릭으로 발사 | WASD / 방향키
            </div>
          </div>
        </>
      )}
    </div>
  );
}
