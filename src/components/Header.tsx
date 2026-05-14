import React, { useState } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { Language } from '../i18n/translations';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang, t }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollProgress = useScrollProgress();

  const navItems = [
    { id: 'portfolio', label: t('nav-portfolio') },
    { id: 'services', label: t('nav-services') },
    { id: 'process', label: t('nav-process') },
    { id: 'ratings', label: t('nav-testimonials') },
  ];

  return (
    <header className="fixed w-full z-50 glassmorphism h-[var(--header-height)]">
      <div className="container mx-auto h-full px-4 flex justify-end items-center relative">
        {/* Logo - Always hanging on the left */}
        <a href="#" className="hanging-logo-wrapper">
          <img src="https://i.ibb.co/d8Qc9k0/FPVlogo.png" alt="FPV Logo" className="hanging-logo-img" />
        </a>

        {/* Brand Name - Visible in landscape and large screens, but and desktop */}
        <div className="absolute left-44 top-1/2 -translate-y-1/2 hidden landscape:block xl:block">
           <span className="text-xl font-extrabold gradient-text">the Future Pages Vibe</span>
        </div>

        {/* Tablet/Mobile View Controls - hidden on large desktop */}
        <div className="flex xl:hidden items-center gap-4">
          <div className="relative w-10 h-10">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-white/10"
              />
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="var(--color-neon-blue)"
                strokeWidth="3"
                strokeDasharray="113"
                strokeDashoffset={113 - (113 * scrollProgress) / 100}
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold">
              {Math.round(scrollProgress)}%
            </div>
          </div>
          <button className="text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Nav - visible only on large screens */}
        <nav className="hidden xl:flex items-center gap-8">
          {navItems.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="nav-link">
              {item.label}
            </a>
          ))}

          <div 
            className="flex bg-gray-900 rounded-full p-1 border border-white/10 cursor-pointer select-none"
            onClick={() => setLang(lang === 'ua' ? 'en' : 'ua')}
          >
            <div
              className={`px-3 py-1 rounded-full text-xs transition ${lang === 'ua' ? 'bg-neon-blue text-white' : 'text-gray-400'}`}
            >
              UA
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs transition ${lang === 'en' ? 'bg-neon-blue text-white' : 'text-gray-400'}`}
            >
              EN
            </div>
          </div>

          <a href="#order" className="btn-primary px-6 py-2 rounded-full font-semibold text-sm flex items-center justify-center">
            {t('quote-btn')}
          </a>

          {/* Scroll Progress Ring */}
          <div className="relative w-10 h-10 ml-2">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-white/10"
              />
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="var(--color-neon-blue)"
                strokeWidth="3"
                strokeDasharray="113"
                strokeDashoffset={113 - (113 * scrollProgress) / 100}
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold">
              {Math.round(scrollProgress)}%
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay to catch clicks outside and provide a backdrop for mobile */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="xl:hidden fixed inset-0 z-[-1] bg-black/20 backdrop-blur-sm" 
              onClick={() => setIsMenuOpen(false)}
              onPan={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="xl:hidden absolute top-full left-0 w-full bg-dark-bg border-b border-white/10 p-6 space-y-6 flex flex-col items-end"
              onMouseLeave={() => setIsMenuOpen(false)}
            >
              {navItems.map((item) => (

            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-lg font-bold text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="w-full flex justify-between items-center pt-6 border-t border-white/10">
            <div 
              className="flex bg-gray-900 rounded-full p-1 cursor-pointer select-none"
              onClick={() => setLang(lang === 'ua' ? 'en' : 'ua')}
            >
              <div className={`px-4 py-1 rounded-full text-xs font-bold transition ${lang === 'ua' ? 'bg-neon-blue text-white' : 'text-gray-400'}`}>UA</div>
              <div className={`px-4 py-1 rounded-full text-xs font-bold transition ${lang === 'en' ? 'bg-neon-blue text-white' : 'text-gray-400'}`}>EN</div>
            </div>
            <a href="#order" onClick={() => setIsMenuOpen(false)} className="btn-primary px-6 py-2 rounded-full text-xs font-bold flex items-center justify-center">
              {t('quote-btn')}
            </a>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
    </header>

  );
};
