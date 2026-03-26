import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, ChevronLeft, Building2, Users, Star, ArrowLeft, PlusCircle, Clock, MessageCircle, Heart, Eye, Tractor, Hammer, Truck, Store, Stethoscope, Coffee, HardHat, BookOpen, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';
import { arEG } from 'date-fns/locale';

const FALLBACK_CATEGORIES = [
  { id: '1', name_ar: 'عمالة زراعية ومزارع', icon: 'tractor' },
  { id: '2', name_ar: 'صنايعية وحرفيين', icon: 'hammer' },
  { id: '3', name_ar: 'سائقين (نقل، جرار، توك توك)', icon: 'truck' },
  { id: '4', name_ar: 'محلات تجارية وسوبر ماركت', icon: 'store' },
  { id: '5', name_ar: 'صيدليات وعيادات', icon: 'stethoscope' },
  { id: '6', name_ar: 'مطاعم وكافيهات', icon: 'coffee' },
  { id: '7', name_ar: 'عمالة يومية (شغل يوم بيوم)', icon: 'hard-hat' },
  { id: '8', name_ar: 'تعليم وتدريس (حضانات، سناتر)', icon: 'book-open' },
  { id: '9', name_ar: 'أمن وحراسة', icon: 'shield' },
  { id: '10', name_ar: 'أخرى', icon: 'briefcase' }
];

export default function Home() {
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setSavedJobs(JSON.parse(localStorage.getItem('nekla_saved_jobs') || '[]'));
    async function fetchHomeData() {
      try {
        const { data: catData } = await supabase.from('job_categories').select('*').eq('is_active', true).limit(8);
        if (catData && catData.length > 0) {
          setCategories(catData);
        } else {
          setCategories(FALLBACK_CATEGORIES.slice(0, 8));
        }
      } catch (e) {
        setCategories(FALLBACK_CATEGORIES.slice(0, 8));
      }

      try {
        const { data: jobData, error } = await supabase
          .from('jobs')
          .select('id, job_title, business_name, governorate, center, area, salary_text, employment_type, created_at, published_at, status, category_id, job_categories (name_ar)');
          
        let allJobs = [];
        if (!error && jobData) {
          allJobs = jobData;
        }

        const localJobs = JSON.parse(localStorage.getItem('nekla_jobs') || '[]');
        const overrides = JSON.parse(localStorage.getItem('nekla_job_overrides') || '{}');

        allJobs = [...allJobs, ...localJobs];
        allJobs = allJobs.map(job => overrides[job.id] ? { ...job, status: overrides[job.id] } : job);

        let filtered = allJobs.filter(j => j.status === 'approved');

        // Filter out jobs older than 20 days
        const twentyDaysAgo = new Date();
        twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);
        filtered = filtered.filter(j => new Date(j.published_at || j.created_at) >= twentyDaysAgo);

        filtered = filtered.map((j: any) => {
          if (!j.job_categories) {
            const cat = FALLBACK_CATEGORIES.find(c => c.id === j.category_id);
            return { ...j, job_categories: { name_ar: cat ? cat.name_ar : 'غير محدد' } };
          }
          return j;
        });

        filtered = Array.from(new Map(filtered.map(item => [item.id, item])).values());
        filtered.sort((a: any, b: any) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());

        setRecentJobs(filtered.slice(0, 6));
      } catch (e) {
        console.error("Error fetching jobs:", e);
      }
    }
    fetchHomeData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(searchQuery)}`);
    }
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

  const popularSearches = ['عمالة زراعية', 'صنايعي', 'سائق توك توك', 'سائق جرار', 'عامل يومية', 'بائع'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
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
      className="flex flex-col min-h-screen bg-white"
    >
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden bg-slate-50">
        {/* Clean Dot Pattern Background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-16">
          
          {/* Text Content */}
          <div className="flex-1 text-right">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[#00D084] animate-pulse"></span>
              <span className="text-sm font-bold text-emerald-700">المنصة الأولى للتوظيف في نكلا العنب</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-black text-[#0B1B3D] mb-6 leading-[1.2] tracking-tight">
              ابحث عن شغلك في
              <span className="block text-[#00D084] mt-2">نكلا العنب</span>
              بكل سهولة
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-600 mb-10 max-w-xl ml-auto leading-relaxed font-medium">
              منصة نكلا جوب بتوفرلك أحدث الوظائف في مختلف المجالات. ابدأ رحلتك المهنية معانا دلوقتي ووصل لفرصتك في أسرع وقت.
            </motion.p>

            {/* Search Bar */}
            <motion.div variants={itemVariants} className="max-w-2xl ml-auto mb-8">
              <form onSubmit={handleSearch} className="bg-white border border-slate-200 p-2 rounded-2xl flex flex-col sm:flex-row items-center gap-2 shadow-sm focus-within:ring-2 focus-within:ring-[#00D084] focus-within:border-transparent transition-all">
                <div className="w-full flex-1 flex items-center px-4">
                  <Search size={24} className="text-slate-400 ml-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="المسمى الوظيفي، الشركة، المكان..."
                    className="w-full bg-transparent border-none text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 text-lg py-3 font-medium"
                    dir="rtl"
                  />
                </div>
                <button type="submit" className="w-full sm:w-auto bg-[#0B1B3D] hover:bg-[#1a2b52] text-white px-10 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all">
                  ابحث دلوقتي
                </button>
              </form>
            </motion.div>

            {/* Popular Searches */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-end gap-3 text-sm">
              <span className="text-slate-500 font-bold ml-2">الأكثر بحثاً:</span>
              {popularSearches.slice(0, 4).map((term, idx) => (
                <Link
                  key={idx}
                  to={`/jobs?q=${term}`}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                >
                  {term}
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Image/Illustration Area */}
          <div className="flex-1 relative hidden md:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Main Image Placeholder */}
              <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm relative z-10 flex flex-col items-center justify-center p-8">
                <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50">
                  <Briefcase size={64} className="text-slate-300 mb-6" />
                  <div className="h-3 w-32 bg-slate-200 rounded-full mb-3"></div>
                  <div className="h-2 w-24 bg-slate-200 rounded-full"></div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute top-16 -right-8 bg-white p-4 rounded-2xl shadow-lg border border-slate-100 z-20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-[#00D084] rounded-xl flex items-center justify-center">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold mb-0.5">+500 وظيفة</p>
                    <p className="text-sm font-black text-slate-800">متاحة الآن</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-24 -left-8 bg-white p-4 rounded-2xl shadow-lg border border-slate-100 z-20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold mb-0.5">شركات موثوقة</p>
                    <p className="text-sm font-black text-slate-800">توظيف سريع</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Stats / Trust Section */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <h3 className="text-4xl font-black text-[#0B1B3D] mb-2">+500</h3>
              <p className="text-slate-500 font-medium">فرصة عمل متاحة</p>
            </div>
            <div className="p-4">
              <h3 className="text-4xl font-black text-[#0B1B3D] mb-2">+2000</h3>
              <p className="text-slate-500 font-medium">باحث عن عمل</p>
            </div>
            <div className="p-4">
              <h3 className="text-4xl font-black text-[#0B1B3D] mb-2">+150</h3>
              <p className="text-slate-500 font-medium">شركة ومحل</p>
            </div>
            <div className="p-4">
              <h3 className="text-4xl font-black text-[#0B1B3D] mb-2">99%</h3>
              <p className="text-slate-500 font-medium">نسبة التوظيف</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black text-[#0B1B3D] mb-4">تصفح حسب القسم</h2>
              <p className="text-slate-500">اختار المجال اللي بتدور فيه عشان تلاقي الوظيفة المناسبة</p>
            </div>
            <Link to="/categories" className="hidden sm:flex items-center gap-2 text-[#00D084] font-bold hover:text-[#00b371] transition-colors">
              كل الأقسام <ChevronLeft size={20} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.length > 0 ? categories.map((cat) => {
              // Map icons based on category ID or name for fallback
              let IconComponent = Briefcase;
              if (cat.id === '1' || cat.name_ar.includes('زراع')) IconComponent = Tractor;
              else if (cat.id === '2' || cat.name_ar.includes('صنايع')) IconComponent = Hammer;
              else if (cat.id === '3' || cat.name_ar.includes('سائق')) IconComponent = Truck;
              else if (cat.id === '4' || cat.name_ar.includes('محلات')) IconComponent = Store;
              else if (cat.id === '5' || cat.name_ar.includes('صيدل')) IconComponent = Stethoscope;
              else if (cat.id === '6' || cat.name_ar.includes('مطاعم')) IconComponent = Coffee;
              else if (cat.id === '7' || cat.name_ar.includes('يومية')) IconComponent = HardHat;
              else if (cat.id === '8' || cat.name_ar.includes('تعليم')) IconComponent = BookOpen;
              else if (cat.id === '9' || cat.name_ar.includes('أمن')) IconComponent = Shield;
              
              return (
              <Link
                key={cat.id}
                to={`/jobs?category=${cat.id}`}
                className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all text-center group border border-slate-100"
              >
                <div className="w-16 h-16 mx-auto bg-emerald-50 text-[#00D084] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#00D084] group-hover:text-white transition-colors">
                  <IconComponent size={28} />
                </div>
                <h3 className="font-bold text-lg text-[#0B1B3D] mb-2">{cat.name_ar}</h3>
                <p className="text-sm text-slate-400">تصفح الوظائف</p>
              </Link>
            )}) : (
              ['عمالة زراعية ومزارع', 'صنايعية وحرفيين', 'سائقين (نقل، جرار، توك توك)', 'عمالة يومية'].map((name, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
                  <div className="w-16 h-16 mx-auto bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-6">
                    <Briefcase size={28} />
                  </div>
                  <h3 className="font-bold text-lg text-[#0B1B3D] mb-2">{name}</h3>
                  <p className="text-sm text-slate-400">تصفح الوظائف</p>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/categories" className="inline-flex items-center gap-2 text-[#00D084] font-bold hover:text-[#00b371] transition-colors">
              كل الأقسام <ChevronLeft size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Jobs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black text-[#0B1B3D] mb-4">أحدث الوظائف</h2>
              <p className="text-slate-500">فرص شغل لسه نازلة طازة</p>
            </div>
            <Link to="/jobs" className="hidden sm:flex items-center gap-2 text-[#00D084] font-bold hover:text-[#00b371] transition-colors">
              كل الوظائف <ChevronLeft size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentJobs.length > 0 ? recentJobs.map((job) => (
              <Link key={job.id} to={`/jobs/${job.id}`} className="block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 hover:border-[#00D084] transition-all duration-300 group relative">
                <button 
                  onClick={(e) => toggleSave(e, job.id)}
                  className="absolute top-6 left-6 p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
                  title={savedJobs.includes(job.id) ? "إزالة من المحفوظات" : "حفظ الوظيفة"}
                >
                  <Heart size={22} className={savedJobs.includes(job.id) ? "fill-red-500 text-red-500" : ""} />
                </button>
                <div className="flex justify-between items-start mb-6 gap-4 pr-2">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
                      <Building2 size={26} className="text-slate-400 group-hover:text-[#00D084] transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#0B1B3D] group-hover:text-[#00D084] transition-colors mb-1.5">{job.job_title}</h3>
                      <p className="text-slate-500 text-sm font-medium">{job.business_name || 'جهة غير معلنة'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-slate-50 text-slate-600 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5">
                    <MapPin size={14} className="text-slate-400" />
                    {job.area || job.center || job.governorate}
                  </span>
                  <span className="bg-slate-50 text-slate-600 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5">
                    <Briefcase size={14} className="text-slate-400" />
                    {job.employment_type || 'دوام كامل'}
                  </span>
                  <span className="bg-slate-50 text-slate-600 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5">
                    <Clock size={14} className="text-slate-400" />
                    {job.published_at ? formatDistanceToNow(new Date(job.published_at), { addSuffix: true, locale: arEG }) : 'منذ فترة'}
                  </span>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 mb-1 font-bold">الراتب</span>
                    <span className="font-black text-lg text-[#0B1B3D]">{job.salary_text || 'يحدد في المقابلة'}</span>
                  </div>
                  <span className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#00D084] group-hover:text-white transition-all shadow-sm group-hover:shadow-md">
                    <ChevronLeft size={24} />
                  </span>
                </div>
              </Link>
            )) : (
              <div className="col-span-full text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-[#0B1B3D] mb-2">مفيش وظايف حالياً</h3>
                <p className="text-slate-500 mb-8">خليك أول واحد ينزل إعلان شغل على المنصة!</p>
                <Link to="/post-job" className="inline-flex items-center gap-2 px-8 py-4 bg-[#0B1B3D] text-white font-bold rounded-2xl hover:bg-[#1a2b52] transition-colors shadow-lg">
                  <PlusCircle size={20} />
                  نزل إعلان شغل
                </Link>
              </div>
            )}
          </div>
          
          <div className="mt-10 text-center sm:hidden">
            <Link to="/jobs" className="inline-flex items-center gap-2 text-[#00D084] font-bold hover:text-[#00b371] bg-emerald-50 px-8 py-4 rounded-2xl w-full justify-center">
              كل الوظائف <ChevronLeft size={20} />
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
