import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface ProcessProps {
  t: (key: string) => string;
}

export const Process: React.FC<ProcessProps> = ({ t }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1 });

  const steps = [
    { title: t('process-step1'), desc: t('process-step1-desc'), num: "#1" },
    { title: t('process-step2'), desc: t('process-step2-desc'), num: "#2" },
    { title: t('process-step3'), desc: t('process-step3-desc'), num: "#3" },
    { title: t('process-step4'), desc: t('process-step4-desc'), num: "#4" },
  ];

  return (
    <section ref={ref} id="process" className={`pt-8 pb-24 px-4 bg-dark-card border-t border-white/5 scroll-mt-[var(--header-height)] ${!isInView ? 'pause-animations' : ''}`}>
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4 gradient-text"
          >
            {t('process-title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            {t('process-subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto group/process">
          {steps.map((step, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{ animationDelay: `${i * 3}s` }}
                className={`bg-white/5 backdrop-blur-sm rounded-3xl p-12 hover:bg-dark-bg transition-all group relative overflow-hidden min-h-[280px] flex flex-col justify-center cursor-default shadow-lg shadow-black/20 group-hover/process:animate-none ${
                  isEven 
                    ? 'border-l-2 border-white/10 hover:border-l-neon-blue/60 process-card-pulse-left' 
                    : 'border-r-2 border-white/10 hover:border-r-neon-blue/60 process-card-pulse-right'
                }`}
              >
                {/* Background Number - Elegant alignment on the right */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-0">
                  <span 
                    style={{ animationDelay: `${i * 3}s` }}
                    className="text-[120px] sm:text-[140px] font-black leading-none select-none gradient-step-num process-number-pulse group-hover:opacity-100 group-hover:animate-none transition-all duration-500 group-hover/process:animate-none"
                  >
                    {step.num}
                  </span>
                </div>

                <div className="relative z-10 w-full pr-12">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4 gradient-text-blue-purple group-hover:font-extrabold group-hover:drop-shadow-[0_0_15px_rgba(0,0,0,1)] transition-all duration-300 inline-block">
                    {step.title}
                  </h3>
                  
                  <div className="relative overflow-visible pb-1">
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed group-hover:font-medium group-hover:text-white group-hover:drop-shadow-[0_2px_10px_rgba(0,0,0,1)] transition-all duration-300 relative z-10 line-clamp-3">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
