import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Loader2, Sparkles, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  options?: { label: string; action: string; target?: string }[];
}

const SYSTEM_INSTRUCTION = `
أنت "مساعد Nekla Job" الذكي. مهمتك هي مساعدة أهالي قرية "نكلا العنب" (مركز إيتاي البارود - البحيرة) في كل ما يخص التوظيف والعمل.

عنك:
- اسمك: مساعد Nekla Job.
- شخصيتك: ابن بلد، جدع، ودود، وبتحب تساعد الناس.
- لغتك: العامية المصرية (لهجة أهل البحيرة ونكلا العنب).

معلومات لازم تعرفها:
1. الموقع بيخدم نكلا العنب والقرى اللي حواليها (زي كفر عوانة، نكلا، وغيرها).
2. الأقسام: صيدليات، محلات، مطاعم، سواقين، صنايعية، أمن، تدريس، إلخ.
3. المميزات: إضافة وظائف مجانية، تواصل مباشر واتساب واتصال، حفظ الوظائف.
4. لو حد سأل "أعمل إيه؟": قوله يدور في الوظائف (/jobs) أو ينزل إعلان لو هو صاحب عمل (/post-job).

قواعد الرد:
- ابدأ دايماً بترحيب حار (يا هلا، منور يا بطل، أهل نكلا الغاليين).
- خلي ردودك قصيرة ومنظمة.
- استخدم إيموجي كتير (🚜، 💼، 🏠، ✨).
- لو حد سأل سؤال ملوش علاقة بالشغل، رده بلطافة لموضوع الشغل في نكلا.
- شجع الناس دايماً إنهم يرزقوا بعض ويساعدوا بعض.
`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: 'أهلًا بيك في Nekla Job 💙\nأنا مساعدك الذكي، أقدر أساعدك تلاقي شغل أو تنزل إعلان توظيف في نكلا العنب.\n\nتحب تبدأ بإيه؟',
          sender: 'bot',
          options: [
            { label: '🔍 أدور على شغل', action: 'link', target: '/jobs' },
            { label: '➕ أنزل إعلان شغل', action: 'link', target: '/post-job' },
            { label: '❓ إيه هو الموقع ده؟', action: 'reply', target: 'الموقع ده معمول لأهالي نكلا العنب والمناطق اللي حواليها عشان يسهل عليهم يلاقوا شغل أو عمالة بسرعة وبدون تعقيد.' },
          ],
        },
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('API Key missing');
      }

      const genAI = new GoogleGenAI({ apiKey });
      const model = "gemini-3-flash-preview";

      const chatHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const response = await genAI.models.generateContent({
        model,
        contents: [
          ...chatHistory,
          { role: 'user', parts: [{ text }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        }
      });

      const botText = response.text || "بعتذر، حصل مشكلة بسيطة. جرب تاني كمان شوية؟";

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: 'bot',
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "يا بطل، حصل مشكلة في الاتصال. اتأكد إنك متصل بالنت وجرب تاني.",
        sender: 'bot',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionClick = (option: { label: string; action: string; target?: string }) => {
    if (option.action === 'link' && option.target) {
      navigate(option.target);
      setIsOpen(false);
    } else if (option.action === 'reply' && option.target) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: option.label, sender: 'user' },
        {
          id: (Date.now() + 1).toString(),
          text: option.target!,
          sender: 'bot',
          options: [
            { label: 'تصفح الوظائف', action: 'link', target: '/jobs' },
            { label: 'إضافة وظيفة', action: 'link', target: '/post-job' },
          ],
        },
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all hover:scale-110 flex items-center justify-center group relative"
          >
            <MessageCircle size={28} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            <div className="absolute right-full mr-4 bg-white text-slate-800 px-4 py-2 rounded-2xl shadow-2xl text-sm font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 pointer-events-none border border-slate-100 hidden sm:block">
              محتاج مساعدة؟ 👋
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-0 sm:p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white w-full h-full sm:max-w-2xl sm:h-[80vh] sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative"
            >
              {/* Header */}
              <div className="bg-white border-b border-slate-100 p-4 sm:p-6 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                      <Bot size={32} className="text-blue-600" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></span>
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-lg sm:text-xl flex items-center gap-2">
                      مساعد Nekla Job الذكي
                      <Sparkles size={18} className="text-blue-500" />
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] sm:text-xs text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded-full">أونلاين</span>
                      <p className="text-[10px] sm:text-xs text-slate-400 font-bold">نكلا العنب والقرى المجاورة</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => {
                      if (window.confirm('هل تريد مسح المحادثة والبدء من جديد؟')) {
                        setMessages([]);
                      }
                    }}
                    className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    title="مسح المحادثة"
                  >
                    <RotateCcw size={20} />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <X size={28} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto bg-slate-50/30 scroll-smooth">
                <div className="p-4 sm:p-8 space-y-8">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${
                        msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 ${
                        msg.sender === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {msg.sender === 'user' ? <div className="text-[10px] font-black">أنا</div> : <Bot size={16} />}
                      </div>

                      <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}>
                        <div
                          className={`p-4 rounded-2xl text-sm md:text-base whitespace-pre-line leading-relaxed shadow-sm ${
                            msg.sender === 'user'
                              ? 'bg-blue-600 text-white rounded-tr-none font-bold'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none font-medium'
                          }`}
                          dir="rtl"
                        >
                          {msg.text}
                        </div>
                        {msg.options && (
                          <div className="mt-4 flex flex-wrap gap-2 w-full justify-start">
                            {msg.options.map((opt, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleOptionClick(opt)}
                                className="text-xs md:text-sm bg-white border border-slate-200 text-blue-600 py-2.5 px-4 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm font-black"
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-1">
                        <Bot size={16} />
                      </div>
                      <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
                        <Loader2 size={18} className="animate-spin text-blue-600" />
                        <span className="text-xs text-slate-400 font-bold">بيفكر في الرد...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 sm:p-8 bg-white border-t border-slate-100 shrink-0">
                <form onSubmit={handleSubmit} className="relative flex items-center gap-3 sm:gap-4">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="اسألني أي حاجة..."
                    className="flex-1 bg-slate-100 border-none rounded-2xl py-4 sm:py-5 px-6 sm:px-8 text-sm md:text-lg focus:ring-2 focus:ring-blue-500 transition-all font-bold placeholder-slate-400 shadow-inner"
                    dir="rtl"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-blue-600 text-white p-4 sm:p-5 rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-500/30 active:scale-95"
                  >
                    <Send size={20} className="rotate-180" />
                  </button>
                </form>
                <div className="flex justify-center items-center gap-4 mt-4">
                   <div className="h-[1px] flex-1 bg-slate-100"></div>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Nekla Job AI Assistant</p>
                   <div className="h-[1px] flex-1 bg-slate-100"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
