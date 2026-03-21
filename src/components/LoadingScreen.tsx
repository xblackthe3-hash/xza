import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const bootLines = [
  "INITIALIZING X-BLACK OS v4.0.2...",
  "LOADING KERNEL MODULES...",
  "ESTABLISHING SECURE CONNECTION...",
  "BYPASSING FIREWALLS...",
  "DECRYPTING ASSETS...",
  "MOUNTING VIRTUAL DRIVES...",
  "STARTING NEURAL INTERFACE...",
  "ACCESS GRANTED."
];

export default function LoadingScreen({ onFinished }: { onFinished: () => void }) {
  const [currentLine, setCurrentLine] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentLine < bootLines.length) {
      const timer = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
        setProgress((currentLine + 1) / bootLines.length * 100);
      }, 400 + Math.random() * 600);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        onFinished();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentLine, onFinished]);

  return (
    <motion.div 
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center font-mono p-6 overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 flex items-center justify-between text-emerald-500 text-xs">
          <span>X-BLACK_BOOT_SEQUENCE</span>
          <span>{Math.round(progress)}%</span>
        </div>
        
        <div className="h-1 w-full bg-emerald-950 rounded-full overflow-hidden mb-8 border border-emerald-500/20">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
          />
        </div>

        <div className="space-y-2">
          {bootLines.slice(0, currentLine + 1).map((line, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-sm ${index === currentLine ? 'text-emerald-400' : 'text-emerald-800'}`}
            >
              <span className="mr-2">[{index === currentLine ? '>' : '✓'}]</span>
              {line}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative CRT Scanline */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_4px,3px_100%]"></div>
    </motion.div>
  );
}
