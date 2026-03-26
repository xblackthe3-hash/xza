import React from 'react';
import { motion } from 'motion/react';
import { Building2, Users, Target, ShieldCheck } from 'lucide-react';

export default function About() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 pt-20 pb-12"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#0B1B3D] mb-4">عن نكلا جوب</h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            المنصة الأولى المتخصصة في ربط أصحاب الأعمال بالباحثين عن عمل في نكلا العنب والقرى المجاورة.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 mb-12">
          <h2 className="text-2xl font-bold text-[#0B1B3D] mb-6">قصتنا</h2>
          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg">
            <p className="mb-4">
              بدأت فكرة "نكلا جوب" من حاجة حقيقية في مجتمعنا. لاحظنا إن كتير من أصحاب المحلات والمصانع والشركات في نكلا العنب بيلاقوا صعوبة في الوصول للعمالة المناسبة، وفي نفس الوقت شباب كتير بيدوروا على شغل ومش عارفين يوصلوا للفرص المتاحة.
            </p>
            <p>
              عشان كده قررنا نعمل منصة إلكترونية بسيطة وسهلة الاستخدام تجمع كل الفرص الوظيفية في مكان واحد، وتسهل التواصل بين صاحب العمل والباحث عن وظيفة بدون أي وسطاء أو تعقيدات.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <div className="w-14 h-14 bg-emerald-50 text-[#00D084] rounded-2xl flex items-center justify-center mb-6">
              <Target size={28} />
            </div>
            <h3 className="text-xl font-bold text-[#0B1B3D] mb-3">رؤيتنا</h3>
            <p className="text-slate-600 leading-relaxed">
              أن نكون الوجهة الأولى والموثوقة لكل باحث عن عمل وكل صاحب عمل في نكلا العنب، والمساهمة في تقليل البطالة وتنمية المجتمع المحلي.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-bold text-[#0B1B3D] mb-3">قيمنا</h3>
            <p className="text-slate-600 leading-relaxed">
              المصداقية، الشفافية، سهولة الاستخدام، والالتزام بتقديم خدمة مجانية ومفيدة لأهل بلدنا.
            </p>
          </div>
        </div>

        <div className="bg-[#0B1B3D] rounded-3xl p-8 md:p-12 text-center text-white shadow-lg">
          <h2 className="text-2xl md:text-3xl font-black mb-4">جاهز تبدأ رحلتك؟</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            سواء كنت بتدور على شغل أو محتاج موظفين، نكلا جوب هي المكان المناسب ليك.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/jobs" className="bg-[#00D084] hover:bg-[#00b371] text-white px-8 py-3 rounded-xl font-bold transition-colors">
              تصفح الوظائف
            </a>
            <a href="/post-job" className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-bold transition-colors">
              انشر وظيفة
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
