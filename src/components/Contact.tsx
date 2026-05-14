import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send } from 'lucide-react';

interface ContactProps {
  t: (key: string) => string;
}

export const Contact: React.FC<ContactProps> = ({ t }) => {
  const [contactValue, setContactValue] = useState('');
  const [promoValue, setPromoValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedType, setSelectedType] = useState<'consultation' | 'order' | 'cooperation'>('order');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#order') setSelectedType('order');
      if (hash === '#consultation') setSelectedType('consultation');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showInteractiveEffects = !isFocused && !promoValue;

  const handleInteraction = () => {
    const input = document.querySelector('input[maxLength="6"]') as HTMLInputElement;
    input?.focus();
  };

  return (
    <section id="contact" className="py-20 px-4 bg-dark-card/50 relative">
      {/* Navigation Anchors */}
      <div id="order" className="absolute -top-32" />
      <div id="consultation" className="absolute -top-32" />
      
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 gradient-text-blue-purple inline-block">{t('contact-title')}</h2>
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
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                placeholder={t('contact-contact-placeholder')}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-neon-blue transition-colors"
                required
              />
            </div>
          </div>

          <div className="mb-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 group/options">
              <div className="flex flex-wrap gap-6">
                {[
                  { id: 'consultation', label: t('contact-opt-consultation') },
                  { id: 'order', label: t('contact-opt-client') },
                  { id: 'cooperation', label: t('contact-opt-cooperation') }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedType(opt.id as any)}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                      selectedType === opt.id 
                      ? 'border-neon-blue bg-neon-blue/20 shadow-[0_0_10px_rgba(41,207,222,0.3)]' 
                      : 'border-white/20 group-hover:border-neon-blue/40'
                    }`}>
                      {selectedType === opt.id && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-neon-blue rounded-sm"
                        />
                      )}
                    </div>
                    <span className={`text-sm font-medium transition-colors ${
                      selectedType === opt.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                    }`}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Promo Input positioned at the right end of the row */}
              <div 
                className="relative w-full md:w-52 h-[48px]"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <input 
                  type="text" 
                  maxLength={6}
                  value={promoValue}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) => setPromoValue(e.target.value.toUpperCase())}
                  className={`absolute inset-0 w-full h-full bg-gray-900 border-2 rounded-full px-6 outline-none transition-all font-mono tracking-[0.4em] text-center text-sm ${
                    isFocused ? 'border-neon-blue shadow-[0_0_15px_rgba(41,207,222,0.1)]' : 'border-neon-blue/30'
                  } ${showInteractiveEffects ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}
                />
                
                {showInteractiveEffects && (
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full border-2 border-neon-blue/30 bg-gray-900 transition-all duration-500 shadow-xl shadow-neon-blue/5">
                    {!isHovered ? (
                      <span className="text-sm font-black text-white/40 tracking-widest uppercase">
                        {t('contact-promo-placeholder')}
                      </span>
                    ) : (
                      <div className="flex w-full h-full items-center">
                        <button 
                          type="button"
                          onClick={() => {
                            const input = document.querySelector('input[maxLength="6"]') as HTMLInputElement;
                            input?.focus();
                          }}
                          className="flex-1 h-full flex items-center justify-center gap-1.5 hover:bg-blue-900/40 border-r border-transparent hover:border-r-2 hover:border-neon-blue transition-all group/left"
                        >
                          <motion.div 
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="w-[1.5px] h-3 bg-neon-blue shadow-[0_0_8px_rgba(41,207,222,1)]"
                          />
                          <span className="text-gray-600 group-hover/left:text-neon-blue/80 tracking-[0.3em] text-[10px] font-bold mt-0.5 transition-all">
                            . . . . . .
                          </span>
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            const input = document.querySelector('input[maxLength="6"]') as HTMLInputElement;
                            input?.focus();
                          }}
                          className="flex-1 h-full bg-white/5 border-l border-white/10 flex items-center justify-center hover:bg-blue-900/40 hover:border-l-2 hover:border-neon-violet transition-all shadow-inner group/right"
                        >
                          <span className="text-neon-violet font-black text-sm tracking-tighter filter drop-shadow-[0_0_8px_rgba(157,78,221,0.4)] group-hover/right:drop-shadow-[0_0_12px_rgba(157,78,221,0.8)] transition-all">
                            * &gt;&gt;&gt;
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-400 ml-1">{t('contact-desc-label')}</label>
              <div className="relative group/textarea min-h-[320px]">
                {/* Custom SVG Background & Border Frame */}
                <div className="absolute inset-0 z-0">
                  <svg 
                    width="100%" 
                    height="100%" 
                    viewBox="0 0 100 100" 
                    preserveAspectRatio="none"
                    className="overflow-visible"
                  >
                    {/* The "Notched" Background Fill */}
                    <path 
                      d="M 10,0 
                         H 90 
                         C 95.5,0 100,4.5 100,10 
                         V 60 
                         C 100,65.5 95.5,70 90,70 
                         H 55 
                         C 50,70 50,75 50,80 
                         V 90 
                         C 50,95.5 45.5,100 40,100 
                         H 10 
                         C 4.5,100 0,95.5 0,90 
                         V 10 
                         C 0,4.5 4.5,0 10,0 
                         Z" 
                      className="fill-gray-900/50 transition-colors duration-300"
                    />
                    {/* The "Notched" Border Path */}
                    <path 
                      d="M 10,0 
                         H 90 
                         C 95.5,0 100,4.5 100,10 
                         V 60 
                         C 100,65.5 95.5,70 90,70 
                         H 55 
                         C 50,70 50,75 50,80 
                         V 90 
                         C 50,95.5 45.5,100 40,100 
                         H 10 
                         C 4.5,100 0,95.5 0,90 
                         V 10 
                         C 0,4.5 4.5,0 10,0 
                         Z" 
                      fill="none"
                      className="stroke-white/10 group-focus-within/textarea:stroke-neon-blue/50 transition-colors duration-300"
                      strokeWidth="0.5"
                    />
                  </svg>
                </div>

                <textarea 
                  placeholder={t('contact-desc-placeholder')}
                  rows={8}
                  className="w-full h-full bg-transparent px-8 py-8 outline-none border-none transition-colors resize-none relative z-10 text-white placeholder:text-gray-600"
                  style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 65%, 50% 65%, 50% 100%, 0% 100%)' }}
                  required
                ></textarea>

                {/* Submit Button in the Notch Space */}
                <div className="absolute bottom-[-10px] right-0 w-[45%] h-[28%] flex items-end justify-end p-2">
                  <button 
                    type="submit"
                    disabled={!contactValue.trim()}
                    className="w-full h-16 btn-primary rounded-2xl font-bold flex items-center justify-center gap-3 shadow-2xl shadow-neon-blue/20 hover:scale-[1.03] active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed group/btn"
                  >
                    <span className="text-lg">{t('submit-btn')}</span>
                    <Send size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-600 text-xs mt-12">
            {t('contact-privacy')}
          </p>
        </motion.form>
      </div>
    </section>
  );
};
