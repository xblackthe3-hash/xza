import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { playUISound } from '../utils/sounds';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export default function SpotlightCard({ 
  children, 
  className = '', 
  spotlightColor = 'rgba(16, 185, 129, 0.15)' 
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
    playUISound('hover');
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 transition-colors duration-300 group ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      {/* Border glow effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 z-0 rounded-3xl border border-emerald-500/0 group-hover:border-emerald-500/50"
        style={{
          opacity,
          maskImage: `radial-gradient(300px circle at ${position.x}px ${position.y}px, black, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(300px circle at ${position.x}px ${position.y}px, black, transparent 100%)`,
        }}
      />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
}
