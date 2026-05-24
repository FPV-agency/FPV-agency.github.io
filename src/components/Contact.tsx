import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Send } from 'lucide-react';
import { publicOfferTextUa, publicOfferTextEn } from '../data/publicOffer';

interface ContactProps {
  t: (key: string) => string;
  searchQuery?: string | null;
  onScheduleClick?: () => void;
  feedbackData?: { text: string; category: string } | null;
  clearFeedbackRequest?: () => void;
  isScheduleRequested?: boolean;
  clearScheduleRequest?: () => void;
  isExchangeRequested?: boolean;
  clearExchangeRequest?: () => void;
  isConceptRequested?: boolean;
  clearConceptRequest?: () => void;
  isInteractionRequested?: boolean;
  clearInteractionRequest?: () => void;
}

export const Contact: React.FC<ContactProps> = ({ 
  t, 
  searchQuery, 
  onScheduleClick, 
  feedbackData,
  clearFeedbackRequest,
  isScheduleRequested,
  clearScheduleRequest,
  isExchangeRequested,
  clearExchangeRequest,
  isConceptRequested,
  clearConceptRequest,
  isInteractionRequested,
  clearInteractionRequest
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1 });
  const [contactValue, setContactValue] = useState('');
  const [promoValue, setPromoValue] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [descValue, setDescValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedType, setSelectedType] = useState<'consultation' | 'order' | 'cooperation' | 'feedback' | 'schedule' | 'exchange' | 'concept' | 'interaction'>('consultation');
  const [isFeedbackAvailable, setIsFeedbackAvailable] = useState(false);
  const [isScheduleAvailable, setIsScheduleAvailable] = useState(false);
  const [isExchangeAvailable, setIsExchangeAvailable] = useState(false);
  const [isConceptAvailable, setIsConceptAvailable] = useState(false);
  const [isInteractionAvailable, setIsInteractionAvailable] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startScrollTopRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const [scrollStats, setScrollStats] = useState({
    clientHeight: 0,
    scrollHeight: 0,
    scrollTop: 0
  });

  const updateScrollStats = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      setScrollStats({
        clientHeight: textarea.clientHeight,
        scrollHeight: textarea.scrollHeight,
        scrollTop: textarea.scrollTop
      });
    }
  };

  useEffect(() => {
    updateScrollStats();
  }, [descValue]);

  useEffect(() => {
    const timer = setTimeout(updateScrollStats, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleThumbPointerDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    isDraggingRef.current = true;
    startYRef.current = clientY;
    
    if (textareaRef.current) {
      startScrollTopRef.current = textareaRef.current.scrollTop;
    }
    
    setIsDragging(true);
  };

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      
      const textarea = textareaRef.current;
      const track = trackRef.current;
      if (!textarea || !track) return;

      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaY = clientY - startYRef.current;

      const T = track.clientHeight;
      const scrollH = textarea.scrollHeight;
      const clientH = textarea.clientHeight;
      
      const thumbRatio = Math.max(clientH / scrollH, 0.15);
      const H = T * thumbRatio;
      
      const maxTrackScroll = T - H;
      const maxContentScroll = scrollH - clientH;

      if (maxTrackScroll <= 0) return;

      const scrollAmount = deltaY * (maxContentScroll / maxTrackScroll);
      let newScrollTop = startScrollTopRef.current + scrollAmount;
      
      newScrollTop = Math.max(0, Math.min(maxContentScroll, newScrollTop));
      
      textarea.scrollTop = newScrollTop;
      setScrollStats({
        clientHeight: clientH,
        scrollHeight: scrollH,
        scrollTop: newScrollTop
      });
    };

    const handlePointerUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: false });
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, []);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const track = trackRef.current;
    const textarea = textareaRef.current;
    if (track && textarea) {
      const rect = track.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const clickRatio = Math.max(0, Math.min(1, clickY / rect.height));
      
      const newScrollTop = clickRatio * (textarea.scrollHeight - textarea.clientHeight);
      textarea.scrollTop = newScrollTop;
      setScrollStats((prev) => ({ ...prev, scrollTop: newScrollTop }));
    }
  };

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
      setIsScheduleAvailable(false);
      setIsExchangeAvailable(false);
      setIsConceptAvailable(false);
      setIsInteractionAvailable(false);
      if (clearFeedbackRequest) clearFeedbackRequest();
    }
  }, [feedbackData, clearFeedbackRequest]);

  useEffect(() => {
    if (isScheduleRequested) {
      setDescValue(t('nav-portfolio').includes('По') 
        ? "     Взагалі ми працюємо 24/7 заради Вашого успіху,\nале пріорітети обираємо самостійно."
        : "     Actually we work 24/7 for Your success,\nbut we choose our priorities ourselves."
      );
      setSelectedType('schedule');
      setIsScheduleAvailable(true);
      setIsFeedbackAvailable(false);
      setIsExchangeAvailable(false);
      setIsConceptAvailable(false);
      setIsInteractionAvailable(false);
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
      setIsFeedbackAvailable(false);
      setIsScheduleAvailable(false);
      setIsConceptAvailable(false);
      setIsInteractionAvailable(false);
      if (clearExchangeRequest) clearExchangeRequest();
    }
  }, [isExchangeRequested, clearExchangeRequest, t]);

  useEffect(() => {
    if (isConceptRequested) {
      setDescValue(t('nav-portfolio').includes('По')
        ? `Публічна частина:

1) Ми поважаємо Вас і поважаємо Себе;

2) Взявся - роби до кінця. І намагайся робити як для себе;

3) Дивитись і бачити, слухати і чути - на перший погляд виглядають однаково... Так само й із почуттям гумору та розумінням;

4) Є товар, є ціна, а є сервіс. Якщо воно Вам дорого, або не підходить то походьте по ринку, попитайте в людей поради і беріть те що Вам краще (торгова політика);

5) Є 1, є 2, є 3! Якщо тобі потрібно саме 2, а тобі пропонують 1-1,5 або 2,5-3... Ну то воно ж не тойво - не годиться (відповідність заявленим умовам);

6) Якщо людина шарить у темі, виконує поставлені задачі та дотримується термінів то хіба важливо як саме і коли вона це робить? Може в неї саме зараз «хвилина релаксації/концентрації», або улюблена кішка рожає... Буде мати часом - передзонить/відпишеться (пріорітети, умови праці/співпраці);


7) |... (маємо місце для Ваших концептів/ідей/пропозицій, можливо вони взаєні);`
        : `Public part:

1) We respect You and we respect Ourselves;

2) If you started - do it to the end. And try to do it as if it were for yourself;

3) To look and to see, to listen and to hear - at first glance look the same... The same goes for a sense of humor and understanding;

4) There is a product, there is a price, and there is also a service. If it is expensive for You, or doesn't suit you, then shop around, ask people for advice and take what is better for You (trade policy);

5) There is 1, there is 2, there is 3! If you need exactly 2, and you are offered 1-1.5 or 2.5-3... Well, it is not it - it doesn't fit (compliance with the declared conditions);

6) If a person is knowledgeable in the field, performs the assigned tasks and meets deadlines, then does it really matter how exactly and when they do it? Maybe they have a "minute of relaxation/concentration" right now, or their favorite cat is giving birth... When they have time - they will call back/reply (priorities, terms of work/cooperation);


7) |... (we have space for Your concepts/ideas/suggestions, perhaps they are mutual);`
      );
      setSelectedType('concept');
      setIsConceptAvailable(true);
      setIsFeedbackAvailable(false);
      setIsScheduleAvailable(false);
      setIsExchangeAvailable(false);
      setIsInteractionAvailable(false);
      if (clearConceptRequest) clearConceptRequest();
    }
  }, [isConceptRequested, clearConceptRequest, t]);

  useEffect(() => {
    if (isInteractionRequested) {
      const isUa = t('nav-portfolio').includes('По');
      setDescValue(isUa ? publicOfferTextUa : publicOfferTextEn);
      setSelectedType('interaction');
      setIsInteractionAvailable(true);
      setIsFeedbackAvailable(false);
      setIsScheduleAvailable(false);
      setIsExchangeAvailable(false);
      setIsConceptAvailable(false);
      if (clearInteractionRequest) clearInteractionRequest();
    }
  }, [isInteractionRequested, clearInteractionRequest, t]);

  const triggerBlink = () => {
    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 2000); // 2 seconds (e.g. 2 blinks of 1s each)
  };

  const handleTypeChange = (type: typeof selectedType) => {
    if (type === selectedType) return;
    
    // Disappear other additional items immediately
    if (['consultation', 'order', 'cooperation'].includes(type)) {
      setIsFeedbackAvailable(false);
      setIsScheduleAvailable(false);
      setIsExchangeAvailable(false);
      setIsConceptAvailable(false);
      setIsInteractionAvailable(false);
    } else if (['feedback', 'schedule', 'exchange', 'concept', 'interaction'].includes(type)) {
      setIsFeedbackAvailable(type === 'feedback');
      setIsScheduleAvailable(type === 'schedule');
      setIsExchangeAvailable(type === 'exchange');
      setIsConceptAvailable(type === 'concept');
      setIsInteractionAvailable(type === 'interaction');
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
    } else if (type === 'concept') {
      setDescValue(t('nav-portfolio').includes('По')
        ? `Публічна частина:

1) Ми поважаємо Вас і поважаємо Себе;

2) Взявся - роби до кінця. І намагайся робити як для себе;

3) Дивитись і бачити, слухати і чути - на перший погляд виглядають однаково... Так само й із почуттям гумору та розумінням;

4) Є товар, є ціна, а є сервіс. Якщо воно Вам дорого, або не підходить то походьте по ринку, попитайте в людей поради і беріть те що Вам краще (торгова політика);

5) Є 1, є 2, є 3! Якщо тобі потрібно саме 2, а тобі пропонують 1-1,5 або 2,5-3... Ну то воно ж не тойво - не годиться (відповідність заявленим умовам);

6) Якщо людина шарить у темі, виконує поставлені задачі та дотримується термінів то хіба важливо як саме і коли вона це робить? Може в неї саме зараз «хвилина релаксації/концентрації», або улюблена кішка рожає... Буде мати час - передзонить/відпишеться (пріорітети, умови праці/співпраці);


7) |... (маємо місце для Ваших концептів/ідей/пропозицій, можливо вони взаєні);`
        : `Public part:

1) We respect You and we respect Ourselves;

2) If you started - do it to the end. And try to do it as if it were for yourself;

3) To look and to see, to listen and to hear - at first glance look the same... The same goes for a sense of humor and understanding;

4) There is a product, there is a price, and there is also a service. If it is expensive for You, or doesn't suit you, then shop around, ask people for advice and take what is better for You (trade policy);

5) There is 1, there is 2, there is 3! If you need exactly 2, and you are offered 1-1.5 or 2.5-3... Well, it is not it - it doesn't fit (compliance with the declared conditions);

6) If a person is knowledgeable in the field, performs the assigned tasks and meets deadlines, then does it really matter how exactly and when they do it? Maybe they have a "minute of relaxation/concentration" right now, or their favorite cat is giving birth... When they have time - they will call back/reply (priorities, terms of work/cooperation);


7) |... (we have space for Your concepts/ideas/suggestions, perhaps they are mutual);`
      );
    } else if (type === 'interaction') {
      const isUa = t('nav-portfolio').includes('По');
      setDescValue(isUa ? publicOfferTextUa : publicOfferTextEn);
    } else if (type === 'order' && searchQuery) {
      setDescValue(`Що до Вашого запиту "${searchQuery}":\n\n- Тількі вчора було... Бігаємо по складах не можемо знайти, але на балансі наче є.\n\nЗалиште будь ласка Ваші контактні данні та натисніть відправити,\n\nа ми ще добре пошукаємо, або запитаємо в наших надійних партнеів і обов'язково надішлемо Вам комерційну пропозицію найближчим часом (спама не буде - обіцяємо).`);
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

    const payload = {
      name: nameValue,
      contact: contactValue,
      type: selectedType,
      promo: promoValue || "Нет",
      message: descValue
    };

    try {
      let success = false;
      const isStaticHosting = window.location.hostname.includes('github.io') || 
                             window.location.hostname.includes('github.preview') ||
                             window.location.hash.includes('force-direct');

      // 1. Попытка отправить через бэкенд прокси, если мы НЕ на статическом хостинге (например, GitHub Pages)
      if (!isStaticHosting) {
        try {
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          
          if (response.ok) {
            success = true;
          }
        } catch (err) {
          console.warn('Локальный API прокси недоступен, пробуем отправить напрямую в Google Apps Script...', err);
        }
      }

      // 2. Если мы на GitHub Pages или локальный прокси выдал ошибку/недоступен, отправляем НАПРЯМУЮ в Google Apps Script
      if (!success) {
        const gasUrl = (import.meta as any).env?.VITE_GOOGLE_APPS_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbxRIGGNjIjSyNFcUr7cw93ZqMFmedpHy5c1GvvN2c84bdYFhdERbZfEXXUjJGFqKu2Y/exec";
        
        // Для отправки напрямую в Google Apps Script из браузера без проблем с CORS,
        // мы используем 'no-cors' режим. Это выполнит запрос на стороне Google, но скроет от браузера opaque-ответ.
        await fetch(gasUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        });
        
        // В режиме no-cors ответ непрозрачный, но так как запрос ушёл без ошибок сети, мы считаем отправку успешной
        success = true;
      }

      if (success) {
        setSubmitStatus('success');
        setNameValue('');
        setContactValue('');
        setPromoValue('');
        setDescValue('');
      } else {
        throw new Error('Form submission failed both via proxy and direct routes');
      }
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

  const { clientHeight, scrollHeight, scrollTop } = scrollStats;

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

                {/* Secondary Row: Feedback / Schedule / Exchange / Concept / Public Offer */}
                {(isFeedbackAvailable || isScheduleAvailable || isExchangeAvailable || isConceptAvailable || isInteractionAvailable) && (
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
                    {isConceptAvailable && (
                      <button
                        type="button"
                        onClick={() => handleTypeChange('concept')}
                        className="flex items-center gap-3 group cursor-pointer whitespace-nowrap"
                      >
                        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                          selectedType === 'concept' 
                          ? 'border-neon-blue bg-neon-blue/20 shadow-[0_0_10px_rgba(41,207,222,0.3)]' 
                          : 'border-white/20 group-hover:border-neon-blue/40'
                        }`}>
                          {selectedType === 'concept' && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-neon-blue rounded-sm"
                            />
                          )}
                        </div>
                        <span className={`text-sm font-medium transition-colors ${
                          selectedType === 'concept' ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                        }`}>
                          {t('contact-opt-concept')}
                        </span>
                      </button>
                    )}
                    {isInteractionAvailable && (
                      <button
                        type="button"
                        onClick={() => handleTypeChange('interaction')}
                        className="flex items-center gap-3 group cursor-pointer whitespace-nowrap"
                      >
                        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                          selectedType === 'interaction' 
                          ? 'border-neon-blue bg-neon-blue/20 shadow-[0_0_10px_rgba(41,207,222,0.3)]' 
                          : 'border-white/20 group-hover:border-neon-blue/40'
                        }`}>
                          {selectedType === 'interaction' && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-neon-blue rounded-sm"
                            />
                          )}
                        </div>
                        <span className={`text-sm font-medium transition-colors ${
                          selectedType === 'interaction' ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                        }`}>
                          {t('contact-opt-interaction')}
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
                  ref={textareaRef}
                  onScroll={updateScrollStats}
                  id="contact-description"
                  value={descValue}
                  onChange={(e) => setDescValue(e.target.value)}
                  placeholder={t('contact-desc-placeholder')}
                  rows={12}
                  className="w-full h-full bg-transparent px-8 py-8 outline-none border-none transition-colors resize-none relative z-10 text-white placeholder:text-gray-600 font-medium leading-relaxed no-scrollbar"
                ></textarea>

                {/* Custom glowing neon scrollbar: shorter at the bottom (25%) so it doesn't overlap the submit button */}
                {scrollHeight > clientHeight && clientHeight > 0 && (
                  <div 
                    ref={trackRef}
                    onClick={handleTrackClick}
                    className="absolute right-4 top-[10%] bottom-[25%] w-[6px] bg-white/5 hover:bg-white/10 rounded-full z-20 cursor-pointer transition-all"
                  >
                    <div 
                      onMouseDown={handleThumbPointerDown}
                      onTouchStart={handleThumbPointerDown}
                      onClick={(e) => e.stopPropagation()}
                      className={`absolute right-0 w-[6px] rounded-full bg-gradient-to-b from-neon-blue via-neon-violet to-neon-pink transition-all ${
                        isDragging 
                        ? 'shadow-[0_0_15px_rgba(41,207,222,1)] scale-x-125 select-none' 
                        : 'shadow-[0_0_8px_rgba(41,207,222,0.6)] hover:shadow-[0_0_12px_rgba(41,207,222,0.9)]'
                      }`}
                      style={{
                        height: `${Math.max((clientHeight / scrollHeight) * 100, 15)}%`,
                        top: `${(scrollTop / (scrollHeight - clientHeight)) * (100 - Math.max((clientHeight / scrollHeight) * 100, 15))}%`,
                        cursor: isDragging ? 'grabbing' : 'grab'
                      }}
                    />
                  </div>
                )}

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
