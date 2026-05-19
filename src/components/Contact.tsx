import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Send } from 'lucide-react';

interface ContactProps {
  t: (key: string) => string;
  searchQuery?: string | null;
  onScheduleClick?: () => void;
  feedbackData?: { text: string; category: string } | null;
  isScheduleRequested?: boolean;
  clearScheduleRequest?: () => void;
  isExchangeRequested?: boolean;
  clearExchangeRequest?: () => void;
}

export const Contact: React.FC<ContactProps> = ({ 
  t, 
  searchQuery, 
  onScheduleClick, 
  feedbackData,
  isScheduleRequested,
  clearScheduleRequest,
  isExchangeRequested,
  clearExchangeRequest
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1 });
  const [contactValue, setContactValue] = useState('');
  const [promoValue, setPromoValue] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [descValue, setDescValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedType, setSelectedType] = useState<'consultation' | 'order' | 'cooperation' | 'feedback' | 'schedule' | 'exchange'>('consultation');
  const [isFeedbackAvailable, setIsFeedbackAvailable] = useState(false);
  const [isScheduleAvailable, setIsScheduleAvailable] = useState(false);
  const [isExchangeAvailable, setIsExchangeAvailable] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (searchQuery) {
      setDescValue(
        `Що до Вашого запиту "${searchQuery}":\n\n- Тількі вчора було... Бігаємо по складах не можемо знайти, але на балансі наче є.\n\nЗалиште будь ласка Ваші контактні данні та натисніть відправити,\n\nа ми ще добре пошукаємо, або запитаємо в наших надійних партнерів і обов'язково надішлемо Вам комерційну пропозицію найближчим часом (спама не буде - обіцяємо).`
      );
    }
  }, [searchQuery]);

  useEffect(() => {
    if (feedbackData) {
      setDescValue(feedbackData.text);
      setSelectedType('feedback');
      setIsFeedbackAvailable(true);
    }
  }, [feedbackData]);

  useEffect(() => {
    if (isScheduleRequested) {
      setDescValue(t('nav-portfolio').includes('По') 
        ? "     Взагалі ми працюємо 24/7 заради Вашого успіху,\nале пріорітети обираємо самостійно."
        : "     Actually we work 24/7 for Your success,\nbut we choose our priorities ourselves."
      );
      setSelectedType('schedule');
      setIsScheduleAvailable(true);
      if (clearScheduleRequest) clearScheduleRequest();
    }
  }, [isScheduleRequested, clearScheduleRequest, t]);

  useEffect(() => {
    if (isExchangeRequested) {
      setDescValue(t('nav-portfolio').includes('По')
        ? "Іноді нам доводиться залучати до розробки проектів представників більш розвинутих цивілізацій - розрахунки із ними ведуться у межгалактичній валюті:\n1 Blemflarck = 1,20 UAH"
        : "Sometimes we have to involve representatives of more advanced civilizations in project development - settlements with them are carried out in intergalactic currency:\n1 Blemflarck = 1.20 UAH"
      );
      setSelectedType('exchange');
      setIsExchangeAvailable(true);
      if (clearExchangeRequest) clearExchangeRequest();
    }
  }, [isExchangeRequested, clearExchangeRequest, t]);

  const triggerBlink = () => {
    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 2000); // 2 seconds (e.g. 2 blinks of 1s each)
  };

  const handleTypeChange = (type: typeof selectedType) => {
    if (type === selectedType) return;
    
    // Disappear temporary items logic
    if (['consultation', 'order', 'cooperation'].includes(type)) {
      if (selectedType === 'feedback') setIsFeedbackAvailable(false);
      if (selectedType === 'schedule') setIsScheduleAvailable(false);
      if (selectedType === 'exchange') setIsExchangeAvailable(false);
    }

    setSelectedType(type);
    
    // Reset/Starting text logic
    if (type === 'feedback' && feedbackData) {
      setDescValue(feedbackData.text);
    } else if (type === 'schedule') {
      setDescValue(t('nav-portfolio').includes('По') 
        ? "     Взагалі ми працюємо 24/7 заради Вашого успіху,\nале пріорітети обираємо самостійно."
        : "     Actually we work 24/7 for Your success,\nbut we choose our priorities ourselves."
      );
    } else if (type === 'exchange') {
      setDescValue(t('nav-portfolio').includes('По')
        ? "Іноді нам доводиться залучати до розробки проектів представників більш розвинутих цивілізацій - розрахунки із ними ведуться у межгалактичній валюті:\n1 Blemflarck = 1,20 UAH"
        : "Sometimes we have to involve representatives of more advanced civilizations in project development - settlements with them are carried out in intergalactic currency:\n1 Blemflarck = 1.20 UAH"
      );
    } else if (type === 'order' && searchQuery) {
      setDescValue(`Що до Вашого запиту "${searchQuery}":\n\n- Тількі вчора було... Бігаємо по складах не можемо знайти, але на балансі наче є.\n\nЗалиште будь ласка Ваші контактні данні та натисніть відправити,\n\nа ми ще добре пошукаємо, або запитаємо в наших надійних партнерів і обов'язково надішлемо Вам комерційну пропозицію найближчим часом (спама не буде - обіцяємо).`);
    } else {
      setDescValue('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactValue.trim()) {
      triggerBlink();
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameValue,
          contact: contactValue,
          type: selectedType,
          promo: promoValue,
          message: descValue
        })
      });

      if (!response.ok) throw new Error('Failed to send');
      
      setSubmitStatus('success');
      setNameValue('');
      setContactValue('');
      setPromoValue('');
      setDescValue('');
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <section ref={ref} id="contact" className={`py-20 px-4 bg-dark-card/50 relative ${!isInView ? 'pause-animations' : ''}`}>
      {/* Navigation Anchors */}
      <div id="order" className="absolute -top-32" />
      <div id="consultation" className="absolute -top-32" />
      
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 gradient-text-blue-purple inline-block">{t('contact-title')}</h2>
          <p className="text-gray-400">
            {t('contact-subtitle').includes('робочих годин') ? (
              <>
                Ми зв'яжемося з Вами протягом 2{' '}
                <button 
                  type="button"
                  onClick={onScheduleClick}
                  className="text-neon-blue underline cursor-pointer hover:text-neon-violet transition-colors underline-offset-4 focus:outline-none"
                >
                  робочих годин
                </button>
              </>
            ) : t('contact-subtitle').includes('working hours') ? (
              <>
                We'll get back to You within 2{' '}
                <button 
                  type="button"
                  onClick={onScheduleClick}
                  className="text-neon-blue underline cursor-pointer hover:text-neon-violet transition-colors underline-offset-4 focus:outline-none"
                >
                  working hours
                </button>
              </>
            ) : (
              t('contact-subtitle')
            )}
          </p>
        </div>

        <motion.form 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-dark-bg/80 backdrop-blur-xl rounded-[2rem] pt-8 md:pt-12 px-8 md:px-12 pb-4 border border-white/5 shadow-2xl shadow-neon-blue/5"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <label htmlFor="contact-name" className="text-sm font-medium text-gray-400 ml-1">{t('contact-name-label')}</label>
              <input 
                id="contact-name"
                type="text" 
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                placeholder={t('contact-name-placeholder')}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-neon-blue transition-colors"
                autoComplete="off"
              />
            </div>
            <div className="space-y-2 relative">
              <label htmlFor="contact-method" className="text-sm font-medium text-gray-400 ml-1">
                {t('contact-contact-label').replace('*', '')}
                <motion.span 
                  animate={isBlinking ? { 
                    opacity: [1, 0, 1, 0, 1],
                    color: ['#9ca3af', '#29cfde', '#29cfde', '#29cfde', '#9ca3af'],
                    textShadow: isBlinking ? ['none', '0 0 10px #29cfde', '0 0 10px #29cfde', '0 0 10px #29cfde', 'none'] : 'none'
                  } : {}}
                  transition={{ duration: 2 }}
                >*</motion.span>
              </label>
              <input 
                id="contact-method"
                type="text" 
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                placeholder={t('contact-contact-placeholder')}
                className={`w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none transition-all ${
                  isBlinking ? 'border-neon-blue/80 shadow-[0_0_15px_rgba(41,207,222,0.2)]' : 'focus:border-neon-blue'
                }`}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8 group/options">
              <div className="flex flex-col gap-5">
                {/* Main Row: Consultation, Order, Cooperation */}
                <div className="flex flex-wrap items-center gap-x-12 gap-y-5">
                  {[
                    { id: 'consultation', label: t('contact-opt-consultation') },
                    { id: 'order', label: t('contact-opt-client') },
                    { id: 'cooperation', label: t('contact-opt-cooperation') }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleTypeChange(opt.id as any)}
                      className="flex items-center gap-3 group cursor-pointer whitespace-nowrap"
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

                {/* Secondary Row: Feedback / Schedule / Exchange */}
                {(isFeedbackAvailable || isScheduleAvailable || isExchangeAvailable) && (
                  <div className="flex flex-wrap items-center gap-x-12 gap-y-5 md:ml-[calc(1.25rem+8.5rem)]">
                    {isFeedbackAvailable && (
                      <button
                        type="button"
                        onClick={() => handleTypeChange('feedback')}
                        className="flex items-center gap-3 group cursor-pointer whitespace-nowrap"
                      >
                        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                          selectedType === 'feedback' 
                          ? 'border-neon-blue bg-neon-blue/20 shadow-[0_0_10px_rgba(41,207,222,0.3)]' 
                          : 'border-white/20 group-hover:border-neon-blue/40'
                        }`}>
                          {selectedType === 'feedback' && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-neon-blue rounded-sm"
                            />
                          )}
                        </div>
                        <span className={`text-sm font-medium transition-colors ${
                          selectedType === 'feedback' ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                        }`}>
                          {t('nav-portfolio').includes('По') ? 'Відгук' : 'Feedback'}
                        </span>
                      </button>
                    )}
                    {isScheduleAvailable && (
                      <button
                        type="button"
                        onClick={() => handleTypeChange('schedule')}
                        className="flex items-center gap-3 group cursor-pointer whitespace-nowrap"
                      >
                        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                          selectedType === 'schedule' 
                          ? 'border-neon-blue bg-neon-blue/20 shadow-[0_0_10px_rgba(41,207,222,0.3)]' 
                          : 'border-white/20 group-hover:border-neon-blue/40'
                        }`}>
                          {selectedType === 'schedule' && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-neon-blue rounded-sm"
                            />
                          )}
                        </div>
                        <span className={`text-sm font-medium transition-colors ${
                          selectedType === 'schedule' ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                        }`}>
                          {t('contact-opt-schedule')}
                        </span>
                      </button>
                    )}
                    {isExchangeAvailable && (
                      <button
                        type="button"
                        onClick={() => handleTypeChange('exchange')}
                        className="flex items-center gap-3 group cursor-pointer whitespace-nowrap"
                      >
                        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                          selectedType === 'exchange' 
                          ? 'border-neon-blue bg-neon-blue/20 shadow-[0_0_10px_rgba(41,207,222,0.3)]' 
                          : 'border-white/20 group-hover:border-neon-blue/40'
                        }`}>
                          {selectedType === 'exchange' && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-neon-blue rounded-sm"
                            />
                          )}
                        </div>
                        <span className={`text-sm font-medium transition-colors ${
                          selectedType === 'exchange' ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                        }`}>
                          {t('contact-opt-exchange')}
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Promo Input positioned at the right end of the row */}
              <div 
                className="relative w-full md:w-52 h-[48px]"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <input 
                  id="contact-promo"
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
              <label htmlFor="contact-description" className="text-sm font-medium text-gray-400 ml-1">{t('contact-desc-label')}</label>
              <div className="relative group/textarea min-h-[400px]">
                {/* Simplified Background & Border Frame */}
                <div className="absolute inset-0 z-0 bg-gray-900/50 border border-white/10 group-focus-within/textarea:border-neon-blue/50 rounded-[2rem] transition-all duration-300" />
                
                <textarea 
                  id="contact-description"
                  value={descValue}
                  onChange={(e) => setDescValue(e.target.value)}
                  placeholder={t('contact-desc-placeholder')}
                  rows={12}
                  className="w-full h-full bg-transparent px-8 py-8 outline-none border-none transition-colors resize-none relative z-10 text-white placeholder:text-gray-600 font-medium leading-relaxed custom-scrollbar"
                ></textarea>

                {/* Submit Button - Positioned absolutely at bottom right with some spacing */}
                <div className="absolute bottom-4 right-4 w-[40%] flex items-end justify-end z-20">
                  <button 
                    id="contact-submit"
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full h-14 btn-primary rounded-2xl font-bold flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-[0.98] group/btn ${
                      !contactValue.trim() 
                      ? 'shadow-neon-blue/5 grayscale-[0.5] opacity-70' 
                      : 'shadow-neon-blue/20 hover:scale-[1.03]'
                    }`}
                  >
                    <span className="text-base text-center">
                      {isSubmitting ? (t('contact-name-label').includes('П') ? 'Відправка...' : 'Sending...') : t('submit-btn')}
                    </span>
                    <Send size={18} className={`${isSubmitting ? 'animate-pulse' : 'group-hover/btn:translate-x-1'} transition-transform`} />
                  </button>
                </div>
              </div>
              <p className={`text-center text-[9px] mt-4 transition-all duration-500 ${
                contactValue.trim() ? 'text-neon-blue drop-shadow-[0_0_8px_rgba(41,207,222,0.8)] font-medium' : 'text-gray-600'
              }`}>
                {t('contact-privacy')}
              </p>
              
              <div className="mt-1 text-center min-h-[1.5rem]">
                {submitStatus === 'success' && (
                  <p className="text-green-400 text-xs font-medium">
                    {t('contact-name-label').includes('П') ? 'Повідомлення успішно відправлено!' : 'Message sent successfully!'}
                  </p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-400 text-xs font-medium">
                    {t('contact-name-label').includes('П') ? 'Помилка при відправці. Спробуйте пізніше.' : 'Error sending message. Try again later.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  );
};
