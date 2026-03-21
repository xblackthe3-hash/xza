import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter, ChevronLeft, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { arEG } from 'date-fns/locale';

export default function Jobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // Fetch categories
      const { data: catData } = await supabase
        .from('job_categories')
        .select('*')
        .eq('is_active', true);
      if (catData) setCategories(catData);

      // Fetch jobs
      let query = supabase
        .from('jobs')
        .select(`
          id, job_title, business_name, governorate, center, area, salary_text, employment_type, created_at, published_at,
          job_categories (name_ar)
        `)
        .eq('status', 'approved')
        .order('published_at', { ascending: false });

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      if (searchTerm) {
        query = query.ilike('job_title', `%${searchTerm}%`);
      }

      const { data: jobData } = await query;
      if (jobData) setJobs(jobData);
      
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

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">دور على شغل</h1>
          <p className="text-slate-600 mb-8">اكتشف أحدث الوظائف المتاحة في نكلا والمناطق المجاورة</p>
          
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-4 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="بتدور على شغل إيه؟ (مثال: كاشير، سواق، مبيعات)"
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
                className="block w-full pl-4 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
              >
                <option value="">كل الأقسام</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name_ar}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-blue-500/30"
            >
              بحث
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {loading ? 'جاري البحث...' : `${jobs.length} وظيفة متاحة`}
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse h-64"></div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Link key={job.id} to={`/jobs/${job.id}`} className="block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 group flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">{job.job_title}</h3>
                    <p className="text-slate-500 text-sm font-medium">{job.business_name || 'جهة غير معلنة'}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <MapPin size={16} className="text-slate-400 shrink-0" />
                    <span className="truncate">{job.area || job.center || job.governorate || 'نكلا والمناطق المجاورة'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Briefcase size={16} className="text-slate-400 shrink-0" />
                    <span className="truncate">{job.job_categories?.name_ar || 'غير محدد'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Clock size={16} className="text-slate-400 shrink-0" />
                    <span className="truncate">
                      {job.published_at ? formatDistanceToNow(new Date(job.published_at), { addSuffix: true, locale: arEG }) : 'منذ فترة'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center mt-auto">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 mb-1">الراتب المتوقع</span>
                    <span className="font-bold text-emerald-600">{job.salary_text || 'يحدد في المقابلة'}</span>
                  </div>
                  <span className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ChevronLeft size={20} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
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
          </div>
        )}
      </div>
    </div>
  );
}
