import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  options?: { label: string; action: string; target?: string }[];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: 'أهلًا بيك في Nekla Job 💙\nأنا هنا أساعدك تستخدم الموقع بسهولة\nتحب تدور على شغل ولا تنزل شغل؟',
          sender: 'bot',
          options: [
            { label: 'أنا بدور على شغل', action: 'link', target: '/jobs' },
            { label: 'أنا محتاج أنزل شغل', action: 'link', target: '/post-job' },
            { label: 'أفهم الموقع', action: 'reply', target: 'الموقع ده معمول لأهالي نكلا والمناطق اللي حواليها عشان يسهل عليهم يلاقوا شغل أو عمالة بسرعة وبدون تعقيد.' },
            { label: 'تواصل معانا', action: 'link', target: '/contact' },
          ],
        },
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleOptionClick = (option: { label: string; action: string; target?: string }) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: option.label, sender: 'user' },
    ]);

    setTimeout(() => {
      if (option.action === 'link' && option.target) {
        navigate(option.target);
        setIsOpen(false);
      } else if (option.action === 'reply' && option.target) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: option.target!,
            sender: 'bot',
            options: [
              { label: 'دور على شغل', action: 'link', target: '/jobs' },
              { label: 'نزل إعلان', action: 'link', target: '/post-job' },
            ],
          },
        ]);
      }
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:scale-105 flex items-center justify-center"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col overflow-hidden border border-slate-200 transition-all duration-300 transform origin-bottom-right h-[500px] max-h-[80vh]">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={24} />
              <div>
                <h3 className="font-bold text-lg leading-none">مساعد Nekla Job</h3>
                <span className="text-xs text-blue-200">أونلاين</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.options && (
                  <div className="mt-2 flex flex-col gap-2 w-full max-w-[85%]">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(opt)}
                        className="text-sm bg-white border border-blue-200 text-blue-600 py-2 px-3 rounded-xl hover:bg-blue-50 transition-colors text-right shadow-sm"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
    </div>
  );
}
