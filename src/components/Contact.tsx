import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Send } from 'lucide-react';
import { publicOfferTextUa, publicOfferTextEn } from '../data/publicOffer';
import { regulationsTextUa, regulationsTextEn } from '../data/regulations';
import { vacanciesTextUa, vacanciesTextEn, vacanciesData } from '../data/vacancies';

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
  isRegulationsRequested?: boolean;
  clearRegulationsRequest?: () => void;
  isPriceRequested?: boolean;
  clearPriceRequest?: () => void;
  isDemoRequested?: boolean;
  demoTemplateTitle?: string | null;
  clearDemoRequest?: () => void;
  isVacanciesRequested?: boolean;
  clearVacanciesRequest?: () => void;
  onPromoClick?: () => void;
  regulationsScrollPoint?: number | null;
  clearRegulationsScrollPoint?: () => void;
  onHighlightFooterItem?: (id: string) => void;
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
  clearInteractionRequest,
  isRegulationsRequested,
  clearRegulationsRequest,
  isPriceRequested,
  clearPriceRequest,
  isDemoRequested,
  demoTemplateTitle,
  clearDemoRequest,
  isVacanciesRequested,
  clearVacanciesRequest,
  onPromoClick,
  regulationsScrollPoint,
  clearRegulationsScrollPoint,
  onHighlightFooterItem
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1 });
  const [contactValue, setContactValue] = useState('');
  const [promoValue, setPromoValue] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [descValue, setDescValue] = useState('');
  const [conceptInput, setConceptInput] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [promoActionHovered, setPromoActionHovered] = useState<'left' | 'right' | null>(null);
  const [selectedType, setSelectedType] = useState<'consultation' | 'order' | 'cooperation' | 'feedback' | 'schedule' | 'exchange' | 'concept' | 'interaction' | 'regulations' | 'price' | 'demo' | 'vacancies'>('consultation');
  const [isFeedbackAvailable, setIsFeedbackAvailable] = useState(false);
  const [isScheduleAvailable, setIsScheduleAvailable] = useState(false);
  const [isExchangeAvailable, setIsExchangeAvailable] = useState(false);
  const [isConceptAvailable, setIsConceptAvailable] = useState(false);
  const [isInteractionAvailable, setIsInteractionAvailable] = useState(false);
  const [isRegulationsAvailable, setIsRegulationsAvailable] = useState(false);
  const [isPriceAvailable, setIsPriceAvailable] = useState(false);
  const [isDemoAvailable, setIsDemoAvailable] = useState(false);
  const [isVacanciesAvailable, setIsVacanciesAvailable] = useState(false);

  // Helper to ensure only the last activated additional option is shown and all others are hidden
  const activateOnlyOneAdditional = (activeType: 'feedback' | 'schedule' | 'exchange' | 'concept' | 'interaction' | 'regulations' | 'price' | 'demo' | 'vacancies' | 'none') => {
    setIsFeedbackAvailable(activeType === 'feedback');
    setIsScheduleAvailable(activeType === 'schedule');
    setIsExchangeAvailable(activeType === 'exchange');
    setIsConceptAvailable(activeType === 'concept');
    setIsInteractionAvailable(activeType === 'interaction');
    setIsRegulationsAvailable(activeType === 'regulations');
    setIsPriceAvailable(activeType === 'price');
    setIsDemoAvailable(activeType === 'demo');
    setIsVacanciesAvailable(activeType === 'vacancies');
  };

  const [isBlinking, setIsBlinking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
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

  const getCurrentScrollElement = (): HTMLElement | null => {
    if (selectedType === 'vacancies') {
      return document.getElementById('vacancies-scroll-list');
    }
    return textareaRef.current;
  };

  const updateScrollStats = () => {
    const el = getCurrentScrollElement();
    if (el) {
      setScrollStats({
        clientHeight: el.clientHeight,
        scrollHeight: el.scrollHeight,
        scrollTop: el.scrollTop
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
    
    const el = getCurrentScrollElement();
    if (el) {
      startScrollTopRef.current = el.scrollTop;
    }
    
    setIsDragging(true);
  };

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      
      const el = getCurrentScrollElement();
      const track = trackRef.current;
      if (!el || !track) return;

      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaY = clientY - startYRef.current;

      const T = track.clientHeight;
      const scrollH = el.scrollHeight;
      const clientH = el.clientHeight;
      
      const thumbRatio = Math.max(clientH / scrollH, 0.15);
      const H = T * thumbRatio;
      
      const maxTrackScroll = T - H;
      const maxContentScroll = scrollH - clientH;

      if (maxTrackScroll <= 0) return;

      const scrollAmount = deltaY * (maxContentScroll / maxTrackScroll);
      let newScrollTop = startScrollTopRef.current + scrollAmount;
      
      newScrollTop = Math.max(0, Math.min(maxContentScroll, newScrollTop));
      
      el.scrollTop = newScrollTop;
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
    const el = getCurrentScrollElement();
    if (track && el) {
      const rect = track.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const clickRatio = Math.max(0, Math.min(1, clickY / rect.height));
      
      const newScrollTop = clickRatio * (el.scrollHeight - el.clientHeight);
      el.scrollTop = newScrollTop;
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
      activateOnlyOneAdditional('feedback');
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
      activateOnlyOneAdditional('schedule');
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
      activateOnlyOneAdditional('exchange');
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
 
5) Є 1, є 2, є 3! Якщо тобі потрібно саме 2, а тобі пропонують 1-1,5 або 2,5-3... Ну то воно ж не тойво - не годицця (відповідність заявленим умовам);
 
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
      setSelectedType('concept');
      setConceptInput('');
      activateOnlyOneAdditional('concept');
      if (clearConceptRequest) clearConceptRequest();
    }
  }, [isConceptRequested, clearConceptRequest, t]);

  useEffect(() => {
    if (isRegulationsRequested) {
      const isUa = t('nav-portfolio').includes('По');
      const targetText = isUa ? regulationsTextUa : regulationsTextEn;
      setDescValue(targetText);
      setSelectedType('regulations');
      activateOnlyOneAdditional('regulations');
      if (clearRegulationsRequest) clearRegulationsRequest();

      if (regulationsScrollPoint) {
        setTimeout(() => {
          const textarea = textareaRef.current;
          if (textarea) {
            const lines = targetText.split('\n');
            const searchTerms = [
              `${regulationsScrollPoint}. Тариф`,
              `${regulationsScrollPoint}. Пропозиція`,
              `${regulationsScrollPoint}. Акція`,
              `${regulationsScrollPoint}. Реферальна`,
              `${regulationsScrollPoint}. Програма`,
              `${regulationsScrollPoint}. Послуга`,
              `${regulationsScrollPoint}. Offer`,
              `${regulationsScrollPoint}. Promo`,
              `${regulationsScrollPoint}. Program`,
              `${regulationsScrollPoint}. Loyalty`,
              `${regulationsScrollPoint}.`
            ];
            
            let foundLineIndex = -1;
            let foundCharIndex = -1;

            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              for (const term of searchTerms) {
                if (line.includes(term)) {
                  foundLineIndex = i;
                  foundCharIndex = targetText.indexOf(line);
                  break;
                }
              }
              if (foundLineIndex !== -1) break;
            }

            if (foundLineIndex === -1) {
              const simplePrefix = `${regulationsScrollPoint}.`;
              for (let i = 0; i < lines.length; i++) {
                if (lines[i].trim().startsWith(simplePrefix)) {
                  foundLineIndex = i;
                  foundCharIndex = targetText.indexOf(lines[i]);
                  break;
                }
              }
            }

            if (foundLineIndex !== -1) {
              const lineText = lines[foundLineIndex];
              if (foundCharIndex !== -1) {
                textarea.focus({ preventScroll: true });
                textarea.setSelectionRange(foundCharIndex, foundCharIndex + lineText.length);
              }

              const isDesktop = window.innerWidth >= 768;
              const charsPerLine = isDesktop ? 82 : 35;
              let precedingVisualLines = 0;
              for (let i = 0; i < foundLineIndex; i++) {
                const len = lines[i].length;
                if (len === 0) {
                  precedingVisualLines += 1;
                } else {
                  precedingVisualLines += Math.max(1, Math.ceil(len / charsPerLine));
                }
              }

              // Adjust to align the found line exactly to the first line of the textarea
              const calculatedScrollTop = precedingVisualLines * 25.6;
              
              // Prevent browser native setSelectionRange scroll from overriding our scrollPosition
              setTimeout(() => {
                textarea.scrollTop = Math.max(0, calculatedScrollTop);
                updateScrollStats();
              }, 50);
            }
          }
          if (clearRegulationsScrollPoint) clearRegulationsScrollPoint();
        }, 180);
      }
    }
  }, [isRegulationsRequested, clearRegulationsRequest, t, regulationsScrollPoint, clearRegulationsScrollPoint]);

  useEffect(() => {
    if (isInteractionRequested) {
      const isUa = t('nav-portfolio').includes('По');
      setDescValue(isUa ? publicOfferTextUa : publicOfferTextEn);
      setSelectedType('interaction');
      activateOnlyOneAdditional('interaction');
      if (clearInteractionRequest) clearInteractionRequest();
    }
  }, [isInteractionRequested, clearInteractionRequest, t]);

  useEffect(() => {
    if (isPriceRequested) {
      const isUa = t('nav-portfolio').includes('По');
      setDescValue(isUa 
        ? "Будь ласка опішіть суть та обсяги робіт вартість яких Вас цікавить і ми надішлемо Вам персональну комерційну пропозицію."
        : "Please describe the scope and nature of the work you are interested in, and we will send you a personalized commercial offer."
      );
      setSelectedType('price');
      activateOnlyOneAdditional('price');
      if (clearPriceRequest) clearPriceRequest();
    }
  }, [isPriceRequested, clearPriceRequest, t]);

  useEffect(() => {
    if (isDemoRequested) {
      const isUa = t('nav-portfolio').includes('По');
      const text = isUa 
        ? `Наразі ми не маємо достойних Вашої уваги готових «коробкових» шаблонів, бо ми — the Future Pages Vibe (Вайб  Майбутніх Сторінок).

Ми пропонуємо Вам замовити "Преміальний дизайн" або "Клона" та інші спецпропозиції на дуже вигідних умовах!

Так! Ми молодий але амбіційний та досвідчений проект. Замість того щоб сперечатися, чий шаблон кращий, НАША КОМАНДА обрала інший шлях: створювати сучасні, адаптивні рішення та постійно оновлювати их, адже веб-індустрія — це очень динамічне середовище.

Что свідчить про Нашу Кваліфікацію:

! Ви знайшли Нас серед тисяч інших пропозицій — це вже результат Нашої Роботи.

! Якість говорить сама за себе: ви бачите рівень Нашого Продукту на прикладі цього сайту.

! Ми відверті з Вами: у сучасному світі це рідкість і головний актив Нашої Репутації.

Залиште Ваші контакти і тисніть "Відправити" - 
все буде супер, обіцяємо!`
        : `Currently we do not have ready-made 'out of the box' templates worthy of your attention, because we are the Future Pages Vibe.

We offer you to order a 'Premium Design' or a 'Clone' and other special offers on very favorable terms!

Yes! We are a young but ambitious and experienced project. Instead of arguing whose template is better, OUR TEAM chose another way: to create modern, responsive solutions and constantly update them, because the web industry is a very dynamic environment.

What testifies to Our Qualification:

! You found Us among thousands of other offers — this is already the result of Our Work.

! Quality speaks for itself: you see the level of Our Product on the example of this website.

! We are honest with you: in today's world this is rare and the main asset of Our Reputation.

Leave your contacts and click "Send" — 
everything will be super, we promise!`;
      
      setDescValue(text);
      setSelectedType('demo');
      activateOnlyOneAdditional('demo');
      if (clearDemoRequest) clearDemoRequest();
    }
  }, [isDemoRequested, clearDemoRequest, t]);

  useEffect(() => {
    if (isVacanciesRequested) {
      const isUa = t('nav-portfolio').includes('По');
      setDescValue(isUa ? vacanciesTextUa : vacanciesTextEn);
      setSelectedType('vacancies');
      setSelectedDeptId(null);
      activateOnlyOneAdditional('vacancies');
      if (clearVacanciesRequest) clearVacanciesRequest();
    }
  }, [isVacanciesRequested, clearVacanciesRequest, t]);



  const handleApplyToVacancy = (jobTitle: string) => {
    handleTypeChange('cooperation');
    activateOnlyOneAdditional('none');
    const isUa = t('nav-portfolio').includes('По');
    const text = isUa 
      ? `Мене це зацікавило! Хочу відгукнутись на вакансію: "${jobTitle}".\n\n`
      : `I am interested in this! I would like to apply for the vacancy: "${jobTitle}".\n\n`;
    setDescValue(text);
    setTimeout(updateScrollStats, 50);
  };

  const triggerBlink = () => {
    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 2000); // 2 seconds (e.g. 2 blinks of 1s each)
  };

  const scrollToRegulationsPoint = (pointNumber: number) => {
    const isUa = t('nav-portfolio').includes('По');
    const targetText = isUa ? regulationsTextUa : regulationsTextEn;
    setDescValue(targetText);
    setSelectedType('regulations');
    activateOnlyOneAdditional('regulations');

    setTimeout(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        const lines = targetText.split('\n');
        const searchTerms = [
          `${pointNumber}. Тариф`,
          `${pointNumber}. Пропозиція`,
          `${pointNumber}. Акція`,
          `${pointNumber}. Реферальна`,
          `${pointNumber}. Програма`,
          `${pointNumber}. Послуга`,
          `${pointNumber}. Offer`,
          `${pointNumber}. Promo`,
          `${pointNumber}. Program`,
          `${pointNumber}. Loyalty`,
          `${pointNumber}.`
        ];
        
        let foundLineIndex = -1;
        let foundCharIndex = -1;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          for (const term of searchTerms) {
            if (line.includes(term)) {
              foundLineIndex = i;
              foundCharIndex = targetText.indexOf(line);
              break;
            }
          }
          if (foundLineIndex !== -1) break;
        }

        if (foundLineIndex === -1) {
          const simplePrefix = `${pointNumber}.`;
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().startsWith(simplePrefix)) {
              foundLineIndex = i;
              foundCharIndex = targetText.indexOf(lines[i]);
              break;
            }
          }
        }

        if (foundLineIndex !== -1) {
          const lineText = lines[foundLineIndex];
          if (foundCharIndex !== -1) {
            textarea.focus({ preventScroll: true });
            textarea.setSelectionRange(foundCharIndex, foundCharIndex + lineText.length);
          }

          const isDesktop = window.innerWidth >= 768;
          const charsPerLine = isDesktop ? 82 : 35;
          let precedingVisualLines = 0;
          for (let i = 0; i < foundLineIndex; i++) {
            const len = lines[i].length;
            if (len === 0) {
              precedingVisualLines += 1;
            } else {
              precedingVisualLines += Math.max(1, Math.ceil(len / charsPerLine));
            }
          }

          const calculatedScrollTop = precedingVisualLines * 25.6;
          
          setTimeout(() => {
            textarea.scrollTop = Math.max(0, calculatedScrollTop);
            updateScrollStats();
          }, 50);
        }
      }
    }, 180);
  };

  const handleTypeChange = (type: typeof selectedType) => {
    if (type === selectedType) return;
    
    // Disappear all additional options if switching to a main option, else maintain only the chosen additional option
    if (['consultation', 'order', 'cooperation'].includes(type)) {
      activateOnlyOneAdditional('none');
    } else {
      activateOnlyOneAdditional(type as any);
    }

    setSelectedType(type);
    
    // Reset/Starting text logic
    if (type === 'price') {
      const isUa = t('nav-portfolio').includes('По');
      setDescValue(isUa 
        ? "Будь ласка опішіть суть та обсяги робіт вартість яких Вас цікавить і ми надішлемо Вам персональну комерційну пропозицію."
        : "Please describe the scope and nature of the work you are interested in, and we will send you a personalized commercial offer."
      );
    } else if (type === 'feedback' && feedbackData) {
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
      setConceptInput('');
      setDescValue(t('nav-portfolio').includes('По')
        ? `Публічна частина:

1) Ми поважаємо Вас і поважаємо Себе;

2) Взявся - роби до кінця. І намагайся робити як для себе;

3) Дивитись і бачити, слухати і чути - на перший погляд виглядають однаково... Так само й із почуттям гумору та розумінням;

4) Є товар, є ціна, а є сервіс. Якщо воно Вам дорого, або не підходить то походьте по ринку, попитайте в людей поради і беріть те що Вам краще (торгова політика);

5) Є 1, є 2, є 3! Якщо тобі потрібно саме 2, а тобі пропонують 1-1,5 або 2,5-3... Ну то воно ж не тойво - не годицця (відповідність заявленим умовам);

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
    } else if (type === 'regulations') {
      const isUa = t('nav-portfolio').includes('По');
      setDescValue(isUa ? regulationsTextUa : regulationsTextEn);
    } else if (type === 'vacancies') {
      const isUa = t('nav-portfolio').includes('По');
      setDescValue(isUa ? vacanciesTextUa : vacanciesTextEn);
    } else if (type === 'demo') {
      const isUa = t('nav-portfolio').includes('По');
      setDescValue(isUa 
        ? `Наразі ми не маємо достойних Вашої уваги готових «коробкових» шаблонів, бо ми — the Future Pages Vibe (Вайб  Майбутніх Сторінок).

Ми пропонуємо Вам замовити "Преміальний дизайн" або "Клона" та інші спецпропозиції на дуже вигідних умовах!

Так! Ми молодий але амбіційний та досвідчений проект. Замість того щоб сперечатися, чий шаблон кращий, НАША КОМАНДА обрала інший шлях: створювати сучасні, адаптивні рішення та постійно оновлювати їх, адже веб-індустрія — це дуже динамічне середовище.

Що свідчить про Нашу Кваліфікацію:

! Ви знайшли Нас серед тисяч інших пропозицій — це вже результат Нашої Роботи.

! Якість говорить сама за себе: ви бачите рівень Нашого Продукту на прикладі цього сайту.

! Ми відверті з Вами: у сучасному світі це рідкість і головний актив Нашої Репутації.

Залиште Ваші контакти і тисніть "Відправити" - 
все буде супер, обіцяємо!`
        : `Currently we do not have ready-made 'out of the box' templates worthy of your attention, because we are the Future Pages Vibe.

We offer you to order a 'Premium Design' or a 'Clone' and other special offers on very favorable terms!

Yes! We are a young but ambitious and experienced project. Instead of arguing whose template is better, OUR TEAM chose another way: to create modern, responsive solutions and constantly update them, because the web industry is a very dynamic environment.

What testifies to Our Qualification:

! You found Us among thousands of other offers — this is already the result of Our Work.

! Quality speaks for itself: you see the level of Our Product on the example of this website.

! We are honest with you: in today's world this is rare and the main asset of Our Reputation.

Leave your contacts and click "Send" — 
everything will be super, we promise!`
      );
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
      const element = formRef.current;
      if (element) {
        const header = document.querySelector('header') || document.querySelector('.fixed');
        const headerHeight = header ? (header as HTMLElement).offsetHeight : 80;
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        // Scroll so that the form is directly beneath the header with a small visual margin
        window.scrollTo({
          top: absoluteElementTop - headerHeight - 6,
          behavior: 'smooth'
        });
      } else {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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
      const gasUrl = (import.meta as any).env?.VITE_GOOGLE_APPS_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbxRIGGNjIjSyNFcUr7cw93ZqMFmedpHy5c1GvvN2c84bdYFhdERbZfEXXUjJGFqKu2Y/exec";
      
      // Отправляем напрямую в Google Apps Script.
      // Используем 'no-cors' режим, чтобы избежать проблем с CORS на статических платформах (например, GitHub Pages).
      await fetch(gasUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });
      
      success = true;

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
      if (hash === '#consultation' || hash === '#contact') setSelectedType('consultation');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showInteractiveEffects = !isFocused && !promoValue;

  const getPlaceholderText = () => {
    switch (selectedType) {
      case 'consultation':
        return t('contact-placeholder-consultation');
      case 'order':
        return t('contact-placeholder-order');
      case 'cooperation':
        return t('contact-placeholder-cooperation');
      default:
        return t('contact-desc-placeholder');
    }
  };

  const { clientHeight, scrollHeight, scrollTop } = scrollStats;

  const handleInteraction = () => {
    const input = document.querySelector('input[maxLength="6"]') as HTMLInputElement;
    input?.focus();
  };

  return (
    <section ref={ref} id="contact" className={`pt-8 pb-20 px-4 bg-dark-card/50 relative scroll-mt-[var(--header-height)] ${!isInView ? 'pause-animations' : ''}`}>
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
          ref={formRef}
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
                  className="text-neon-blue font-bold ml-1 filter drop-shadow-[0_0_8px_rgba(41,207,222,1)] inline-block"
                  style={{ color: '#29cfde' }}
                  animate={isBlinking ? { 
                    scale: [1, 1.4, 1, 1.4, 1],
                    color: ['#29cfde', '#ffffff', '#29cfde', '#ffffff', '#29cfde'],
                    textShadow: ['0 0 8px #29cfde', '0 0 15px #ffffff', '0 0 8px #29cfde', '0 0 15px #ffffff', '0 0 8px #29cfde']
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
            <div id="contact-options-row" className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8 group/options">
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

                {/* Secondary Row: Feedback / Schedule / Exchange / Concept / Public Offer / Active Offers / Price / Demo */}
                {(isFeedbackAvailable || isScheduleAvailable || isExchangeAvailable || isConceptAvailable || isInteractionAvailable || isRegulationsAvailable || isPriceAvailable || isDemoAvailable || isVacanciesAvailable) && (
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
                    {isRegulationsAvailable && (
                      <button
                        type="button"
                        onClick={() => handleTypeChange('regulations')}
                        className="flex items-center gap-3 group cursor-pointer whitespace-nowrap"
                      >
                        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                          selectedType === 'regulations' 
                          ? 'border-neon-blue bg-neon-blue/20 shadow-[0_0_10px_rgba(41,207,222,0.3)]' 
                          : 'border-white/20 group-hover:border-neon-blue/40'
                        }`}>
                          {selectedType === 'regulations' && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-neon-blue rounded-sm"
                            />
                          )}
                        </div>
                        <span className={`text-sm font-medium transition-colors ${
                          selectedType === 'regulations' ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                        }`}>
                          {t('footer-regulations-header')}
                        </span>
                      </button>
                    )}
                    {isPriceAvailable && (
                      <button
                        type="button"
                        onClick={() => handleTypeChange('price')}
                        className="flex items-center gap-3 group cursor-pointer whitespace-nowrap"
                      >
                        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                          selectedType === 'price' 
                          ? 'border-neon-blue bg-neon-blue/20 shadow-[0_0_10px_rgba(41,207,222,0.3)]' 
                          : 'border-white/20 group-hover:border-neon-blue/40'
                        }`}>
                          {selectedType === 'price' && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-neon-blue rounded-sm"
                            />
                          )}
                        </div>
                        <span className={`text-sm font-medium transition-colors ${
                          selectedType === 'price' ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                        }`}>
                          {t('footer-price')}
                        </span>
                      </button>
                    )}
                    {isDemoAvailable && (
                      <button
                        type="button"
                        onClick={() => handleTypeChange('demo')}
                        className="flex items-center gap-3 group cursor-pointer whitespace-nowrap"
                      >
                        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                          selectedType === 'demo' 
                          ? 'border-neon-blue bg-neon-blue/20 shadow-[0_0_10px_rgba(41,207,222,0.3)]' 
                          : 'border-white/20 group-hover:border-neon-blue/40'
                        }`}>
                          {selectedType === 'demo' && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-neon-blue rounded-sm"
                            />
                          )}
                        </div>
                        <span className={`text-sm font-medium transition-colors ${
                          selectedType === 'demo' ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                        }`}>
                          {demoTemplateTitle || (t('nav-portfolio').includes('По') ? 'Демо' : 'Demo')}
                        </span>
                      </button>
                    )}
                    {isVacanciesAvailable && (
                      <button
                        type="button"
                        onClick={() => handleTypeChange('vacancies')}
                        className="flex items-center gap-3 group cursor-pointer whitespace-nowrap"
                      >
                        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                          selectedType === 'vacancies' 
                          ? 'border-neon-blue bg-neon-blue/20 shadow-[0_0_10px_rgba(41,207,222,0.3)]' 
                          : 'border-white/20 group-hover:border-neon-blue/40'
                        }`}>
                          {selectedType === 'vacancies' && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-neon-blue rounded-sm"
                            />
                          )}
                        </div>
                        <span className={`text-sm font-medium transition-colors ${
                          selectedType === 'vacancies' ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                        }`}>
                          {t('footer-vacancies')}
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Promo Input positioned at the right end of the row */}
              <div 
                className="relative w-full md:w-52 h-[48px]"
                onMouseEnter={() => {
                  setIsHovered(true);
                  if (!promoActionHovered) {
                    setPromoActionHovered('left');
                  }
                }}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setPromoActionHovered(null);
                }}
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
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full bg-gray-900 transition-all duration-500 shadow-xl shadow-neon-blue/5 z-10">
                    {/* Left Frame Border */}
                    <div className={`absolute inset-y-0 left-0 right-1/2 border-2 border-r-0 rounded-l-full pointer-events-none transition-all duration-300 z-20 ${
                      !isHovered 
                        ? 'border-neon-blue/30' 
                        : promoActionHovered === 'left'
                        ? 'border-neon-blue shadow-[0_0_12px_rgba(41,207,222,0.4)]'
                        : 'border-white/5'
                    }`} />

                    {/* Right Frame Border */}
                    <div className={`absolute inset-y-0 left-1/2 right-0 border-2 border-l-0 rounded-r-full pointer-events-none transition-all duration-300 z-20 ${
                      !isHovered 
                        ? 'border-neon-blue/30' 
                        : promoActionHovered === 'right'
                        ? 'border-neon-violet shadow-[0_0_12px_rgba(157,78,221,0.4)]'
                        : 'border-white/5'
                    }`} />

                    {/* Middle divider */}
                    <div className={`absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 pointer-events-none transition-all duration-300 z-20 ${
                      !isHovered 
                        ? 'opacity-0' 
                        : promoActionHovered === 'left'
                        ? 'bg-neon-blue shadow-[0_0_8px_rgba(41,207,222,0.8)] opacity-100'
                        : 'bg-neon-violet shadow-[0_0_8px_rgba(157,78,221,0.8)] opacity-100'
                    }`} />

                    {!isHovered ? (
                      <span className="text-sm font-black text-white/40 tracking-widest uppercase flex items-center justify-center gap-0.5 z-30">
                        {t('contact-promo-placeholder').replace('*', '')}
                        <motion.span 
                          className="text-neon-blue font-bold filter drop-shadow-[0_0_8px_rgba(41,207,222,1)] inline-block"
                          style={{ color: '#29cfde' }}
                          animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.7, 1, 0.7],
                            textShadow: ['0 0 4px #29cfde', '0 0 10px #29cfde', '0 0 4px #29cfde']
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >*</motion.span>
                      </span>
                    ) : (
                      <div className="flex w-full h-full items-center z-30">
                        <button 
                          type="button"
                          onMouseEnter={() => setPromoActionHovered('left')}
                          onClick={() => {
                            const input = document.querySelector('input[maxLength="6"]') as HTMLInputElement;
                            input?.focus();
                          }}
                          className={`flex-1 h-full flex items-center justify-center gap-1.5 transition-all duration-300 ${
                            promoActionHovered === 'left' ? 'bg-transparent' : 'bg-gray-800'
                          }`}
                        >
                          {promoActionHovered === 'left' && (
                            <motion.div 
                              animate={{ opacity: [0, 1, 0] }}
                              transition={{ duration: 0.8, repeat: Infinity }}
                              className="w-[1.5px] h-3 bg-neon-blue shadow-[0_0_8px_rgba(41,207,222,1)]"
                            />
                          )}
                          <span className={`tracking-[0.3em] text-[10px] font-bold mt-0.5 transition-all duration-300 ${
                            promoActionHovered === 'left' 
                              ? 'text-neon-blue filter drop-shadow-[0_0_8px_rgba(41,207,222,0.8)] scale-105' 
                              : 'text-gray-500'
                          }`}>
                            . . . . . .
                          </span>
                        </button>
                        <button 
                          type="button"
                          onMouseEnter={() => setPromoActionHovered('right')}
                          onClick={() => {
                            scrollToRegulationsPoint(3);
                          }}
                          className={`flex-1 h-full flex items-center justify-center transition-all duration-300 ${
                            promoActionHovered === 'right' ? 'bg-transparent' : 'bg-gray-800'
                          }`}
                        >
                          <span className={`text-sm tracking-tighter transition-all duration-300 ${
                            promoActionHovered === 'right'
                              ? 'text-neon-violet font-black filter drop-shadow-[0_0_8px_rgba(157,78,221,0.8)] scale-105'
                              : 'text-gray-500 font-medium'
                          }`}>
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
                
                {selectedType === 'demo' ? (
                  <div 
                    id="contact-description"
                    className="w-full absolute inset-0 z-10 bg-transparent px-8 py-8 outline-none border-none text-white font-medium leading-relaxed overflow-y-auto no-scrollbar"
                  >
                    {t('nav-portfolio').includes('По') ? (
                      <div className="space-y-4 text-left">
                        <p>
                          Наразі ми не маємо достойних Вашої уваги готових «коробкових» шаблонів, бо ми — <span className="gradient-text font-extrabold">the Future Pages Vibe</span> (Вайб  Майбутніх Сторінок).
                        </p>
                        <p>
                          Ми пропонуємо Вам замовити "Преміальний дизайн" або "Клона" та інші спецпропозиції на дуже{" "}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              if (onPromoClick) {
                                onPromoClick();
                              }
                            }}
                            className="text-neon-blue underline decoration-neon-blue font-black tracking-wide cursor-pointer hover:scale-105 inline-block transition-transform animate-pulse filter drop-shadow-[0_0_8px_rgba(41,207,222,0.6)] bg-transparent"
                          >
                            вигідних умовах!
                          </button>
                        </p>
                        <p>
                          Так! Ми молодий але амбіційний та досвідчений проект. Замість того щоб сперечатися, чий шаблон кращий, НАША КОМАНДА обрала інший шлях: створювати сучасні, адаптивні рішення та постійно оновлювати їх, адже веб-індустрія — це дуже динамічне середовище.
                        </p>
                        <p className="font-bold text-neon-blue/80">
                          Що свідчить про Нашу Кваліфікацію:
                        </p>
                        <ul className="space-y-2 pl-4">
                          <li className="flex gap-2">
                            <span className="text-neon-blue font-bold">!</span>
                            <span>Ви знайшли Нас серед тисяч інших пропозицій — це вже результат Нашої Роботи.</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-neon-blue font-bold">!</span>
                            <span>Якість говорить сама за себе: ви бачите рівень Нашого Продукту на прикладі цього сайту.</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-neon-blue font-bold">!</span>
                            <span>Ми відверті з Вами: у сучасному світі це рідкість і головний актив Нашої Репутації.</span>
                          </li>
                        </ul>
                        <p className="pt-4 text-neon-violet font-semibold">
                          Залиште Ваші контакти і тисніть "Відправити" - <br />
                          все буде супер, обіцяємо!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 text-left">
                        <p>
                          Currently we do not have ready-made 'out of the box' templates worthy of your attention, because we are <span className="gradient-text font-extrabold">the Future Pages Vibe</span>.
                        </p>
                        <p>
                          We offer you to order a "Premium Design" or a "Clone" and other special offers on very{" "}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              if (onPromoClick) {
                                onPromoClick();
                              }
                            }}
                            className="text-neon-blue underline decoration-neon-blue font-black tracking-wide cursor-pointer hover:scale-105 inline-block transition-transform animate-pulse filter drop-shadow-[0_0_8px_rgba(41,207,222,0.6)] bg-transparent"
                          >
                            favorable terms!
                          </button>
                        </p>
                        <p>
                          Yes! We are a young but ambitious and experienced project. Instead of arguing whose template is better, OUR TEAM chose another way: to create modern, responsive solutions and constantly update them, because the web industry is a very dynamic environment.
                        </p>
                        <p className="font-bold text-neon-blue/80">
                          What testifies to Our Qualification:
                        </p>
                        <ul className="space-y-2 pl-4">
                          <li className="flex gap-2">
                            <span className="text-neon-blue font-bold">!</span>
                            <span>You found Us among thousands of other offers — this is already the result of Our Work.</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-neon-blue font-bold">!</span>
                            <span>Quality speaks for itself: you see the level of Our Product on the example of this website.</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-neon-blue font-bold">!</span>
                            <span>We are honest with you: in today's world this is rare and the main asset of Our Reputation.</span>
                          </li>
                        </ul>
                        <p className="pt-4 text-neon-violet font-semibold">
                          Leave your contacts and click "Send" — <br />
                          everything will be super, we promise!
                        </p>
                      </div>
                    )}
                  </div>
                ) : selectedType === 'concept' ? (
                  <div 
                    id="contact-description"
                    className="w-full absolute inset-0 z-10 bg-transparent px-8 py-8 outline-none border-none text-white font-medium leading-relaxed overflow-y-auto no-scrollbar"
                  >
                    {t('nav-portfolio').includes('По') ? (
                      <div className="space-y-4 text-left">
                        <p className="font-bold text-neon-blue/80">Публічна частина:</p>
                        <ul className="space-y-3 pl-4">
                          <li className="flex gap-2">
                            <span className="text-neon-blue font-bold">1)</span>
                            <span>Ми поважаємо Вас і поважаємо Себе;</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-neon-blue font-bold">2)</span>
                            <span>Взявся - роби до кінця. І намагайся робити як для себе;</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-neon-blue font-bold">3)</span>
                            <span>Дивитись і бачити, слухати і чути - на перший погляд виглядають однаково... Так само й із почуттям гумору та розумінням;</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-neon-blue font-bold">4)</span>
                            <span>Є товар, є ціна, а є сервіс. Якщо воно Вам дорого, або не підходить то походьте по ринку, попитайте в людей поради і беріть те що Вам краще (торгова політика);</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-neon-blue font-bold">5)</span>
                            <span>Є 1, є 2, є 3! Якщо тобі потрібно саме 2, а тобі пропонують 1-1,5 або 2,5-3... Ну то воно ж не тойво - не годицця (відповідність заявленим умовам);</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-neon-blue font-bold">6)</span>
                            <span>Якщо людина шарить у темі, виконує поставлені задачі та дотримується термінів то хіба важливо як саме і коли вона це робить? Може в неї саме зараз «хвилина релаксації/концентрації», або улюблена кішка рожає... Буде мати час - передзонить/відпишеться (пріорітети, умови праці/співпраці);</span>
                          </li>
                        </ul>
                        <div className="flex gap-2 text-left">
                          <span className="text-neon-blue font-bold mt-1">7)</span>
                          <div className="flex-1 col-span-1">
                            <textarea
                              id="concept-user-input"
                              value={conceptInput}
                              onChange={(e) => {
                                const val = e.target.value;
                                setConceptInput(val);
                                const base = `Публічна частина:

1) Ми поважаємо Вас і поважаємо Себе;

2) Взявся - роби до кінця. І намагайся робити як для себе;

3) Дивитись і бачити, слухати і чути - на перший погляд виглядають однаково... Так само й із почуттям гумору та розумінням;

4) Є товар, є ціна, а є сервіс. Якщо воно Вам дорого, або не підходить то походьте по ринку, попитайте в людей поради і беріть те що Вам краще (торгова політика);

5) Є 1, є 2, є 3! Якщо тобі потрібно саме 2, а тобі пропонують 1-1,5 або 2,5-3... Ну то воно ж не тойво - не годицця (відповідність заявленим умовам);

6) Якщо людина шарить у темі, виконує поставлені задачі та дотримується термінів то хіба важливо як саме і коли вона це робить? Може в неї саме зараз «хвилина релаксації/концентрації», або улюблена кішка рожає... Буде мати час - передзонить/відпишеться (пріорітети, умови праці/співпраці);`;
                                setDescValue(val ? `${base}\n\n7) ${val}` : `${base}\n\n7) |...`);
                              }}
                              placeholder={`|... (маємо місце для Ваших концептів / ідей /\nпропозицій, можливо вони взаєні);`}
                              rows={3}
                              className="w-full bg-transparent outline-none border-none resize-none text-white placeholder:text-gray-500 font-medium leading-relaxed p-0 overflow-hidden"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 text-left">
                        <p className="font-bold text-neon-blue/80">Public part:</p>
                        <ul className="space-y-3 pl-4">
                          <li className="flex gap-2">
                            <span className="text-neon-blue font-bold">1)</span>
                            <span>We respect You and we respect Ourselves;</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-neon-blue font-bold">2)</span>
                            <span>If you started - do it to the end. And try to do it as if it were for yourself;</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-neon-blue font-bold">3)</span>
                            <span>To look and to see, to listen and to hear - at first glance look the same... The same goes for a sense of humor and understanding;</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-neon-blue font-bold">4)</span>
                            <span>There is a product, there is a price, and there is also a service. If it is expensive for You, or doesn't suit you, then shop around, ask people for advice and take what is better for You (trade policy);</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-neon-blue font-bold">5)</span>
                            <span>There is 1, there is 2, there is 3! If you need exactly 2, and you are offered 1-1.5 or 2.5-3... Well, it is not it - it doesn't fit (compliance with the declared conditions);</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-neon-blue font-bold">6)</span>
                            <span>If a person is knowledgeable in the field, performs the assigned tasks and meets deadlines, then does it really matter how exactly and when they do it? Maybe they have a "minute of relaxation/concentration" right now, or their favorite cat is giving birth... When they have time - they will call back/reply (priorities, terms of work/cooperation);</span>
                          </li>
                        </ul>
                        <div className="flex gap-2 text-left">
                          <span className="text-neon-blue font-bold mt-1">7)</span>
                          <div className="flex-1 col-span-1">
                            <textarea
                              id="concept-user-input"
                              value={conceptInput}
                              onChange={(e) => {
                                const val = e.target.value;
                                setConceptInput(val);
                                const base = `Public part:

1) We respect You and we respect Ourselves;

2) If you started - do it to the end. And try to do it as if it were for yourself;

3) To look and to see, to listen and to hear - at first glance look the same... The same goes for a sense of humor and understanding;

4) There is a product, there is a price, and there is also a service. If it is expensive for You, or doesn't suit you, then shop around, ask people for advice and take what is better for You (trade policy);

5) There is 1, there is 2, there is 3! If you need exactly 2, and you are offered 1-1.5 or 2.5-3... Well, it is not it - it doesn't fit (compliance with the declared conditions);

6) If a person is knowledgeable in the field, performs the assigned tasks and meets deadlines, then does it really matter how exactly and when they do it? Maybe they have a "minute of relaxation/concentration" right now, or their favorite cat is giving birth... When they have time - they will call back/reply (priorities, terms of work/cooperation);`;
                                setDescValue(val ? `${base}\n\n7) ${val}` : `${base}\n\n7) |...`);
                              }}
                              placeholder={`|... (we have space for Your concepts / ideas /\nsuggestions, perhaps they are mutual);`}
                              rows={3}
                              className="w-full bg-transparent outline-none border-none resize-none text-white placeholder:text-gray-500 font-medium leading-relaxed p-0 overflow-hidden"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : selectedType === 'vacancies' ? (
                  <div 
                    id="contact-description"
                    className="w-full absolute inset-0 z-10 bg-transparent px-8 py-8 text-white font-medium flex flex-col overflow-hidden"
                  >
                    {(() => {
                      const isUa = t('nav-portfolio').includes('По');
                      return (
                        <div className="flex flex-col h-full overflow-hidden select-text text-left">
                          {/* Note Header — ALWAYS VISIBLE ON TOP */}
                          <div className="flex-none pb-4 border-b border-white/5 space-y-1 text-xs text-gray-300">
                            <div className="font-bold text-gray-200">
                              {isUa ? 'Примітка:' : 'Note:'}
                            </div>
                            <div>
                              <span className="text-neon-blue font-bold">*</span>
                              {isUa ? ' – бажано, але не обовʼязково.' : ' – preferred, but not required.'}
                            </div>
                            <div>
                              <span className="text-neon-blue font-bold">**</span>
                              {isUa ? ' – обовʼязково.' : ' – mandatory.'}
                            </div>
                            <div>
                              <span className="text-neon-blue font-bold font-black">!</span>
                              {isUa ? ' – ознайомитись** з ' : ' – familiarize** with '}
                              <button
                                type="button"
                                onClick={() => {
                                  if (onHighlightFooterItem) {
                                    onHighlightFooterItem('concept');
                                  }
                                }}
                                className="underline text-neon-blue hover:text-neon-violet font-black cursor-pointer bg-transparent border-none p-0 inline transition-colors"
                              >
                                {isUa ? 'п.5 КК' : 'Art. 5 of the CC'}
                              </button>
                              .
                            </div>
                          </div>

                          {/* Scrollable Area */}
                          <div 
                            id="vacancies-scroll-list"
                            className="flex-1 overflow-y-auto no-scrollbar space-y-5 pt-4 pb-12"
                            onScroll={updateScrollStats}
                          >
                            {selectedDeptId === null ? (
                              /* List of Departments */
                              <div className="space-y-3 mt-1">
                                {vacanciesData.map((dept) => {
                                  const label = isUa ? dept.nameUa : dept.nameEn;
                                  return (
                                    <div key={dept.id} className="flex items-center gap-2 text-sm md:text-base font-bold">
                                      <span className="text-gray-500 font-normal font-sans">-</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedDeptId(dept.id);
                                          setTimeout(updateScrollStats, 50);
                                        }}
                                        className="underline text-neon-blue hover:text-neon-violet transition-colors text-left cursor-pointer bg-transparent border-none p-0 inline"
                                      >
                                        {label} ({dept.count})
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              /* List of Vacancies for Selected Department */
                              (() => {
                                const dept = vacanciesData.find(d => d.id === selectedDeptId);
                                if (!dept) return null;
                                const deptName = isUa ? dept.nameUa : dept.nameEn;
                                const deptJobs = isUa ? dept.jobsUa : dept.jobsEn;
                                const deptNote = isUa ? dept.noteUa : dept.noteEn;

                                return (
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between pb-1 border-b border-white/5">
                                      <h3 className="text-sm md:text-base font-black text-white uppercase tracking-wider">
                                        {deptName} ({dept.count})
                                      </h3>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedDeptId(null);
                                          setTimeout(updateScrollStats, 50);
                                        }}
                                        className="text-xs font-bold text-neon-pink hover:underline uppercase tracking-wide cursor-pointer bg-transparent border-none p-0 px-1"
                                      >
                                        {isUa ? '← Назад' : '← Back'}
                                      </button>
                                    </div>

                                    {deptNote && (
                                      <p className="text-xs text-neon-violet leading-relaxed italic font-semibold">
                                        {deptNote}
                                      </p>
                                    )}

                                    <div className="space-y-4">
                                      {deptJobs.map((job, idx) => (
                                        <div key={idx} className="text-sm space-y-1 font-medium">
                                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                            <div className="font-bold text-gray-200">
                                              {idx + 1}. {job.title}
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => handleApplyToVacancy(job.title)}
                                              className="text-[11px] font-bold text-neon-pink hover:text-neon-blue underline transition-colors cursor-pointer bg-transparent border-none p-0 inline"
                                            >
                                              {isUa ? 'відгукнутись' : 'apply'}
                                            </button>
                                          </div>
                                          {job.requirements && (
                                            <div className="text-xs text-gray-400">
                                              <span className="font-bold text-gray-300">
                                                {isUa ? 'Вимоги: ' : 'Requirements: '}
                                              </span>
                                              {job.requirements}
                                            </div>
                                          )}
                                          {job.additional && (
                                            <div className="text-xs text-gray-500 italic">
                                              {job.additional}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })()
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <textarea 
                    ref={textareaRef}
                    onScroll={updateScrollStats}
                    id="contact-description"
                    value={descValue}
                    onChange={(e) => setDescValue(e.target.value)}
                    placeholder={getPlaceholderText()}
                    rows={12}
                    className="w-full h-full bg-transparent px-8 py-8 outline-none border-none transition-colors resize-none relative z-10 text-white placeholder:text-gray-500 font-medium leading-relaxed no-scrollbar"
                  ></textarea>
                )}

                {/* Custom glowing neon scrollbar: covers the full height of textarea now that button is outside */}
                {scrollHeight > clientHeight && clientHeight > 0 && (
                  <div 
                    ref={trackRef}
                    onClick={handleTrackClick}
                    className="absolute right-4 top-[10%] bottom-[10%] w-[6px] bg-white/5 hover:bg-white/10 rounded-full z-20 cursor-pointer transition-all"
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
              </div>

              {/* Submit Row - Positioned beautifully outside the textarea wrapper card */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-6">
                <p className={`text-left text-[11px] transition-all duration-500 max-w-md ${
                  contactValue.trim() ? 'text-neon-blue drop-shadow-[0_0_8px_rgba(41,207,222,0.8)] font-medium' : 'text-gray-500'
                }`}>
                  {t('contact-privacy')}
                </p>
                <div className="w-full sm:w-[40%] md:w-[32%] flex items-end justify-end z-20">
                  <button 
                    id="contact-submit"
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full h-14 btn-primary rounded-2xl font-bold flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-[0.98] group/btn ${
                      !contactValue.trim() 
                      ? 'shadow-neon-blue/5 grayscale-[0.5] opacity-70 cursor-not-allowed' 
                      : 'shadow-neon-blue/20 hover:scale-[1.03] cursor-pointer'
                    }`}
                  >
                    <span className="text-base text-center">
                      {isSubmitting ? (t('contact-name-label').includes('П') ? 'Відправка...' : 'Sending...') : t('submit-btn')}
                    </span>
                    <Send size={18} className={`${isSubmitting ? 'animate-pulse' : 'group-hover/btn:translate-x-1'} transition-transform`} />
                  </button>
                </div>
              </div>
              
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
