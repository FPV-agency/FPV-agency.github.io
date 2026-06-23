import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { Services } from './components/Services';
import { Process } from './components/Process';
import { RatingSection } from './components/RatingSection';
import { Contact } from './components/Contact';
import { FAQ } from './components/FAQ';
import { FloatingActions } from './components/FloatingActions';
import { translations, Language } from './i18n/translations';
import { faqCategories } from './data/faqData';

interface FooterItemProps {
  link: any;
  highlightedId: string | null;
  row: number;
  allFooterBlinking: boolean;
  openFooterPopupId: string | null;
  setOpenFooterPopupId: React.Dispatch<React.SetStateAction<string | null>>;
  lang: Language;
  onDetailClick?: () => void;
}

const FooterItem: React.FC<FooterItemProps> = ({ 
  link, 
  highlightedId, 
  row, 
  allFooterBlinking, 
  openFooterPopupId, 
  setOpenFooterPopupId, 
  lang, 
  onDetailClick 
}) => {
  const isHighlighted = highlightedId === link.id;
  const shouldBlink = isHighlighted || allFooterBlinking;
  const isPopupOpen = openFooterPopupId === link.id;
  const popupRef = useRef<HTMLDivElement>(null);
  const [shiftX, setShiftX] = useState<number>(0);

  useEffect(() => {
    if (!isPopupOpen || !popupRef.current) return;
    const adjustPosition = () => {
      const parent = popupRef.current?.parentElement;
      if (!parent) return;
      const parentRect = parent.getBoundingClientRect();
      const parentCenter = parentRect.left + parentRect.width / 2;
      const viewportWidth = window.innerWidth;
      const padding = 16; // Min space from screen edge
      const popupWidth = 256; // w-64 is 256px
      
      const defaultLeft = parentCenter - popupWidth / 2;
      const defaultRight = parentCenter + popupWidth / 2;
      
      let localShiftX = 0;
      if (defaultLeft < padding) {
        localShiftX = padding - defaultLeft;
      } else if (defaultRight > viewportWidth - padding) {
        localShiftX = (viewportWidth - padding) - defaultRight;
      }
      
      setShiftX(localShiftX);
    };
    
    adjustPosition();
    window.addEventListener('resize', adjustPosition);
    return () => window.removeEventListener('resize', adjustPosition);
  }, [isPopupOpen]);

  const bottomClass = row === 3 
    ? 'bottom-[calc(100%+6.5rem)]' 
    : row === 2 
      ? 'bottom-[calc(100%+3.25rem)]' 
      : 'bottom-full';

  return (
    <div className="relative group/footer-item" id={link.id === 'schedule' ? 'footer-schedule-link' : undefined}>
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpenFooterPopupId(prev => prev === link.id ? null : link.id);
        }}
        className={`hover:text-neon-blue transition-all duration-300 font-medium cursor-pointer relative py-3 px-4 sm:px-5 ${
          shouldBlink ? 'animate-blink-twice text-neon-blue z-10' : ''
        }`}
      >
        {link.label}
      </button>
      {/* Popup Window */}
      <div 
        ref={popupRef}
        style={shiftX !== 0 ? { transform: `translateX(calc(-50% + ${shiftX}px))` } : {}}
        className={`absolute left-1/2 -translate-x-1/2 pb-4 w-64 transition-all duration-300 z-50 pointer-events-none before:absolute before:content-[''] before:top-0 before:bottom-[-120px] before:left-1/2 before:-translate-x-1/2 before:w-20 before:z-[-1] ${bottomClass} ${
          isPopupOpen 
            ? 'opacity-100 visible translate-y-0 pointer-events-auto' 
            : 'opacity-0 invisible translate-y-2 lg:group-hover/footer-item:opacity-100 lg:group-hover/footer-item:visible lg:group-hover/footer-item:translate-y-0 lg:group-hover/footer-item:pointer-events-auto'
        }`}
      >
        <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl shadow-2xl shadow-black/50 backdrop-blur-xl relative pointer-events-auto">
          <h4 className={`font-bold mb-2 text-base gradient-text-blue-purple ${link.id === 'schedule' || link.id === 'exchange' ? 'text-center' : 'text-left'}`}>
            {link.title || link.label}
          </h4>
          <div className={`text-white text-xs leading-relaxed whitespace-pre-line ${link.id === 'schedule' || link.id === 'exchange' ? 'text-center' : 'text-left'}`}>
            {link.content}
          </div>
          {onDetailClick && (
            <div className={`mt-4 pt-4 border-t border-white/5 flex ${link.id === 'schedule' || link.id === 'exchange' ? 'justify-center' : 'justify-start'}`}>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenFooterPopupId(null);
                  if (onDetailClick) {
                    onDetailClick();
                  }
                }}
                className="text-neon-blue text-[10px] font-bold uppercase tracking-widest hover:underline cursor-pointer"
              >
                {lang === 'ua' ? 'Детальніше' : 'Details'} →
              </button>
            </div>
          )}
          {/* Triangle Arrow */}
          {row === 1 && (
            <div 
              style={shiftX !== 0 ? { left: `calc(50% - ${shiftX}px)` } : {}}
              className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 border-r border-b border-white/10 rotate-45 transition-all duration-300" 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const userLang = (navigator.language || (navigator as any).userLanguage)?.toLowerCase() || '';
    if (userLang.startsWith('uk') || userLang.startsWith('ru') || userLang.startsWith('be')) {
      return 'ua';
    }
    return 'en';
  });
  const [highlightedFooterItem, setHighlightedFooterItem] = useState<string | null>(null);
  const [allFooterBlinking, setAllFooterBlinking] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [feedbackTransfer, setFeedbackTransfer] = useState<{ text: string; category: string } | null>(null);
  const [scheduleRequested, setScheduleRequested] = useState<boolean>(false);
  const [exchangeRequested, setExchangeRequested] = useState<boolean>(false);
  const [conceptRequested, setConceptRequested] = useState<boolean>(false);
  const [interactionRequested, setInteractionRequested] = useState<boolean>(false);
  const [regulationsRequested, setRegulationsRequested] = useState<boolean>(false);
  const [regulationsPoint, setRegulationsPoint] = useState<number | null>(null);
  const [priceRequested, setPriceRequested] = useState<boolean>(false);
  const [demoRequested, setDemoRequested] = useState<boolean>(false);
  const [demoTemplateTitle, setDemoTemplateTitle] = useState<string | null>(null);
  const [vacanciesRequested, setVacanciesRequested] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [showFaq, setShowFaq] = useState<boolean>(false);
  const [openFooterPopupId, setOpenFooterPopupId] = useState<string | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.group\\/footer-item')) {
        setOpenFooterPopupId(null);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      const roundedProgress = Math.round(progress);
      
      let currentSection = '';
      
      if (roundedProgress >= 14 && roundedProgress < 30) {
        currentSection = 'portfolio';
      } else if (roundedProgress >= 30 && roundedProgress < 44) {
        currentSection = 'services';
      } else if (roundedProgress >= 44 && roundedProgress < 63) {
        currentSection = 'process';
      } else if (roundedProgress >= 63 && roundedProgress < 100) {
        currentSection = 'ratings';
      } else if (roundedProgress >= 100) {
        currentSection = 'footer';
      }
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  useEffect(() => {
    // Generate and inject valid Schema.org FAQPage Structured JSON-LD Data for SEO Robots/Crawlers
    const faqQuestions = faqCategories.flatMap(cat => cat.items);
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqQuestions.map(item => ({
        "@type": "Question",
        "name": lang === 'ua' ? item.questionUa : item.questionEn,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": lang === 'ua' ? item.answerUa : item.answerEn
        }
      }))
    };

    let scriptElement = document.getElementById('faq-schema-jsonld') as HTMLScriptElement | null;
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = 'faq-schema-jsonld';
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }
    scriptElement.textContent = JSON.stringify(schemaData, null, 2);

    return () => {
      // Keep it there or let it clean up; actually it auto-updates whenever language changes!
    };
  }, [lang]);

  const highlightFooterItem = (id: string) => {
    const logoRow = document.getElementById('footer-logo-row');
    if (logoRow) {
      const rect = logoRow.getBoundingClientRect();
      const brandBottomAbsolute = rect.bottom + window.scrollY;
      const targetScrollY = brandBottomAbsolute - window.innerHeight + 12;
      window.scrollTo({
        top: Math.max(0, targetScrollY),
        behavior: 'smooth'
      });
    } else {
      const footerElement = document.getElementById('footer');
      if (footerElement) {
        footerElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // Delay setting the highlight so that it blinks after scrolling completes
    setTimeout(() => {
      setHighlightedFooterItem(id);
      setTimeout(() => setHighlightedFooterItem(null), 1500); // Clear highlight after 1.5 seconds
    }, 800);
  };

  const handleCoffeeClick = () => {
    const logoRow = document.getElementById('footer-logo-row');
    if (logoRow) {
      const rect = logoRow.getBoundingClientRect();
      const brandBottomAbsolute = rect.bottom + window.scrollY;
      const targetScrollY = brandBottomAbsolute - window.innerHeight + 12;
      window.scrollTo({
        top: Math.max(0, targetScrollY),
        behavior: 'smooth'
      });
    } else {
      const footerElement = document.getElementById('footer');
      if (footerElement) {
        footerElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // Delay starting the blink for all buttons so that it starts after scrolling completes
    setTimeout(() => {
      setAllFooterBlinking(true);
      setTimeout(() => {
        setAllFooterBlinking(false);
      }, 1500);
    }, 800);
  };

  const handleNavClick = (id: string) => {
    if (id === 'footer') {
      handleCoffeeClick();
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToOptionsRow = useCallback(() => {
    setTimeout(() => {
      const optionsElement = document.getElementById('contact-options-row');
      const headerElement = document.querySelector('header');
      if (optionsElement) {
        const headerHeight = headerElement ? headerElement.offsetHeight : 80;
        const elementPosition = optionsElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerHeight - 16;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 200);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    scrollToOptionsRow();
  };

  const handleFeedbackTransfer = (text: string) => {
    setFeedbackTransfer({ text, category: 'feedback' });
    scrollToOptionsRow();
  };

  const handleScheduleRequest = () => {
    setScheduleRequested(true);
    scrollToOptionsRow();
  };

  const handleExchangeRequest = () => {
    setExchangeRequested(true);
    scrollToOptionsRow();
  };

  const handleConceptRequest = () => {
    setConceptRequested(true);
    scrollToOptionsRow();
  };

  const handleInteractionRequest = () => {
    setInteractionRequested(true);
    scrollToOptionsRow();
  };

  const handleRegulationsRequest = () => {
    setRegulationsRequested(true);
    scrollToOptionsRow();
  };

  const handleRegulationsWithPointRequest = (point: number) => {
    setRegulationsPoint(point);
    setRegulationsRequested(true);
    scrollToOptionsRow();
  };

  const handlePriceRequest = () => {
    setPriceRequested(true);
    scrollToOptionsRow();
  };

  const handleDemoRequest = (title: string) => {
    setDemoTemplateTitle(title);
    setDemoRequested(true);
    scrollToOptionsRow();
  };

  const handleVacanciesRequest = () => {
    setVacanciesRequested(true);
    scrollToOptionsRow();
  };

  // Translation helper function
  const t = useCallback((key: string) => {
    return (translations[lang] as any)[key] || key;
  }, [lang]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header 
        lang={lang} 
        setLang={setLang} 
        t={t} 
        onSearch={handleSearch} 
        activeSection={activeSection}
        onNavClick={handleNavClick}
      />
      
      <main className="overflow-x-hidden">
        <Hero t={t} lang={lang} />
        
        <Portfolio 
          t={t} 
          lang={lang}
          onCoffeeClick={() => highlightFooterItem('regulations')} 
          onPromoClick={() => highlightFooterItem('regulations')}
          onDemoClick={handleDemoRequest}
          onRegulationsSelect={handleRegulationsWithPointRequest}
        />
        
        <Services t={t} onConceptClick={() => highlightFooterItem('concept')} />
        
        <Process t={t} />
        
        <RatingSection t={t} onAddFeedbackToContact={handleFeedbackTransfer} />
 
        <Contact 
          t={t} 
          searchQuery={searchQuery} 
          feedbackData={feedbackTransfer}
          clearFeedbackRequest={() => setFeedbackTransfer(null)}
          isScheduleRequested={scheduleRequested}
          clearScheduleRequest={() => setScheduleRequested(false)}
          isExchangeRequested={exchangeRequested}
          clearExchangeRequest={() => setExchangeRequested(false)}
          isConceptRequested={conceptRequested}
          clearConceptRequest={() => setConceptRequested(false)}
          isInteractionRequested={interactionRequested}
          clearInteractionRequest={() => setInteractionRequested(false)}
          isRegulationsRequested={regulationsRequested}
          clearRegulationsRequest={() => setRegulationsRequested(false)}
          regulationsScrollPoint={regulationsPoint}
          clearRegulationsScrollPoint={() => setRegulationsPoint(null)}
          isPriceRequested={priceRequested}
          clearPriceRequest={() => setPriceRequested(false)}
          isDemoRequested={demoRequested}
          demoTemplateTitle={demoTemplateTitle}
          clearDemoRequest={() => setDemoRequested(false)}
          isVacanciesRequested={vacanciesRequested}
          clearVacanciesRequest={() => setVacanciesRequested(false)}
          onPromoClick={() => highlightFooterItem('regulations')}
          onScheduleClick={() => {
            highlightFooterItem('schedule');
          }}
          onHighlightFooterItem={highlightFooterItem}
        />
      </main>

      <footer id="footer" className="py-20 px-4 border-t border-white/5 bg-black/40">
        <div className="container mx-auto flex flex-col items-center gap-12 text-sm text-gray-500">
          <div className="flex flex-col items-center gap-6">
            {/* Row 1 */}
            <div className="flex flex-wrap justify-center gap-x-2 sm:gap-x-3 lg:gap-x-4 gap-y-1 sm:gap-y-2">
              {[
                { id: 'concept', label: t('footer-concept'), title: t('footer-concept-header'), content: lang === 'ua' ? 'Інформація про наше бачення, підхід та основні принципи роботи.' : 'Information about our vision, approach, and core principles.' },
                { id: 'regulations', label: t('footer-regulations'), title: t('footer-regulations-header'), content: lang === 'ua' ? 'Акція «Портфоліо»: -50%!!!\nАкція «Партнер»: -50%!!!\nАкція «Промокодер»: Вигода 5%!\nАкція «Сайт за ціною кави»\n«Приведи друга»: Вигода 5-10%!\n«Клон»: сайт від 1000грн.' : 'Promo "Portfolio": -50%!!!\nPromo "Partner": -50%!!!\nPromo "Promocoder": Benefit 5%!\nPromo "Website for the price of coffee"\n"Bring a Friend": Benefit 5-10%!\n"Clone": website from 1000uah.' },
                { id: 'interaction', label: t('footer-interaction'), title: t('footer-interaction-header'), content: t('footer-interaction-content') },
                { id: 'price', label: t('footer-price'), content: lang === 'ua' ? 'Детальний прайс-лист на всі види робіт та послуг.' : 'Detailed price list for all types of work and services.' },
                { id: 'vacancies', label: t('footer-vacancies'), title: lang === 'ua' ? 'Вакансії компанії' : 'Company Vacancies', content: lang === 'ua' ? '📁 Бухгалтерія (1)\n📁 Відділ продажів (1)\n📁 Юридичний відділ (1)\n📁 Технічний відділ (2)\n📁 Креативний відділ (9)' : '📁 Accounting (1)\n📁 Sales Department (1)\n📁 Legal Department (1)\n📁 Technical Department (2)\n📁 Creative Department (9)' },
                { id: 'partners', label: t('footer-partners'), content: lang === 'ua' ? 'Список наших надійних партнеів та умови співпраці.' : 'Our reliable partners and cooperation terms.' }
              ].map((link) => (
                <FooterItem 
                  key={link.id} 
                  link={link} 
                  row={1}
                  highlightedId={highlightedFooterItem} 
                  allFooterBlinking={allFooterBlinking}
                  openFooterPopupId={openFooterPopupId}
                  setOpenFooterPopupId={setOpenFooterPopupId}
                  lang={lang}
                  onDetailClick={
                    link.id === 'concept' ? handleConceptRequest : 
                    link.id === 'regulations' ? handleRegulationsRequest :
                    link.id === 'interaction' ? handleInteractionRequest :
                    link.id === 'price' ? handlePriceRequest :
                    link.id === 'vacancies' ? handleVacanciesRequest :
                    scrollToOptionsRow
                  }
                />
              ))}
            </div>

            {/* Row 2 */}
            <div className="flex flex-wrap justify-center gap-x-2 sm:gap-x-3 lg:gap-x-4 gap-y-1 sm:gap-y-2">
              {[
                { id: 'faq', label: '(FAQ)', title: t('footer-faq-header'), content: lang === 'ua' ? 'Відповіді на запитання про FPV, процеси розробки та технології.' : 'Answers to questions about FPV, design flow, and technology.' },
                { id: 'legal', label: t('footer-legal'), content: lang === 'ua' ? 'Юридична підтримка, договори та правові аспекти співпраці.' : 'Legal support, contracts, and legal aspects.' },
                { id: 'accounting', label: t('footer-accounting'), content: lang === 'ua' ? 'Фінансова звітність, рахунки та питання взаєморозрахунків.' : 'Financial statements, invoices, and payments.' },
                { 
                  id: 'exchange', 
                  label: t('footer-exchange'), 
                  content: lang === 'ua' ? 'Усі розрахунки проводяться виключно у національній валюті!!!' : 'All payments are processed exclusively in the national currency!!!' 
                },
                { 
                  id: 'schedule', 
                  label: t('footer-schedule'), 
                  title: t('footer-schedule-header'),
                  content: lang === 'ua' 
                    ? `Понеділок - П'ятниця\nз 10:00 до 11:45,\nперерва на обід із сієстою,\nпотім з 14:00 до 17:45.\n\nУ Державні вихідні та свята - не працюємо.`
                    : `Monday - Friday\nfrom 10:00 to 11:45,\nlunch break with siesta,\nthen 14:00 to 17:45.\n\nClosed on public holidays.`
                }
              ].map((link) => (
                <FooterItem 
                  key={link.id} 
                  link={link} 
                  row={2} 
                  highlightedId={highlightedFooterItem} 
                  allFooterBlinking={allFooterBlinking}
                  openFooterPopupId={openFooterPopupId}
                  setOpenFooterPopupId={setOpenFooterPopupId}
                  lang={lang}
                  onDetailClick={
                    link.id === 'faq' ? () => setShowFaq(true) :
                    link.id === 'schedule' ? handleScheduleRequest : 
                    link.id === 'exchange' ? handleExchangeRequest :
                    scrollToOptionsRow
                  }
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 pt-4 border-t border-white/5 w-full max-w-4xl">
            <div id="footer-logo-row" className="flex flex-row items-center justify-center gap-3 whitespace-nowrap">
              <img src="https://i.ibb.co/d8Qc9k0/FPVlogo.png" alt="FPV Logo" className="h-12 w-auto hover:scale-110 transition-transform flex-shrink-0" />
              <span className="font-extrabold text-shimmer-effect text-lg sm:text-xl md:text-2xl tracking-tighter flex-shrink-0">FPV | the Future Pages Vibe</span>
            </div>
            
            <p className="text-[10px] text-gray-600 opacity-60 max-w-lg text-center leading-tight">
              {t('footer-demo-notice')}
            </p>

            <div className="text-gray-400 font-medium">
              © 2026 <span className="font-extrabold text-white">FPV</span> | {t('footer-rights')}.
            </div>
          </div>
        </div>
      </footer>
      
      {/* Dynamic SEO Support Section for Web Crawlers, Robots & Non-JS Search Bots */}
      <div 
        className="sr-only" 
        aria-hidden="true" 
        style={{ display: 'none', opacity: 0, width: 0, height: 0, overflow: 'hidden' }}
      >
        <h2>{lang === 'ua' ? 'Часті запитання про FPV та процес веб-розробки' : 'Frequently Asked Questions about FPV and Web Development Process'}</h2>
        {faqCategories.map((category) => (
          <section key={`seo-category-${category.id}`} id={`seo-category-${category.id}`}>
            <h3>{lang === 'ua' ? category.titleUa : category.titleEn}</h3>
            {category.items.map((item) => (
              <article key={`seo-faq-item-${item.id}`}>
                <h4>{lang === 'ua' ? item.questionUa : item.questionEn}</h4>
                <p>{lang === 'ua' ? item.answerUa : item.answerEn}</p>
              </article>
            ))}
          </section>
        ))}
      </div>

      <FAQ isOpen={showFaq} onClose={() => setShowFaq(false)} lang={lang} />
      <FloatingActions lang={lang} />
    </div>
  );
}
