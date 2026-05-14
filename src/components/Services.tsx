import React from 'react';
import { motion } from 'motion/react';
import { Zap, Search, Smartphone, BarChart3 } from 'lucide-react';

interface ServicesProps {
  t: (key: string) => string;
}

export const Services: React.FC<ServicesProps> = ({ t }) => {
  const items = [
    { icon: < Zap className="text-neon-blue" />, title: t('service1-title'), desc: t('service1-desc'), delay: 0 },
    { icon: < Search className="text-neon-violet" />, title: t('service2-title'), desc: t('service2-desc'), delay: 0.1 },
    { icon: < Smartphone className="text-neon-pink" />, title: t('service3-title'), desc: t('service3-desc'), delay: 0.2 },
    { icon: < BarChart3 className="text-neon-orange" />, title: t('service4-title'), desc: t('service4-desc'), delay: 0.3 },
  ];

  return (
    <section id="services" className="py-20 px-4 border-t border-white/5 scroll-mt-[var(--header-height)]">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 gradient-text">{t('services-title')}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: item.delay }}
              className="advantage-card p-8 group min-h-[190px] flex flex-col justify-center"
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold gradient-text-blue-purple group-hover:font-extrabold transition-all leading-tight">
                  {item.title}
                </h2>
                <div className="w-16 h-16 bg-gray-900/50 rounded-2xl flex items-center justify-center group-hover:scale-110 origin-bottom-right transition-transform shrink-0 ml-6">
                  {React.cloneElement(item.icon as React.ReactElement, { size: 32 })}
                </div>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed group-hover:font-bold transition-all max-w-xl">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
