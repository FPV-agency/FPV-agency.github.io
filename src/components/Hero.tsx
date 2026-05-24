import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

import { Language } from '../i18n/translations';

interface HeroProps {
  t: (key: string) => string;
  lang: Language;
}

const FirstLetterLarger: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;
  const first = text.charAt(0);
  const rest = text.slice(1);
  return (
    <>
      <span className="text-[1.2em] leading-none inline-block">{first}</span>
      {rest}
    </>
  );
};

export const Hero: React.FC<HeroProps> = ({ t, lang }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1 });

  return (
    <section ref={ref} id="hero" className={`pt-28 pb-20 sm:pt-40 px-4 relative overflow-hidden ${!isInView ? 'pause-animations' : ''}`}>
      <div className="absolute top-20 left-10 w-96 h-96 bg-neon-blue/5 rounded-full filter blur-[120px]"></div>
      <div className="container mx-auto text-center relative z-10">
      <h1 className="visually-hidden">
  {lang === 'ua' 
    ? "Створення високоефективних Landing Page: розробка сайтів та UI/UX дизайн від FPV Agency" 
    : "High-converting Landing Page Development: professional web design services by FPV Agency"}
</h1>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 leading-tight max-w-5xl mx-auto"
        >
          {lang === 'ua' ? (
            <>Майбутнє Ваших продажів починається з <span className="gradient-underline-broken">оригінального</span> лендингу</>
          ) : (
            <>The future of Your sales starts with an <span className="gradient-underline-broken">original</span> landing page</>
          )}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-400 mb-8 max-w-3xl mx-auto"
        >
          {lang === 'ua' ? (
            <>
              Професійні лендінг сторінки з високою конверсією <br />
              від <span className="font-extrabold text-white">FPV</span> (<span className="text-shimmer-effect">the Future Pages Vibe</span>)
            </>
          ) : (
            <>
              High-converting landing pages <br />
              by <span className="font-extrabold text-white">FPV</span> (<span className="text-shimmer-effect">the Future Pages Vibe</span>)
            </>
          )}
        </motion.p>

        <motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.4 }}
  className="flex flex-col sm:flex-row justify-center gap-6"
>
  <a 
    href="#portfolio" 
    aria-label="Переглянути портфоліо FPV Agency: кейси з розробки Landing Page"
    className="btn-primary px-10 py-4 rounded-full text-lg font-bold shadow-lg shadow-neon-blue/20 hover:scale-105 transition-transform btn-shimmer-effect"
  >
    {t('hero-portfolio-btn')}
  </a>
  <a 
    href="#consultation" 
    aria-label="Замовити безкоштовну консультацію з розробки та маркетингу сайту у FPV Agency"
    className="px-10 py-4 rounded-full text-lg font-bold border border-neon-blue text-neon-blue hover:bg-neon-blue/10 transition-colors"
  >
    {t('hero-consultation-btn')}
  </a>
</motion.div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { num: t('stat1-number'), text: t('stat1-text'), delay: 0.5 },
            { num: t('stat2-number'), text: t('stat2-text'), delay: 0.6 },
            { num: t('stat3-number'), text: t('stat3-text'), delay: 0.7 },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: stat.delay }}
              className="text-center"
            >
              <div className="text-4xl font-bold gradient-text mb-2 tracking-tighter">{stat.num}</div>
              <div className="text-gray-500 uppercase tracking-widest text-xs font-semibold">
                <FirstLetterLarger text={stat.text} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
