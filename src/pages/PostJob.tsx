import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Briefcase, Building2, MapPin, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PostJob() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    poster_name: '',
    business_name: '',
    job_title: '',
    category_id: '',
    description: '',
    requirements: '',
    salary_text: '',
    employment_type: 'دوام كامل',
    governorate: 'الجيزة',
    center: 'منشأة القناطر',
    area: 'نكلا',
    phone: '',
    whatsapp: '',
    work_hours: '',
    number_of_workers_needed: 1,
    experience_required: ''
  });

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('job_categories')
        .select('*')
        .eq('is_active', true);
      if (data) setCategories(data);
    }
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: submitError } = await supabase
        .from('jobs')
        .insert([
          {
            ...formData,
            status: 'pending', // All new jobs are pending
          }
        ]);

      if (submitError) throw submitError;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'حصلت مشكلة في رفع الإعلان. جرب تاني.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-sm border border-slate-200">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">تم إرسال الإعلان بنجاح!</h2>
          <p className="text-slate-600 mb-8">
            إعلانك دلوقتي في مرحلة المراجعة. هيتم نشره على الموقع في أسرع وقت بعد التأكد من مطابقته للشروط.
          </p>
          <Link to="/" className="block w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
            الرجوع للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">نزل إعلان شغل جديد</h1>
          <p className="text-slate-600">املى البيانات دي عشان توصل لأكبر عدد من الناس اللي بتدور على شغل في نكلا والمناطق المجاورة.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
            <AlertCircle size={24} />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Section 1: Basic Info */}
          <div className="p-6 md:p-8 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Briefcase className="text-blue-500" />
              المعلومات الأساسية
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">المسمى الوظيفي *</label>
                <input
                  type="text"
                  name="job_title"
                  required
                  value={formData.job_title}
                  onChange={handleChange}
                  placeholder="مثال: كاشير، بائع، صنايعي، محاسب..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">اسمك أو اسم المسئول *</label>
                <input
                  type="text"
                  name="poster_name"
                  required
                  value={formData.poster_name}
                  onChange={handleChange}
                  placeholder="الاسم الثلاثي"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">اسم المكان / الشركة</label>
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  placeholder="اسم المحل أو الشركة (اختياري)"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">القسم *</label>
                <select
                  name="category_id"
                  required
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="" disabled>اختار القسم المناسب</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name_ar}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Details */}
          <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Building2 className="text-blue-500" />
              تفاصيل الوظيفة
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">وصف الوظيفة *</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="اشرح طبيعة الشغل بالتفصيل..."
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">الشروط والمتطلبات</label>
                <textarea
                  name="requirements"
                  rows={3}
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="مثال: السن لا يزيد عن 30، خبرة سنة، الخ..."
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">الراتب المتوقع</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      name="salary_text"
                      value={formData.salary_text}
                      onChange={handleChange}
                      placeholder="مثال: 3000 جنيه أو يحدد في المقابلة"
                      className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">مواعيد العمل</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      name="work_hours"
                      value={formData.work_hours}
                      onChange={handleChange}
                      placeholder="مثال: من 9 الصبح لـ 5 العصر"
                      className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Contact & Location */}
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <MapPin className="text-blue-500" />
              المكان والتواصل
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">المنطقة / القرية *</label>
                <input
                  type="text"
                  name="area"
                  required
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="مثال: نكلا، ذات الكوم، برقاش..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">العدد المطلوب</label>
                <input
                  type="number"
                  name="number_of_workers_needed"
                  min="1"
                  value={formData.number_of_workers_needed}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">رقم التليفون *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01xxxxxxxxx"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">رقم الواتساب (اختياري)</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="01xxxxxxxxx"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all shadow-lg ${
                loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'
              }`}
            >
              {loading ? 'جاري الإرسال...' : 'نشر الإعلان'}
            </button>
            <p className="text-center text-sm text-slate-500 mt-4">
              بالضغط على "نشر الإعلان" أنت توافق على شروط الاستخدام. سيتم مراجعة الإعلان قبل نشره.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}
