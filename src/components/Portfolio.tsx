import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';

interface Template {
  id: number;
  emoji: string;
  label: string;
  tag: string;
  price: string;
  title: string;
  desc: string;
  color: string;
}

interface PortfolioProps {
  t: (key: string) => string;
}

const originalTemplates: Template[] = [
  { id: 1, emoji: '🛒', label: 'E-commerce', tag: 'tag-ecommerce', price: '$998', title: 'TechStore Pro', desc: 'High-converting landing page for gadget stores', color: 'from-blue-900/30 to-purple-900/30' },
  { id: 2, emoji: '📈', label: 'SaaS', tag: 'tag-saas', price: '$1398', title: 'Analytics Dashboard', desc: 'Clean SaaS landing with conversion focus', color: 'from-emerald-900/30 to-blue-900/30' },
  { id: 3, emoji: '🏠', label: 'Real Estate', tag: 'tag-realestate', price: '$1098', title: 'Luxury Estates', desc: 'Premium showcase for properties', color: 'from-purple-900/30 to-pink-900/30' },
  { id: 4, emoji: '🎓', label: 'Education', tag: 'tag-education', price: '$1198', title: 'EduPlatform', desc: 'Engaging layout for online courses', color: 'from-orange-900/30 to-red-900/30' },
  { id: 5, emoji: '🏥', label: 'Medicine', tag: 'tag-medicine', price: '$1298', title: 'Medicare Clinic', desc: 'Modern health and wellness portal', color: 'from-cyan-900/30 to-blue-900/30' },
  { id: 6, emoji: '💅', label: 'Beauty', tag: 'tag-beauty', price: '$1058', title: 'Beauty Studio', desc: 'Elegant salon and boutique theme', color: 'from-pink-900/30 to-rose-900/30' },
];

// Clones for infinite scrolling
const items = [
  ...originalTemplates.slice(-3),
  ...originalTemplates,
  ...originalTemplates.slice(0, 3)
];

const FirstLetterLarger: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;
  const first = text.charAt(0);
  const rest = text.slice(1);
  return (
    <>
      <span className="text-[1.25em] leading-none inline-block">{first}</span>
      {rest}
    </>
  );
};

export const Portfolio: React.FC<PortfolioProps> = ({ t }) => {
  const [currentIndex, setCurrentIndex] = useState(2); // Start so dot 1 shows 6,1,2
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [forcedActiveId, setForcedActiveId] = useState<number | null>(null);
  
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number>(0);
  const isMobile = useRef(false);

  useEffect(() => {
    isMobile.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
    setActiveCardId(null);
  }, []);

  const prevSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
    setActiveCardId(null);
  }, []);

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setCurrentIndex(index);
    setActiveCardId(null);
    setForcedActiveId(null);
  };

  const handleDotMouseEnter = (index: number) => {
    if (isMobile.current) return;
    setIsTransitioning(true);
    setCurrentIndex(index + 2);
    setIsPaused(true);
    
    // Find the template ID for this index (card that corresponds to the dot)
    const templateId = originalTemplates[index].id;
    setForcedActiveId(templateId);
    setActiveCardId(templateId);
  };

  const handleDotMouseDown = (index: number) => {
    setIsTransitioning(true);
    setCurrentIndex(index + 2);
    setIsPaused(true);
    
    // Find the template ID for this index (card that corresponds to the dot)
    const templateId = originalTemplates[index].id;
    setForcedActiveId(templateId);
    setActiveCardId(templateId);
  };

  const handleDotMouseUpOrLeave = () => {
    if (isMobile.current) return;
    setForcedActiveId(null);
    setActiveCardId(null);
    setIsPaused(false);
  };

  const handleDotClick = (index: number) => {
    // For mobile
    if (isMobile.current) {
      setIsTransitioning(true);
      setCurrentIndex(index + 2);
    }
  };

  // Jump back to start/end for infinite loop
  useEffect(() => {
    if (currentIndex >= originalTemplates.length + 2) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(2);
      }, 1200); // matching duration-1200
      return () => clearTimeout(timer);
    }
    if (currentIndex < 2) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(originalTemplates.length + 1);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  // Auto-play timer
  useEffect(() => {
    if (!isPaused && activeCardId === null && forcedActiveId === null) {
      autoPlayTimer.current = setInterval(nextSlide, 5000);
    } else {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    }
    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [isPaused, activeCardId, forcedActiveId, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - endX;
    
    if (Math.abs(diff) > 50) {
      setActiveCardId(null); // Swiping turns off active card
      setForcedActiveId(null);
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    
    setTimeout(() => {
      if (!activeCardId && !forcedActiveId) setIsPaused(false);
    }, 2000);
  };

  const handleCardClick = (id: number) => {
    if (isMobile.current) {
      if (activeCardId === id) {
        setActiveCardId(null);
        setForcedActiveId(null);
        setIsPaused(false);
      } else {
        setActiveCardId(id);
        setForcedActiveId(id);
        setIsPaused(true); // Stop scroll when card is "active-hovered"
      }
    }
  };

  const getActiveDot = () => {
    let index = currentIndex - 2;
    if (currentIndex >= originalTemplates.length + 2) index = 0;
    if (currentIndex < 2) index = originalTemplates.length - 1;
    
    // Safety clamp
    if (index < 0) return originalTemplates.length - 1;
    if (index >= originalTemplates.length) return 0;
    return index;
  };

  const renderPrice = (price: string) => {
    const rawNumeric = parseInt(price.replace('$', ''));
    const numericPrice = rawNumeric / 10;
    const multiplier = Number(t('price-multiplier'));
    const currency = t('currency');
    
    const finalValue = numericPrice * multiplier;
    
    // For UAH (multiplier > 1), round up and show no decimals
    if (multiplier > 1) {
      const roundedValue = Math.ceil(finalValue);
      return `${currency}${roundedValue.toLocaleString()}`;
    }
    
    // For USD (multiplier === 1), use 2 decimal places
    const formattedValue = finalValue.toFixed(2).replace('.', ',');
    return `${currency}${formattedValue}`;
  };

  return (
    <section id="portfolio" className="py-12 px-4 bg-dark-card/50 relative overflow-visible z-10 scroll-mt-[var(--header-height)]">
      <div className="container mx-auto">
        <div className="text-center mb-0">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4 gradient-text"
          >
            {t('portfolio-title')}
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            <div className="whitespace-pre-line">
              {t('portfolio-subtitle-start')}
              <span 
                onClick={() => setShowAll(true)}
                className="inline-block relative group cursor-pointer align-bottom"
              >
                <span className="group-hover:opacity-0 transition-opacity duration-300 gradient-text-pink-orange font-bold">
                  {t('portfolio-subtitle-mix')}
                </span>
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-neon-blue text-[10px] font-black uppercase tracking-widest drop-shadow-[0_0_8px_rgba(41,207,222,0.8)] whitespace-nowrap">
                  <FirstLetterLarger text={t('portfolio-detail-hover')} />
                </span>
              </span>
              {t('portfolio-subtitle-mid')}
              <span 
                onClick={() => setShowAll(true)}
                className="inline-block relative group cursor-pointer align-bottom"
              >
                <span className="group-hover:opacity-0 transition-opacity duration-300 gradient-text-blue-purple font-bold">
                  {t('portfolio-subtitle-end')}
                </span>
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-neon-blue text-[10px] font-black uppercase tracking-widest drop-shadow-[0_0_8px_rgba(41,207,222,0.8)] whitespace-nowrap">
                  <FirstLetterLarger text={t('portfolio-detail-hover')} />
                </span>
              </span>
            </div>
          </motion.div>
        </div>

        {/* Carousel Container */}
        <div 
          className="portfolio-carousel-container relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="portfolio-carousel-wrapper">
            <div 
              className={`flex ${isTransitioning ? 'transition-transform duration-1200 ease-in-out' : ''}`}
              style={{ transform: `translateX(-${currentIndex * (100 / (windowWidth < 768 ? 1 : windowWidth < 1024 ? 2 : 3))}%)` }}
            >
              {items.map((template, i) => {
                return (
                  <div 
                    key={`${template.id}-${i}`} 
                    className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4"
                    onClick={() => handleCardClick(template.id)}
                    onMouseEnter={() => {
                      if (!isMobile.current) {
                        setIsPaused(true);
                        setForcedActiveId(null);
                      }
                    }}
                    onMouseLeave={() => !isMobile.current && setIsPaused(false)}
                  >
                    <div 
                      className={`portfolio-card gradient-border rounded-3xl p-8 h-full bg-dark-bg group transition-all duration-500 relative z-10 
                        ${(activeCardId === template.id || forcedActiveId === template.id) ? 'active-hover' : ''}`}
                    >
                      <div className={`mb-6 h-48 bg-gradient-to-br ${template.color} rounded-2xl flex items-center justify-center relative overflow-hidden transition-transform duration-500 group-hover:scale-105 ${(activeCardId === template.id || forcedActiveId === template.id) ? 'scale-105' : ''}`}>
                        <span className="text-6xl" role="img" aria-label={template.label}>
                          {template.emoji}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4">
                        <span className="px-3 py-1 bg-neon-blue/10 text-neon-blue rounded-full text-xs font-bold uppercase tracking-wider">
                          <FirstLetterLarger text={template.label} />
                        </span>
                        <span className="text-2xl font-bold gradient-text whitespace-nowrap">{renderPrice(template.price)}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 group-hover:text-neon-blue transition-colors">
                        {template.title}
                      </h3>
                      <div className="relative overflow-hidden h-[2.6rem] mb-8">
                        <div className="float-right w-1/2 h-[1.3rem] pointer-events-none" />
                        <p className="text-gray-400 text-sm italic leading-[1.3rem]">
                          {t(`template${template.id}-desc`) || template.desc}
                        </p>
                      </div>
                      
                      <div className="flex gap-4">
                        <button className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm font-semibold">
                          {t('portfolio-demo-btn')}
                        </button>
                        <button className="flex-1 btn-primary py-3 rounded-xl text-sm font-bold">
                          {t('portfolio-buy-btn')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-1">
            {originalTemplates.map((_, i) => (
              <button
                key={i}
                onMouseEnter={() => handleDotMouseEnter(i)}
                onMouseDown={() => handleDotMouseDown(i)}
                onMouseUp={() => handleDotMouseUpOrLeave()}
                onMouseLeave={() => handleDotMouseUpOrLeave()}
                onClick={() => handleDotClick(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${getActiveDot() === i ? 'bg-neon-blue scale-125 shadow-[0_0_10px_rgba(41,207,222,0.5)]' : 'bg-gray-700 hover:bg-gray-500'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-4">
          <button 
            onClick={() => setShowAll(true)}
            className="portfolio-view-all-link group"
          >
            <span className="portfolio-view-all-text">{t('portfolio-view-all')}</span>
            <ArrowRight className="w-5 h-5 transition-transform portfolio-view-all-arrow" />
          </button>
        </div>
      </div>

      {/* Grid Modal */}
      <AnimatePresence>
        {showAll && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
          >
            <div className="absolute inset-0 bg-dark-bg/95 backdrop-blur-md" onClick={() => setShowAll(false)} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-7xl max-h-[90vh] bg-dark-card border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-dark-card/50 backdrop-blur-md sticky top-0 z-10">
                <h2 className="text-3xl font-bold gradient-text">{t('portfolio-modal-title')}</h2>
                <button 
                  onClick={() => setShowAll(false)}
                  className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {originalTemplates.map((template) => (
                    <div 
                      key={template.id} 
                      className="gradient-border rounded-3xl p-6 bg-dark-bg group hover:border-neon-blue transition-all"
                    >
                      <div className={`mb-4 h-40 bg-gradient-to-br ${template.color} rounded-xl flex items-center justify-center`}>
                        <span className="text-5xl">{template.emoji}</span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-neon-blue uppercase">
                          <FirstLetterLarger text={template.label} />
                        </span>
                        <span className="font-bold">{renderPrice(template.price)}</span>
                      </div>
                      <h4 className="font-bold text-lg mb-2">{template.title}</h4>
                      <div className="relative overflow-hidden h-[2.5rem] mb-4">
                        <div className="float-right w-1/2 h-[1.25rem] pointer-events-none" />
                        <p className="text-gray-400 text-xs leading-[1.25rem]">
                          {t(`template${template.id}-desc`) || template.desc}
                        </p>
                      </div>
                      <button className="w-full btn-primary py-2 rounded-xl text-sm font-bold">{t('portfolio-details-btn')}</button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
