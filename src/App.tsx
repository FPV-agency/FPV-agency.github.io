import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { Services } from './components/Services';
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
        
        {/* Process and Testimonials would go here similarly */}
        <section id="process" className="py-20 px-4 bg-dark-bg">
           <div className="container mx-auto text-center">
              <h2 className="text-4xl font-bold mb-4">{t('process-title')}</h2>
              <p className="text-gray-400">{t('process-subtitle')}</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
                 {[t('process-step1'), t('process-step2'), t('process-step3'), t('process-step4')].map((step, i) => (
                    <div key={i} className="glassmorphism p-8 rounded-3xl relative">
                       <span className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-neon-blue rounded-full flex items-center justify-center font-bold">{i+1}</span>
                       <h3 className="text-xl font-bold mt-4">{step}</h3>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        <Contact t={t} />
      </main>

      <footer className="py-12 px-4 border-t border-white/5">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-3">
            <img src="https://i.ibb.co/d8Qc9k0/FPVlogo.png" alt="FPV Logo" className="h-12 w-auto hover:scale-110 transition-transform" />
            <span className="font-extrabold text-shimmer-effect text-lg">the Future Pages Vibe</span>
            <span className="ml-2">© 2026 <span className="font-extrabold text-white">FPV</span>. {t('footer-rights')}.</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">{t('footer-privacy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer-terms')}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
