import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Stars, Html, useProgress } from '@react-three/drei';
import { useRef, Suspense, useMemo } from 'react';
import * as THREE from 'three';

const CanvasLoader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center space-y-3 w-48">
        <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs tracking-widest font-bold">
          SYS.INIT [{progress.toFixed(0)}%]
        </span>
      </div>
    </Html>
  );
};

const HackerMask = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const maskRef = useRef<THREE.Group>(null);

  const extrudeSettings = {
    depth: 0.15,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 2,
    bevelSize: 0.05,
    bevelThickness: 0.05,
  };

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    // Top center
    s.moveTo(0, 1.2);
    // Top right
    s.quadraticCurveTo(0.8, 1.2, 0.9, 0.5);
    // Right cheek
    s.lineTo(0.7, -0.2);
    // Right jaw
    s.lineTo(0.4, -0.9);
    // Chin
    s.lineTo(0, -1.1);
    // Left jaw
    s.lineTo(-0.4, -0.9);
    // Left cheek
    s.lineTo(-0.7, -0.2);
    // Top left
    s.quadraticCurveTo(-0.8, 1.2, 0, 1.2);

    // Right Eye Hole (Angry slant)
    const rightEye = new THREE.Path();
    rightEye.moveTo(0.2, 0.2);
    rightEye.lineTo(0.6, 0.35);
    rightEye.lineTo(0.5, 0.1);
    rightEye.lineTo(0.15, 0.05);
    s.holes.push(rightEye);

    // Left Eye Hole (Angry slant)
    const leftEye = new THREE.Path();
    leftEye.moveTo(-0.2, 0.2);
    leftEye.lineTo(-0.6, 0.35);
    leftEye.lineTo(-0.5, 0.1);
    leftEye.lineTo(-0.15, 0.05);
    s.holes.push(leftEye);
    
    // Mouth Hole (Cyber Slit)
    const mouth = new THREE.Path();
    mouth.moveTo(-0.25, -0.6);
    mouth.lineTo(0.25, -0.6);
    mouth.lineTo(0.2, -0.65);
    mouth.lineTo(-0.2, -0.65);
    s.holes.push(mouth);

    return s;
  }, []);

  const { viewport } = useThree();

  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (groupRef.current && maskRef.current) {
      timeRef.current += delta;
      const t = timeRef.current;
      
      // Intro Animation: Fly in from the left and scale up
      const introDuration = 1.5;
      const progress = Math.min(t / introDuration, 1);
      
      // Easing function (easeOutExpo)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      // Calculate responsive target X position
      const isMobile = viewport.width < 5;
      
      // On mobile: Center the mask horizontally, push it up higher so it sits above the text
      // On desktop: Keep it on the left side
      const targetX = isMobile ? 0 : -viewport.width * 0.25;
      const targetY = isMobile ? 0 : 0; // Center vertically on mobile too
      const startX = targetX - 5;
      
      // Animate position and scale
      groupRef.current.position.x = THREE.MathUtils.lerp(startX, targetX, ease); 
      groupRef.current.position.y = THREE.MathUtils.lerp(targetY + 2, targetY, ease); // Drop down slightly
      groupRef.current.position.z = isMobile ? -2 : 1; // Push further back on mobile
      
      // Scale down on mobile
      const baseScale = isMobile ? 0.8 : 1.2; // Slightly larger on mobile than before
      groupRef.current.scale.setScalar(ease * baseScale);
      
      // Floating animation after intro
      maskRef.current.position.y = Math.sin(t * 2) * 0.1;
      
      // Static rotation (no mouse interaction)
      maskRef.current.rotation.y = THREE.MathUtils.lerp(maskRef.current.rotation.y, isMobile ? 0 : 0.2, 0.1); 
      maskRef.current.rotation.x = THREE.MathUtils.lerp(maskRef.current.rotation.x, 0, 0.1);
    }
  });

  return (
    <group ref={groupRef} position={[-8, 0, 0]}>
      <group ref={maskRef}>
        {/* Hood / Cowl */}
        <mesh position={[0, 0.2, -0.3]}>
          <sphereGeometry args={[1.15, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial 
            color={isDarkMode ? "#022c22" : "#94a3b8"} 
            emissive={isDarkMode ? "#022c22" : "#000000"}
            emissiveIntensity={0.5}
            wireframe={true}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Mask Body */}
        <mesh position={[0, 0, 0]}>
          <extrudeGeometry args={[shape, extrudeSettings]} />
          <meshStandardMaterial 
            color={isDarkMode ? "#0f172a" : "#e2e8f0"} 
            metalness={isDarkMode ? 0.9 : 0.5} 
            roughness={isDarkMode ? 0.1 : 0.4} 
          />
        </mesh>
        
        {/* Glowing Eyes Background */}
        <mesh position={[0.35, 0.2, 0.05]}>
          <planeGeometry args={[0.5, 0.3]} />
          <meshBasicMaterial color="#10b981" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-0.35, 0.2, 0.05]}>
          <planeGeometry args={[0.5, 0.3]} />
          <meshBasicMaterial color="#10b981" side={THREE.DoubleSide} />
        </mesh>

        {/* Glowing Mouth Background */}
        <mesh position={[0, -0.62, 0.05]}>
          <planeGeometry args={[0.5, 0.1]} />
          <meshBasicMaterial color="#10b981" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Point light to cast glow on the hood */}
        <pointLight position={[0, 0, 0.5]} color="#10b981" intensity={isDarkMode ? 1.5 : 2.5} distance={3} />
      </group>
    </group>
  );
};

const ParallaxRig = ({ children }: { children: React.ReactNode }) => {
  // Removed mouse parallax to keep the scene completely static
  return <group>{children}</group>;
};

export default function Scene3D({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 transition-colors duration-700">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} eventSource={document.body} eventPrefix="client">
        <ambientLight intensity={isDarkMode ? 0.1 : 0.6} />
        <directionalLight position={[10, 10, 5]} intensity={isDarkMode ? 1.5 : 1.5} color={isDarkMode ? "#10b981" : "#ffffff"} />
        <pointLight position={[-10, -10, -5]} color={isDarkMode ? "#059669" : "#cbd5e1"} intensity={isDarkMode ? 3 : 1.5} />
        
        <Suspense fallback={<CanvasLoader />}>
          <ParallaxRig>
            <HackerMask isDarkMode={isDarkMode} />
            
            {isDarkMode && <Stars radius={100} depth={50} count={4000} factor={3} saturation={0} fade speed={2} />}
            {!isDarkMode && <Stars radius={100} depth={50} count={1000} factor={2} saturation={0} fade speed={1} />}
          </ParallaxRig>
        </Suspense>
      </Canvas>
      {/* Gradient overlay to make text readable and blend with background */}
      <div className={`absolute inset-0 pointer-events-none transition-colors duration-700 ${isDarkMode ? 'bg-gradient-to-b from-transparent via-black/40 to-black' : 'bg-gradient-to-b from-transparent via-slate-50/40 to-slate-50'}`} />
    </div>
  );
}
