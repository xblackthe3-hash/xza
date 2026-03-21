import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

function CyberShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[2, 0]} />
        <MeshDistortMaterial
          color="#10b981"
          speed={3}
          distort={0.4}
          radius={1}
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <octahedronGeometry args={[2.2, 0]} />
        <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.1} />
      </mesh>
    </Float>
  );
}

export default function CyberScene() {
  return (
    <div className="w-full h-[400px] md:h-[600px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} color="#10b981" intensity={2} />
        <CyberShape />
      </Canvas>
    </div>
  );
}
