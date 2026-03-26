import React from 'react';
import { motion } from 'motion/react';

export default function Privacy() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 pt-20 pb-12"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#0B1B3D] mb-4">سياسة الخصوصية</h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-[#0B1B3D] mb-4">1. مقدمة</h2>
              <p>
                نحن في "نكلا جوب" نولي أهمية قصوى لخصوصية مستخدمينا. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدامك لمنصتنا.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0B1B3D] mb-4">2. جمع المعلومات</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>المعلومات التي تقدمها طواعية عند إنشاء حساب أو نشر إعلان وظيفة (مثل الاسم، البريد الإلكتروني، رقم الهاتف، تفاصيل الوظيفة).</li>
                <li>معلومات الاستخدام والتصفح التي يتم جمعها تلقائيًا عند زيارة الموقع (مثل عنوان IP، نوع المتصفح، الصفحات التي زرتها).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0B1B3D] mb-4">3. استخدام المعلومات</h2>
              <p>
                نستخدم المعلومات التي نجمعها للأغراض التالية:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>تقديم خدماتنا وتحسينها.</li>
                <li>التواصل معك بشأن حسابك أو إعلاناتك.</li>
                <li>تحليل استخدام الموقع لتحسين تجربة المستخدم.</li>
                <li>الامتثال للمتطلبات القانونية.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0B1B3D] mb-4">4. مشاركة المعلومات</h2>
              <p>
                نحن لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك في الحالات التالية:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>مع مزودي الخدمات الذين يساعدوننا في تشغيل الموقع (مثل خدمات الاستضافة).</li>
                <li>إذا كان ذلك مطلوبًا بموجب القانون أو استجابة لطلب قانوني.</li>
                <li>لحماية حقوقنا أو ممتلكاتنا أو سلامة مستخدمينا.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0B1B3D] mb-4">5. أمن المعلومات</h2>
              <p>
                نتخذ تدابير أمنية معقولة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الإفصاح أو الإتلاف. ومع ذلك، لا توجد طريقة نقل عبر الإنترنت أو تخزين إلكتروني آمنة بنسبة 100%.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0B1B3D] mb-4">6. حقوقك</h2>
              <p>
                لديك الحق في الوصول إلى معلوماتك الشخصية وتصحيحها أو حذفها. يمكنك أيضًا سحب موافقتك على معالجة معلوماتك في أي وقت. للقيام بذلك، يرجى الاتصال بنا.
              </p>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
