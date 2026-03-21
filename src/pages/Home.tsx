import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, ChevronLeft, Building2, Users, Star, ArrowLeft, PlusCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchHomeData() {
      const { data: catData } = await supabase.from('job_categories').select('*').eq('is_active', true).limit(8);
      if (catData) setCategories(catData);

      const { data: jobData } = await supabase
        .from('jobs')
        .select('id, job_title, business_name, governorate, center, area, salary_text, employment_type, created_at, job_categories (name_ar)')
        .eq('status', 'approved')
        .order('published_at', { ascending: false })
        .limit(6);
      if (jobData) setRecentJobs(jobData);
    }
    fetchHomeData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const popularSearches = ['عاملة منزلية', 'نجار', 'عامل مطعم', 'سائق', 'كاشير', 'بائع'];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-br from-[#0B1727] via-[#16345A] to-[#046C4E]">
        {/* Starry Background */}
        <div className="absolute inset-0 bg-stars opacity-40"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-yellow-500 text-sm font-bold mb-8 backdrop-blur-sm">
            <Star size={16} className="fill-yellow-500" />
            منصة الوظائف الأولى في نكلا
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-[1.2]">
            <span className="block mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">فرص شغل</span>
            قريبة منك في
            <span className="block mt-2 text-yellow-400">نكلا</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-blue-100/80 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            لو بتدور على شغل أو محتاج حد يشتغل عندك، الموقع ده هيساعدك بسهولة وبسرعة
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl flex items-center gap-2 shadow-2xl shadow-black/20">
              <div className="flex-1 flex items-center px-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="...ابحث عن وظيفة حلمك"
                  className="w-full bg-transparent border-none text-white placeholder-blue-200/50 focus:outline-none focus:ring-0 text-lg"
                  dir="rtl"
                />
              </div>
              <button type="submit" className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg">
                ابحث الآن
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Popular Searches */}
          <div className="mb-16">
            <p className="text-sm text-blue-200/60 mb-4 font-medium flex items-center justify-center gap-2">
              <Search size={14} /> البحث الشائع
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {popularSearches.map((term, idx) => (
                <Link
                  key={idx}
                  to={`/jobs?q=${term}`}
                  className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-blue-100 text-sm hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/jobs"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-2xl text-lg transition-all shadow-xl flex items-center justify-center gap-3 group"
            >
              <Briefcase size={24} className="text-blue-600 group-hover:scale-110 transition-transform" />
              أنا بدور على شغل
            </Link>
            <Link
              to="/post-job"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-white font-bold rounded-2xl text-lg transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 group"
            >
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
              أنا محتاج حد يشتغل
            </Link>
          </div>

        </div>

        {/* Bottom Curve Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-[50px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,115.4,188.9,97.9,234.3,84.34,278.14,71.38,321.39,56.44Z" className="fill-slate-50"></path>
          </svg>
        </div>
      </section>

      {/* Stats / Trust Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 rounded-3xl bg-white shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                <Briefcase size={28} />
              </div>
              <h3 className="text-4xl font-extrabold text-slate-900 mb-2">+500</h3>
              <p className="text-slate-500 font-medium">فرصة عمل متاحة</p>
            </div>
            <div className="p-8 rounded-3xl bg-white shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 -rotate-3">
                <Users size={28} />
              </div>
              <h3 className="text-4xl font-extrabold text-slate-900 mb-2">+2000</h3>
              <p className="text-slate-500 font-medium">باحث عن عمل</p>
            </div>
            <div className="p-8 rounded-3xl bg-white shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                <Building2 size={28} />
              </div>
              <h3 className="text-4xl font-extrabold text-slate-900 mb-2">+150</h3>
              <p className="text-slate-500 font-medium">شركة ومحل</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">تصفح حسب القسم</h2>
            <p className="text-slate-500">اختار المجال اللي بتدور فيه عشان تلاقي الوظيفة المناسبة</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.length > 0 ? categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/jobs?category=${cat.id}`}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all text-center group"
              >
                <h3 className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{cat.name_ar}</h3>
              </Link>
            )) : (
              ['عمالة يدوية وحرفية', 'مبيعات وتسويق', 'سائقين وتوصيل', 'مطاعم وكافيهات'].map((name, i) => (
                <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                  <h3 className="font-bold text-slate-700">{name}</h3>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Recent Jobs */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">أحدث الوظائف</h2>
              <p className="text-slate-500">فرص شغل لسه نازلة طازة</p>
            </div>
            <Link to="/jobs" className="hidden sm:flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 bg-blue-50 px-6 py-2.5 rounded-full transition-colors">
              كل الوظائف <ChevronLeft size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentJobs.length > 0 ? recentJobs.map((job) => (
              <Link key={job.id} to={`/jobs/${job.id}`} className="block bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">{job.job_title}</h3>
                    <p className="text-slate-500 text-sm font-medium">{job.business_name || 'جهة غير معلنة'}</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full">
                    {job.employment_type || 'دوام كامل'}
                  </span>
                </div>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <MapPin size={16} className="text-slate-400" />
                    <span>{job.area || job.center || job.governorate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Briefcase size={16} className="text-slate-400" />
                    <span>{job.job_categories?.name_ar || 'غير محدد'}</span>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-emerald-600">{job.salary_text || 'يحدد في المقابلة'}</span>
                  <span className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ChevronLeft size={20} />
                  </span>
                </div>
              </Link>
            )) : (
              <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
                <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-700 mb-2">مفيش وظايف حالياً</h3>
                <p className="text-slate-500 mb-8">خليك أول واحد ينزل إعلان شغل على المنصة!</p>
                <Link to="/post-job" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                  <PlusCircle size={20} />
                  نزل إعلان شغل
                </Link>
              </div>
            )}
          </div>
          
          <div className="mt-10 text-center sm:hidden">
            <Link to="/jobs" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 bg-blue-50 px-8 py-4 rounded-2xl w-full justify-center">
              كل الوظائف <ChevronLeft size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
