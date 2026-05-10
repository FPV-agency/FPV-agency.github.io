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
  { id: 1, emoji: '🛒', label: 'E-commerce', tag: 'E-commerce', price: '$499', title: 'TechStore Pro', desc: 'High-converting landing page for gadget stores', color: 'from-blue-900/30 to-purple-900/30' },
  { id: 2, emoji: '📈', label: 'SaaS', tag: 'SaaS', price: '$699', title: 'Analytics Dashboard', desc: 'Clean SaaS landing with conversion focus', color: 'from-emerald-900/30 to-blue-900/30' },
  { id: 3, emoji: '🏠', label: 'Real Estate', tag: 'Real Estate', price: '$549', title: 'Luxury Estates', desc: 'Premium showcase for properties', color: 'from-purple-900/30 to-pink-900/30' },
  { id: 4, emoji: '🎓', label: 'Education', tag: 'Education', price: '$599', title: 'EduPlatform', desc: 'Engaging layout for online courses', color: 'from-orange-900/30 to-red-900/30' },
  { id: 5, emoji: '🏥', label: 'Medicine', tag: 'Medicine', price: '$649', title: 'MediCare Clinic', desc: 'Modern health and wellness portal', color: 'from-cyan-900/30 to-blue-900/30' },
  { id: 6, emoji: '💅', label: 'Beauty', tag: 'Beauty', price: '$529', title: 'Beauty Studio', desc: 'Elegant salon and boutique theme', color: 'from-pink-900/30 to-rose-900/30' },
];

// Clones for infinite scrolling
const items = [
  ...originalTemplates.slice(-3),
  ...originalTemplates,
  ...originalTemplates.slice(0, 3)
];

export const Portfolio: React.FC<PortfolioProps> = ({ t }) => {
  const [currentIndex, setCurrentIndex] = useState(3); // Start at first original item
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  
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
  };

  // Jump back to start/end for infinite loop
  useEffect(() => {
    if (currentIndex >= originalTemplates.length + 3) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(3);
      }, 700); // matching duration-700
      return () => clearTimeout(timer);
    }
    if (currentIndex <= 0) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(originalTemplates.length);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  // Auto-play timer
  useEffect(() => {
    if (!isPaused && activeCardId === null) {
      autoPlayTimer.current = setInterval(nextSlide, 4000);
    } else {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    }
    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [isPaused, activeCardId, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - endX;
    
    if (Math.abs(diff) > 50) {
      setActiveCardId(null); // Swiping turns off active card
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    
    setTimeout(() => {
      if (!activeCardId) setIsPaused(false);
    }, 2000);
  };

  const handleCardClick = (id: number) => {
    if (isMobile.current) {
      if (activeCardId === id) {
        setActiveCardId(null);
        setIsPaused(false);
      } else {
        setActiveCardId(id);
        setIsPaused(true); // Stop scroll when card is "active-hovered"
      }
    }
  };

  const getActiveDot = () => {
    let index = currentIndex - 3;
    if (index < 0) index = originalTemplates.length - 1;
    if (index >= originalTemplates.length) index = 0;
    return index;
  };

  return (
    <section id="portfolio" className="py-12 px-4 bg-dark-card/50 relative overflow-visible z-10">
      <div className="container mx-auto">
        <div className="text-center mb-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4 gradient-text"
          >
            {t('portfolio-title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            {t('portfolio-subtitle')}
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div 
          className="portfolio-carousel-container relative"
          onMouseEnter={() => !isMobile.current && setIsPaused(true)}
          onMouseLeave={() => !isMobile.current && setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="portfolio-carousel-wrapper overflow-hidden pt-12">
            <div 
              className={`flex ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
              style={{ transform: `translateX(-${currentIndex * (100 / (windowWidth < 768 ? 1 : windowWidth < 1024 ? 2 : 3))}%)` }}
            >
              {items.map((template, i) => (
                <div 
                  key={`${template.id}-${i}`} 
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4"
                  onClick={() => handleCardClick(template.id)}
                >
                  <div 
                    className={`gradient-border rounded-3xl p-8 h-full bg-dark-bg group transition-all duration-500 relative z-10 
                      ${activeCardId === template.id ? 'active-hover' : 'hover:active-hover'}`}
                  >
                    <div className={`mb-6 h-48 bg-gradient-to-br ${template.color} rounded-2xl flex items-center justify-center relative overflow-hidden transition-transform duration-500 group-hover:scale-105 ${activeCardId === template.id ? 'scale-105' : ''}`}>
                      <span className="text-6xl" role="img" aria-label={template.label}>
                        {template.emoji}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="px-3 py-1 bg-neon-blue/10 text-neon-blue rounded-full text-xs font-bold uppercase tracking-wider">
                        {template.tag}
                      </span>
                      <span className="text-2xl font-bold gradient-text">{template.price}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 group-hover:text-neon-blue transition-colors">
                      {template.title}
                    </h3>
                    <p className="text-gray-400 mb-8 text-sm italic">
                      {template.desc}
                    </p>
                    
                    <div className="flex gap-4">
                      <button className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm font-semibold">
                        Demo
                      </button>
                      <button className="flex-1 btn-primary py-3 rounded-xl text-sm font-bold">
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-12">
            {originalTemplates.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i + 3)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${getActiveDot() === i ? 'bg-neon-blue scale-125 shadow-[0_0_10px_rgba(41,207,222,0.5)]' : 'bg-gray-700 hover:bg-gray-500'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-16 pb-12">
          <button 
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 text-neon-blue hover:text-neon-violet transition-colors font-bold text-lg group"
          >
            <span>Переглянути всі шаблони</span>
            <ArrowRight className="transition-transform group-hover:translate-x-2" />
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
                <h2 className="text-3xl font-bold gradient-text">Всі шаблони</h2>
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
                        <span className="text-xs font-bold text-neon-blue uppercase">{template.tag}</span>
                        <span className="font-bold">{template.price}</span>
                      </div>
                      <h4 className="font-bold text-lg mb-2">{template.title}</h4>
                      <p className="text-gray-400 text-xs mb-4">{template.desc}</p>
                      <button className="w-full btn-primary py-2 rounded-xl text-sm font-bold">Детальніше</button>
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
