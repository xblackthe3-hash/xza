import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Chatbot from './Chatbot';
import { AnimatePresence } from 'motion/react';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'الوظائف', path: '/jobs' },
    { name: 'الأقسام', path: '/categories' }, // Assuming a categories route or just a placeholder
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-900 font-sans" dir="rtl">
      {/* Navbar */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00D084] rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white font-black text-xl">N</span>
                </div>
                <h1 className="text-2xl font-black text-[#0B1B3D] tracking-tight">Nekla Job</h1>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-base font-bold transition-all relative py-2 ${
                    location.pathname === link.path
                      ? 'text-[#00D084]'
                      : 'text-[#0B1B3D] hover:text-[#00D084]'
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00D084] rounded-full"></span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Action Button & Mobile Toggle */}
            <div className="flex items-center gap-4">
              <Link
                to="/post-job"
                className="hidden md:flex items-center justify-center bg-[#0B1B3D] hover:bg-[#1a2b52] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                انشر وظيفة
              </Link>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-[#0B1B3D] p-2"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-xl overflow-hidden">
            <div className="p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-2xl text-lg font-bold ${
                    location.pathname === link.path
                      ? 'bg-emerald-50 text-[#00D084]'
                      : 'text-[#0B1B3D] hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/post-job"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center bg-[#0B1B3D] text-white px-4 py-3.5 rounded-xl font-bold mt-4 shadow-sm"
              >
                انشر وظيفة
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
      <footer className="bg-[#f8f9fa] border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6 text-sm font-bold text-slate-500">
              <Link to="/about" className="hover:text-[#0B1B3D] transition-colors">عن نكلا جوب</Link>
              <Link to="/contact" className="hover:text-[#0B1B3D] transition-colors">اتصل بنا</Link>
              <Link to="/terms" className="hover:text-[#0B1B3D] transition-colors">شروط الاستخدام</Link>
              <Link to="/privacy" className="hover:text-[#0B1B3D] transition-colors">سياسة الخصوصية</Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl font-black text-[#0B1B3D]">Nekla Job</span>
            </div>
          </div>
          <div className="mt-8 text-center md:text-right">
            <p className="text-xs font-medium text-slate-400">
              © {new Date().getFullYear()} Nekla Job - من قلب نكلا. جميع الحقوق محفوظة باسم سيد محمد.
            </p>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
