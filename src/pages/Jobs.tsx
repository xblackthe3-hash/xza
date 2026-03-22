import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter, ChevronLeft, Clock, MessageCircle, Heart, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';
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

export default function Jobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [categories, setCategories] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  useEffect(() => {
    setSavedJobs(JSON.parse(localStorage.getItem('nekla_saved_jobs') || '[]'));
    async function fetchData() {
      setLoading(true);
      
      // Fetch categories
      try {
        const { data: catData } = await supabase
          .from('job_categories')
          .select('*')
          .eq('is_active', true);
        if (catData && catData.length > 0) {
          setCategories(catData);
        } else {
          setCategories(FALLBACK_CATEGORIES);
        }
      } catch (e) {
        setCategories(FALLBACK_CATEGORIES);
      }

      try {
        const { data: jobData, error } = await supabase
          .from('jobs')
          .select(`
            id, job_title, business_name, governorate, center, area, salary_text, employment_type, created_at, published_at, status, category_id,
            job_categories (name_ar)
          `)
          .order('published_at', { ascending: false });

        let allJobs = [];
        if (!error && jobData) {
          allJobs = jobData;
        }

        const localJobs = JSON.parse(localStorage.getItem('nekla_jobs') || '[]');
        const overrides = JSON.parse(localStorage.getItem('nekla_job_overrides') || '{}');

        allJobs = [...allJobs, ...localJobs];

        // Apply overrides
        allJobs = allJobs.map(job => overrides[job.id] ? { ...job, status: overrides[job.id] } : job);

        // Filter approved
        let filtered = allJobs.filter(j => j.status === 'approved');

        // Filter out jobs older than 20 days
        const twentyDaysAgo = new Date();
        twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);
        filtered = filtered.filter(j => new Date(j.published_at || j.created_at) >= twentyDaysAgo);

        if (selectedCategory) {
          filtered = filtered.filter(j => j.category_id === selectedCategory);
        }

        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(j => 
            j.job_title.toLowerCase().includes(term) || 
            (j.business_name && j.business_name.toLowerCase().includes(term))
          );
        }

        // Add category names for local jobs
        filtered = filtered.map((j: any) => {
          if (!j.job_categories) {
            const cat = FALLBACK_CATEGORIES.find(c => c.id === j.category_id);
            return { ...j, job_categories: { name_ar: cat ? cat.name_ar : 'غير محدد' } };
          }
          return j;
        });

        // Deduplicate
        filtered = Array.from(new Map(filtered.map(item => [item.id, item])).values());

        filtered.sort((a: any, b: any) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());

        setJobs(filtered);
      } catch (e) {
        console.error("Error fetching jobs:", e);
      }
      
      setLoading(false);
    }

    fetchData();
  }, [selectedCategory, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchTerm) params.set('q', searchTerm);
    else params.delete('q');
    setSearchParams(params);
  };

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    let newSaved = [...savedJobs];
    if (newSaved.includes(id)) {
      newSaved = newSaved.filter(jId => jId !== id);
    } else {
      newSaved.push(id);
    }
    setSavedJobs(newSaved);
    localStorage.setItem('nekla_saved_jobs', JSON.stringify(newSaved));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <motion.div variants={itemVariants} className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-slate-200 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">دور على شغل</h1>
          <p className="text-sm md:text-base text-slate-600 mb-6 md:mb-8">اكتشف أحدث الوظائف المتاحة في نكلا العنب والمناطق المجاورة</p>
          
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-4 pr-12 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
                placeholder="ابحث بالمسمى الوظيفي أو اسم المكان..."
              />
            </div>
            <div className="md:w-64 relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-slate-400" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  const params = new URLSearchParams(searchParams);
                  if (e.target.value) params.set('category', e.target.value);
                  else params.delete('category');
                  setSearchParams(params);
                }}
                className="block w-full pl-10 pr-12 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none text-sm md:text-base"
              >
                <option value="">كل الأقسام</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name_ar}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
            <button
              type="submit"
              className="px-8 py-3 md:py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-blue-500/30 text-sm md:text-base"
            >
              بحث
            </button>
          </form>
        </motion.div>

        {/* Results */}
        <motion.div variants={itemVariants} className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {loading ? 'جاري البحث...' : `${jobs.length} وظيفة متاحة`}
          </h2>
        </motion.div>

        {loading ? (
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse h-64"></div>
            ))}
          </motion.div>
        ) : jobs.length > 0 ? (
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Link key={job.id} to={`/jobs/${job.id}`} className="block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 group flex flex-col h-full relative">
                <button 
                  onClick={(e) => toggleSave(e, job.id)}
                  className="absolute top-4 left-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
                  title={savedJobs.includes(job.id) ? "إزالة من المحفوظات" : "حفظ الوظيفة"}
                >
                  <Heart size={20} className={savedJobs.includes(job.id) ? "fill-red-500 text-red-500" : ""} />
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
            <Search size={64} className="mx-auto text-slate-300 mb-6" />
            <h3 className="text-2xl font-bold text-slate-800 mb-2">مفيش وظايف بالبحث ده</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">جرب تغير كلمات البحث أو تختار قسم تاني عشان تلاقي فرص أكتر.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSearchParams(new URLSearchParams());
              }}
              className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full transition-colors"
            >
              عرض كل الوظائف
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
