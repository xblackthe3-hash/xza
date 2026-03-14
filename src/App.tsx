import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import Scene3D from './components/Scene3D';
import TerminalComponent from './components/Terminal';
import DecryptText from './components/DecryptText';
import SpotlightCard from './components/SpotlightCard';
import MagneticButton from './components/MagneticButton';
import ProjectCard from './components/ProjectCard';
import SelfDestruct from './components/SelfDestruct';
import HiddenTerminal from './components/HiddenTerminal';
import MatrixRain from './components/MatrixRain';
import CustomCursor from './components/CustomCursor';
import Typewriter from './components/Typewriter';
import { Code2, Terminal, Cpu, Globe, Layers, Smartphone, Mail, Github, Facebook, Instagram, ExternalLink, ChevronDown, MessageCircle, ShieldAlert, Wifi, Search, Lock, Home, Briefcase, Skull, Music, VolumeX } from 'lucide-react';

export const triggerHaptic = (pattern: number | number[] = 50) => {
  if (typeof window !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

const fadeInUp: any = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 1.2, // Wait for the 3D mask to fly in
      staggerChildren: 0.2
    }
  }
};

export default function App() {
  const [isRedTeam, setIsRedTeam] = useState(false);
  const [isDarkWeb, setIsDarkWeb] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isDestructing, setIsDestructing] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const reqRef = useRef<number | undefined>(undefined);
  const playPromiseRef = useRef<Promise<void> | undefined>(undefined);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!audioRef.current) {
        toggleMusic();
      }
      ['click', 'touchstart', 'keydown'].forEach(evt => 
        document.removeEventListener(evt, handleFirstInteraction)
      );
    };

    ['click', 'touchstart', 'keydown'].forEach(evt => 
      document.addEventListener(evt, handleFirstInteraction)
    );

    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
      ['click', 'touchstart', 'keydown'].forEach(evt => 
        document.removeEventListener(evt, handleFirstInteraction)
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Terminal toggle
      if (e.key === '`' || e.key === '~') {
        setIsTerminalOpen(prev => !prev);
      }

      // Konami code
      if (e.key === konamiCode[konamiIndex]) {
        if (konamiIndex === konamiCode.length - 1) {
          setIsDarkWeb(true);
          triggerHaptic([100, 50, 100]);
          setKonamiIndex(0);
        } else {
          setKonamiIndex(prev => prev + 1);
        }
      } else {
        setKonamiIndex(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex]);

  const toggleMusic = () => {
    if (!audioRef.current) {
      const audio = new Audio('https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3');
      audio.crossOrigin = "anonymous";
      audio.loop = true;
      audioRef.current = audio;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;
        const source = ctx.createMediaElementSource(audio);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyser.connect(ctx.destination);
        analyserRef.current = analyser;
      }
    }

    if (isPlayingMusic) {
      setIsPlayingMusic(false);
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
      document.documentElement.style.setProperty('--audio-intensity', '0');
      
      if (playPromiseRef.current !== undefined) {
        playPromiseRef.current.then(() => {
          audioRef.current?.pause();
        }).catch(e => console.error("Audio pause failed:", e));
      } else {
        audioRef.current?.pause();
      }
    } else {
      audioCtxRef.current?.resume();
      const promise = audioRef.current?.play();
      playPromiseRef.current = promise;
      
      if (promise !== undefined) {
        promise.catch(e => {
          console.error("Audio play failed:", e);
          setIsPlayingMusic(false);
        });
      }
      
      setIsPlayingMusic(true);
      updateVisualizer();
    }
  };

  const updateVisualizer = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculate average bass (lower frequencies)
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += dataArray[i];
    }
    const average = sum / 10;
    const intensity = average / 255; // 0 to 1
    
    document.documentElement.style.setProperty('--audio-intensity', intensity.toString());
    reqRef.current = requestAnimationFrame(updateVisualizer);
  };

  const handlePressStart = () => {
    const timer = setTimeout(() => {
      setIsRedTeam(prev => !prev);
      triggerHaptic([100, 50, 100, 50, 500]);
    }, 2000); // 2 seconds long press
    setPressTimer(timer);
  };

  const handlePressEnd = () => {
    if (pressTimer) clearTimeout(pressTimer);
  };

  if (isDestructing) {
    return <SelfDestruct onComplete={() => window.location.reload()} />;
  }

  // Determine the filter based on mode. RedTeam = hue-rotate(225deg), DarkWeb = hue-rotate(-90deg)
  const themeFilter = isDarkWeb ? 'hue-rotate(-90deg) saturate(1.5) contrast(1.1)' : isRedTeam ? 'hue-rotate(225deg) saturate(1.5)' : 'none';

  return (
    <div className={`relative w-full min-h-screen selection:bg-emerald-500/30 transition-all duration-1000 ${isDarkWeb ? 'dark-web' : ''}`} style={{ filter: themeFilter }}>
      <CustomCursor />
      <MatrixRain />
      <HiddenTerminal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
      
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-[100] shadow-[0_0_15px_rgba(16,185,129,1)] audio-reactive-glow"
        style={{ scaleX }}
      />
      <div className="scanlines"></div>
      <div className="fixed inset-0 -z-20 bg-slate-50 dark:bg-black transition-colors duration-500"></div>
      <div className="fixed inset-0 -z-20 opacity-[0.03] dark:opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <Scene3D isDarkMode={true} />

      <div className="relative z-10 w-full h-full">
        {/* Navbar */}
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
          className="fixed top-0 w-full z-50 bg-white/70 dark:bg-black/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-emerald-500/10 shadow-sm dark:shadow-[0_4px_30px_rgba(16,185,129,0.05)] transition-colors duration-500"
        >
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <motion.div 
              whileHover={{ scale: 1.05, textShadow: "0px 0px 8px rgb(16 185 129 / 0.5)" }}
              onTouchStart={handlePressStart}
              onTouchEnd={handlePressEnd}
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-500 bg-clip-text text-transparent font-mono tracking-wider cursor-pointer select-none glitch-hover" 
              data-text="X-Black."
              dir="ltr"
            >
              X-Black.
            </motion.div>
            <div className="flex items-center gap-8">
              <div className="hidden md:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-900/50 p-1 rounded-full border border-slate-200/50 dark:border-emerald-500/20 backdrop-blur-md">
                {['عني', 'العدة', 'عملياتي', 'تواصل'].map((item, index) => {
                  const hrefs = ['#about', '#skills', '#projects', '#contact'];
                  return (
                    <motion.a 
                      key={item}
                      href={hrefs[index]} 
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors relative group"
                    >
                      {item}
                      <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/70 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </motion.a>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMusic}
                  className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-emerald-500/30 transition-all shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center justify-center"
                  aria-label="Toggle Audio Reactive UI"
                >
                  {isPlayingMusic ? <VolumeX size={18} className="audio-reactive-scale" /> : <Music size={18} />}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.nav>

        <main className="container mx-auto px-6 pt-32 pb-20">
          {/* Hero Section */}
          <section id="about" className="min-h-[80vh] flex flex-col lg:flex-row justify-between items-center gap-12 relative">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl w-full lg:w-1/2"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-sm font-mono font-bold mb-6 shadow-sm dark:shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-colors duration-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-500"></span>
                </span>
                SYSTEM_ONLINE // متاح للعمل
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-slate-900 dark:text-white transition-colors duration-500">
                <Typewriter text="أنا سيد محمد" delay={100} /> <br/>
                <span className="text-3xl md:text-4xl text-slate-500 dark:text-slate-400 font-medium mt-2 block">المعروف بـ </span>
                <motion.span 
                  initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: 2.2, type: "spring", bounce: 0.5 }}
                  className="inline-block mt-2 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 dark:from-emerald-400 dark:via-green-400 dark:to-teal-400 bg-clip-text text-transparent font-mono font-black tracking-widest uppercase drop-shadow-sm dark:drop-shadow-[0_0_20px_rgba(16,185,129,0.6)] glitch-text" 
                  data-text="X-Black"
                  dir="ltr">
                  X-Black
                </motion.span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl leading-relaxed transition-colors duration-500">
                {isDarkWeb 
                  ? "مرحباً بك في السوق السوداء. نوفر لك أحدث الثغرات (0-Day)، أدوات الاختراق المتقدمة، وخدمات الهندسة الاجتماعية. الدفع بالعملات المشفرة فقط." 
                  : "هاكر أخلاقي ومكتشف ثغرات، بلعب في الكود زي ما بلعب في الشارع. بحب أنكش في الأنظمة، أطلع الثغرات من تحت الأرض، وأأمن السيرفرات عشان تنام وانت مطمن. دايماً جاهز لأي تحدي تقني يقلب الموازين."}
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mb-16">
                <MagneticButton href="#projects" onClick={() => triggerHaptic(30)} className="px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold transition-all shadow-lg shadow-emerald-600/30 dark:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-emerald-600/50 dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] inline-block">
                  استكشف العمليات
                </MagneticButton>
                <MagneticButton href="#contact" onClick={() => triggerHaptic(30)} className="px-8 py-3.5 rounded-full bg-white hover:bg-slate-50 dark:bg-[#0a0a0a] dark:hover:bg-slate-900 border border-slate-300 dark:border-emerald-500/30 text-slate-700 dark:text-emerald-400 font-bold transition-all shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.1)] backdrop-blur-sm inline-block">
                  تواصل مشفر
                </MagneticButton>
              </motion.div>

              {/* Interactive Terminal */}
              <motion.div variants={fadeInUp} className="w-full mt-8">
                <TerminalComponent />
              </motion.div>
            </motion.div>

            {/* Profile Image Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 1.5, type: "spring" }}
              className="w-full lg:w-1/2 flex justify-center lg:justify-end relative mt-12 lg:mt-0"
            >
              <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 group perspective-1000">
                {/* Animated Border/Frame */}
                <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-2xl transform group-hover:rotate-3 transition-transform duration-500 audio-reactive-border audio-reactive-glow"></div>
                <div className="absolute inset-0 border-2 border-teal-500/30 rounded-2xl transform group-hover:-rotate-3 transition-transform duration-500 audio-reactive-border"></div>
                
                {/* Image Container */}
                <div className="absolute inset-0 bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 dark:border-emerald-500/50 shadow-2xl dark:shadow-[0_0_30px_rgba(16,185,129,0.2)] audio-reactive-scale">
                  <div className="absolute inset-0 bg-emerald-500/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none"></div>
                  
                  {/* REPLACE THE SRC BELOW WITH YOUR ACTUAL IMAGE URL */}
                  <img 
                    src="https://imgg.io/images/2026/03/14/f986eafc8d89121412937b843e7d30e3.jpg" 
                    alt="X-Black Profile" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100 rgb-split"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Hacker UI Overlay */}
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20 pointer-events-none">
                    <div className="flex items-center justify-between text-emerald-400 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className="animate-pulse text-red-500">●</span>
                        <span>LIVE_FEED</span>
                      </div>
                      <span>ID: X-BLACK-001</span>
                    </div>
                    <div className="w-full h-1 bg-slate-800 mt-2 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-full animate-[pulse_2s_ease-in-out_infinite]"></div>
                    </div>
                  </div>
                </div>
                
                {/* Corner Accents */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-emerald-500 z-30 pointer-events-none"></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-emerald-500 z-30 pointer-events-none"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-emerald-500 z-30 pointer-events-none"></div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-emerald-500 z-30 pointer-events-none"></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-400 dark:text-slate-500"
            >
              <ChevronDown size={32} />
            </motion.div>
          </section>

          {/* Skills Section */}
          <section id="skills" className="py-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white transition-colors duration-500">
                <DecryptText text={isDarkWeb ? "Hacking Arsenal & Services" : "العدة والمهارات (My Arsenal)"} speed={30} delay={200} />
              </h2>
              <div className="w-20 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 rounded-full"></div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory pb-8 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
            >
              {[
                { icon: <ShieldAlert className="text-red-600 dark:text-red-400" size={32}/>, title: isDarkWeb ? "0-Day Exploits" : "صيد الثغرات", desc: isDarkWeb ? "Custom exploits for unpatched systems. High success rate." : "بجيب الثغرة من جحرها وأقفلها قبل ما حد يستغلها.", tech: "Burp Suite, OWASP, SQLi", price: "$5,000" },
                { icon: <Terminal className="text-emerald-600 dark:text-emerald-400" size={32}/>, title: isDarkWeb ? "Botnet Rental" : "شبح اللينكس", desc: isDarkWeb ? "Rent our 100k+ node botnet for stress testing." : "التيرمنال ملعبي، وسكربتاتي بتخلص الشغل في ثواني.", tech: "Kali Linux, Bash, Python", price: "$500/hr" },
                { icon: <Wifi className="text-blue-600 dark:text-blue-400" size={32}/>, title: isDarkWeb ? "Network Infiltration" : "تأمين الشبكات", desc: isDarkWeb ? "Silent entry into corporate networks. No logs left behind." : "بشمشم في الترافيك وأقفل أي باب ورايا في الشبكة.", tech: "Nmap, Wireshark, Metasploit", price: "2.5 BTC" },
                { icon: <Search className="text-purple-600 dark:text-purple-400" size={32}/>, title: isDarkWeb ? "Doxxing & OSINT" : "هندسة اجتماعية", desc: isDarkWeb ? "Complete digital footprint extraction of any target." : "بجيب قرار أي تارجت من على النت، مفيش حاجة بتستخبى.", tech: "Maltego, Recon-ng, OSINT", price: "$1,200" },
                { icon: <Cpu className="text-amber-600 dark:text-amber-400" size={32}/>, title: isDarkWeb ? "Malware Development" : "هندسة عكسية", desc: isDarkWeb ? "FUD (Fully Undetectable) malware tailored to your needs." : "بفصص البرامج حتة حتة عشان أفهم دماغ اللي برمجها.", tech: "Ghidra, IDA Pro, x64dbg", price: "1.8 BTC" },
                { icon: <Lock className="text-slate-600 dark:text-slate-400" size={32}/>, title: isDarkWeb ? "Ransomware Kits" : "تشفير وفك شفرات", desc: isDarkWeb ? "RaaS (Ransomware as a Service). 70/30 split." : "بكسر الباسوردات المعقدة وأأمن الداتا الحساسة.", tech: "Hashcat, John the Ripper", price: "0.5 BTC" },
              ].map((skill, idx) => (
                <motion.div key={idx} variants={fadeInUp} className="h-full min-w-[85vw] md:min-w-0 snap-center active:scale-[0.98] transition-transform duration-200">
                  <SpotlightCard className="p-6 h-full relative overflow-hidden">
                    {isDarkWeb && (
                      <div className="absolute top-4 right-4 bg-black/80 text-amber-500 font-mono text-xs px-3 py-1 border border-amber-500/50 rounded-full backdrop-blur-md z-20 flex items-center gap-2">
                        <Skull size={12} />
                        {skill.price}
                      </div>
                    )}
                    <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 inline-block group-hover:scale-110 transition-transform border border-slate-100 dark:border-transparent relative z-10">
                      {skill.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white relative z-10">{skill.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed relative z-10">{skill.desc}</p>
                    <p className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 inline-block px-3 py-1 rounded-full relative z-10" dir="ltr">{skill.tech}</p>
                  </SpotlightCard>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="py-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white transition-colors duration-500">
                <DecryptText text={isDarkWeb ? "0-Day Exploits & Malware" : "سجل العمليات (Operations)"} speed={30} delay={200} />
              </h2>
              <div className="w-20 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 rounded-full"></div>
            </motion.div>

            <div className="flex md:grid md:grid-cols-2 gap-8 overflow-x-auto snap-x snap-mandatory pb-8 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {[
                { title: isDarkWeb ? "WannaCry v2.0 Source" : "أداة فحص الثغرات (VulnScanner)", desc: isDarkWeb ? "Fully weaponized ransomware source code. Includes C2 server setup." : "سكربت بايثون بيفحص الشبكات وبيطلع الثغرات في ثواني، بيوفر وقت ومجهود كبير في الـ Recon.", tags: ["Python", "Nmap", "Sockets"], color: "from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/10", price: "5.5 BTC" },
                { title: isDarkWeb ? "iOS 18 Jailbreak" : "نظام كشف التسلل (IDS)", desc: isDarkWeb ? "Untethered jailbreak for latest iOS. Kernel exploit included." : "سيستم بيراقب الترافيك وبيمسك أي محاولة اختراق لايف، وبيبعت تنبيهات فورية على تليجرام.", tags: ["C++", "Snort", "ELK Stack"], color: "from-red-500/5 to-orange-500/5 dark:from-red-500/10 dark:to-orange-500/10", price: "15.0 BTC" },
                { title: isDarkWeb ? "Bank DB Dump (1M+)" : "منصة تدريب (CTF Platform)", desc: isDarkWeb ? "Fresh database dump. Includes CC, SSN, and full profiles." : "بيئة وهمية للتدريب على الاختراق وحل التحديات الأمنية، معمولة عشان تدرب التيمات الجديدة.", tags: ["Docker", "Node.js", "React"], color: "from-purple-500/5 to-indigo-500/5 dark:from-purple-500/10 dark:to-indigo-500/10", price: "2.1 BTC" },
                { title: isDarkWeb ? "Pegasus Clone" : "محاكي الفدية (Ransomware Sim)", desc: isDarkWeb ? "Zero-click spyware for Android/iOS. Full device takeover." : "أداة تعليمية بتشفر الداتا وتفكها عشان نفهم الميكانيزم ونعرف نحمي نفسنا من الهجمات الحقيقية.", tags: ["Rust", "Cryptography", "AES-256"], color: "from-slate-500/5 to-zinc-500/5 dark:from-slate-500/10 dark:to-zinc-500/10", price: "50.0 BTC" },
              ].map((project, idx) => (
                <ProjectCard key={idx} project={project} idx={idx} isDarkWeb={isDarkWeb} />
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-20 mb-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="max-w-4xl mx-auto bg-white dark:bg-black/80 backdrop-blur-md border border-slate-200 dark:border-emerald-500/30 rounded-3xl p-8 md:p-12 text-center shadow-2xl shadow-slate-200/50 dark:shadow-[0_0_40px_rgba(16,185,129,0.15)] transition-colors duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                <DecryptText text="جاهز نأمن السيستم؟" speed={30} delay={200} />
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                لو عندك سيرفر محتاج يتأمن، أو سيستم شاكك إن فيه ثغرات، أو حتى فكرة مشروع مجنونة.. ابعتلي رسالة مشفرة وهنظبط الدنيا.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <MagneticButton href="mailto:sayedblack3@gmail.com" onClick={() => triggerHaptic(30)} className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold text-lg hover:bg-emerald-600 dark:hover:bg-emerald-400 active:scale-95 transition-all shadow-lg shadow-slate-900/20 dark:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  <Mail size={24} />
                  راسلني إيميل
                </MagneticButton>
                <MagneticButton href="https://wa.me/201090841534" target="_blank" rel="noopener noreferrer" onClick={() => triggerHaptic(30)} className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-white font-bold text-lg hover:bg-[#20bd5a] active:scale-95 transition-all shadow-lg shadow-[#25D366]/30 hover:shadow-[0_0_30px_rgba(37,211,102,0.5)]">
                  <MessageCircle size={24} />
                  واتساب
                </MagneticButton>
              </div>

              <div className="mt-16 flex justify-center gap-6">
                <a href="https://www.facebook.com/xblack919/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-slate-50 dark:bg-[#1a1a1a] text-slate-500 dark:text-emerald-500/70 hover:text-[#1877F2] dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-emerald-900/30 border border-slate-200 dark:border-emerald-500/30 hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-90 transition-all">
                  <Facebook size={24} />
                </a>
                <a href="https://www.instagram.com/xbla_ck20/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-slate-50 dark:bg-[#1a1a1a] text-slate-500 dark:text-emerald-500/70 hover:text-[#E4405F] dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-emerald-900/30 border border-slate-200 dark:border-emerald-500/30 hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-90 transition-all">
                  <Instagram size={24} />
                </a>
              </div>
            </motion.div>
          </section>
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
          <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-slate-200 dark:border-emerald-500/30 rounded-full px-6 py-3 flex justify-between items-center shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <a href="#home" onClick={() => triggerHaptic(30)} className="p-2 text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 active:scale-90 transition-all flex flex-col items-center gap-1">
              <Home size={20} />
            </a>
            <a href="#skills" onClick={() => triggerHaptic(30)} className="p-2 text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 active:scale-90 transition-all flex flex-col items-center gap-1">
              <Cpu size={20} />
            </a>
            <a href="#projects" onClick={() => triggerHaptic(30)} className="p-2 text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 active:scale-90 transition-all flex flex-col items-center gap-1">
              <Briefcase size={20} />
            </a>
            <a href="#contact" onClick={() => triggerHaptic(30)} className="p-2 text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 active:scale-90 transition-all flex flex-col items-center gap-1">
              <Mail size={20} />
            </a>
          </div>
        </div>

        <footer className="border-t border-slate-200 dark:border-emerald-500/20 py-8 text-center text-slate-500 dark:text-emerald-600/60 text-sm font-mono transition-colors duration-500 mb-16 md:mb-0 flex flex-col items-center">
          <p>SYSTEM SECURED BY X-BLACK &copy; {new Date().getFullYear()}</p>
          <button 
            onClick={() => {
              triggerHaptic(50);
              setIsDestructing(true);
            }}
            className="mt-6 text-[10px] text-red-500/30 hover:text-red-500 transition-colors uppercase tracking-widest select-none"
          >
            [ Do Not Touch ]
          </button>
        </footer>
      </div>
    </div>
  );
}
