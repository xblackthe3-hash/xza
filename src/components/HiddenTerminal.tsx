import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, X } from 'lucide-react';

interface HiddenTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HiddenTerminal({ isOpen, onClose }: HiddenTerminalProps) {
  const [history, setHistory] = useState<{cmd: string, output: string | React.ReactNode}[]>([
    { cmd: '', output: 'X-Black Terminal v2.0.0\nType "help" for available commands.' }
  ]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    let output: string | React.ReactNode = '';

    switch (cmd) {
      case 'help':
        output = 'Available commands: whoami, projects, clear, sudo rm -rf /';
        break;
      case 'whoami':
        output = 'X-Black - Elite Cyber Security Expert & Full Stack Developer.';
        break;
      case 'projects':
        output = 'Accessing mainframe... Check the UI for details.';
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'sudo rm -rf /':
        output = <span className="text-red-500">CRITICAL ERROR: SYSTEM DESTRUCTION INITIATED... Just kidding.</span>;
        break;
      case '':
        output = '';
        break;
      default:
        output = `Command not found: ${cmd}`;
    }

    setHistory(prev => [...prev, { cmd, output }]);
    setInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="fixed bottom-4 right-4 w-full max-w-lg h-96 bg-black/95 border border-emerald-500/50 rounded-lg shadow-[0_0_30px_rgba(16,185,129,0.3)] z-[9999] flex flex-col overflow-hidden backdrop-blur-xl font-mono"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-emerald-900/40 border-b border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold">
              <TerminalIcon size={16} />
              <span>root@x-black:~</span>
            </div>
            <button onClick={onClose} className="text-emerald-500/70 hover:text-emerald-500 transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto text-sm text-emerald-400/90 space-y-3" onClick={() => inputRef.current?.focus()}>
            {history.map((item, i) => (
              <div key={i}>
                {item.cmd && <div className="mb-1"><span className="text-emerald-500 font-bold">root@x-black:~$</span> {item.cmd}</div>}
                <div className="whitespace-pre-wrap">{item.output}</div>
              </div>
            ))}
            <form onSubmit={handleCommand} className="flex items-center gap-2 mt-2">
              <span className="text-emerald-500 font-bold">root@x-black:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-emerald-400 caret-emerald-500"
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
            </form>
            <div ref={bottomRef} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
