import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MapPin, Briefcase, Clock, DollarSign, Phone, MessageCircle, ChevronRight, User, GraduationCap, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { arEG } from 'date-fns/locale';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      if (!id) return;
      
      const { data } = await supabase
        .from('jobs')
        .select(`
          *,
          job_categories (name_ar)
        `)
        .eq('id', id)
        .single();
        
      if (data) {
        setJob(data);
        // Increment views count
        try {
          await supabase.rpc('increment_views', { job_id: id });
        } catch (e) {}
      }
      setLoading(false);
    }

    fetchJob();
  }, [id]);

  const handleContactClick = async () => {
    if (id) {
      try {
        await supabase.rpc('increment_contact_clicks', { job_id: id });
      } catch (e) {}
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">الوظيفة دي مش موجودة أو اتمسحت</h2>
        <Link to="/jobs" className="text-blue-600 hover:underline font-medium">الرجوع لقائمة الوظائف</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <Link to="/jobs" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium mb-6 transition-colors">
          <ChevronRight size={20} />
          الرجوع للوظائف
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{job.job_title}</h1>
              <p className="text-lg text-slate-600 font-medium">{job.business_name || 'جهة غير معلنة'}</p>
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-sm font-bold px-4 py-2 rounded-full border border-emerald-100">
              {job.employment_type || 'دوام كامل'}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-100">
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 text-sm flex items-center gap-1"><MapPin size={14}/> المكان</span>
              <span className="font-bold text-slate-800">{job.area || job.center || job.governorate || 'غير محدد'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 text-sm flex items-center gap-1"><DollarSign size={14}/> الراتب</span>
              <span className="font-bold text-emerald-600">{job.salary_text || 'يحدد في المقابلة'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 text-sm flex items-center gap-1"><Briefcase size={14}/> القسم</span>
              <span className="font-bold text-slate-800">{job.job_categories?.name_ar || 'غير محدد'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 text-sm flex items-center gap-1"><Clock size={14}/> نُشرت</span>
              <span className="font-bold text-slate-800">
                {job.published_at ? formatDistanceToNow(new Date(job.published_at), { addSuffix: true, locale: arEG }) : 'منذ فترة'}
              </span>
            </div>
          </div>

          {/* Contact Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {job.whatsapp && (
              <a 
                href={`https://wa.me/${job.whatsapp.replace(/[^0-9]/g, '')}?text=بخصوص إعلان وظيفة: ${job.job_title} على Nekla Job`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleContactClick}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-2xl transition-all shadow-lg shadow-[#25D366]/30"
              >
                <MessageCircle size={24} />
                تواصل واتساب
              </a>
            )}
            {job.phone && (
              <a 
                href={`tel:${job.phone}`}
                onClick={handleContactClick}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/30"
              >
                <Phone size={24} />
                اتصل بالرقم
              </a>
            )}
            {!job.whatsapp && !job.phone && (
              <div className="flex-1 text-center p-4 bg-slate-100 text-slate-500 rounded-2xl">
                طريقة التواصل غير متوفرة حالياً
              </div>
            )}
          </div>
        </div>

        {/* Details Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">تفاصيل الوظيفة</h3>
              <div className="prose prose-slate max-w-none whitespace-pre-line text-slate-700 leading-relaxed">
                {job.description}
              </div>
            </div>

            {job.requirements && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">الشروط والمتطلبات</h3>
                <div className="prose prose-slate max-w-none whitespace-pre-line text-slate-700 leading-relaxed">
                  {job.requirements}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">معلومات إضافية</h3>
              <ul className="space-y-4">
                {job.work_hours && (
                  <li className="flex items-start gap-3">
                    <Clock size={20} className="text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-sm text-slate-500">مواعيد العمل</span>
                      <span className="font-medium text-slate-800">{job.work_hours}</span>
                    </div>
                  </li>
                )}
                {job.experience_required && (
                  <li className="flex items-start gap-3">
                    <GraduationCap size={20} className="text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-sm text-slate-500">الخبرة المطلوبة</span>
                      <span className="font-medium text-slate-800">{job.experience_required}</span>
                    </div>
                  </li>
                )}
                {job.gender_preference && (
                  <li className="flex items-start gap-3">
                    <User size={20} className="text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-sm text-slate-500">الجنس المطلوب</span>
                      <span className="font-medium text-slate-800">{job.gender_preference}</span>
                    </div>
                  </li>
                )}
                {job.number_of_workers_needed > 1 && (
                  <li className="flex items-start gap-3">
                    <Users size={20} className="text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-sm text-slate-500">العدد المطلوب</span>
                      <span className="font-medium text-slate-800">{job.number_of_workers_needed} أشخاص</span>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100 text-center">
              <h4 className="font-bold text-blue-900 mb-2">نصيحة أمان</h4>
              <p className="text-sm text-blue-700 mb-4">
                ماتدفعش أي فلوس أو رسوم عشان تستلم شغل. لو حد طلب منك فلوس، بلّغ عنه فوراً.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
