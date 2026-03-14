import React, { useState, useEffect } from 'react';
import { triggerHaptic } from '../App';

export default function SelfDestruct({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(5);
  const [isBlack, setIsBlack] = useState(false);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(c => c - 1);
        triggerHaptic([200, 100, 200]);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (count === 0 && !isBlack) {
      setIsBlack(true);
      triggerHaptic([500, 200, 500]);
      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  }, [count, isBlack, onComplete]);

  if (isBlack) {
    return (
      <div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center">
        <div className="text-emerald-500 font-mono animate-pulse">System Rebooted.</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] bg-red-950/80 flex items-center justify-center animate-shake backdrop-blur-sm">
      <div className="absolute inset-0 bg-red-500/20 mix-blend-overlay animate-pulse"></div>
      <div className="text-[15rem] md:text-[20rem] font-black text-red-500 drop-shadow-[0_0_50px_rgba(239,68,68,1)] leading-none">
        {count}
      </div>
      <div className="absolute bottom-20 text-red-500 text-2xl md:text-4xl font-bold tracking-widest animate-pulse text-center px-4">
        SELF DESTRUCT INITIATED
      </div>
    </div>
  );
}
