import React, { useState, useCallback } from 'react';
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

  const highlightFooterItem = (id: string) => {
    setHighlightedFooterItem(id);
    setTimeout(() => setHighlightedFooterItem(null), 3000); // Clear highlight after 3 seconds
  };

  // Translation helper function
  const t = useCallback((key: string) => {
    return (translations[lang] as any)[key] || key;
  }, [lang]);

  const FooterItem: React.FC<{ link: any, highlightedId: string | null }> = ({ link, highlightedId }) => (
    <div className="relative group/footer-item">
      <button 
        className={`hover:text-neon-blue transition-all duration-500 font-medium cursor-pointer ${
          highlightedId === link.id ? 'text-neon-blue scale-110 shadow-[0_0_15px_rgba(41,207,222,0.5)]' : ''
        }`}
      >
        {link.label}
      </button>
      {/* Popup Window */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 opacity-0 invisible group-hover/footer-item:opacity-100 group-hover/footer-item:visible transition-all duration-300 translate-y-2 group-hover/footer-item:translate-y-0 z-50">
        <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl shadow-2xl shadow-black/50 backdrop-blur-xl">
          <h4 className={`font-bold mb-2 text-base gradient-text-blue-purple ${link.id === 'schedule' ? 'text-center' : 'text-left'}`}>
            {link.title || link.label}
          </h4>
          <div className={`text-white text-xs leading-relaxed whitespace-pre-line ${link.id === 'schedule' ? 'text-center' : 'text-left'}`}>
            {link.content}
          </div>
          <div className={`mt-4 pt-4 border-t border-white/5 flex ${link.id === 'schedule' ? 'justify-center' : 'justify-start'}`}>
            <a href="#" className="text-neon-blue text-[10px] font-bold uppercase tracking-widest hover:underline">
              {lang === 'ua' ? 'Детальніше' : 'Details'} →
            </a>
          </div>
        </div>
        {/* Triangle Arrow */}
        <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 border-r border-b border-white/10 rotate-45" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Header lang={lang} setLang={setLang} t={t} />
      
      <main>
        <Hero t={t} lang={lang} />
        
        <Portfolio t={t} />
        
        <Services t={t} onConceptClick={() => highlightFooterItem('concept')} />
        
        <Process t={t} />
        
        <RatingSection t={t} />

        <Contact t={t} />
      </main>

      <footer id="footer" className="py-20 px-4 border-t border-white/5 bg-black/40">
        <div className="container mx-auto flex flex-col items-center gap-12 text-sm text-gray-500">
          <div className="flex flex-col items-center gap-6">
            {/* Row 1 */}
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
              {[
                { id: 'concept', label: t('footer-concept'), content: lang === 'ua' ? 'Інформація про нашу концепцію розвитку та основні принципи роботи.' : 'Information about our development concept and core principles.' },
                { id: 'regulations', label: t('footer-regulations'), content: lang === 'ua' ? 'Внутрішні правила та регламент надання послуг.' : 'Internal rules and service regulations.' },
                { id: 'price', label: t('footer-price'), content: lang === 'ua' ? 'Детальний прайс-лист на всі види робіт та послуг.' : 'Detailed price list for all types of work and services.' },
                { id: 'vacancies', label: t('footer-vacancies'), content: lang === 'ua' ? 'Актуальні вакансії для приєднання до нашої команди.' : 'Current vacancies to join our team.' },
                { id: 'partners', label: t('footer-partners'), content: lang === 'ua' ? 'Список наших надійних партнерів та умови співпраці.' : 'Our reliable partners and cooperation terms.' }
              ].map((link) => (
                <FooterItem key={link.id} link={link} highlightedId={highlightedFooterItem} />
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
                { id: 'exchange', label: t('footer-exchange'), content: lang === 'ua' ? 'Актуальні курси валют для розрахунків та планування.' : 'Current currency exchange rates for payments and planning.' },
                { 
                  id: 'schedule', 
                  label: t('footer-schedule'), 
                  title: t('footer-schedule-header'),
                  content: lang === 'ua' 
                    ? `Понеділок - П'ятниця\nз 10:00 до 11:45,\nперерва на обід із сієстою,\nпотім з 14:00 до 17:45.\n\nУ Державні вихідні та свята - не працюємо.`
                    : `Monday - Friday\nfrom 10:00 to 11:45,\nlunch break with siesta,\nthen 14:00 to 17:45.\n\nClosed on public holidays.`
                }
              ].map((link) => (
                <FooterItem key={link.id} link={link} highlightedId={highlightedFooterItem} />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 pt-4 border-t border-white/5 w-full max-w-4xl">
            <div className="flex items-center gap-3">
              <img src="https://i.ibb.co/d8Qc9k0/FPVlogo.png" alt="FPV Logo" className="h-12 w-auto hover:scale-110 transition-transform" />
              <span className="font-extrabold text-shimmer-effect text-2xl tracking-tighter">FPV | the Future Pages Vibe</span>
            </div>
            <div className="text-gray-400 font-medium">
              © 2022-2026 <span className="font-extrabold text-white">FPV</span> | {t('footer-rights')}.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
