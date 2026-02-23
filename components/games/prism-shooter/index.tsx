"use client";

import { useState, useCallback, useRef, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Sphere, Trail } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import * as THREE from "three";

const COLORS = ["#ff0055", "#00ff88", "#0088ff", "#ff8800", "#aa00ff", "#ffff00"];

type TargetData = { id: number; pos: THREE.Vector3; color: string; scale: number; destroyed: boolean };
type BulletData = { id: number; pos: THREE.Vector3; vel: THREE.Vector3 };
type ParticleData = { id: number; pos: THREE.Vector3; vel: THREE.Vector3; color: string; life: number };

function Target({ target, onHit }: { target: TargetData; onHit: () => void }) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((_, delta) => {
    if (!ref.current || target.destroyed) return;
    ref.current.rotation.x += delta * 0.5;
    ref.current.rotation.y += delta * 0.8;
    ref.current.position.y = target.pos.y + Math.sin(Date.now() * 0.002 + target.id) * 0.3;
  });

  if (target.destroyed) return null;

  return (
    <mesh 
      ref={ref} 
      position={target.pos}
      scale={target.scale}
      onClick={onHit}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <octahedronGeometry args={[0.5, 0]} />
      <meshPhysicalMaterial
        color={target.color}
        emissive={target.color}
        emissiveIntensity={hovered ? 3 : 1.5}
        metalness={0.6}
        roughness={0.1}
        transmission={0.5}
        thickness={0.5}
      />
    </mesh>
  );
}

function Bullet({ bullet }: { bullet: BulletData }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.copy(bullet.pos);
  });

  return (
    <Trail width={0.3} length={6} color="#00ffff" attenuation={(t) => t * t}>
      <Sphere ref={ref} args={[0.1, 8, 8]} position={bullet.pos.toArray()}>
        <meshBasicMaterial color="#ffffff" />
      </Sphere>
    </Trail>
  );
}

function Particle({ particle }: { particle: ParticleData }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.copy(particle.pos);
    const scale = particle.life * 0.3;
    ref.current.scale.setScalar(scale);
  });

  return (
    <Sphere ref={ref} args={[0.15, 6, 6]} position={particle.pos.toArray()}>
      <meshBasicMaterial color={particle.color} transparent opacity={particle.life} />
    </Sphere>
  );
}

function Crosshair({ mouse }: { mouse: THREE.Vector2 }) {
  const ref = useRef<THREE.Group>(null);
  const { camera, viewport } = useThree();
  
  useFrame(() => {
    if (!ref.current) return;
    const x = (mouse.x * viewport.width) / 2;
    const y = (mouse.y * viewport.height) / 2;
    ref.current.position.set(x, y, -5);
  });

  return (
    <group ref={ref}>
      <mesh>
        <ringGeometry args={[0.15, 0.2, 32]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.8} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <ringGeometry args={[0.25, 0.28, 4]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function Stars() {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const arr = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 80;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 80;
      arr[i * 3 + 2] = -Math.random() * 40 - 10;
    }
    return arr;
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }
  }, [positions]);

  return (
    <points ref={ref}>
      <bufferGeometry />
      <pointsMaterial size={0.1} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function Scene({ targets, bullets, particles, mouse, onTargetHit }: {
  targets: TargetData[];
  bullets: BulletData[];
  particles: ParticleData[];
  mouse: THREE.Vector2;
  onTargetHit: (id: number) => void;
}) {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 60 }} gl={{ antialias: true }} dpr={[1, 2]}>
      <color attach="background" args={["#030308"]} />
      <fog attach="fog" args={["#030308", 15, 40]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 5]} intensity={1} color="#6666ff" />
      <Suspense fallback={null}>
        <Stars />
        {targets.map((t) => (
          <Target key={t.id} target={t} onHit={() => onTargetHit(t.id)} />
        ))}
        {bullets.map((b) => (
          <Bullet key={b.id} bullet={b} />
        ))}
        {particles.map((p) => (
          <Particle key={p.id} particle={p} />
        ))}
        <Crosshair mouse={mouse} />
        <Environment preset="night" />
      </Suspense>
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} intensity={1.2} mipmapBlur />
        <ChromaticAberration offset={[0.001, 0.001]} />
      </EffectComposer>
    </Canvas>
  );
}

export default function PrismShooterGame() {
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<TargetData[]>([]);
  const [bullets, setBullets] = useState<BulletData[]>([]);
  const [particles, setParticles] = useState<ParticleData[]>([]);
  const [mouse, setMouse] = useState(new THREE.Vector2(0, 0));
  const targetIdRef = useRef(0);
  const bulletIdRef = useRef(0);
  const particleIdRef = useRef(0);

  // Spawn targets
  useEffect(() => {
    if (!started || gameOver) return;
    
    const spawn = setInterval(() => {
      if (targets.filter(t => !t.destroyed).length < 8) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const pos = new THREE.Vector3(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4 - 5
        );
        setTargets((prev) => [...prev, {
          id: targetIdRef.current++,
          pos,
          color,
          scale: 0.8 + Math.random() * 0.6,
          destroyed: false
        }]);
      }
    }, 800);
    
    return () => clearInterval(spawn);
  }, [started, gameOver, targets]);

  // Timer
  useEffect(() => {
    if (!started || gameOver) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [started, gameOver]);

  // Update particles
  useEffect(() => {
    if (!started || gameOver) return;
    
    const update = setInterval(() => {
      setParticles((prev) => prev
        .map((p) => {
          p.pos.add(p.vel);
          p.vel.y -= 0.01;
          p.life -= 0.03;
          return p;
        })
        .filter((p) => p.life > 0)
      );
    }, 16);
    
    return () => clearInterval(update);
  }, [started, gameOver]);

  // Clean up old targets
  useEffect(() => {
    const cleanup = setInterval(() => {
      setTargets((prev) => prev.filter((t) => !t.destroyed || Date.now() - t.id < 1000));
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  const handleTargetHit = useCallback((id: number) => {
    setTargets((prev) => prev.map((t) => {
      if (t.id === id && !t.destroyed) {
        // Spawn particles
        const newParticles: ParticleData[] = [];
        for (let i = 0; i < 15; i++) {
          newParticles.push({
            id: particleIdRef.current++,
            pos: t.pos.clone(),
            vel: new THREE.Vector3(
              (Math.random() - 0.5) * 0.3,
              (Math.random() - 0.5) * 0.3,
              (Math.random() - 0.5) * 0.3
            ),
            color: t.color,
            life: 1
          });
        }
        setParticles((p) => [...p, ...newParticles]);
        
        // Score
        setCombo((c) => c + 1);
        setScore((s) => s + (10 + combo * 5) * Math.round(t.scale));
        
        return { ...t, destroyed: true };
      }
      return t;
    }));
  }, [combo]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    setMouse(new THREE.Vector2(x, y));
  }, []);

  // Reset combo on miss (clicking empty space)
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    // Check if we clicked on empty space (no target hit)
    // This is a simplified approach
  }, []);

  const restart = () => {
    setStarted(true);
    setGameOver(false);
    setScore(0);
    setCombo(0);
    setTimeLeft(30);
    setTargets([]);
    setBullets([]);
    setParticles([]);
  };

  return (
    <div 
      className="relative w-full overflow-hidden rounded-2xl cursor-crosshair" 
      style={{ height: "min(70vh, 560px)", background: "#030308" }}
      onMouseMove={handleMouseMove}
    >
      <Scene 
        targets={targets} 
        bullets={bullets} 
        particles={particles} 
        mouse={mouse}
        onTargetHit={handleTargetHit}
      />
      
      {!started && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#030308]/90 backdrop-blur-xl">
          <h2 className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-4xl font-black uppercase tracking-[0.15em] text-transparent sm:text-5xl">
            Prism Shooter
          </h2>
          <p className="mt-2 text-xs font-light uppercase tracking-[0.4em] text-purple-400">Click the Crystals!</p>
          <button onClick={() => setStarted(true)} className="mt-8 rounded-full border border-purple-500/40 bg-purple-500/15 px-10 py-4 text-sm uppercase tracking-[0.3em] text-purple-300 backdrop-blur-md transition-all hover:bg-purple-500/30 hover:shadow-[0_0_40px_rgba(170,0,255,0.3)]">
            Start
          </button>
        </div>
      )}
      
      {gameOver && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#030308]/90 backdrop-blur-xl">
          <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-pink-400">Time's Up!</h2>
          <div className="mt-6 rounded-2xl border border-purple-500/30 bg-[#0a0a20]/80 px-8 py-4 text-center backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.3em] text-purple-400">Final Score</div>
            <div className="text-5xl font-black bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">{score}</div>
          </div>
          <button onClick={restart} className="mt-6 rounded-full border border-cyan-500/40 bg-cyan-500/15 px-10 py-4 text-sm uppercase tracking-[0.3em] text-cyan-300 transition-all hover:bg-cyan-500/30">
            Play Again
          </button>
        </div>
      )}
      
      {started && !gameOver && (
        <>
          <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex justify-between p-4">
            <div className="rounded-full border border-purple-500/30 bg-[#0a0a20]/70 px-6 py-2 backdrop-blur-xl">
              <div className="text-xs uppercase tracking-wider text-purple-400">Score</div>
              <div className="text-2xl font-black text-white">{score}</div>
            </div>
            <div className="rounded-full border border-pink-500/30 bg-[#0a0a20]/70 px-6 py-2 backdrop-blur-xl">
              <div className="text-xs uppercase tracking-wider text-pink-400">Time</div>
              <div className="text-2xl font-black text-white">{timeLeft}s</div>
            </div>
          </div>
          {combo > 1 && (
            <div className="pointer-events-none absolute bottom-4 left-0 right-0 z-10 flex justify-center">
              <div className="rounded-full border border-yellow-500/50 bg-yellow-500/20 px-6 py-2 backdrop-blur-xl">
                <span className="text-lg font-black text-yellow-400">{combo}x COMBO!</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
