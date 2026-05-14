import { useState, useCallback } from 'react';
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

  // Translation helper function
  const t = useCallback((key: string) => {
    return (translations[lang] as any)[key] || key;
  }, [lang]);

  return (
    <div className="min-h-screen">
      <Header lang={lang} setLang={setLang} t={t} />
      
      <main>
        <Hero t={t} lang={lang} />
        
        <Portfolio t={t} />
        
        <Services t={t} />
        
        <Process t={t} />
        
        <RatingSection t={t} />

        <Contact t={t} />
      </main>

      <footer className="py-12 px-4 border-t border-white/5 bg-black/20">
        <div className="container mx-auto flex flex-col items-center gap-8 text-sm text-gray-500">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
            {[
              { id: 'concept', label: t('footer-concept'), content: 'Інформація про нашу концепцію розвитку та основні принципи роботи.' },
              { id: 'regulations', label: t('footer-regulations'), content: 'Внутрішні правила та регламент надання послуг.' },
              { id: 'price', label: t('footer-price'), content: 'Детальний прайс-лист на всі види робіт та послуг.' },
              { id: 'vacancies', label: t('footer-vacancies'), content: 'Актуальні вакансії для приєднання до нашої команди.' },
              { id: 'partners', label: t('footer-partners'), content: 'Список наших надійних партнерів та умови співпраці.' }
            ].map((link) => (
              <div key={link.id} className="relative group/footer-item">
                <button className="hover:text-neon-blue transition-colors font-medium cursor-pointer">
                  {link.label}
                </button>
                {/* Popup Window */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 opacity-0 invisible group-hover/footer-item:opacity-100 group-hover/footer-item:visible transition-all duration-300 translate-y-2 group-hover/footer-item:translate-y-0 z-50">
                  <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl shadow-2xl shadow-black/50 backdrop-blur-xl">
                    <div className="w-8 h-8 rounded-full bg-neon-blue/10 flex items-center justify-center mb-4">
                      <div className="w-2 h-2 bg-neon-blue rounded-full shadow-[0_0_8px_rgba(41,207,222,0.8)]" />
                    </div>
                    <h4 className="text-white font-bold mb-2 text-base">{link.label}</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {link.content}
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <a href="#" className="text-neon-blue text-[10px] font-bold uppercase tracking-widest hover:underline">
                        Детальніше →
                      </a>
                    </div>
                  </div>
                  {/* Triangle Arrow */}
                  <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 border-r border-b border-white/10 rotate-45" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4">
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
