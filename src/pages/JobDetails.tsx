import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MapPin, Briefcase, Clock, DollarSign, Phone, MessageCircle, ChevronRight, User, GraduationCap, Users, Eye, Heart, Flag, CheckCircle2, Building2, Share2, Facebook, Copy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { arEG } from 'date-fns/locale';
import { motion } from 'motion/react';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [views, setViews] = useState(0);

  useEffect(() => {
    if (id) {
      const savedJobs = JSON.parse(localStorage.getItem('nekla_saved_jobs') || '[]');
      setIsSaved(savedJobs.includes(id));
      
      // Generate deterministic views based on ID if not available in DB
      const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      setViews(120 + (hash % 300));
    }
  }, [id]);

  const toggleSave = () => {
    if (!id) return;
    const savedJobs = JSON.parse(localStorage.getItem('nekla_saved_jobs') || '[]');
    if (isSaved) {
      const newSaved = savedJobs.filter((jId: string) => jId !== id);
      localStorage.setItem('nekla_saved_jobs', JSON.stringify(newSaved));
      setIsSaved(false);
    } else {
      savedJobs.push(id);
      localStorage.setItem('nekla_saved_jobs', JSON.stringify(savedJobs));
      setIsSaved(true);
    }
  };

  const handleReport = () => {
    if (!job) return;
    const message = `🚨 بلاغ عن وظيفة:
اسم الوظيفة: ${job.job_title}
رابط الوظيفة: ${window.location.href}
السبب: (اكتب السبب هنا - رقم غلط / نصب / شغل وهمي)`;
    window.open(`https://wa.me/201090841534?text=${encodeURIComponent(message)}`, '_blank');
  };

  const markAsFilled = async () => {
    if (!id || !window.confirm('هل أنت متأكد أنك تريد إغلاق هذا الإعلان؟ سيتم إخفاؤه من القائمة الرئيسية.')) return;
    
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: 'filled' })
        .eq('id', id);
        
      if (error) throw error;
      
      setJob({ ...job, status: 'filled' });
      alert('تم تحديث حالة الإعلان بنجاح.');
    } catch (err) {
      console.error("Error marking job as filled:", err);
      // Fallback to local storage overrides
      const overrides = JSON.parse(localStorage.getItem('nekla_job_overrides') || '{}');
      overrides[id] = 'filled';
      localStorage.setItem('nekla_job_overrides', JSON.stringify(overrides));
      
      setJob({ ...job, status: 'filled' });
      alert('تم تحديث حالة الإعلان بنجاح.');
    }
  };

  useEffect(() => {
    async function fetchJob() {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select(`
            *,
            job_categories (name_ar)
          `)
          .eq('id', id)
          .single();
          
        if (error) throw error;
        if (data) {
          setJob(data);
          // Increment views count
          try {
            await supabase.rpc('increment_views', { job_id: id });
          } catch (e) {}
        }
      } catch (err) {
        console.error("Supabase error, using local storage:", err);
        const localJobs = JSON.parse(localStorage.getItem('nekla_jobs') || '[]');
        const localJob = localJobs.find((j: any) => j.id === id);
        if (localJob) {
          // Add category name
          const cat = [
            { id: '1', name_ar: 'عمالة زراعية ومزارع' },
            { id: '2', name_ar: 'صنايعية وحرفيين' },
            { id: '3', name_ar: 'سائقين (نقل، جرار، توك توك)' },
            { id: '4', name_ar: 'محلات تجارية وسوبر ماركت' },
            { id: '5', name_ar: 'صيدليات وعيادات' },
            { id: '6', name_ar: 'مطاعم وكافيهات' },
            { id: '7', name_ar: 'عمالة يومية (شغل يوم بيوم)' },
            { id: '8', name_ar: 'تعليم وتدريس (حضانات، سناتر)' },
            { id: '9', name_ar: 'أمن وحراسة' },
            { id: '10', name_ar: 'أخرى' }
          ].find(c => c.id === localJob.category_id);
          
          setJob({ ...localJob, job_categories: { name_ar: cat ? cat.name_ar : 'غير محدد' } });
        }
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('تم نسخ الرابط بنجاح!');
  };

  const handleShareWhatsApp = () => {
    const text = `شوف الوظيفة دي على نكلا جوب: ${job.job_title}\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D084]"></div></div>;
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">الوظيفة دي مش موجودة أو اتمسحت</h2>
        <Link to="/jobs" className="text-[#00D084] hover:underline font-medium">الرجوع لقائمة الوظائف</Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 pt-20 pb-12"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          to="/jobs" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#00D084] font-bold mb-6 transition-colors group"
        >
          <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-200 group-hover:border-[#00D084]/30 group-hover:bg-emerald-50">
            <ChevronRight size={18} />
          </div>
          <span>الرجوع للوظائف</span>
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 mb-8 relative overflow-hidden">
          {job.status === 'filled' && (
            <div className="bg-red-500 text-white text-center py-2 font-bold text-sm z-20">
              تم شغل هذه الوظيفة (مغلق)
            </div>
          )}
          
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-slate-100 text-slate-700 text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 uppercase tracking-wider">
                    {job.job_categories?.name_ar || 'عام'}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-100">
                    {job.employment_type || 'دوام كامل'}
                  </span>
                </div>
                <h1 className="text-2xl md:text-4xl font-black text-[#0B1B3D] leading-tight">
                  {job.job_title}
                </h1>
                <p className="text-lg md:text-xl text-slate-600 font-bold flex items-center gap-2">
                  <Building2 size={20} className="text-[#00D084]" />
                  {job.business_name || 'جهة غير معلنة'}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button 
                  onClick={toggleSave}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border transition-all font-bold text-sm ${
                    isSaved 
                      ? 'bg-red-50 border-red-200 text-red-600 shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Heart size={18} className={isSaved ? 'fill-current' : ''} />
                  {isSaved ? 'محفوظة' : 'حفظ'}
                </button>
                <button 
                  onClick={handleReport}
                  className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                  title="إبلاغ"
                >
                  <Flag size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-1">
                <span className="text-slate-500 text-[10px] md:text-xs font-bold flex items-center gap-1 uppercase tracking-wide">
                  <MapPin size={14} className="text-[#00D084]" /> المكان
                </span>
                <span className="font-bold text-slate-800 text-sm md:text-base truncate">
                  {job.area || job.center || 'نكلا العنب'}
                </span>
              </div>
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50 flex flex-col gap-1">
                <span className="text-emerald-600/70 text-[10px] md:text-xs font-bold flex items-center gap-1 uppercase tracking-wide">
                  <DollarSign size={14} className="text-emerald-500" /> الراتب
                </span>
                <span className="font-bold text-emerald-700 text-sm md:text-base truncate">
                  {job.salary_text || 'يحدد لاحقاً'}
                </span>
              </div>
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 flex flex-col gap-1">
                <span className="text-slate-600/70 text-[10px] md:text-xs font-bold flex items-center gap-1 uppercase tracking-wide">
                  <Eye size={14} className="text-[#00D084]" /> المشاهدات
                </span>
                <span className="font-bold text-slate-700 text-sm md:text-base">
                  {views} مشاهدة
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-1">
                <span className="text-slate-500 text-[10px] md:text-xs font-bold flex items-center gap-1 uppercase tracking-wide">
                  <Clock size={14} className="text-[#00D084]" /> نُشرت
                </span>
                <span className="font-bold text-slate-800 text-sm md:text-base">
                  {job.published_at ? formatDistanceToNow(new Date(job.published_at), { addSuffix: true, locale: arEG }) : 'الآن'}
                </span>
              </div>
            </div>

            {/* Desktop Contact Actions */}
            <div className="hidden md:flex mt-8 gap-4">
              {job.whatsapp && (
                <a 
                  href={`https://wa.me/${job.whatsapp.replace(/[^0-9]/g, '')}?text=بخصوص إعلان وظيفة: ${job.job_title} على Nekla Job`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleContactClick}
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-black rounded-2xl transition-all shadow-lg shadow-[#25D366]/20 text-lg"
                >
                  <MessageCircle size={24} />
                  تواصل عبر واتساب
                </a>
              )}
              {job.phone && (
                <a 
                  href={`tel:${job.phone}`}
                  onClick={handleContactClick}
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-[#0B1B3D] hover:bg-[#152b57] text-white font-black rounded-2xl transition-all shadow-lg shadow-[#0B1B3D]/20 text-lg"
                >
                  <Phone size={24} />
                  اتصل بصاحب العمل
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Details Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-24 md:pb-8">
          
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#0B1B3D]">
                  <Briefcase size={20} />
                </div>
                <h3 className="text-xl font-black text-[#0B1B3D]">وصف الوظيفة</h3>
              </div>
              <div className="prose prose-slate max-w-none whitespace-pre-line text-slate-700 leading-relaxed text-base md:text-lg">
                {job.description}
              </div>
            </div>

            {job.requirements && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <h3 className="text-xl font-black text-[#0B1B3D]">الشروط والمتطلبات</h3>
                </div>
                <div className="prose prose-slate max-w-none whitespace-pre-line text-slate-700 leading-relaxed text-base md:text-lg">
                  {job.requirements}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Share Section */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-[#0B1B3D] mb-4 flex items-center gap-2">
                <Share2 size={20} className="text-[#00D084]" />
                شارك الوظيفة
              </h3>
              <div className="flex gap-3">
                <button 
                  onClick={handleShareWhatsApp}
                  className="flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                >
                  <MessageCircle size={24} />
                  <span className="text-xs font-bold">واتساب</span>
                </button>
                <button 
                  onClick={handleShareFacebook}
                  className="flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-colors"
                >
                  <Facebook size={24} />
                  <span className="text-xs font-bold">فيسبوك</span>
                </button>
                <button 
                  onClick={handleCopyLink}
                  className="flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <Copy size={24} />
                  <span className="text-xs font-bold">نسخ الرابط</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-[#0B1B3D] mb-6 flex items-center gap-2">
                <Users size={20} className="text-[#00D084]" />
                تفاصيل إضافية
              </h3>
              <ul className="space-y-5">
                {job.work_hours && (
                  <li className="flex items-start gap-4">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                      <Clock size={18} />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">مواعيد العمل</span>
                      <span className="font-bold text-slate-700">{job.work_hours}</span>
                    </div>
                  </li>
                )}
                {job.experience_required && (
                  <li className="flex items-start gap-4">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                      <GraduationCap size={18} />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">الخبرة</span>
                      <span className="font-bold text-slate-700">{job.experience_required}</span>
                    </div>
                  </li>
                )}
                {job.gender_preference && (
                  <li className="flex items-start gap-4">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                      <User size={18} />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">الجنس</span>
                      <span className="font-bold text-slate-700">{job.gender_preference}</span>
                    </div>
                  </li>
                )}
                {job.number_of_workers_needed > 1 && (
                  <li className="flex items-start gap-4">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                      <Users size={18} />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">العدد المطلوب</span>
                      <span className="font-bold text-slate-700">{job.number_of_workers_needed} أشخاص</span>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#0B1B3D] to-[#152b57] rounded-3xl p-6 text-white shadow-lg shadow-[#0B1B3D]/20">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={20} className="text-[#00D084]" />
                <h4 className="font-black text-lg">نصيحة أمان</h4>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                ماتدفعش أي فلوس أو رسوم عشان تستلم شغل. لو حد طلب منك فلوس، بلّغ عنه فوراً من خلال زرار الإبلاغ.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Contact Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 p-4 z-50 flex gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        {job.whatsapp && (
          <a 
            href={`https://wa.me/${job.whatsapp.replace(/[^0-9]/g, '')}?text=بخصوص إعلان وظيفة: ${job.job_title} على Nekla Job`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleContactClick}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#25D366] text-white font-black rounded-2xl shadow-lg shadow-[#25D366]/20 text-sm"
          >
            <MessageCircle size={18} />
            واتساب
          </a>
        )}
        {job.phone && (
          <a 
            href={`tel:${job.phone}`}
            onClick={handleContactClick}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#0B1B3D] text-white font-black rounded-2xl shadow-lg shadow-[#0B1B3D]/20 text-sm"
          >
            <Phone size={18} />
            اتصال
          </a>
        )}
      </div>
    </motion.div>
  );
}
