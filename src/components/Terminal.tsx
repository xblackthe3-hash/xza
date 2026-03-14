import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

interface Command {
  cmd: string;
  output: React.ReactNode;
}

export default function Terminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Command[]>([
    {
      cmd: 'system_init',
      output: (
        <div className="text-emerald-400">
          <p>X-Black OS v2.4.1 initialized.</p>
          <p>Type <span className="text-yellow-400">'help'</span> to see available commands.</p>
        </div>
      )
    }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    
    if (!cmd) return;

    let output: React.ReactNode = '';

    switch (cmd) {
      case 'help':
        output = (
          <div className="text-slate-300">
            <p><span className="text-emerald-400">whoami</span> - Display user info</p>
            <p><span className="text-emerald-400">skills</span> - List technical arsenal</p>
            <p><span className="text-emerald-400">contact</span> - Show secure comms</p>
            <p><span className="text-emerald-400">clear</span> - Clear terminal output</p>
          </div>
        );
        break;
      case 'whoami':
        output = <p className="text-slate-300">Sayed Mohamed (X-Black) - Ethical Hacker & Security Researcher. Finding vulnerabilities before the bad guys do.</p>;
        break;
      case 'skills':
        output = (
          <div className="text-slate-300">
            <p>[+] Penetration Testing</p>
            <p>[+] Web App Security</p>
            <p>[+] Network Exploitation</p>
            <p>[+] Reverse Engineering</p>
            <p>[+] Cryptography</p>
          </div>
        );
        break;
      case 'contact':
        output = <p className="text-slate-300">Email: szater600@gmail.com | Status: Listening on Port 443...</p>;
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'sudo hack':
      case 'matrix':
        output = (
          <div className="text-red-500 animate-pulse font-bold">
            <p>[!] WARNING: UNAUTHORIZED ACCESS DETECTED</p>
            <p>[!] INITIATING LOCKDOWN PROTOCOL...</p>
            <p>[!] JUST KIDDING. ENJOY THE SITE!</p>
          </div>
        );
        // Add matrix class to body for 5 seconds
        document.body.classList.add('matrix-mode');
        setTimeout(() => document.body.classList.remove('matrix-mode'), 5000);
        break;
      default:
        output = <p className="text-red-400">Command not found: {cmd}. Type 'help' for available commands.</p>;
    }

    setHistory([...history, { cmd, output }]);
    setInput('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-black/80 backdrop-blur-md rounded-lg border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] overflow-hidden font-mono text-sm">
      {/* Terminal Header */}
      <div className="bg-slate-900 px-4 py-2 border-b border-emerald-500/30 flex items-center gap-2">
        <TerminalIcon size={16} className="text-emerald-500" />
        <span className="text-slate-400 text-xs">root@x-black:~</span>
      </div>
      
      {/* Terminal Body */}
      <div className="p-4 h-64 overflow-y-auto crt-flicker">
        {history.map((item, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center gap-2 text-emerald-500 mb-1">
              <span>root@x-black:~$</span>
              <span className="text-white">{item.cmd}</span>
            </div>
            <div className="pl-4 border-l-2 border-emerald-500/30 ml-2">
              {item.output}
            </div>
          </div>
        ))}
        
        {/* Input Line */}
        <form onSubmit={handleCommand} className="flex items-center gap-2 text-emerald-500 mt-2">
          <span>root@x-black:~$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-white caret-emerald-500"
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
