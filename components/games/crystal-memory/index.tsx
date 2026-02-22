"use client";

import { useState, useCallback, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Text, Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const SYMBOLS = ["♠", "♥", "♦", "♣", "★", "●", "▲", "■"];
const COLORS = ["#6366f1", "#ec4899", "#f97316", "#22c55e", "#06b6d4", "#eab308", "#8b5cf6", "#f43f5e"];

type Card = { id: number; symbol: string; color: string; flipped: boolean; matched: boolean };

function createDeck(): Card[] {
  const pairs = SYMBOLS.slice(0, 8);
  const cards: Card[] = [];
  pairs.forEach((symbol, i) => {
    cards.push({ id: i * 2, symbol, color: COLORS[i], flipped: false, matched: false });
    cards.push({ id: i * 2 + 1, symbol, color: COLORS[i], flipped: false, matched: false });
  });
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

function Card3D({ card, index, onClick }: { card: Card; index: number; onClick: () => void }) {
  const ref = useRef<THREE.Group>(null);
  const targetFlip = card.flipped || card.matched ? Math.PI : 0;
  const currentFlip = useRef(0);
  const col = index % 4;
  const row = Math.floor(index / 4);
  const x = (col - 1.5) * 1.35;
  const z = (row - 1.5) * 1.7;

  useFrame((_, delta) => {
    if (!ref.current) return;
    currentFlip.current += (targetFlip - currentFlip.current) * Math.min(1, delta * 10);
    ref.current.rotation.y = currentFlip.current;
    const targetY = card.matched ? -0.5 : 0;
    ref.current.position.y += (targetY - ref.current.position.y) * 0.08;
  });

  return (
    <group ref={ref} position={[x, 0, z]} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* Card back */}
      <RoundedBox args={[1.1, 0.08, 1.4]} radius={0.06} smoothness={4}>
        <meshPhysicalMaterial
          color="#1e1b4b"
          metalness={0.5}
          roughness={0.1}
          clearcoat={1}
          side={THREE.DoubleSide}
        />
      </RoundedBox>
      {/* Back pattern */}
      <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.8, 1.1]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      {/* Card front (symbol) - faces -Z initially, visible when flipped 180 */}
      <Text
        position={[0, 0.045, 0]}
        rotation={[-Math.PI / 2, Math.PI, 0]}
        fontSize={0.55}
        color={card.color}
        anchorX="center"
        anchorY="middle"
      >
        {card.symbol}
      </Text>
      {/* Glow for matched */}
      {card.matched && (
        <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.3, 1.6]} />
          <meshBasicMaterial color={card.color} transparent opacity={0.2} />
        </mesh>
      )}
    </group>
  );
}

function Scene({ cards, onCardClick }: { cards: Card[]; onCardClick: (i: number) => void }) {
  return (
    <Canvas camera={{ position: [0, 6, 5], fov: 45 }} gl={{ antialias: true }} dpr={[1, 2]}>
      <color attach="background" args={["#0a0a12"]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 8, 5]} intensity={1} color="#e0e0ff" />
      <pointLight position={[0, 3, 0]} intensity={0.8} color="#6366f1" />
      <Suspense fallback={null}>
        {cards.map((card, i) => (
          <Card3D key={card.id} card={card} index={i} onClick={() => onCardClick(i)} />
        ))}
        {/* Table */}
        <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8, 10]} />
          <meshStandardMaterial color="#0f0f1a" metalness={0.8} roughness={0.2} />
        </mesh>
        <Environment preset="night" />
      </Suspense>
      <EffectComposer>
        <Bloom luminanceThreshold={0.5} intensity={0.5} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}

export default function CrystalMemoryGame() {
  const [cards, setCards] = useState<Card[]>(createDeck);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [started, setStarted] = useState(false);
  const locked = useRef(false);

  const matched = cards.filter((c) => c.matched).length;
  const isComplete = matched === cards.length;

  const handleCardClick = useCallback((index: number) => {
    if (locked.current) return;
    const card = cards[index];
    if (card.flipped || card.matched) return;

    const newCards = [...cards];
    newCards[index] = { ...card, flipped: true };
    const newSelected = [...selected, index];
    setCards(newCards);
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      locked.current = true;
      const [a, b] = newSelected;
      if (newCards[a].symbol === newCards[b].symbol) {
        setTimeout(() => {
          setCards((prev) => prev.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)));
          setSelected([]);
          locked.current = false;
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) => prev.map((c, i) => (i === a || i === b ? { ...c, flipped: false } : c)));
          setSelected([]);
          locked.current = false;
        }, 800);
      }
    }
  }, [cards, selected]);

  const handleRestart = useCallback(() => {
    setCards(createDeck());
    setSelected([]);
    setMoves(0);
    setStarted(true);
    locked.current = false;
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ height: "min(70vh, 560px)", background: "#0a0a12" }}>
      <Scene cards={cards} onCardClick={started && !isComplete ? handleCardClick : () => {}} />

      {!started && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a12]/85 backdrop-blur-xl">
          <h2 className="text-4xl font-extralight uppercase tracking-[0.3em] text-slate-200 sm:text-5xl" style={{ textShadow: "0 0 40px rgba(236,72,153,0.6)" }}>
            Crystal Memory
          </h2>
          <p className="mt-2 text-xs font-light uppercase tracking-[0.5em] text-pink-400">3D Card Matching</p>
          <button onClick={() => setStarted(true)} className="mt-8 rounded-xl border border-pink-500/40 bg-pink-500/15 px-8 py-3 text-sm uppercase tracking-[0.3em] text-slate-200 transition-all hover:bg-pink-500/30 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]">
            Start Game
          </button>
        </div>
      )}

      {isComplete && started && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a12]/90 backdrop-blur-2xl">
          <h2 className="text-3xl font-extralight uppercase tracking-[0.25em] text-emerald-500" style={{ textShadow: "0 0 40px rgba(34,197,94,0.5)" }}>
            Complete!
          </h2>
          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-[#0f0f1e]/70 px-6 py-3 text-center backdrop-blur-xl">
            <div className="text-[0.6rem] uppercase tracking-[0.25em] text-emerald-400">Moves</div>
            <div className="text-3xl font-extralight text-slate-200">{moves}</div>
          </div>
          <button onClick={handleRestart} className="mt-6 rounded-xl border border-pink-500/40 bg-pink-500/15 px-8 py-3 text-sm uppercase tracking-[0.3em] text-slate-200 transition-all hover:bg-pink-500/30">
            Play Again
          </button>
        </div>
      )}

      {started && !isComplete && (
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex justify-between p-4">
          <div className="rounded-xl border border-pink-500/20 bg-[#0f0f1e]/70 px-4 py-2 backdrop-blur-xl">
            <div className="text-[0.6rem] uppercase tracking-[0.25em] text-pink-400">Moves</div>
            <div className="text-lg font-extralight text-slate-200">{moves}</div>
          </div>
          <div className="rounded-xl border border-pink-500/20 bg-[#0f0f1e]/70 px-4 py-2 backdrop-blur-xl">
            <div className="text-[0.6rem] uppercase tracking-[0.25em] text-pink-400">Pairs</div>
            <div className="text-lg font-extralight text-slate-200">{matched / 2}/8</div>
          </div>
        </div>
      )}
    </div>
  );
}
