import React, { useState, useEffect, useRef } from 'react';
import { Bell, Clock, Briefcase, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { arEG } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchLatestJobs() {
      try {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        const { data } = await supabase
          .from('jobs')
          .select('id, job_title, business_name, published_at, created_at')
          .eq('status', 'approved')
          .gte('published_at', twentyFourHoursAgo.toISOString())
          .order('published_at', { ascending: false })
          .limit(5);

        if (data) {
          setNotifications(data);
          // Check local storage for last read time
          const lastRead = localStorage.getItem('nekla_last_read_notifications');
          if (lastRead) {
            const lastReadDate = new Date(lastRead);
            const unread = data.filter(job => new Date(job.published_at || job.created_at) > lastReadDate).length;
            setUnreadCount(unread);
          } else {
            setUnreadCount(data.length);
          }
        }
      } catch (e) {
        console.error("Error fetching notifications:", e);
      }
    }

    fetchLatestJobs();

    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
      localStorage.setItem('nekla_last_read_notifications', new Date().toISOString());
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleOpen}
        className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0B1727]"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] sm:hidden"
            />

            <motion.div 
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-[70] flex flex-col sm:absolute sm:top-full sm:right-0 sm:mt-3 sm:h-auto sm:w-80 sm:rounded-2xl sm:border sm:border-slate-100 sm:shadow-xl sm:overflow-hidden sm:z-50 sm:translate-x-0"
              dir="rtl"
            >
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800">الإشعارات</h3>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                    {notifications.length}
                  </span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors sm:hidden"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto sm:max-h-80">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {notifications.map(job => (
                      <Link 
                        key={job.id} 
                        to={`/jobs/${job.id}`}
                        onClick={() => setIsOpen(false)}
                        className="block p-4 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
                            <Briefcase size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 mb-1 line-clamp-1">
                              شغل جديد: {job.job_title}
                            </p>
                            <p className="text-xs text-slate-500 mb-2 line-clamp-1">
                              {job.business_name || 'جهة غير معلنة'}
                            </p>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Clock size={12} />
                              {job.published_at ? formatDistanceToNow(new Date(job.published_at), { addSuffix: true, locale: arEG }) : 'منذ فترة'}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-500">
                    <Bell size={32} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-sm">مفيش إشعارات جديدة دلوقتي</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-slate-100 text-center bg-slate-50 mt-auto sm:mt-0">
                <Link 
                  to="/jobs" 
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-blue-600 font-bold hover:underline"
                >
                  شوف كل الوظايف
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
