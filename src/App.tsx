import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Scene3D from './components/Scene3D';
import { Code2, Terminal, Cpu, Globe, Layers, Smartphone, Mail, Github, Facebook, Instagram, ExternalLink, ChevronDown, Sun, Moon, MessageCircle, ShieldAlert, Wifi, Search, Lock } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
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
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="relative w-full min-h-screen selection:bg-emerald-500/30">
      <div className="fixed inset-0 -z-20 bg-slate-50 dark:bg-black transition-colors duration-500"></div>
      <div className="fixed inset-0 -z-20 opacity-[0.03] dark:opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <Scene3D isDarkMode={isDarkMode} />

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
              className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-500 bg-clip-text text-transparent font-mono tracking-wider cursor-pointer" 
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
                      whileHover={{ scale: 1.05, backgroundColor: isDarkMode ? "rgba(16, 185, 129, 0.1)" : "rgba(16, 185, 129, 0.05)" }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors relative group"
                    >
                      {item}
                      <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/70 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </motion.a>
                  );
                })}
              </div>
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-emerald-500/30 transition-all shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center justify-center"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </motion.button>
            </div>
          </div>
        </motion.nav>

        <main className="container mx-auto px-6 pt-32 pb-20">
          {/* Hero Section */}
          <section id="about" className="min-h-[80vh] flex flex-col justify-center items-start relative">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-3xl"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-sm font-mono font-bold mb-6 shadow-sm dark:shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-colors duration-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-500"></span>
                </span>
                SYSTEM_ONLINE // متاح للعمل
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-slate-900 dark:text-white transition-colors duration-500">
                أنا <span className="text-slate-800 dark:text-white">سيد محمد</span> <br/>
                <span className="text-3xl md:text-4xl text-slate-500 dark:text-slate-400 font-medium mt-2 block">المعروف بـ </span>
                <motion.span 
                  initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: 2.2, type: "spring", bounce: 0.5 }}
                  className="inline-block mt-2 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 dark:from-emerald-400 dark:via-green-400 dark:to-teal-400 bg-clip-text text-transparent font-mono font-black tracking-widest uppercase drop-shadow-sm dark:drop-shadow-[0_0_20px_rgba(16,185,129,0.6)]" dir="ltr">
                  X-Black
                </motion.span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl leading-relaxed transition-colors duration-500">
                هاكر أخلاقي ومكتشف ثغرات، بلعب في الكود زي ما بلعب في الشارع. بحب أنكش في الأنظمة، أطلع الثغرات من تحت الأرض، وأأمن السيرفرات عشان تنام وانت مطمن. دايماً جاهز لأي تحدي تقني يقلب الموازين.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <a href="#projects" className="px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold transition-all shadow-lg shadow-emerald-600/30 dark:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-emerald-600/50 dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]">
                  استكشف العمليات
                </a>
                <a href="#contact" className="px-8 py-3.5 rounded-full bg-white hover:bg-slate-50 dark:bg-[#0a0a0a] dark:hover:bg-slate-900 border border-slate-300 dark:border-emerald-500/30 text-slate-700 dark:text-emerald-400 font-bold transition-all shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.1)] backdrop-blur-sm">
                  تواصل مشفر
                </a>
              </motion.div>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white transition-colors duration-500">العدة والمهارات (My Arsenal)</h2>
              <div className="w-20 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 rounded-full"></div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                { icon: <ShieldAlert className="text-red-600 dark:text-red-400" size={32}/>, title: "صيد الثغرات", desc: "بجيب الثغرة من جحرها وأقفلها قبل ما حد يستغلها.", tech: "Burp Suite, OWASP, SQLi" },
                { icon: <Terminal className="text-emerald-600 dark:text-emerald-400" size={32}/>, title: "شبح اللينكس", desc: "التيرمنال ملعبي، وسكربتاتي بتخلص الشغل في ثواني.", tech: "Kali Linux, Bash, Python" },
                { icon: <Wifi className="text-blue-600 dark:text-blue-400" size={32}/>, title: "تأمين الشبكات", desc: "بشمشم في الترافيك وأقفل أي باب ورايا في الشبكة.", tech: "Nmap, Wireshark, Metasploit" },
                { icon: <Search className="text-purple-600 dark:text-purple-400" size={32}/>, title: "هندسة اجتماعية", desc: "بجيب قرار أي تارجت من على النت، مفيش حاجة بتستخبى.", tech: "Maltego, Recon-ng, OSINT" },
                { icon: <Cpu className="text-amber-600 dark:text-amber-400" size={32}/>, title: "هندسة عكسية", desc: "بفصص البرامج حتة حتة عشان أفهم دماغ اللي برمجها.", tech: "Ghidra, IDA Pro, x64dbg" },
                { icon: <Lock className="text-slate-600 dark:text-slate-400" size={32}/>, title: "تشفير وفك شفرات", desc: "بكسر الباسوردات المعقدة وأأمن الداتا الحساسة.", tech: "Hashcat, John the Ripper" },
              ].map((skill, idx) => (
                <motion.div key={idx} variants={fadeInUp} className="p-6 rounded-2xl bg-white dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-300 group shadow-xl shadow-slate-200/40 dark:shadow-none">
                  <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 inline-block group-hover:scale-110 transition-transform border border-slate-100 dark:border-transparent">
                    {skill.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{skill.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">{skill.desc}</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 inline-block px-3 py-1 rounded-full" dir="ltr">{skill.tech}</p>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white transition-colors duration-500">سجل العمليات (Operations)</h2>
              <div className="w-20 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 rounded-full"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: "أداة فحص الثغرات (VulnScanner)", desc: "سكربت بايثون بيفحص الشبكات وبيطلع الثغرات في ثواني، بيوفر وقت ومجهود كبير في الـ Recon.", tags: ["Python", "Nmap", "Sockets"], color: "from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/10" },
                { title: "نظام كشف التسلل (IDS)", desc: "سيستم بيراقب الترافيك وبيمسك أي محاولة اختراق لايف، وبيبعت تنبيهات فورية على تليجرام.", tags: ["C++", "Snort", "ELK Stack"], color: "from-red-500/5 to-orange-500/5 dark:from-red-500/10 dark:to-orange-500/10" },
                { title: "منصة تدريب (CTF Platform)", desc: "بيئة وهمية للتدريب على الاختراق وحل التحديات الأمنية، معمولة عشان تدرب التيمات الجديدة.", tags: ["Docker", "Node.js", "React"], color: "from-purple-500/5 to-indigo-500/5 dark:from-purple-500/10 dark:to-indigo-500/10" },
                { title: "محاكي الفدية (Ransomware Sim)", desc: "أداة تعليمية بتشفر الداتا وتفكها عشان نفهم الميكانيزم ونعرف نحمي نفسنا من الهجمات الحقيقية.", tags: ["Rust", "Cryptography", "AES-256"], color: "from-slate-500/5 to-zinc-500/5 dark:from-slate-500/10 dark:to-zinc-500/10" },
              ].map((project, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="group relative overflow-hidden rounded-3xl bg-white dark:bg-black/60 border border-slate-200 dark:border-emerald-500/20 backdrop-blur-sm shadow-xl shadow-slate-200/40 dark:shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:dark:shadow-[0_0_25px_rgba(16,185,129,0.2)] hover:dark:border-emerald-500/60 transition-all duration-500"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  <div className="p-8 relative z-10 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-emerald-400">{project.title}</h3>
                      <a href="#" className="p-2 rounded-full bg-slate-50 dark:bg-[#1a1a1a] hover:bg-slate-100 dark:hover:bg-emerald-900/30 text-slate-600 dark:text-emerald-500 border border-slate-100 dark:border-emerald-500/30 transition-colors">
                        <ExternalLink size={20} />
                      </a>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow leading-relaxed">{project.desc}</p>
                    <div className="flex flex-wrap gap-2" dir="ltr">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-slate-50 dark:bg-emerald-900/20 text-slate-600 dark:text-emerald-400 border border-slate-200 dark:border-emerald-500/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
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
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">جاهز نأمن السيستم؟</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                لو عندك سيرفر محتاج يتأمن، أو سيستم شاكك إن فيه ثغرات، أو حتى فكرة مشروع مجنونة.. ابعتلي رسالة مشفرة وهنظبط الدنيا.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="mailto:sayedblack3@gmail.com" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold text-lg hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-all shadow-lg shadow-slate-900/20 dark:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  <Mail size={24} />
                  راسلني إيميل
                </a>
                <a href="https://wa.me/201090841534" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-white font-bold text-lg hover:bg-[#20bd5a] transition-all shadow-lg shadow-[#25D366]/30 hover:shadow-[0_0_30px_rgba(37,211,102,0.5)]">
                  <MessageCircle size={24} />
                  واتساب
                </a>
              </div>

              <div className="mt-16 flex justify-center gap-6">
                <a href="https://www.facebook.com/xblack919/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-slate-50 dark:bg-[#1a1a1a] text-slate-500 dark:text-emerald-500/70 hover:text-[#1877F2] dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-emerald-900/30 border border-slate-200 dark:border-emerald-500/30 hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all">
                  <Facebook size={24} />
                </a>
                <a href="https://www.instagram.com/xbla_ck20/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-slate-50 dark:bg-[#1a1a1a] text-slate-500 dark:text-emerald-500/70 hover:text-[#E4405F] dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-emerald-900/30 border border-slate-200 dark:border-emerald-500/30 hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all">
                  <Instagram size={24} />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-slate-50 dark:bg-[#1a1a1a] text-slate-500 dark:text-emerald-500/70 hover:text-slate-900 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-emerald-900/30 border border-slate-200 dark:border-emerald-500/30 hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all">
                  <Github size={24} />
                </a>
              </div>
            </motion.div>
          </section>
        </main>

        <footer className="border-t border-slate-200 dark:border-emerald-500/20 py-8 text-center text-slate-500 dark:text-emerald-600/60 text-sm font-mono transition-colors duration-500">
          <p>SYSTEM SECURED BY X-BLACK &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}
