import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { Services } from './components/Services';
import { Process } from './components/Process';
import { RatingSection } from './components/RatingSection';
import { Contact } from './components/Contact';
import { translations, Language } from './i18n/translations';

export default function App() {
  const [lang, setLang] = useState<Language>('ua');
  const [highlightedFooterItem, setHighlightedFooterItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [feedbackTransfer, setFeedbackTransfer] = useState<{ text: string; category: string } | null>(null);
  const [scheduleRequested, setScheduleRequested] = useState<boolean>(false);
  const [exchangeRequested, setExchangeRequested] = useState<boolean>(false);
  const [conceptRequested, setConceptRequested] = useState<boolean>(false);
  const [interactionRequested, setInteractionRequested] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      const roundedProgress = Math.round(progress);
      
      let currentSection = '';
      
      if (roundedProgress >= 15 && roundedProgress <= 33) {
        currentSection = 'portfolio';
      } else if (roundedProgress >= 34 && roundedProgress <= 48) {
        currentSection = 'services';
      } else if (roundedProgress >= 49 && roundedProgress <= 68) {
        currentSection = 'process';
      } else if (roundedProgress >= 69 && roundedProgress <= 99) {
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

  const highlightFooterItem = (id: string) => {
    setHighlightedFooterItem(id);
    setTimeout(() => setHighlightedFooterItem(null), 3000); // Clear highlight after 3 seconds
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFeedbackTransfer = (text: string) => {
    setFeedbackTransfer({ text, category: 'feedback' });
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScheduleRequest = () => {
    setScheduleRequested(true);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExchangeRequest = () => {
    setExchangeRequested(true);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleConceptRequest = () => {
    setConceptRequested(true);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInteractionRequest = () => {
    setInteractionRequested(true);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Translation helper function
  const t = useCallback((key: string) => {
    return (translations[lang] as any)[key] || key;
  }, [lang]);

  const FooterItem: React.FC<{ link: any, highlightedId: string | null, onDetailClick?: () => void }> = ({ link, highlightedId, onDetailClick }) => (
    <div className="relative group/footer-item" id={link.id === 'schedule' ? 'footer-schedule-link' : undefined}>
      <button 
        className={`hover:text-neon-blue transition-all duration-500 font-medium cursor-pointer relative ${
          highlightedId === link.id ? 'text-neon-blue scale-125 shadow-[0_0_25px_rgba(41,207,222,0.8)] z-10' : ''
        }`}
      >
        {link.label}
        {highlightedId === link.id && (
          <motion.div 
            layoutId="footer-highlight"
            className="absolute -inset-2 border border-neon-blue/50 rounded-lg -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}
      </button>
      {/* Popup Window */}
      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 pb-4 w-64 transition-all duration-300 z-50 ${
        highlightedId === link.id 
          ? 'opacity-100 visible translate-y-0' 
          : 'opacity-0 invisible translate-y-2 group-hover/footer-item:opacity-100 group-hover/footer-item:visible group-hover/footer-item:translate-y-0'
      }`}>
        <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl shadow-2xl shadow-black/50 backdrop-blur-xl relative">
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
          <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 border-r border-b border-white/10 rotate-45" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header 
        lang={lang} 
        setLang={setLang} 
        t={t} 
        onSearch={handleSearch} 
        activeSection={activeSection}
      />
      
      <main className="overflow-x-hidden">
        <Hero t={t} lang={lang} />
        
        <Portfolio t={t} />
        
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
          onScheduleClick={() => {
            highlightFooterItem('schedule');
            const scheduleLink = document.getElementById('footer-schedule-link');
            if (scheduleLink) scheduleLink.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </main>

      <footer id="footer" className="py-20 px-4 border-t border-white/5 bg-black/40">
        <div className="container mx-auto flex flex-col items-center gap-12 text-sm text-gray-500">
          <div className="flex flex-col items-center gap-6">
            {/* Row 1 */}
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
              {[
                { id: 'concept', label: t('footer-concept'), title: t('footer-concept-header'), content: lang === 'ua' ? 'Інформація про наше бачення, підхід та основні принципи роботи.' : 'Information about our vision, approach, and core principles.' },
                { id: 'regulations', label: t('footer-regulations'), title: t('footer-regulations-header'), content: lang === 'ua' ? 'Индивідуальний дизайн - 50%!\nРекламне партнерство - 50%!\nПраво на використання - 15%!\nЗнижка за промокодом - 10%!' : 'Individual Design - 50%!\nAdvertising Partnership - 50%!\nRight to Use - 15%!\nPromo Code Discount - 10%!' },
                { id: 'interaction', label: t('footer-interaction'), title: t('footer-interaction-header'), content: t('footer-interaction-content') },
                { id: 'price', label: t('footer-price'), content: lang === 'ua' ? 'Детальний прайс-лист на всі види робіт та послуг.' : 'Detailed price list for all types of work and services.' },
                { id: 'vacancies', label: t('footer-vacancies'), content: lang === 'ua' ? 'Актуальні вакансії для приєднання до нашої команди.' : 'Current vacancies to join our team.' },
                { id: 'partners', label: t('footer-partners'), content: lang === 'ua' ? 'Список наших надійних партнерів та умови співпраці.' : 'Our reliable partners and cooperation terms.' }
              ].map((link) => (
                <FooterItem 
                  key={link.id} 
                  link={link} 
                  highlightedId={highlightedFooterItem} 
                  onDetailClick={
                    link.id === 'concept' ? handleConceptRequest : 
                    link.id === 'interaction' ? handleInteractionRequest : undefined
                  }
                />
              ))}
            </div>

            {/* Row 2 */}
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
              {[
                { id: 'sales', label: t('footer-sales'), content: lang === 'ua' ? "Зв'яжіться з нашими менеджерами для обговорення нових проектів." : 'Contact our managers to discuss new projects.' },
                { id: 'ads', label: t('footer-ads'), content: lang === 'ua' ? 'Обговорення маркетингових стратегій та рекламних кампаній.' : 'Marketing strategies and advertising campaigns.' },
                { id: 'strategy', label: t('footer-strategy'), content: lang === 'ua' ? 'План розвитку нашої компанії та інноваційні впровадження.' : 'Company development plan and innovative implementations.' }
              ].map((link) => (
                <FooterItem key={link.id} link={link} highlightedId={highlightedFooterItem} />
              ))}
            </div>

            {/* Row 3 */}
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
              {[
                { id: 'legal', label: t('footer-legal'), content: lang === 'ua' ? 'Юридична підтримка, договори та правові аспекти співпраці.' : 'Legal support, contracts, and legal aspects.' },
                { id: 'accounting', label: t('footer-accounting'), content: lang === 'ua' ? 'Фінансова звітність, рахунки та питання взаєморозрахунків.' : 'Financial statements, invoices, and payments.' },
                { id: 'office', label: t('footer-office'), content: lang === 'ua' ? 'Наш головний хаб, де народжуються ідеї та проекти.' : 'Our main hub where ideas and projects are born.' },
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
                  highlightedId={highlightedFooterItem} 
                  onDetailClick={
                    link.id === 'schedule' ? handleScheduleRequest : 
                    link.id === 'exchange' ? handleExchangeRequest : undefined
                  }
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 pt-4 border-t border-white/5 w-full max-w-4xl">
            <div className="flex items-center gap-3">
              <img src="https://i.ibb.co/d8Qc9k0/FPVlogo.png" alt="FPV Logo" className="h-12 w-auto hover:scale-110 transition-transform" />
              <span className="font-extrabold text-shimmer-effect text-2xl tracking-tighter">FPV | the Future Pages Vibe</span>
            </div>
            
            <p className="text-[10px] text-gray-600 opacity-60 max-w-lg text-center leading-tight">
              {t('footer-demo-notice')}
            </p>

            <div className="text-gray-400 font-medium">
              © 2022-2026 <span className="font-extrabold text-white">FPV</span> | {t('footer-rights')}.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
