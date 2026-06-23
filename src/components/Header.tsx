import React, { useState, useEffect } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { Language } from '../i18n/translations';
import { Menu, X, ScanSearch } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  onSearch?: (query: string) => void;
  activeSection?: string;
  onNavClick?: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang, t, onSearch, activeSection, onNavClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [flashTrigger, setFlashTrigger] = useState(0);
  const scrollProgress = useScrollProgress();

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchInputValue.trim() && onSearch) {
      onSearch(searchInputValue.trim());
      setIsSearchOpen(false);
      setSearchInputValue('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getConicGradient = (progress: number) => {
    const degree = progress * 3.6;
    return `conic-gradient(
      #29CFDE 0deg,
      #5F4BA1 ${Math.min(90, degree)}deg,
      #CE477B ${Math.min(180, degree)}deg,
      #E5805C ${Math.min(270, degree)}deg,
      #29CFDE ${Math.min(360, degree)}deg,
      transparent ${Math.min(360, degree)}deg,
      transparent 360deg
    )`;
  };

  useEffect(() => {
    if (scrollProgress === 0 || isSearchOpen) {
      // Small reset to make sure it triggers
      const initialTimeout = setTimeout(() => {
        setFlashTrigger(v => v + 1);
      }, 2000);

      const interval = setInterval(() => {
        setFlashTrigger(v => v + 1);
      }, 20000);

      return () => {
        clearTimeout(initialTimeout);
        clearInterval(interval);
      };
    }
  }, [scrollProgress === 0, isSearchOpen]);

  const navItems = [
    { id: 'portfolio', label: t('nav-portfolio') },
    { id: 'services', label: t('nav-services') },
    { id: 'process', label: t('nav-process') },
    { id: 'ratings', label: t('nav-testimonials') },
    { id: 'footer', label: t('nav-more') },
  ];

  return (
    <div 
      className="fixed w-full z-[200] group/header"
      onMouseLeave={() => setIsSearchOpen(false)}
    >
      <header 
        className="w-full glassmorphism h-[var(--header-height)] relative"
      >
      <div className="container mx-auto h-full px-4 flex justify-end items-center relative">
        {/* Logo - Always hanging on the left, hidden on mobile when search is open */}
        <a 
          href="#" 
          className={`hanging-logo-wrapper transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none xl:opacity-100 xl:pointer-events-auto' : 'opacity-100'}`}
        >
          <img src="https://i.ibb.co/d8Qc9k0/FPVlogo.png" alt="FPV Logo" className="hanging-logo-img" />
        </a>

        {/* Brand Name - Visible in landscape and large screens, hidden on mobile when search is open */}
        <div 
          className={`absolute left-44 top-1/2 -translate-y-1/2 hidden landscape:block xl:block transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none xl:opacity-100 xl:pointer-events-auto' : 'opacity-100'}`}
        >
           <span className="text-xl font-extrabold gradient-text">the Future Pages Vibe</span>
        </div>

        {/* Tablet/Mobile View Controls - hidden on large desktop */}
        <div className="flex xl:hidden items-center gap-4">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isSearchOpen ? null : (scrollProgress === 0 ? (
                <motion.button
                  key="search-btn-mobile"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1 }}
                  onClick={() => {
                    setIsSearchOpen(true);
                  }}
                >
                  <motion.div
                    key={`blink-mobile-${flashTrigger}`}
                    animate={{ 
                      filter: [
                        "drop-shadow(0 0 0px #29cfde00)",
                        "drop-shadow(0 0 15px #29cfde)",
                        "drop-shadow(0 0 2px #29cfde)",
                        "drop-shadow(0 0 15px #29cfde)",
                        "drop-shadow(0 0 0px #29cfde00)"
                      ]
                    }}
                    transition={{
                      duration: 1.5,
                      times: [0, 0.25, 0.5, 0.75, 1]
                    }}
                  >
                    <ScanSearch 
                      size={32} 
                      strokeWidth={2.5} 
                      className="transition-transform group-hover:scale-110"
                    />
                  </motion.div>
                </motion.button>
              ) : (
                <motion.div
                  key="progress-ring-mobile"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="scroll-indicator-mobile"
                  onClick={scrollToTop}
                >
                  <div 
                    className="scroll-ring-mobile" 
                    style={{ background: getConicGradient(scrollProgress) }}
                  />
                  <div className="scroll-percentage-mobile">
                    {Math.round(scrollProgress)}%
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <button className="text-white p-2 transition-opacity duration-300 shrink-0" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Mobile Search Input Box */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -2 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -2 }}
                className="absolute left-[10px] right-[60px] md:left-auto md:right-[75px] md:w-[350px] z-50 overflow-hidden rounded-full"
              >
                <form onSubmit={handleSearchSubmit} className="bg-dark-bg/60 backdrop-blur-md border border-white/10 rounded-full pl-6 pr-3 py-2 flex items-center justify-between shadow-2xl gap-3">
                  <input
                    type="text"
                    value={searchInputValue}
                    onChange={(e) => setSearchInputValue(e.target.value)}
                    placeholder={t('search-placeholder')}
                    className="w-full bg-transparent border-none text-white text-base outline-none placeholder:text-gray-500"
                    autoFocus
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      type="button" 
                      onClick={() => {
                        if (searchInputValue.trim()) {
                          handleSearchSubmit();
                        } else {
                          setIsSearchOpen(false);
                        }
                      }} 
                      className="text-gray-400 hover:text-white transition cursor-pointer p-1.5 flex items-center justify-center animate-pulse"
                    >
                      <ScanSearch size={22} strokeWidth={2.5} className={searchInputValue.trim() ? "text-neon-blue" : "text-gray-400"} />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Nav - visible only on large screens */}
        <nav className="hidden xl:flex items-center gap-8 w-max">
          <div className={`flex items-center gap-8 transition-all duration-500 ${isSearchOpen ? 'w-0 opacity-0 pointer-events-none overflow-hidden' : 'w-max opacity-100'}`}>
            {navItems.map((item) => (
              <a 
                key={`desktop-nav-${item.id}`} 
                href={`#${item.id}`} 
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  if (onNavClick) {
                    e.preventDefault();
                    onNavClick(item.id);
                  }
                }}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="relative flex items-center">
            {/* Desktop Search Input Slider (slides left from icon) */}
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0, x: 20 }}
                  animate={{ width: 450, opacity: 1, x: 0 }}
                  exit={{ width: 0, opacity: 0, x: 20 }}
                  className="mr-4 overflow-hidden rounded-full"
                  style={{ maxWidth: 'min(450px, calc(100vw - 550px))' }}
                >
                  <form onSubmit={handleSearchSubmit} className="bg-dark-bg/60 backdrop-blur-md border border-white/10 rounded-full px-6 py-2.5 flex items-center shadow-lg">
                    <input
                      type="text"
                      value={searchInputValue}
                      onChange={(e) => setSearchInputValue(e.target.value)}
                      placeholder={t('search-placeholder')}
                      className="w-full bg-transparent border-none text-white text-base outline-none placeholder:text-gray-500"
                      autoFocus
                    />
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {scrollProgress === 0 || isSearchOpen ? (
                <motion.button
                  key="search-btn-desktop"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1 }}
                  className="p-3 transition-opacity hover:opacity-80 cursor-pointer z-20 group relative text-white flex items-center justify-center"
                  onClick={() => {
                    if (isSearchOpen && searchInputValue.trim()) {
                      handleSearchSubmit();
                    } else {
                      setIsSearchOpen(!isSearchOpen);
                    }
                  }}
                >
                  <motion.div
                    key={`blink-desktop-${flashTrigger}`}
                    animate={{ 
                      filter: [
                        "drop-shadow(0 0 0px #29cfde00)",
                        "drop-shadow(0 0 20px #29cfde)",
                        "drop-shadow(0 0 5px #29cfde)",
                        "drop-shadow(0 0 20px #29cfde)",
                        "drop-shadow(0 0 0px #29cfde00)"
                      ]
                    }}
                    transition={{
                      duration: 1.5,
                      times: [0, 0.25, 0.5, 0.75, 1]
                    }}
                    className="flex items-center justify-center"
                  >
                    <ScanSearch 
                      size={36} 
                      strokeWidth={2.5} 
                      className="transition-transform group-hover:scale-110"
                    />
                  </motion.div>
                </motion.button>
              ) : (
                <motion.div
                  key="progress-ring-desktop"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="scroll-indicator"
                  onClick={scrollToTop}
                >
                  <div 
                    className="scroll-ring" 
                    style={{ background: getConicGradient(scrollProgress) }}
                  />
                  <div className="scroll-percentage">
                    {Math.round(scrollProgress)}%
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div 
            className="flex bg-gray-900 rounded-full p-1 border border-white/10 cursor-pointer select-none transition-all duration-300 w-max"
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

          <a 
            href="#order" 
            onClick={(e) => {
              window.location.hash = '#order';
              if (onNavClick) {
                e.preventDefault();
                onNavClick('order');
              }
            }}
            className="btn-primary px-6 py-3 rounded-full font-bold text-sm flex items-center justify-center hover:shadow-[0_0_20px_rgba(41,207,222,0.5)] hover:scale-105 transition-all duration-300 w-max"
          >
            {t('quote-btn')}
          </a>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            key="mobile-nav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="xl:hidden fixed inset-0 z-[-1] bg-black/20 backdrop-blur-sm" 
            onClick={() => setIsMenuOpen(false)}
            onPan={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}
        {isMenuOpen && (
          <motion.div 
            key="mobile-nav-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="xl:hidden absolute top-full left-0 w-full bg-dark-bg border-b border-white/10 p-6 space-y-6 flex flex-col items-end"
            onMouseLeave={() => setIsMenuOpen(false)}
          >
            {navItems.map((item) => (
              <a
                key={`mobile-nav-${item.id}`}
                href={`#${item.id}`}
                className={`text-lg font-bold transition-colors ${activeSection === item.id ? 'text-neon-blue' : 'text-gray-300 hover:text-white'}`}
                onClick={(e) => {
                  setIsMenuOpen(false);
                  if (onNavClick) {
                    e.preventDefault();
                    onNavClick(item.id);
                  }
                }}
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
              <a 
                href="#order" 
                onClick={(e) => {
                  setIsMenuOpen(false);
                  window.location.hash = '#order';
                  if (onNavClick) {
                    e.preventDefault();
                    onNavClick('order');
                  }
                }} 
                className="btn-primary px-6 py-2 rounded-full text-xs font-bold flex items-center justify-center hover:shadow-[0_0_15px_rgba(41,207,222,0.4)] transition-all"
              >
                {t('quote-btn')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </header>

      {/* Invisible buffer zone to keep search open until mouse is 2x header height away */}
      {isSearchOpen && (
        <div className="h-[var(--header-height)] w-full pointer-events-auto cursor-default" />
      )}
    </div>
  );
};
