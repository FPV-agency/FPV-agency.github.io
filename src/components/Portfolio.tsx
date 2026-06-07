import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { ArrowRight } from 'lucide-react';

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
  lang: string;
  onCoffeeClick?: () => void;
  onPromoClick?: () => void;
  onDemoClick?: (title: string) => void;
  onRegulationsSelect?: (pointNumber: number) => void;
}

const templatePriceInfo: Record<number, { priceUah: number; hasFrom: boolean }> = {
  1: { priceUah: 250000, hasFrom: true },
  2: { priceUah: 5999, hasFrom: false },
  3: { priceUah: 5999, hasFrom: false },
  4: { priceUah: 5999, hasFrom: false },
  5: { priceUah: 5999, hasFrom: false },
  6: { priceUah: 5999, hasFrom: false },
  7: { priceUah: 5999, hasFrom: false },
  8: { priceUah: 5999, hasFrom: false },
  9: { priceUah: 5999, hasFrom: false },
  10: { priceUah: 999, hasFrom: true },
  11: { priceUah: 9999, hasFrom: true },
  12: { priceUah: 25000, hasFrom: true },
};

const originalTemplates: Template[] = [
  { id: 1, emoji: '🛒', label: 'E-commerce', tag: 'tag-ecommerce', price: '$998', title: 'Modern Shop', desc: 'High-converting landing page for gadget stores', color: 'from-blue-900/30 to-purple-900/30' },
  { id: 2, emoji: '🎨', label: 'Showcase', tag: 'tag-saas', price: '$1398', title: 'Brand Portfolio', desc: 'Clean SaaS landing with conversion focus', color: 'from-emerald-900/30 to-blue-900/30' },
  { id: 3, emoji: '🏠', label: 'Property', tag: 'tag-realestate', price: '$1098', title: 'Realty Prime', desc: 'Premium showcase for properties', color: 'from-purple-900/30 to-pink-900/30' },
  { id: 4, emoji: '🎓', label: 'Education', tag: 'tag-education', price: '$1198', title: 'EduMaster Suite', desc: 'Engaging layout for online courses', color: 'from-orange-900/30 to-red-900/30' },
  { id: 5, emoji: '🏥', label: 'Healthcare', tag: 'tag-medicine', price: '$1298', title: 'Health & Wellness Hub', desc: 'Modern health and wellness portal', color: 'from-cyan-900/30 to-blue-900/30' },
  { id: 6, emoji: '💅', label: 'Beauty', tag: 'tag-beauty', price: '$1058', title: 'Glow Studio', desc: 'Elegant salon and boutique theme', color: 'from-pink-900/30 to-rose-900/30' },
  { id: 7, emoji: '🚚', label: 'Logistics', tag: 'tag-logistics', price: '$898', title: 'Cargo & Transport', desc: 'High-quality landing page for transportation and logistics.', color: 'from-amber-900/30 to-yellow-900/30' },
  { id: 8, emoji: '⚖️', label: 'Legal', tag: 'tag-legal', price: '$1150', title: 'Legal Consulting', desc: 'Professional landing page for lawyers and consulting firms.', color: 'from-slate-900/30 to-indigo-900/30' },
  { id: 9, emoji: '🛠️', label: 'Services', tag: 'tag-services', price: '$798', title: 'Household Services', desc: 'Clean design for appliance repair, cleaning and handyman services.', color: 'from-lime-900/30 to-emerald-950/30' },
  { id: 10, emoji: '👥', label: 'Clone', tag: 'tag-cloning', price: '$498', title: 'Website Clone', desc: 'Get a precise, lightning-fast copy of any existing website.', color: 'from-rose-900/30 to-pink-950/30' },
  { id: 11, emoji: '🍱', label: 'Mix-combo', tag: 'tag-mix-combo', price: '$1498', title: 'Fusion Ready Mix', desc: 'Combine any features and designs from different templates.', color: 'from-amber-950/30 to-orange-900/30' },
  { id: 12, emoji: '👑', label: 'Premium', tag: 'tag-premium-design', price: '$1998', title: 'Elite Executive', desc: 'Completely unique boutique design with high-end features.', color: 'from-violet-950/30 to-fuchsia-900/30' },
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

export const Portfolio: React.FC<PortfolioProps> = ({ t, lang, onCoffeeClick, onPromoClick, onDemoClick, onRegulationsSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(2); // Start so dot 1 shows template 12, 1, 2
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [forcedActiveId, setForcedActiveId] = useState<number | null>(null);
  const [isHoverScrolling, setIsHoverScrolling] = useState(false);

  const scrollInterval = useRef<NodeJS.Timeout | null>(null);
  const dotsContainerRef = useRef<HTMLDivElement | null>(null);
  const collapseBtnRef = useRef<HTMLButtonElement | null>(null);
  const openedTimeRef = useRef<number>(0);

  useEffect(() => {
    if (showAll) {
      openedTimeRef.current = Date.now();
    }
  }, [showAll]);

  useEffect(() => {
    if (!showAll) return;

    const handleScroll = () => {
      if (!collapseBtnRef.current) return;
      
      // Don't auto-collapse within 800ms of opening
      if (Date.now() - openedTimeRef.current < 800) {
        return;
      }

      const btnRect = collapseBtnRef.current.getBoundingClientRect();
      const headerEl = document.querySelector('header');
      const headerBottom = headerEl ? headerEl.getBoundingClientRect().bottom : 80;

      // If the top of the button rises above the bottom edge of the header
      if (btnRect.top < headerBottom) {
        setShowAll(false);
      }
    };

    let tick = false;
    const scrollListener = () => {
      if (!tick) {
        window.requestAnimationFrame(() => {
          handleScroll();
          tick = false;
        });
        tick = true;
      }
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  }, [showAll, t]);

  const handleDotsTouchMove = (e: React.TouchEvent) => {
    if (!dotsContainerRef.current) return;
    const touch = e.touches[0];
    const containerRect = dotsContainerRef.current.getBoundingClientRect();
    const x = touch.clientX - containerRect.left;
    const width = containerRect.width;
    
    // Calculate which dot is under touch
    const dotCount = originalTemplates.length;
    let dotIndex = Math.floor((x / width) * dotCount);
    if (dotIndex >= 0 && dotIndex < dotCount) {
      setIsTransitioning(true);
      setCurrentIndex(dotIndex + 2);
      setIsPaused(true);
      setActiveCardId(null);
      setForcedActiveId(null);
    }
  };

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

  const startHoverScroll = (direction: 'left' | 'right') => {
    setIsPaused(true);
    setIsHoverScrolling(true);
    
    const trigger = () => {
      if (direction === 'left') {
        prevSlide();
      } else {
        nextSlide();
      }
    };

    trigger();

    if (scrollInterval.current) clearInterval(scrollInterval.current);
    scrollInterval.current = setInterval(trigger, 3200);
  };

  const stopHoverScroll = () => {
    setIsPaused(false);
    setIsHoverScrolling(false);
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  };

  const getCardStatus = (i: number) => {
    const visibleCount = windowWidth < 768 ? 1 : windowWidth < 1024 ? 2 : 3;
    if (i < currentIndex) {
      return 'left-cropped';
    } else if (i >= currentIndex + visibleCount) {
      return 'right-cropped';
    } else {
      return 'middle';
    }
  };

  const handlePromoLinkClick = (id: number) => {
    const index = originalTemplates.findIndex(item => item.id === id);
    if (index !== -1) {
      setIsTransitioning(true);
      setCurrentIndex(index + 2);
      
      setForcedActiveId(id);
      setActiveCardId(id);
      setIsPaused(true);
      
      // Keep it highlighted for 4 seconds
      setTimeout(() => {
        setForcedActiveId(null);
        setActiveCardId(null);
        setIsPaused(false);
      }, 4000);
      
      const elem = document.getElementById('portfolio');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number>(0);
  const isMobile = useRef(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1 });

  useEffect(() => {
    isMobile.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (scrollInterval.current) clearInterval(scrollInterval.current);
    };
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
    setActiveCardId(null);
    setForcedActiveId(null);
  };

  const handleDotMouseLeave = () => {
    if (isMobile.current) return;
    setForcedActiveId(null);
    setActiveCardId(null);
    setIsPaused(false);
  };

  const handleDotClick = (index: number) => {
    setIsTransitioning(true);
    setCurrentIndex(index + 2);
    const templateId = originalTemplates[index].id;
    setForcedActiveId(templateId);
    setActiveCardId(templateId);
    setIsPaused(true);
  };

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== 'transform') return;
    
    if (currentIndex >= originalTemplates.length + 2) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - originalTemplates.length);
    } else if (currentIndex < 2) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + originalTemplates.length);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      // Use setTimeout to force a browser layout paint with transition: 'none'
      // before re-enabling smooth transition scrolling.
      // This completely solves the flashing/backward slide effects.
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // Watchdog timer to force snapped indexing when CSS transitions do not fire or are interrupted
  useEffect(() => {
    if (!isTransitioning) return;
    const duration = isHoverScrolling ? 12800 : 3200;
    const paddingBuffer = 150; // Safely wait slightly longer than transition duration
    
    const timer = setTimeout(() => {
      if (currentIndex >= originalTemplates.length + 2) {
        setIsTransitioning(false);
        setCurrentIndex((prev) => prev - originalTemplates.length);
      } else if (currentIndex < 2) {
        setIsTransitioning(false);
        setCurrentIndex((prev) => prev + originalTemplates.length);
      }
    }, duration + paddingBuffer);

    return () => clearTimeout(timer);
  }, [currentIndex, isTransitioning, isHoverScrolling]);

  // Auto-play timer with tab visibility checking to prevent offscreen runaway
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (autoPlayTimer.current) {
          clearInterval(autoPlayTimer.current);
          autoPlayTimer.current = null;
        }
      } else {
        if (!isPaused && activeCardId === null && forcedActiveId === null && isInView) {
          if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
          autoPlayTimer.current = setInterval(nextSlide, 6000);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (!isPaused && activeCardId === null && forcedActiveId === null && isInView && !document.hidden) {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
      autoPlayTimer.current = setInterval(nextSlide, 6000);
    } else {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
        autoPlayTimer.current = null;
      }
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
        autoPlayTimer.current = null;
      }
    };
  }, [isPaused, activeCardId, forcedActiveId, nextSlide, isInView]);

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
      setIsPaused(false);
      if (diff > 0) nextSlide();
      else prevSlide();
    } else {
      setTimeout(() => {
        if (!activeCardId && !forcedActiveId) setIsPaused(false);
      }, 50);
    }
  };

  const handleCardClick = (id: number) => {
    if (isMobile.current) {
      if (activeCardId === id || forcedActiveId === id) {
        setActiveCardId(null);
        setForcedActiveId(null);
        setIsPaused(false);
      } else {
        setActiveCardId(id);
        setForcedActiveId(id);
        setIsPaused(true);
      }
    }
  };

  const getActiveDot = () => {
    let index = (currentIndex - 2) % originalTemplates.length;
    if (index < 0) index += originalTemplates.length;
    return index;
  };

  const renderPrice = (templateId: number) => {
    const info = templatePriceInfo[templateId];
    if (!info) return '';

    const isUah = t('currency') === '₴';
    const currency = t('currency');
    
    if (isUah) {
      const prefix = info.hasFrom ? 'від ' : '';
      const formatted = info.priceUah.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      return `${prefix}${currency}${formatted}`;
    } else {
      const usdValue = info.priceUah / 45;
      const prefix = info.hasFrom ? 'from ' : '';
      const formatted = usdValue.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      });
      return `${prefix}${currency}${formatted}`;
    }
  };

  return (
    <section ref={ref} id="portfolio" className={`py-12 px-4 bg-dark-card/50 relative overflow-visible z-10 scroll-mt-[var(--header-height)] ${!isInView ? 'pause-animations' : ''}`}>
      <div className="container mx-auto">
        <div className="text-center mb-12">
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
            className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed"
          >
            <div className="whitespace-pre-line text-center">
              <span className="text-gray-200 font-medium">
                {t('portfolio-subtitle-start')}
              </span>
              {"\n"}
              <span className="text-white font-medium">
                {t('portfolio-subtitle-order')}
              </span>
              <span 
                onClick={() => handlePromoLinkClick(11)}
                className="inline-block relative group cursor-pointer align-middle mx-1.5 py-0.5 px-3 rounded-full border border-neon-pink/20 hover:border-neon-pink/60 bg-white/[0.02] hover:bg-neon-pink/5 shadow-[0_0_10px_rgba(206,71,123,0.12)] hover:shadow-[0_0_16px_rgba(206,71,123,0.35)] lg:py-0 lg:px-0 lg:mx-1 lg:rounded-none lg:border-none lg:bg-transparent lg:hover:bg-transparent lg:shadow-none lg:hover:shadow-none transition-all duration-300 select-none"
              >
                <span className="transition-all duration-300 lg:border-b lg:border-dashed lg:border-neon-pink/50 lg:hover:border-neon-pink lg:pb-0.5 gradient-text-pink-orange font-bold lg:hover:drop-shadow-[0_0_12px_rgba(206,71,123,0.95)] lg:group-hover:drop-shadow-[0_0_12px_rgba(206,71,123,0.95)]">
                  {t('portfolio-subtitle-mix')}
                </span>
              </span>
              <span className="text-white font-medium">
                {t('portfolio-subtitle-divider')}
              </span>
              <span 
                onClick={() => handlePromoLinkClick(12)}
                className="inline-block relative group cursor-pointer align-middle mx-1.5 py-0.5 px-3 rounded-full border border-neon-blue/20 hover:border-neon-blue/60 bg-white/[0.02] hover:bg-neon-blue/5 shadow-[0_0_10px_rgba(41,207,222,0.12)] hover:shadow-[0_0_16px_rgba(41,207,222,0.35)] lg:py-0 lg:px-0 lg:mx-1 lg:rounded-none lg:border-none lg:bg-transparent lg:hover:bg-transparent lg:shadow-none lg:hover:shadow-none transition-all duration-300 select-none"
              >
                <span className="transition-all duration-300 lg:border-b lg:border-dashed lg:border-neon-blue/50 lg:hover:border-neon-blue lg:pb-0.5 gradient-text-blue-purple font-bold lg:hover:drop-shadow-[0_0_12px_rgba(41,207,222,0.95)] lg:group-hover:drop-shadow-[0_0_12px_rgba(41,207,222,0.95)]">
                  {t('portfolio-subtitle-premium')}
                </span>
              </span>
              {"\n"}
              <span className="text-white font-medium">
                {t('portfolio-subtitle-or')}
              </span>
              <span 
                onClick={() => { if (onCoffeeClick) onCoffeeClick(); }}
                className="inline-block relative group cursor-pointer align-middle mx-1.5 py-0.5 px-3 rounded-full border border-neon-violet/20 hover:border-neon-violet/60 bg-white/[0.02] hover:bg-neon-violet/5 shadow-[0_0_10px_rgba(168,85,247,0.12)] hover:shadow-[0_0_16px_rgba(168,85,247,0.35)] lg:py-0 lg:px-0 lg:mx-1 lg:rounded-none lg:border-none lg:bg-transparent lg:hover:bg-transparent lg:shadow-none lg:hover:shadow-none transition-all duration-300 select-none"
              >
                <span className="transition-all duration-300 lg:border-b lg:border-dashed lg:border-neon-violet/50 lg:hover:border-neon-violet lg:pb-0.5 gradient-text font-extrabold lg:hover:drop-shadow-[0_0_12px_rgba(168,85,247,0.95)] lg:group-hover:drop-shadow-[0_0_12px_rgba(168,85,247,0.95)]">
                  {t('portfolio-subtitle-end')}
                </span>
              </span>
            </div>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {!showAll ? (
            <motion.div 
              key="carousel-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="portfolio-carousel-container relative"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Sides of the screen/wrapper hover zones that trigger scrolling */}
              <div 
                className="absolute left-0 top-0 bottom-12 w-16 md:w-20 z-30 cursor-w-resize hidden lg:block"
                onMouseEnter={() => startHoverScroll('left')}
                onMouseLeave={stopHoverScroll}
                onClick={prevSlide}
              />
              <div 
                className="absolute right-0 top-0 bottom-12 w-16 md:w-20 z-30 cursor-e-resize hidden lg:block"
                onMouseEnter={() => startHoverScroll('right')}
                onMouseLeave={stopHoverScroll}
                onClick={nextSlide}
              />

              <div className="portfolio-carousel-wrapper">
                <div 
                  className="flex"
                  onTransitionEnd={handleTransitionEnd}
                  style={{ 
                    transform: `translateX(-${currentIndex * (100 / (windowWidth < 768 ? 1 : windowWidth < 1024 ? 2 : 3))}%)`,
                    transition: isTransitioning 
                      ? (isHoverScrolling ? 'transform 12800ms linear' : 'transform 3200ms cubic-bezier(0.16, 1, 0.3, 1)')
                      : 'none'
                  }}
                >
                  {items.map((template, i) => {
                    const cardStatus = getCardStatus(i);
                    const isLeftCropped = cardStatus === 'left-cropped';
                    const isRightCropped = cardStatus === 'right-cropped';
                    const isMiddle = cardStatus === 'middle';
                    const originalIndex = originalTemplates.findIndex(item => item.id === template.id);

                    return (
                      <div 
                        key={`carousel-card-${template.id}-${i}`} 
                        className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4"
                        data-card-id={template.id}
                        data-original-index={originalIndex}
                        data-carousel-index={i}
                        onClick={() => {
                          if (isLeftCropped) {
                            prevSlide();
                          } else if (isRightCropped) {
                            nextSlide();
                          } else {
                            handleCardClick(template.id);
                          }
                        }}
                        onMouseEnter={() => {
                          if (!isMobile.current) {
                            setIsPaused(true);
                            setForcedActiveId(null);
                            setActiveCardId(null);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isMobile.current) {
                            setIsPaused(false);
                          }
                        }}
                      >
                        <div 
                          className={`rounded-3xl pt-6 px-6 pb-4 md:pt-7 md:px-7 md:pb-5 h-full bg-dark-bg transition-all duration-500 relative z-10 gradient-border flex flex-col justify-between
                            ${isMiddle ? 'portfolio-card group cursor-pointer' : 'opacity-30 scale-95 cursor-pointer pointer-events-auto'}
                            ${(isMiddle && (activeCardId === template.id || forcedActiveId === template.id)) ? 'active-hover scale-[1.05]' : ''}`}
                        >
                          <div>
                            {/* Hidden numbering for carousel safety against dynamic edits */}
                            <span className="sr-only" data-index={template.id} data-seq={originalIndex + 1}>
                              Card #{template.id} (Index: {originalIndex})
                            </span>

                            <div className={`mb-4 h-20 bg-gradient-to-br ${template.color} rounded-2xl flex items-center justify-center relative overflow-hidden transition-transform duration-500 ${isMiddle ? 'group-hover:scale-105' : ''} ${(isMiddle && (activeCardId === template.id || forcedActiveId === template.id)) ? 'scale-105' : ''}`}>
                              <span className="text-[4rem] md:text-[4.5rem] leading-none h-full flex items-center justify-center" role="img" aria-label={template.label}>
                                {template.emoji}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center mb-3 h-7">
                              <span className="px-3 py-1 bg-neon-blue/10 text-neon-blue rounded-full text-xs font-bold uppercase tracking-wider">
                                <FirstLetterLarger text={t(template.tag) || template.label} />
                              </span>
                              <span className="text-2xl font-bold gradient-text whitespace-nowrap">{renderPrice(template.id)}</span>
                            </div>
                            
                            <h3 className={`text-xl font-bold mb-2 transition-colors line-clamp-2 h-14 overflow-hidden ${isMiddle ? 'group-hover:text-neon-blue' : ''}`}>
                              {t(`template${template.id}-title`) || template.title}
                            </h3>
                            <div className="h-[3.75rem] mb-5 overflow-hidden">
                              <p className="text-gray-400 group-hover:text-white transition-colors duration-300 text-sm italic leading-5 line-clamp-3">
                                {t(`template${template.id}-short-desc`) || template.desc}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-4">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (template.id === 10 || template.id === 11 || template.id === 12) {
                                  if (onRegulationsSelect) {
                                    const pointNum = template.id === 10 ? 6 : template.id === 11 ? 7 : 8;
                                    onRegulationsSelect(pointNum);
                                  } else {
                                    setShowAll(true);
                                  }
                                } else {
                                  if (onDemoClick) {
                                    onDemoClick(t(`template${template.id}-title`) || template.title);
                                  }
                                }
                              }}
                              className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 hover:text-neon-blue hover:border-neon-blue/40 transition-all duration-300 text-sm font-semibold"
                            >
                              {(template.id === 10 || template.id === 11 || template.id === 12)
                                ? t('portfolio-detail-hover')
                                : t('portfolio-demo-btn')
                              }
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onDemoClick) {
                                  onDemoClick(t(`template${template.id}-title`) || template.title);
                                }
                              }}
                              className="flex-1 btn-primary py-3 rounded-xl text-sm font-bold"
                            >
                              {t('portfolio-buy-btn')}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Dots wrapper supporting swiping over dots */}
              <div 
                ref={dotsContainerRef}
                className="relative z-40 flex justify-center gap-3 mt-4 py-3 px-6 select-none touch-none"
                onTouchStart={(e) => {
                  setIsPaused(true);
                  handleDotsTouchMove(e);
                }}
                onTouchMove={handleDotsTouchMove}
                onTouchEnd={() => {
                  setIsPaused(false);
                }}
              >
                {originalTemplates.map((_, i) => (
                  <button
                    key={`dot-${i}`}
                    onMouseEnter={() => handleDotMouseEnter(i)}
                    onMouseLeave={handleDotMouseLeave}
                    onClick={() => handleDotClick(i)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${getActiveDot() === i ? 'bg-neon-blue scale-125 shadow-[0_0_10px_rgba(41,207,222,0.5)]' : 'bg-gray-700 hover:bg-gray-500'}`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="grid-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="py-12 md:py-16"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                {originalTemplates.map((template) => (
                  <div 
                    key={`grid-card-${template.id}`} 
                    className="gradient-border rounded-3xl pt-6 px-6 pb-4 md:pt-7 md:px-7 md:pb-5 bg-dark-bg group transition-all duration-500 relative z-10 hover:border-neon-blue hover:active-hover flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className={`mb-4 h-20 bg-gradient-to-br ${template.color} rounded-2xl flex items-center justify-center relative overflow-hidden transition-transform duration-500 group-hover:scale-105`}>
                        <span className="text-[4rem] md:text-[4.5rem] leading-none h-full flex items-center justify-center" role="img" aria-label={template.label}>
                          {template.emoji}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-3 h-7">
                        <span className="px-3 py-1 bg-neon-blue/10 text-neon-blue rounded-full text-xs font-bold uppercase tracking-wider">
                          <FirstLetterLarger text={t(template.tag) || template.label} />
                        </span>
                        <span className="text-2xl font-bold gradient-text whitespace-nowrap">{renderPrice(template.id)}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 group-hover:text-neon-blue transition-colors line-clamp-2 h-14 overflow-hidden">
                        {t(`template${template.id}-title`) || template.title}
                      </h3>
                      <div className="h-[5rem] mb-5 overflow-hidden">
                        <p className="text-gray-400 group-hover:text-white transition-colors duration-300 text-sm italic leading-5 line-clamp-4">
                          {t(`template${template.id}-desc`) || template.desc}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-auto">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (template.id === 10 || template.id === 11 || template.id === 12) {
                            if (onRegulationsSelect) {
                              const pointNum = template.id === 10 ? 6 : template.id === 11 ? 7 : 8;
                              onRegulationsSelect(pointNum);
                            } else {
                              if (onDemoClick) {
                                onDemoClick(t(`template${template.id}-title`) || template.title);
                              }
                            }
                          } else {
                            if (onDemoClick) {
                              onDemoClick(t(`template${template.id}-title`) || template.title);
                            }
                          }
                        }}
                        className="flex-1 py-2.5 px-1 rounded-xl border border-white/10 hover:bg-white/5 hover:text-neon-blue hover:border-neon-blue/40 transition-all duration-300 text-xs font-semibold whitespace-nowrap text-center"
                      >
                        {(template.id === 10 || template.id === 11 || template.id === 12)
                          ? t('portfolio-details-short')
                          : t('portfolio-demo-btn')
                        }
                      </button>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onDemoClick) {
                            onDemoClick(t(`template${template.id}-title`) || template.title);
                          }
                        }}
                        className="flex-1 btn-primary py-2.5 px-1 rounded-xl text-xs font-bold whitespace-nowrap text-center"
                      >
                        {t('portfolio-buy-btn')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center mt-4">
          <button 
            ref={collapseBtnRef}
            onClick={() => {
              if (showAll) {
                setShowAll(false);
              } else {
                setShowAll(true);
              }
              setTimeout(() => {
                const elem = document.getElementById('portfolio');
                if (elem) {
                  elem.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}
            className="portfolio-view-all-link group"
          >
            <span className="portfolio-view-all-text">
              {showAll ? t('portfolio-collapse') : t('portfolio-view-all')}
            </span>
            <ArrowRight className={`w-5 h-5 transition-transform portfolio-view-all-arrow ${showAll ? '-rotate-90 group-hover:-translate-y-1 group-hover:translate-x-0' : ''}`} />
          </button>
        </div>
      </div>
    </section>
  );
};
