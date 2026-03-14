import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Trail {
  id: number;
  x: number;
  y: number;
  char: string;
}

export default function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [trails, setTrails] = useState<Trail[]>([]);

  useEffect(() => {
    let trailId = 0;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      if (Math.random() > 0.6) {
        const newTrail = {
          id: trailId++,
          x: e.clientX + (Math.random() * 20 - 10),
          y: e.clientY + (Math.random() * 20 - 10),
          char: Math.random() > 0.5 ? '1' : '0'
        };
        setTrails(prev => [...prev.slice(-12), newTrail]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <div 
        className="fixed top-0 left-0 w-6 h-6 border-2 border-emerald-500 rounded-sm pointer-events-none z-[9999] mix-blend-difference transition-transform duration-75 ease-out"
        style={{ transform: `translate(${mousePos.x - 12}px, ${mousePos.y - 12}px)` }}
      >
        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-emerald-500 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <AnimatePresence>
        {trails.map(trail => (
          <motion.div
            key={trail.id}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: 20, scale: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed text-emerald-500 font-mono text-xs pointer-events-none z-[9998]"
            style={{ left: trail.x, top: trail.y }}
          >
            {trail.char}
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
}
