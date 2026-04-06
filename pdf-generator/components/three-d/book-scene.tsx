'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { ColorScheme } from '@/lib/types';

interface BookMeshProps {
  colorScheme: ColorScheme;
  title: string;
}

function BookMesh({ colorScheme, title }: BookMeshProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const frontTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 720;
    const ctx = canvas.getContext('2d')!;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 512, 720);
    grad.addColorStop(0, colorScheme.primary);
    grad.addColorStop(1, colorScheme.secondary);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 720);

    // Decorative circle
    ctx.beginPath();
    ctx.arc(400, 100, 80, 0, Math.PI * 2);
    ctx.fillStyle = colorScheme.accent + '40';
    ctx.fill();

    // Title text
    ctx.fillStyle = colorScheme.text;
    ctx.font = 'bold 42px sans-serif';
    ctx.textAlign = 'left';
    const words = (title || 'eBook Title').split(' ');
    let y = 300;
    let line = '';
    for (const word of words) {
      const test = line + word + ' ';
      if (ctx.measureText(test).width > 440) {
        ctx.fillText(line.trim(), 36, y);
        line = word + ' ';
        y += 52;
      } else {
        line = test;
      }
    }
    ctx.fillText(line.trim(), 36, y);

    // Accent line
    ctx.fillStyle = colorScheme.accent;
    ctx.fillRect(36, 240, 80, 4);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [colorScheme, title]);

  const spineTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 720;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = colorScheme.secondary;
    ctx.fillRect(0, 0, 64, 720);
    ctx.fillStyle = colorScheme.text;
    ctx.font = 'bold 18px sans-serif';
    ctx.save();
    ctx.translate(38, 360);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText((title || 'eBook').substring(0, 30), 0, 0);
    ctx.restore();
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [colorScheme, title]);

  const materials = useMemo(() => [
    new THREE.MeshStandardMaterial({ map: spineTexture }), // right (spine)
    new THREE.MeshStandardMaterial({ color: colorScheme.background }), // left
    new THREE.MeshStandardMaterial({ color: colorScheme.secondary }), // top
    new THREE.MeshStandardMaterial({ color: colorScheme.secondary }), // bottom
    new THREE.MeshStandardMaterial({ map: frontTexture }), // front
    new THREE.MeshStandardMaterial({ color: colorScheme.background }), // back
  ], [frontTexture, spineTexture, colorScheme]);

  return (
    <group ref={groupRef}>
      <RoundedBox args={[3, 4.2, 0.35]} radius={0.02} smoothness={4} material={materials}>
      </RoundedBox>
    </group>
  );
}

interface BookSceneProps {
  colorScheme: ColorScheme;
  title: string;
  className?: string;
}

export function BookScene({ colorScheme, title, className = '' }: BookSceneProps) {
  return (
    <div className={`w-full aspect-square ${className}`}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} />
        <BookMesh colorScheme={colorScheme} title={title} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={(3 * Math.PI) / 4}
        />
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}
