"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";
import { GRID_SIZE, getTilePosition, canMove, type PuzzleState } from "./puzzle-logic";

const TILE_SIZE = 1.05;
const GAP = 0.08;
const TILE_SPACING = TILE_SIZE + GAP;
const BOARD_OFFSET = ((GRID_SIZE - 1) * TILE_SPACING) / 2;

function Tile({
  value,
  index,
  emptyIndex,
  onMove,
  isComplete,
}: {
  value: number;
  index: number;
  emptyIndex: number;
  onMove: (i: number) => void;
  isComplete: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const targetPos = useRef(new THREE.Vector3());
  const currentPos = useRef(new THREE.Vector3());
  const hovered = useRef(false);
  const scaleTarget = useRef(1);

  const { row, col } = getTilePosition(index);
  const movable = canMove(index, emptyIndex);

  const x = col * TILE_SPACING - BOARD_OFFSET;
  const z = row * TILE_SPACING - BOARD_OFFSET;
  targetPos.current.set(x, movable ? 0.08 : 0, z);

  const color = useMemo(() => {
    if (isComplete) return new THREE.Color("#22c55e");
    const hue = (value / 15) * 0.6 + 0.55;
    return new THREE.Color().setHSL(hue % 1, 0.5, 0.65);
  }, [value, isComplete]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    currentPos.current.lerp(targetPos.current, 1 - Math.exp(-12 * delta));
    meshRef.current.position.copy(currentPos.current);
    const ts = hovered.current && movable ? 1.05 : 1;
    scaleTarget.current += (ts - scaleTarget.current) * 0.15;
    meshRef.current.scale.setScalar(scaleTarget.current);
  });

  return (
    <group
      ref={meshRef}
      position={[x, 0, z]}
      onClick={(e) => { e.stopPropagation(); if (movable) onMove(index); }}
      onPointerOver={() => { hovered.current = true; if (movable) document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { hovered.current = false; document.body.style.cursor = "default"; }}
    >
      <RoundedBox args={[TILE_SIZE, 0.35, TILE_SIZE]} radius={0.08} smoothness={4}>
        <meshPhysicalMaterial
          color={color}
          metalness={0.1}
          roughness={0.05}
          transmission={0.92}
          thickness={0.5}
          ior={1.5}
          envMapIntensity={1.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transparent
        />
      </RoundedBox>
      <Text
        position={[0, 0.19, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.38}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {String(value)}
      </Text>
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[TILE_SIZE * 0.9, TILE_SIZE * 0.9]} />
        <meshBasicMaterial color={color} transparent opacity={movable ? 0.3 : 0.08} />
      </mesh>
    </group>
  );
}

function BoardBase() {
  const totalSize = GRID_SIZE * TILE_SPACING + 0.4;
  return (
    <group position={[0, -0.25, 0]}>
      <RoundedBox args={[totalSize, 0.15, totalSize]} radius={0.12} smoothness={4}>
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.15} />
      </RoundedBox>
      <mesh position={[0, 0.076, 0]}>
        <boxGeometry args={[totalSize - 0.3, 0.02, totalSize - 0.3]} />
        <meshStandardMaterial color="#0f0f1a" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

export default function PuzzleBoard({ gameState, onMove }: { gameState: PuzzleState; onMove: (i: number) => void }) {
  return (
    <group>
      <BoardBase />
      {gameState.tiles.map((value, index) => {
        if (value === 0) return null;
        return (
          <Tile key={value} value={value} index={index} emptyIndex={gameState.emptyIndex} onMove={onMove} isComplete={gameState.isComplete} />
        );
      })}
    </group>
  );
}
