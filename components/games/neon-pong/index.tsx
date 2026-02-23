"use client";

import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, RoundedBox, Trail, Text } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

const PADDLE_WIDTH = 2;
const PADDLE_HEIGHT = 0.3;
const PADDLE_DEPTH = 0.5;
const BALL_SPEED = 0.12;
const AI_SPEED = 0.08;

function Paddle({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <RoundedBox args={[PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_DEPTH]} radius={0.1} smoothness={4} position={position}>
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1}
        metalness={0.8}
        roughness={0.1}
        transmission={0.3}
        thickness={0.3}
      />
    </RoundedBox>
  );
}

function Ball({ position }: { position: THREE.Vector3 }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.copy(position);
    ref.current.rotation.x += 0.1;
    ref.current.rotation.y += 0.1;
  });

  return (
    <group>
      <Trail width={0.5} length={12} color="#ffffff" attenuation={(t) => t * t}>
        <mesh ref={ref}>
          <icosahedronGeometry args={[0.2, 2]} />
          <meshPhysicalMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={3}
            metalness={0.9}
            roughness={0}
          />
        </mesh>
      </Trail>
      <pointLight position={[position.x, position.y, position.z]} color="#ffffff" intensity={2} distance={4} />
    </group>
  );
}

function Arena() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[6, 12]} />
        <meshPhysicalMaterial
          color="#0a0a15"
          emissive="#1a1a3a"
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Side walls */}
      {[-3, 3].map((x) => (
        <RoundedBox key={x} args={[0.1, 0.8, 12]} radius={0.03} position={[x, 0, 0]}>
          <meshPhysicalMaterial
            color="#6366f1"
            emissive="#6366f1"
            emissiveIntensity={0.8}
            metalness={0.8}
            roughness={0.1}
            transmission={0.5}
            thickness={0.5}
          />
        </RoundedBox>
      ))}
      
      {/* Center line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]}>
        <planeGeometry args={[5.8, 0.05]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.8} />
      </mesh>
      
      {/* Grid pattern */}
      {Array.from({ length: 13 }).map((_, i) => (
        <mesh key={`h${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, -6 + i]}>
          <planeGeometry args={[5.8, 0.02]} />
          <meshBasicMaterial color="#3333aa" transparent opacity={0.3} />
        </mesh>
      ))}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={`v${i}`} rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[-3 + i, -0.48, 0]}>
          <planeGeometry args={[11.8, 0.02]} />
          <meshBasicMaterial color="#3333aa" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ playerX, aiX, ballPos, playerScore, aiScore }: {
  playerX: number;
  aiX: number;
  ballPos: THREE.Vector3;
  playerScore: number;
  aiScore: number;
}) {
  return (
    <Canvas camera={{ position: [0, 6, 8], fov: 50, near: 0.1, far: 100 }} gl={{ antialias: true }} dpr={[1, 2]}>
      <color attach="background" args={["#050508"]} />
      <fog attach="fog" args={["#050508", 10, 20]} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 10, 5]} intensity={0.4} />
      <Suspense fallback={null}>
        <Arena />
        <Paddle position={[playerX, 0, 5]} color="#00ff88" />
        <Paddle position={[aiX, 0, -5]} color="#ff0088" />
        <Ball position={ballPos} />
        <Environment preset="night" />
      </Suspense>
      <EffectComposer>
        <Bloom luminanceThreshold={0.4} intensity={1} mipmapBlur />
        <Vignette darkness={0.5} offset={0.3} />
      </EffectComposer>
    </Canvas>
  );
}

export default function NeonPongGame() {
  const [started, setStarted] = useState(false);
  const [playerX, setPlayerX] = useState(0);
  const [aiX, setAiX] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const ballPos = useRef(new THREE.Vector3(0, 0, 0));
  const ballVel = useRef(new THREE.Vector3(0.05, 0, BALL_SPEED));
  const gameRef = useRef<number | null>(null);

  const resetBall = useCallback((direction: number) => {
    ballPos.current.set(0, 0, 0);
    const angle = (Math.random() - 0.5) * Math.PI / 3;
    ballVel.current.set(Math.sin(angle) * BALL_SPEED, 0, direction * BALL_SPEED);
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;
    
    const loop = () => {
      // Move ball
      ballPos.current.add(ballVel.current);
      
      // Wall collision
      if (ballPos.current.x < -2.7 || ballPos.current.x > 2.7) {
        ballVel.current.x *= -1;
        ballPos.current.x = Math.max(-2.7, Math.min(2.7, ballPos.current.x));
      }
      
      // Player paddle collision
      if (ballPos.current.z > 4.7 && ballPos.current.z < 5.3) {
        if (Math.abs(ballPos.current.x - playerX) < PADDLE_WIDTH / 2 + 0.2) {
          ballVel.current.z *= -1.05;
          ballVel.current.x += (ballPos.current.x - playerX) * 0.03;
          ballPos.current.z = 4.7;
        }
      }
      
      // AI paddle collision
      if (ballPos.current.z < -4.7 && ballPos.current.z > -5.3) {
        if (Math.abs(ballPos.current.x - aiX) < PADDLE_WIDTH / 2 + 0.2) {
          ballVel.current.z *= -1.05;
          ballVel.current.x += (ballPos.current.x - aiX) * 0.03;
          ballPos.current.z = -4.7;
        }
      }
      
      // Score
      if (ballPos.current.z > 6) {
        setAiScore((s) => {
          const newScore = s + 1;
          if (newScore >= 5) setGameOver(true);
          return newScore;
        });
        resetBall(-1);
      }
      if (ballPos.current.z < -6) {
        setPlayerScore((s) => {
          const newScore = s + 1;
          if (newScore >= 5) setGameOver(true);
          return newScore;
        });
        resetBall(1);
      }
      
      // AI movement
      const aiTarget = ballPos.current.x;
      setAiX((prev) => {
        const diff = aiTarget - prev;
        const move = Math.sign(diff) * Math.min(Math.abs(diff), AI_SPEED);
        return Math.max(-2, Math.min(2, prev + move));
      });
      
      // Speed limit
      const speed = ballVel.current.length();
      if (speed > 0.25) {
        ballVel.current.multiplyScalar(0.25 / speed);
      }
      
      gameRef.current = requestAnimationFrame(loop);
    };
    
    gameRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameRef.current) cancelAnimationFrame(gameRef.current);
    };
  }, [started, gameOver, playerX, aiX, resetBall]);

  const handleMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!started || gameOver) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    let clientX: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    const x = ((clientX - rect.left) / rect.width - 0.5) * 4;
    setPlayerX(Math.max(-2, Math.min(2, x)));
  }, [started, gameOver]);

  const restart = () => {
    setStarted(true);
    setGameOver(false);
    setPlayerScore(0);
    setAiScore(0);
    setPlayerX(0);
    setAiX(0);
    resetBall(1);
  };

  const winner = playerScore >= 5 ? "You Win!" : "AI Wins!";

  return (
    <div 
      className="relative w-full overflow-hidden rounded-2xl touch-none" 
      style={{ height: "min(70vh, 560px)", background: "#050508" }}
      onTouchMove={handleMove}
      onMouseMove={handleMove}
    >
      <Scene playerX={playerX} aiX={aiX} ballPos={ballPos.current} playerScore={playerScore} aiScore={aiScore} />
      
      {!started && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#050508]/90 backdrop-blur-xl">
          <h2 className="bg-gradient-to-r from-green-400 via-cyan-400 to-pink-500 bg-clip-text text-4xl font-black uppercase tracking-[0.15em] text-transparent sm:text-5xl">
            Neon Pong
          </h2>
          <p className="mt-2 text-xs font-light uppercase tracking-[0.4em] text-cyan-400">Touch to Control</p>
          <button onClick={() => { setStarted(true); resetBall(1); }} className="mt-8 rounded-full border border-green-500/40 bg-green-500/15 px-10 py-4 text-sm uppercase tracking-[0.3em] text-green-300 backdrop-blur-md transition-all hover:bg-green-500/30 hover:shadow-[0_0_40px_rgba(0,255,136,0.3)]">
            Play
          </button>
        </div>
      )}
      
      {gameOver && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#050508]/90 backdrop-blur-xl">
          <h2 className={`text-3xl font-black uppercase tracking-[0.2em] ${playerScore >= 5 ? 'text-green-400' : 'text-rose-400'}`}>
            {winner}
          </h2>
          <div className="mt-6 flex gap-8">
            <div className="rounded-2xl border border-green-500/30 bg-[#0a0a20]/80 px-6 py-3 text-center">
              <div className="text-xs uppercase tracking-[0.2em] text-green-400">You</div>
              <div className="text-3xl font-black text-white">{playerScore}</div>
            </div>
            <div className="rounded-2xl border border-pink-500/30 bg-[#0a0a20]/80 px-6 py-3 text-center">
              <div className="text-xs uppercase tracking-[0.2em] text-pink-400">AI</div>
              <div className="text-3xl font-black text-white">{aiScore}</div>
            </div>
          </div>
          <button onClick={restart} className="mt-6 rounded-full border border-cyan-500/40 bg-cyan-500/15 px-10 py-4 text-sm uppercase tracking-[0.3em] text-cyan-300 transition-all hover:bg-cyan-500/30">
            Play Again
          </button>
        </div>
      )}
      
      {started && !gameOver && (
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex justify-center p-4">
          <div className="flex items-center gap-6 rounded-full border border-white/20 bg-[#0a0a20]/70 px-8 py-3 backdrop-blur-xl">
            <span className="text-2xl font-black text-green-400">{playerScore}</span>
            <span className="text-lg text-white/50">vs</span>
            <span className="text-2xl font-black text-pink-400">{aiScore}</span>
          </div>
        </div>
      )}
    </div>
  );
}
