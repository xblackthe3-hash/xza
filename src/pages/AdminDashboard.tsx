import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle, Clock, Archive, Trash2, ShieldAlert } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { arEG } from 'date-fns/locale';

export default function AdminDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected, archived

  useEffect(() => {
    fetchJobs();
  }, [filter]);

  async function fetchJobs() {
    setLoading(true);
    const { data } = await supabase
      .from('jobs')
      .select(`
        *,
        job_categories (name_ar)
      `)
      .eq('status', filter)
      .order('created_at', { ascending: false });
      
    if (data) setJobs(data);
    setLoading(false);
  }

  const handleAction = async (id: string, action: string) => {
    if (!window.confirm(`متأكد إنك عايز تعمل ${action} للإعلان ده؟`)) return;

    try {
      const updates: any = { status: action };
      if (action === 'approved') {
        updates.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      // Refresh list
      fetchJobs();
    } catch (err: any) {
      alert(err.message || 'حصلت مشكلة.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('متأكد إنك عايز تمسح الإعلان ده نهائياً؟')) return;

    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchJobs();
    } catch (err: any) {
      alert(err.message || 'حصلت مشكلة في المسح.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
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
    </div>
  );
}
