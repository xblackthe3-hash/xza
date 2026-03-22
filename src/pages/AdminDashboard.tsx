import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle, Clock, Archive, Trash2, ShieldAlert, Lock, KeyRound } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { arEG } from 'date-fns/locale';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected, archived
  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('admin_auth') === 'true');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      sessionStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('كلمة المرور غير صحيحة');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchJobs();
    }
  }, [filter, isAuthenticated]);

  async function fetchJobs() {
    setLoading(true);
    try {
      let fetchedJobs: any[] = [];
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          job_categories (name_ar)
        `)
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        fetchedJobs = data;
      }

      const localJobs = JSON.parse(localStorage.getItem('nekla_jobs') || '[]');
      const overrides = JSON.parse(localStorage.getItem('nekla_job_overrides') || '{}');

      let allJobs = [...fetchedJobs, ...localJobs];

      // Apply overrides
      allJobs = allJobs.map(job => {
        if (overrides[job.id]) {
          return { ...job, status: overrides[job.id] };
        }
        return job;
      });

      // Filter
      let filtered = allJobs.filter(j => j.status === filter);

      // Deduplicate
      filtered = Array.from(new Map(filtered.map(item => [item.id, item])).values());

      filtered.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setJobs(filtered);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleAction = async (id: string, action: string) => {
    // Optimistic UI update
    setJobs(prev => prev.filter(j => j.id !== id));

    // Update local overrides immediately
    const overrides = JSON.parse(localStorage.getItem('nekla_job_overrides') || '{}');
    overrides[id] = action;
    localStorage.setItem('nekla_job_overrides', JSON.stringify(overrides));

    // Update local jobs if it exists there
    const localJobs = JSON.parse(localStorage.getItem('nekla_jobs') || '[]');
    const updatedLocalJobs = localJobs.map((j: any) => {
      if (j.id === id) {
        return { ...j, status: action, published_at: action === 'approved' ? new Date().toISOString() : j.published_at };
      }
      return j;
    });
    localStorage.setItem('nekla_jobs', JSON.stringify(updatedLocalJobs));

    try {
      const updates: any = { status: action };
      if (action === 'approved') {
        updates.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', id);
        
      if (error) {
        console.error("Supabase update error:", error);
      }
    } catch (err: any) {
      console.error("Supabase error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من مسح هذا الإعلان نهائياً؟')) return;

    // Optimistic UI update
    setJobs(prev => prev.filter(j => j.id !== id));

    // Update local overrides immediately
    const overrides = JSON.parse(localStorage.getItem('nekla_job_overrides') || '{}');
    overrides[id] = 'deleted';
    localStorage.setItem('nekla_job_overrides', JSON.stringify(overrides));

    // Remove from local jobs if it exists there
    const localJobs = JSON.parse(localStorage.getItem('nekla_jobs') || '[]');
    const filteredLocalJobs = localJobs.filter((j: any) => j.id !== id);
    localStorage.setItem('nekla_jobs', JSON.stringify(filteredLocalJobs));

    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error("Supabase delete error:", error);
      }
    } catch (err: any) {
      console.error("Supabase error:", err);
    }
  };

  if (!isAuthenticated) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-slate-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-sm border border-slate-200 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">لوحة الإدارة</h1>
          <p className="text-slate-500 mb-8">برجاء إدخال كلمة المرور للوصول للوحة التحكم</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="كلمة المرور"
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-left"
                  dir="ltr"
                />
              </div>
              {loginError && <p className="text-red-500 text-sm mt-2 text-right">{loginError}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/30"
            >
              دخول
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="text-blue-600" />
              لوحة تحكم الإدارة
            </h1>
            <p className="text-slate-600 mt-2">مراجعة وإدارة إعلانات الوظائف</p>
          </div>
          
          <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {[
              { id: 'pending', label: 'قيد المراجعة', icon: <Clock size={16} /> },
              { id: 'approved', label: 'مقبول', icon: <CheckCircle size={16} /> },
              { id: 'rejected', label: 'مرفوض', icon: <XCircle size={16} /> },
              { id: 'archived', label: 'مؤرشف', icon: <Archive size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  filter === tab.id 
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6">
                
                {/* Job Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{job.job_title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      job.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                      job.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {job.status === 'pending' ? 'مراجعة' :
                       job.status === 'approved' ? 'مقبول' :
                       job.status === 'rejected' ? 'مرفوض' : 'مؤرشف'}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 font-medium mb-4">{job.business_name || 'جهة غير معلنة'} - {job.poster_name}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <span className="block text-slate-500">المكان</span>
                      <span className="font-medium text-slate-800">{job.area}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500">القسم</span>
                      <span className="font-medium text-slate-800">{job.job_categories?.name_ar}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500">تاريخ الإضافة</span>
                      <span className="font-medium text-slate-800" dir="ltr">
                        {formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: arEG })}
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-500">التواصل</span>
                      <span className="font-medium text-slate-800" dir="ltr">{job.phone}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 whitespace-pre-line">
                    {job.description}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row md:flex-col gap-3 md:w-48 shrink-0 border-t md:border-t-0 md:border-r border-slate-100 pt-4 md:pt-0 md:pr-6">
                  {filter === 'pending' && (
                    <>
                      <button onClick={() => handleAction(job.id, 'approved')} className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl font-bold transition-colors">
                        <CheckCircle size={18} /> قبول
                      </button>
                      <button onClick={() => handleAction(job.id, 'rejected')} className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl font-bold transition-colors">
                        <XCircle size={18} /> رفض
                      </button>
                    </>
                  )}
                  
                  {filter === 'approved' && (
                    <button onClick={() => handleAction(job.id, 'archived')} className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold transition-colors">
                      <Archive size={18} /> أرشفة
                    </button>
                  )}

                  {(filter === 'rejected' || filter === 'archived') && (
                    <button onClick={() => handleAction(job.id, 'pending')} className="flex-1 flex items-center justify-center gap-2 py-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-xl font-bold transition-colors">
                      <Clock size={18} /> إعادة مراجعة
                    </button>
                  )}

                  <button onClick={() => handleDelete(job.id)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl font-bold transition-colors mt-auto">
                    <Trash2 size={18} /> مسح نهائي
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <ShieldAlert size={64} className="mx-auto text-slate-300 mb-6" />
            <h3 className="text-2xl font-bold text-slate-800 mb-2">مفيش إعلانات هنا</h3>
            <p className="text-slate-500">القائمة دي فاضية حالياً.</p>
          </div>
        )}

      </div>
    </motion.div>
  );
}
