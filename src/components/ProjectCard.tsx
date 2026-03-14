import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SpotlightCard from './SpotlightCard';
import { ExternalLink, Skull } from 'lucide-react';
import { triggerHaptic } from '../App';

export default function ProjectCard({ project, idx, isDarkWeb }: { project: any, idx: number, isDarkWeb?: boolean }) {
  const [isHacked, setIsHacked] = useState(false);
  const [lastTap, setLastTap] = useState(0);

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      triggerHaptic([50, 50, 100]);
      setIsHacked(true);
      setTimeout(() => setIsHacked(false), 2000);
    } else {
      triggerHaptic(15);
    }
    setLastTap(now);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.6 }}
      className="h-full min-w-[85vw] md:min-w-0 snap-center active:scale-[0.98] transition-transform duration-200 relative cursor-pointer"
      onClick={handleTap}
    >
      <SpotlightCard className="h-full group relative overflow-hidden rounded-3xl bg-white dark:bg-black/60 border border-slate-200 dark:border-emerald-500/20 backdrop-blur-sm shadow-xl shadow-slate-200/40 dark:shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:dark:shadow-[0_0_25px_rgba(16,185,129,0.2)] transition-all duration-500" spotlightColor="rgba(16, 185, 129, 0.2)">
        {isDarkWeb && project.price && (
          <div className="absolute top-4 left-4 bg-black/80 text-amber-500 font-mono text-xs px-3 py-1 border border-amber-500/50 rounded-full backdrop-blur-md z-20 flex items-center gap-2">
            <Skull size={12} />
            {project.price}
          </div>
        )}
        <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0`}></div>
        <div className="p-8 relative z-10 h-full flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-emerald-400 mt-6 md:mt-0">{project.title}</h3>
            <a href="#" onClick={(e) => { e.stopPropagation(); triggerHaptic(30); }} className="p-2 rounded-full bg-slate-50 dark:bg-[#1a1a1a] hover:bg-slate-100 dark:hover:bg-emerald-900/30 text-slate-600 dark:text-emerald-500 border border-slate-100 dark:border-emerald-500/30 transition-colors">
              <ExternalLink size={20} />
            </a>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow leading-relaxed">{project.desc}</p>
          <div className="flex flex-wrap gap-2" dir="ltr">
            {project.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-slate-50 dark:bg-emerald-900/20 text-slate-600 dark:text-emerald-400 border border-slate-200 dark:border-emerald-500/30">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {isHacked && (
            <motion.div
              initial={{ opacity: 0, scale: 2, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: -10 }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none bg-emerald-900/40 backdrop-blur-sm rounded-3xl"
            >
              <div className="border-4 border-emerald-500 text-emerald-500 text-4xl md:text-5xl font-black p-4 rounded-lg uppercase tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.6)] bg-black/60" style={{ textShadow: '0 0 15px rgba(16,185,129,0.9)' }}>
                ACCESS GRANTED
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SpotlightCard>
    </motion.div>
  );
}
