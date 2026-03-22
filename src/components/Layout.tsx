import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Briefcase, Menu, X, Home, PlusCircle, Search, Phone, Heart } from 'lucide-react';
import Chatbot from './Chatbot';
import Notifications from './Notifications';
import { AnimatePresence } from 'motion/react';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'الرئيسية', path: '/', icon: <Home size={18} /> },
    { name: 'شوف الوظايف', path: '/jobs', icon: <Search size={18} /> },
    { name: 'المحفوظات', path: '/saved', icon: <Heart size={18} /> },
    { name: 'تواصل معانا', path: '/contact', icon: <Phone size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900" dir="rtl">
      {/* Navbar */}
      <header className="bg-[#0B1727] border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-20 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 md:gap-3">
                <div className="bg-blue-600/20 text-blue-400 p-1.5 md:p-2 rounded-lg md:rounded-xl border border-blue-500/30">
                  <Briefcase className="w-5 h-5 md:w-7 md:h-7" />
                </div>
                <div>
                  <h1 className="text-lg md:text-2xl font-bold text-white leading-none tracking-tight">وظائف نكلا العنب</h1>
                  <p className="text-[9px] md:text-[11px] text-blue-300/70 font-medium mt-1">فرص شغل قريبة منك</p>
                </div>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                    location.pathname === link.path
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              <Notifications />
              <Link
                to="/post-job"
                className="ml-4 flex items-center gap-2 bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-900 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-yellow-500/20"
              >
                <PlusCircle size={20} />
                ضيف وظيفة
              </Link>
              <Link
                to="/admin"
                className="text-xs text-slate-500 hover:text-slate-300"
              >
                الإدارة
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden gap-2">
              <Notifications />
              <Link
                to="/post-job"
                className="flex items-center gap-1 bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-900 px-3 py-2 rounded-lg font-bold text-xs shadow-md shadow-yellow-500/10 transition-all active:scale-95"
              >
                <PlusCircle size={14} />
                ضيف وظيفة
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-300 hover:text-white p-1"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0B1727] border-t border-white/10 absolute w-full">
            <div className="px-4 pt-2 pb-4 space-y-2 shadow-2xl">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold ${
                    location.pathname === link.path
                      ? 'bg-white/10 text-white'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm text-slate-500"
              >
                لوحة التحكم
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-[#0B1727] border-t border-white/5 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Briefcase size={28} className="text-blue-500" />
            <span className="text-2xl font-bold text-white">وظائف نكلا العنب</span>
          </div>
          <p className="mb-6 text-sm max-w-md mx-auto leading-relaxed">منصة الوظائف الأولى في نكلا العنب والمناطق المجاورة. بنوصل أصحاب الشغل بالناس اللي بتدور على فرصة حقيقية.</p>
          <div className="flex justify-center gap-6 text-sm font-medium mb-8">
            <Link to="/contact" className="hover:text-white transition-colors">تواصل معانا</Link>
            <Link to="/jobs" className="hover:text-white transition-colors">الوظائف</Link>
            <Link to="/post-job" className="hover:text-white transition-colors">نزل إعلان</Link>
          </div>
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} وظائف نكلا العنب. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
