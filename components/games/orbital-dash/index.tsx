"use client";

import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Trail, Sphere, Ring } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import * as THREE from "three";

const TRACK_RADIUS = 4;
const COLORS = ["#00ff88", "#ff0088", "#0088ff", "#ff8800", "#8800ff"];

function Player({ angle, lane }: { angle: number; lane: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const radius = TRACK_RADIUS + (lane - 1) * 1.2;
  
  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x = Math.cos(angle) * radius;
    ref.current.position.z = Math.sin(angle) * radius;
    ref.current.rotation.y = -angle + Math.PI / 2;
  });

  return (
    <group>
      <Trail width={0.8} length={8} color="#00ffff" attenuation={(t) => t * t}>
        <Sphere ref={ref} args={[0.25, 16, 16]}>
          <meshPhysicalMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={2}
            metalness={0.8}
            roughness={0.1}
            transmission={0.3}
            thickness={0.5}
          />
        </Sphere>
      </Trail>
      <pointLight position={[Math.cos(angle) * radius, 0.5, Math.sin(angle) * radius]} color="#00ffff" intensity={2} distance={3} />
    </group>
  );
}

function Obstacle({ startAngle, lane, playerAngle, color }: { startAngle: number; lane: number; playerAngle: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const radius = TRACK_RADIUS + (lane - 1) * 1.2;
  
  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x = Math.cos(startAngle) * radius;
    ref.current.position.z = Math.sin(startAngle) * radius;
    ref.current.rotation.y += 0.05;
  });

  return (
    <mesh ref={ref} position={[0, 0.3, 0]}>
      <octahedronGeometry args={[0.35, 0]} />
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        metalness={0.5}
        roughness={0.1}
        transmission={0.4}
        thickness={0.3}
      />
    </mesh>
  );
}

function Collectible({ startAngle, lane, collected }: { startAngle: number; lane: number; collected: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const radius = TRACK_RADIUS + (lane - 1) * 1.2;
  
  useFrame((_, delta) => {
    if (!ref.current || collected) return;
    ref.current.position.x = Math.cos(startAngle) * radius;
    ref.current.position.z = Math.sin(startAngle) * radius;
    ref.current.position.y = 0.3 + Math.sin(Date.now() * 0.005) * 0.1;
    ref.current.rotation.y += delta * 2;
  });

  if (collected) return null;

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.2, 0]} />
      <meshPhysicalMaterial
        color="#ffff00"
        emissive="#ffff00"
        emissiveIntensity={2}
        metalness={0.9}
        roughness={0}
      />
    </mesh>
  );
}

function Track() {
  return (
    <group>
      {[0, 1, 2].map((lane) => (
        <Ring
          key={lane}
          args={[TRACK_RADIUS + (lane - 1) * 1.2 - 0.3, TRACK_RADIUS + (lane - 1) * 1.2 + 0.3, 64]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.1, 0]}
        >
          <meshPhysicalMaterial
            color="#1a1a2e"
            emissive={lane === 1 ? "#3333ff" : "#222244"}
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.3}
            transparent
            opacity={0.9}
          />
        </Ring>
      ))}
      {/* Grid lines */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * TRACK_RADIUS, -0.05, Math.sin(a) * TRACK_RADIUS]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.02, 0.01, 2.4]} />
            <meshBasicMaterial color="#4444ff" transparent opacity={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

type ObstacleData = { id: number; angle: number; lane: number; color: string };
type CollectibleData = { id: number; angle: number; lane: number; collected: boolean };

function Scene({ playerAngle, playerLane, obstacles, collectibles, speed }: {
  playerAngle: number;
  playerLane: number;
  obstacles: ObstacleData[];
  collectibles: CollectibleData[];
  speed: number;
}) {
  return (
    <Canvas camera={{ position: [0, 8, 8], fov: 50 }} gl={{ antialias: true }} dpr={[1, 2]}>
      <color attach="background" args={["#050510"]} />
      <fog attach="fog" args={["#050510", 10, 25]} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} />
      <Suspense fallback={null}>
        <Track />
        <Player angle={playerAngle} lane={playerLane} />
        {obstacles.map((obs) => (
          <Obstacle key={obs.id} startAngle={obs.angle} lane={obs.lane} playerAngle={playerAngle} color={obs.color} />
        ))}
        {collectibles.map((col) => (
          <Collectible key={col.id} startAngle={col.angle} lane={col.lane} collected={col.collected} />
        ))}
        <Environment preset="night" />
      </Suspense>
      <EffectComposer>
        <Bloom luminanceThreshold={0.3} intensity={0.8} mipmapBlur />
        <ChromaticAberration offset={[0.0005, 0.0005]} />
      </EffectComposer>
    </Canvas>
  );
}

export default function OrbitalDashGame() {
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [playerAngle, setPlayerAngle] = useState(0);
  const [playerLane, setPlayerLane] = useState(1);
  const [obstacles, setObstacles] = useState<ObstacleData[]>([]);
  const [collectibles, setCollectibles] = useState<CollectibleData[]>([]);
  const [speed, setSpeed] = useState(1.5);
  const obstacleIdRef = useRef(0);
  const collectibleIdRef = useRef(0);

  useEffect(() => {
    if (!started || gameOver) return;
    
    const interval = setInterval(() => {
      setPlayerAngle((prev) => {
        const newAngle = prev + 0.03 * speed;
        return newAngle;
      });
      
      // Spawn obstacles
      if (Math.random() < 0.02 * speed) {
        const lane = Math.floor(Math.random() * 3);
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        setObstacles((prev) => [...prev, { id: obstacleIdRef.current++, angle: playerAngle + Math.PI, lane, color }]);
      }
      
      // Spawn collectibles
      if (Math.random() < 0.015) {
        const lane = Math.floor(Math.random() * 3);
        setCollectibles((prev) => [...prev, { id: collectibleIdRef.current++, angle: playerAngle + Math.PI, lane, collected: false }]);
      }
      
      // Check collisions
      setObstacles((prev) => {
        const current = prev.filter((obs) => {
          const angleDiff = Math.abs(((obs.angle - playerAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2));
          const close = angleDiff < 0.15 || angleDiff > Math.PI * 2 - 0.15;
          if (close && obs.lane === playerLane) {
            setGameOver(true);
          }
          return angleDiff < Math.PI * 1.5;
        });
        return current;
      });
      
      // Check collectible pickup
      setCollectibles((prev) => {
        return prev.map((col) => {
          if (col.collected) return col;
          const angleDiff = Math.abs(((col.angle - playerAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2));
          const close = angleDiff < 0.2 || angleDiff > Math.PI * 2 - 0.2;
          if (close && col.lane === playerLane) {
            setScore((s) => s + 10);
            return { ...col, collected: true };
          }
          return col;
        }).filter((col) => {
          const angleDiff = Math.abs(((col.angle - playerAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2));
          return angleDiff < Math.PI * 1.5;
        });
      });
      
      setScore((s) => s + 1);
      setSpeed((s) => Math.min(s + 0.0005, 3));
    }, 16);
    
    return () => clearInterval(interval);
  }, [started, gameOver, playerAngle, playerLane, speed]);

  const changeLane = (dir: number) => {
    if (gameOver) return;
    setPlayerLane((prev) => Math.max(0, Math.min(2, prev + dir)));
  };

  const restart = () => {
    setStarted(true);
    setGameOver(false);
    setScore(0);
    setPlayerAngle(0);
    setPlayerLane(1);
    setObstacles([]);
    setCollectibles([]);
    setSpeed(1.5);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ height: "min(70vh, 560px)", background: "#050510" }}>
      <Scene playerAngle={playerAngle} playerLane={playerLane} obstacles={obstacles} collectibles={collectibles} speed={speed} />
      
      {!started && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#050510]/90 backdrop-blur-xl">
          <h2 className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-4xl font-black uppercase tracking-[0.2em] text-transparent sm:text-5xl">
            Orbital Dash
          </h2>
          <p className="mt-2 text-xs font-light uppercase tracking-[0.4em] text-cyan-400">Endless Ring Runner</p>
          <button onClick={() => setStarted(true)} className="mt-8 rounded-full border border-cyan-500/40 bg-cyan-500/15 px-10 py-4 text-sm uppercase tracking-[0.3em] text-cyan-300 backdrop-blur-md transition-all hover:bg-cyan-500/30 hover:shadow-[0_0_40px_rgba(0,255,255,0.3)]">
            Start
          </button>
        </div>
      )}
      
      {gameOver && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#050510]/90 backdrop-blur-xl">
          <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-rose-400">Game Over</h2>
          <div className="mt-6 rounded-2xl border border-cyan-500/30 bg-[#0a0a20]/80 px-8 py-4 text-center backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.3em] text-cyan-400">Score</div>
            <div className="text-4xl font-black text-white">{score}</div>
          </div>
          <button onClick={restart} className="mt-6 rounded-full border border-cyan-500/40 bg-cyan-500/15 px-10 py-4 text-sm uppercase tracking-[0.3em] text-cyan-300 transition-all hover:bg-cyan-500/30">
            Try Again
          </button>
        </div>
      )}
      
      {started && !gameOver && (
        <>
          <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex justify-center p-4">
            <div className="rounded-full border border-cyan-500/30 bg-[#0a0a20]/70 px-6 py-2 backdrop-blur-xl">
              <div className="text-center text-2xl font-black tracking-wider text-white">{score}</div>
            </div>
          </div>
          <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-4">
            <button onClick={() => changeLane(-1)} className="h-16 w-16 rounded-full border border-cyan-500/40 bg-cyan-500/20 text-2xl text-white backdrop-blur-md active:bg-cyan-500/40">
              ←
            </button>
            <button onClick={() => changeLane(1)} className="h-16 w-16 rounded-full border border-cyan-500/40 bg-cyan-500/20 text-2xl text-white backdrop-blur-md active:bg-cyan-500/40">
              →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
