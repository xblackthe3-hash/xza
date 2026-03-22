import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MapPin, Briefcase, Clock, ChevronLeft, Heart, MessageCircle, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { arEG } from 'date-fns/locale';
import { motion } from 'motion/react';

const FALLBACK_CATEGORIES = [
  { id: '1', name_ar: 'صيدليات' },
  { id: '2', name_ar: 'محلات تجارية' },
  { id: '3', name_ar: 'مطاعم وكافيهات' },
  { id: '4', name_ar: 'سائقين وتوصيل' },
  { id: '5', name_ar: 'عمالة يومية (شغل يوم بيوم)' },
  { id: '6', name_ar: 'مطلوب حالاً (شغل النهارده)' },
  { id: '7', name_ar: 'أمن وحراسة' },
  { id: '8', name_ar: 'تعليم وتدريس' },
  { id: '9', name_ar: 'أخرى' }
];

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSavedJobs() {
      const savedIds = JSON.parse(localStorage.getItem('nekla_saved_jobs') || '[]');
      
      if (savedIds.length === 0) {
        setSavedJobs([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('jobs')
          .select(`
            id, job_title, business_name, governorate, center, area, salary_text, employment_type, created_at, published_at, status, category_id, whatsapp,
            job_categories (name_ar)
          `)
          .in('id', savedIds);

        let allJobs = [];
        if (!error && data) {
          allJobs = data;
        }

        const localJobs = JSON.parse(localStorage.getItem('nekla_jobs') || '[]');
        const localSaved = localJobs.filter((j: any) => savedIds.includes(j.id));
        
        allJobs = [...allJobs, ...localSaved];

        // Add category names for local jobs
        allJobs = allJobs.map((j: any) => {
          if (!j.job_categories) {
            const cat = FALLBACK_CATEGORIES.find(c => c.id === j.category_id);
            return { ...j, job_categories: { name_ar: cat ? cat.name_ar : 'غير محدد' } };
          }
          return j;
        });

        // Deduplicate
        allJobs = Array.from(new Map(allJobs.map(item => [item.id, item])).values());

        setSavedJobs(allJobs);
      } catch (e) {
        console.error("Error fetching saved jobs:", e);
      }
      
      setLoading(false);
    }

    fetchSavedJobs();
  }, []);

  const removeSavedJob = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const savedIds = JSON.parse(localStorage.getItem('nekla_saved_jobs') || '[]');
    const newSaved = savedIds.filter((jId: string) => jId !== id);
    localStorage.setItem('nekla_saved_jobs', JSON.stringify(newSaved));
    setSavedJobs(savedJobs.filter(j => j.id !== id));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Heart className="text-red-500 fill-current" />
          الوظائف المحفوظة
        </h1>
        <p className="text-slate-600">الوظائف اللي حفظتها عشان ترجعلها بعدين</p>
      </motion.div>

      {loading ? (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse h-64"></div>
          ))}
        </motion.div>
      ) : savedJobs.length > 0 ? (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <Link key={job.id} to={`/jobs/${job.id}`} className="block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 group flex flex-col h-full relative">
              <button 
                onClick={(e) => removeSavedJob(e, job.id)}
                className="absolute top-4 left-4 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
                title="إزالة من المحفوظات"
              >
                <Heart size={20} className="fill-current" />
              </button>
              
              <div className="flex justify-between items-start mb-4 gap-4 pr-10">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">{job.job_title}</h3>
                  <p className="text-slate-500 text-sm font-medium">{job.business_name || 'جهة غير معلنة'}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1">
                    <Clock size={12} />
                    {job.published_at ? formatDistanceToNow(new Date(job.published_at), { addSuffix: true, locale: arEG }) : 'منذ فترة'}
                  </span>
                  <span className="text-slate-400 text-xs flex items-center gap-1">
                    <Eye size={12} />
                    {120 + (job.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) % 300)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 mb-6 flex-grow">
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <MapPin size={16} className="text-slate-400 shrink-0" />
                  <span className="truncate">{job.area || job.center || job.governorate || 'نكلا العنب والمناطق المجاورة'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <Briefcase size={16} className="text-slate-400 shrink-0" />
                  <span className="truncate">{job.job_categories?.name_ar || 'غير محدد'}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center mt-auto">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 mb-1">الراتب المتوقع</span>
                  <span className="font-bold text-emerald-600">{job.salary_text || 'يحدد في المقابلة'}</span>
                </div>
                {job.whatsapp ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(`https://wa.me/${job.whatsapp.replace(/[^0-9]/g, '')}?text=بخصوص إعلان وظيفة: ${job.job_title} على وظائف نكلا العنب`, '_blank');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#128C7E] text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md"
                  >
                    <MessageCircle size={16} />
                    كلم على واتساب
                  </button>
                ) : (
                  <span className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ChevronLeft size={20} />
                  </span>
                )}
              </div>
            </Link>
          ))}
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <Heart size={64} className="mx-auto text-slate-300 mb-6" />
          <h3 className="text-2xl font-bold text-slate-800 mb-2">مفيش وظايف محفوظة</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">لما تعجبك وظيفة، اضغط على علامة القلب عشان تحفظها هنا وترجعلها بسهولة.</p>
          <Link to="/jobs" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
            تصفح الوظائف
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
