import React from 'react';
import { motion } from 'motion/react';
import { Send } from 'lucide-react';

interface ContactProps {
  t: (key: string) => string;
}

export const Contact: React.FC<ContactProps> = ({ t }) => {
  return (
    <section id="contact" className="py-20 px-4 bg-dark-card/50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{t('contact-title')}</h2>
          <p className="text-gray-400">{t('contact-subtitle')}</p>
        </div>

        <motion.form 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-dark-bg/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 border border-white/5 shadow-2xl shadow-neon-blue/5"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">{t('contact-name-label')}</label>
              <input 
                type="text" 
                placeholder={t('contact-name-placeholder')}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-neon-blue transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">{t('contact-contact-label')}</label>
              <input 
                type="text" 
                placeholder={t('contact-contact-placeholder')}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-neon-blue transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2 mb-10">
            <label className="text-sm font-medium text-gray-400 ml-1">{t('contact-desc-label')}</label>
            <textarea 
              placeholder={t('contact-desc-placeholder')}
              rows={5}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-neon-blue transition-colors resize-none"
              required
            ></textarea>
          </div>

          <div className="text-center">
            <button type="submit" className="btn-primary px-12 py-5 rounded-full text-lg font-bold flex items-center gap-3 mx-auto hover:scale-105 transition-transform shadow-xl shadow-neon-blue/20">
              {t('submit-btn')}
              <Send size={20} />
            </button>
          </div>
          
          <p className="text-center text-gray-600 text-xs mt-8">
            {t('contact-privacy')}
          </p>
        </motion.form>
      </div>
    </section>
  );
};
