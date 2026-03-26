import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building2, Users, Tractor, Hammer, Truck, Store, Stethoscope, Coffee, HardHat, BookOpen, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';

const FALLBACK_CATEGORIES = [
  { id: '1', name_ar: 'عمالة زراعية ومزارع', icon: 'tractor' },
  { id: '2', name_ar: 'صنايعية وحرفيين', icon: 'hammer' },
  { id: '3', name_ar: 'سائقين (نقل، جرار، توك توك)', icon: 'truck' },
  { id: '4', name_ar: 'محلات تجارية وسوبر ماركت', icon: 'store' },
  { id: '5', name_ar: 'صيدليات وعيادات', icon: 'stethoscope' },
  { id: '6', name_ar: 'مطاعم وكافيهات', icon: 'coffee' },
  { id: '7', name_ar: 'عمالة يومية (شغل يوم بيوم)', icon: 'hard-hat' },
  { id: '8', name_ar: 'تعليم وتدريس (حضانات، سناتر)', icon: 'book-open' },
  { id: '9', name_ar: 'أمن وحراسة', icon: 'shield' },
  { id: '10', name_ar: 'أخرى', icon: 'briefcase' }
];

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data } = await supabase.from('job_categories').select('*').eq('is_active', true);
        if (data && data.length > 0) {
          setCategories(data);
        } else {
          setCategories(FALLBACK_CATEGORIES);
        }
      } catch (e) {
        setCategories(FALLBACK_CATEGORIES);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-slate-50 py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">تصفح الأقسام</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            اختار المجال اللي بتدور فيه عشان تلاقي الوظيفة المناسبة ليك في نكلا العنب
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-slate-200 animate-pulse h-48"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              let IconComponent = Briefcase;
              if (cat.id === '1' || cat.name_ar.includes('زراع')) IconComponent = Tractor;
              else if (cat.id === '2' || cat.name_ar.includes('صنايع')) IconComponent = Hammer;
              else if (cat.id === '3' || cat.name_ar.includes('سائق')) IconComponent = Truck;
              else if (cat.id === '4' || cat.name_ar.includes('محلات')) IconComponent = Store;
              else if (cat.id === '5' || cat.name_ar.includes('صيدل')) IconComponent = Stethoscope;
              else if (cat.id === '6' || cat.name_ar.includes('مطاعم')) IconComponent = Coffee;
              else if (cat.id === '7' || cat.name_ar.includes('يومية')) IconComponent = HardHat;
              else if (cat.id === '8' || cat.name_ar.includes('تعليم')) IconComponent = BookOpen;
              else if (cat.id === '9' || cat.name_ar.includes('أمن')) IconComponent = Shield;

              return (
                <motion.div variants={itemVariants} key={cat.id}>
                  <Link
                    to={`/jobs?category=${cat.id}`}
                    className="block bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all text-center group border border-slate-100 h-full"
                  >
                    <div className="w-16 h-16 mx-auto bg-emerald-50 text-[#00D084] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#00D084] group-hover:text-white transition-colors">
                      <IconComponent size={28} />
                    </div>
                    <h3 className="font-bold text-lg text-[#0B1B3D] mb-2">{cat.name_ar}</h3>
                    <p className="text-sm text-slate-400">تصفح الوظائف</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
