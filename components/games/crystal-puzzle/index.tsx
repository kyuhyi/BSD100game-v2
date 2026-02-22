"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import PuzzleBoard from "./PuzzleBoard";
import { createInitialState, shufflePuzzle, moveTile, formatTime, type PuzzleState } from "./puzzle-logic";

function Scene({ gameState, onMove }: { gameState: PuzzleState; onMove: (i: number) => void }) {
  return (
    <Canvas camera={{ position: [0, 5.5, 5.5], fov: 45 }} gl={{ antialias: true }} dpr={[1, 2]}>
      <color attach="background" args={["#0a0a12"]} />
      <fog attach="fog" args={["#0a0a12", 12, 25]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#e0e0ff" />
      <directionalLight position={[-5, 6, -5]} intensity={0.4} color="#8080ff" />
      <pointLight position={[0, 4, 0]} intensity={0.8} color="#6366f1" />
      <spotLight position={[0, 10, 0]} angle={0.4} penumbra={0.8} intensity={1.5} color="#818cf8" />
      <Suspense fallback={null}>
        <PuzzleBoard gameState={gameState} onMove={onMove} />
        <Environment preset="night" />
      </Suspense>
      <ContactShadows position={[0, -0.33, 0]} opacity={0.5} scale={12} blur={2} far={4} />
      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={14}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        autoRotate={gameState.isComplete}
        autoRotateSpeed={1.5}
      />
      <EffectComposer>
        <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} intensity={0.5} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}

function Timer({ startTime }: { startTime: number | null }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!startTime) return;
    const id = setInterval(() => setElapsed(Date.now() - startTime), 100);
    return () => clearInterval(id);
  }, [startTime]);
  return <span>{formatTime(elapsed)}</span>;
}

export default function CrystalPuzzleGame() {
  const [gameState, setGameState] = useState<PuzzleState>(() => shufflePuzzle(createInitialState()));
  const [started, setStarted] = useState(false);

  const handleMove = useCallback((i: number) => {
    setGameState((prev) => (prev.isComplete ? prev : moveTile(prev, i)));
  }, []);

  const handleNewGame = useCallback(() => {
    setGameState(shufflePuzzle(createInitialState()));
    setStarted(true);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ height: "min(70vh, 560px)", background: "#0a0a12" }}>
      {/* 3D Scene */}
      <Scene gameState={gameState} onMove={handleMove} />

      {/* Start overlay */}
      {!started && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a12]/85 backdrop-blur-xl">
          <h2
            className="m-0 text-4xl font-extralight uppercase tracking-[0.3em] text-slate-200 sm:text-5xl"
            style={{ textShadow: "0 0 40px rgba(99,102,241,0.6), 0 0 80px rgba(99,102,241,0.3)" }}
          >
            Crystal Puzzle
          </h2>
          <p className="mt-2 text-xs font-light uppercase tracking-[0.5em] text-indigo-400 sm:text-sm">3D Sliding Puzzle</p>
          <button
            onClick={() => setStarted(true)}
            className="mt-8 cursor-pointer rounded-xl border border-indigo-500/40 bg-indigo-500/15 px-8 py-3 text-sm uppercase tracking-[0.3em] text-slate-200 backdrop-blur-md transition-all hover:border-indigo-500/70 hover:bg-indigo-500/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
          >
            Start Game
          </button>
        </div>
      )}

      {/* Win overlay */}
      {started && gameState.isComplete && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a12]/90 backdrop-blur-2xl animate-in fade-in duration-500">
          <h2
            className="m-0 text-3xl font-extralight uppercase tracking-[0.25em] text-emerald-500 sm:text-4xl"
            style={{ textShadow: "0 0 40px rgba(34,197,94,0.5), 0 0 80px rgba(34,197,94,0.2)" }}
          >
            Puzzle Complete!
          </h2>
          <div className="mt-6 flex gap-6">
            <div className="rounded-xl border border-emerald-500/30 bg-[#0f0f1e]/70 px-5 py-3 text-center backdrop-blur-xl">
              <div className="text-[0.6rem] font-normal uppercase tracking-[0.25em] text-emerald-500">Moves</div>
              <div className="text-2xl font-extralight text-slate-200">{gameState.moves}</div>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-[#0f0f1e]/70 px-5 py-3 text-center backdrop-blur-xl">
              <div className="text-[0.6rem] font-normal uppercase tracking-[0.25em] text-emerald-500">Time</div>
              <div className="text-2xl font-extralight text-slate-200">{formatTime(gameState.startTime ? Date.now() - gameState.startTime : 0)}</div>
            </div>
          </div>
          <button
            onClick={handleNewGame}
            className="mt-8 cursor-pointer rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-8 py-3 text-sm uppercase tracking-[0.3em] text-slate-200 backdrop-blur-md transition-all hover:border-emerald-500/70 hover:bg-emerald-500/30 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]"
          >
            Play Again
          </button>
        </div>
      )}

      {/* In-game HUD */}
      {started && !gameState.isComplete && (
        <>
          <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex justify-between p-4">
            <div className="rounded-xl border border-indigo-500/20 bg-[#0f0f1e]/70 px-4 py-2 backdrop-blur-xl">
              <div className="text-[0.6rem] font-normal uppercase tracking-[0.25em] text-indigo-400">Moves</div>
              <div className="text-lg font-extralight tracking-wider text-slate-200">{gameState.moves}</div>
            </div>
            <div className="rounded-xl border border-indigo-500/20 bg-[#0f0f1e]/70 px-4 py-2 backdrop-blur-xl">
              <div className="text-[0.6rem] font-normal uppercase tracking-[0.25em] text-indigo-400">Time</div>
              <div className="text-lg font-extralight tracking-wider text-slate-200">
                <Timer startTime={gameState.startTime} />
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 flex justify-center p-4">
            <button
              onClick={handleNewGame}
              className="pointer-events-auto cursor-pointer rounded-lg border border-indigo-500/20 bg-[#0f0f1e]/70 px-5 py-2 text-xs uppercase tracking-[0.25em] text-indigo-400 backdrop-blur-xl transition-all hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
            >
              New Game
            </button>
          </div>
        </>
      )}
    </div>
  );
}
