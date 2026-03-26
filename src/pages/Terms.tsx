import React from 'react';
import { motion } from 'motion/react';

export default function Terms() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 pt-20 pb-12"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#0B1B3D] mb-4">شروط الاستخدام</h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-[#0B1B3D] mb-4">1. قبول الشروط</h2>
              <p>
                باستخدامك لموقع "نكلا جوب"، فإنك توافق على الالتزام بشروط الاستخدام هذه. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام الموقع.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0B1B3D] mb-4">2. وصف الخدمة</h2>
              <p>
                "نكلا جوب" هي منصة إلكترونية تهدف إلى تسهيل التواصل بين أصحاب العمل والباحثين عن عمل في نكلا العنب والمناطق المجاورة. نحن لا نتدخل في عملية التوظيف نفسها ولا نضمن الحصول على وظيفة.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0B1B3D] mb-4">3. مسؤولية المستخدم</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>يجب أن تكون المعلومات المقدمة في الإعلانات صحيحة ودقيقة.</li>
                <li>يُمنع نشر إعلانات وهمية أو مضللة أو غير قانونية.</li>
                <li>يتحمل صاحب العمل مسؤولية التأكد من صحة بيانات المتقدمين للوظيفة.</li>
                <li>يتحمل الباحث عن عمل مسؤولية التأكد من مصداقية صاحب العمل قبل تقديم أي معلومات شخصية أو مالية.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0B1B3D] mb-4">4. إخلاء المسؤولية</h2>
              <p>
                الموقع غير مسؤول عن أي أضرار أو خسائر ناتجة عن استخدام الخدمة، بما في ذلك على سبيل المثال لا الحصر، فقدان البيانات أو الأرباح. نحن لا نضمن صحة أو دقة الإعلانات المنشورة.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0B1B3D] mb-4">5. التعديلات</h2>
              <p>
                نحتفظ بالحق في تعديل شروط الاستخدام في أي وقت. سيتم نشر التعديلات على هذه الصفحة، ويعتبر استمرارك في استخدام الموقع بعد نشر التعديلات موافقة منك عليها.
              </p>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
