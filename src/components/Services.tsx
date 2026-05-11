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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: item.delay }}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/5 hover:border-neon-blue/30 transition-all group"
            >
              <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
