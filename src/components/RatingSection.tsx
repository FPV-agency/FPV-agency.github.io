import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { Star, MessageSquare, Send } from 'lucide-react';

interface RatingSectionProps {
  t: (key: string) => string;
  onAddFeedbackToContact?: (text: string) => void;
}

const Digit: React.FC<{ value: string }> = ({ value }) => (
  <div className="relative h-14 w-10 bg-black/60 border border-white/20 rounded-lg overflow-hidden flex items-center justify-center shadow-inner">
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="text-3xl font-black text-white"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  </div>
);

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

export const RatingSection: React.FC<RatingSectionProps> = ({ t, onAddFeedbackToContact }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1 });
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [addContacts, setAddContacts] = useState(false);
  const initialBaseCount = 6286;
  const [displayCount, setDisplayCount] = useState(initialBaseCount);

  const ratings = [1, 2, 3, 4, 5, 6];

  useEffect(() => {
    // Load persisted state
    const savedRating = localStorage.getItem('fpv-user-rating');
    const savedCount = localStorage.getItem('fpv-total-ratings');
    
    if (savedRating) {
      setRating(parseInt(savedRating));
    }
    
    if (savedCount) {
      setDisplayCount(parseInt(savedCount));
    } else {
      localStorage.setItem('fpv-total-ratings', initialBaseCount.toString());
    }
  }, []);

  const handleRatingSelect = (star: number) => {
    const newRating = rating === star ? 0 : star;
    
    // Update display count logic
    let newCount = displayCount;
    if (rating === 0 && newRating > 0) {
      // Just rated
      newCount = displayCount + 1;
    } else if (rating > 0 && newRating === 0) {
      // Un-rated
      newCount = Math.max(initialBaseCount, displayCount - 1);
    }
    
    setRating(newRating);
    setDisplayCount(newCount);
    
    // Persist immediately
    localStorage.setItem('fpv-user-rating', newRating.toString());
    localStorage.setItem('fpv-total-ratings', newCount.toString());
  };

  const handleRatingSubmit = async () => {
    if (rating === 0) return;
    
    // Send anonymous rating and review to the bot
    const ratingMessage = feedback.trim() 
      ? `Оцінка: ${rating}/6\nКоментар: ${feedback.trim()}`
      : `Оцінка: ${rating}/6 (Без коментаря)`;

    const payload = {
      name: "Анонімний відвідувач",
      contact: "Анонімно",
      type: "feedback",
      promo: "Нет",
      message: ratingMessage
    };

    try {
      let success = false;
      const isStaticHosting = window.location.hostname.includes('github.io') || 
                             window.location.hostname.includes('github.preview') ||
                             window.location.hash.includes('force-direct');

      if (!isStaticHosting) {
        try {
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (response.ok) {
            success = true;
          }
        } catch (err) {
          console.warn('API proxy error:', err);
        }
      }

      if (!success) {
        const gasUrl = "https://script.google.com/macros/s/AKfycbxRIGGNjIjSyNFcUr7cw93ZqMFmedpHy5c1GvvN2c84bdYFhdERbZfEXXUjJGFqKu2Y/exec";
        await fetch(gasUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        });
      }
    } catch (e) {
      console.error("Failed to submit rating to bot:", e);
    }
    
    // Also transfer to contact if they checked addContacts and there is text
    if (addContacts && onAddFeedbackToContact && feedback.trim()) {
      onAddFeedbackToContact(feedback);
    }
    
    alert(t('nav-portfolio').includes('По') ? 'Дякуємо за Вашу оцінку!' : 'Thank you for your rating!');
    setFeedback('');
  };

  const handleFeedbackTransfer = () => {
    if (onAddFeedbackToContact) {
      onAddFeedbackToContact(feedback);
    }
  };

  const renderPlaceholder = () => {
    const text = t('rating-feedback-placeholder');
    const parts = text.split(/(анонімні|anonymous)/gi);
    return (
      <div className="absolute top-8 left-8 pointer-events-none text-gray-600 text-lg leading-relaxed">
        {parts.map((part, i) => 
          (part.toLowerCase() === 'анонімні' || part.toLowerCase() === 'anonymous')
          ? <u key={i} className="decoration-neon-blue decoration-2 underline-offset-4">{part}</u> 
          : <span key={i}>{part}</span>
        )}
      </div>
    );
  };

  // Format with thousands separator: e.g. "6.286"
  const formattedCount = displayCount.toLocaleString('de-DE'); 
  const countChars = formattedCount.split('');

  return (
    <section ref={ref} id="ratings" className={`pt-12 pb-32 relative overflow-hidden scroll-mt-[var(--header-height)] ${!isInView ? 'pause-animations' : ''}`}>
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-0 w-full h-full bg-neon-blue/5 blur-[160px] rounded-full -translate-x-1/2 opacity-50" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-neon-violet/5 blur-[180px] rounded-full translate-x-1/4 opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-6 gradient-text-purple-pink"
          >
            {t('rating-title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            {t('rating-subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Stats & Selection Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[40px] flex flex-col justify-between"
          >
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-amber-400/20 p-3 rounded-2xl">
                  <Star className="text-amber-400 fill-amber-400" size={24} />
                </div>
                <h3 className="text-2xl font-bold gradient-text-blue-purple">{t('rating-stats-avg')}</h3>
              </div>
              
              <div className="flex items-baseline gap-2 mb-6 text-shadow-glow">
                <span className="text-7xl font-black gradient-text">4.7</span>
                <span className="text-gray-500 text-xl font-medium">/ 5.0</span>
              </div>

              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center gap-1.5 h-14">
                  {countChars.map((char, i) => {
                    if (i === countChars.length - 1) {
                      return <Digit key={i} value={char} />;
                    }
                    if (char === '.' || char === ',') {
                      return <span key={i} className="text-3xl font-black text-gray-500 self-end mb-1">.</span>;
                    }
                    return <span key={i} className="text-3xl font-black text-gray-500">{char}</span>;
                  })}
                  <span className="text-3xl font-black text-gray-500 ml-2">
                    {t('rating-stats-count')}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400 text-right">
                <FirstLetterLarger text={t('rating-your-label')} />
              </p>
              <div 
                className={`flex justify-between items-center bg-black/40 px-6 py-10 rounded-[32px] transition-all duration-500 shadow-inner border-2 ${
                  hover === 6 
                    ? 'active-hover !translate-y-0 !scale-100 !z-0 !bg-dark-bg transition-none' 
                    : hover > 0 
                      ? 'border-neon-blue' 
                      : 'border-white/5'
                }`}
                style={hover > 0 ? { 
                  boxShadow: `0 0 ${Math.min(hover, 5) * 10}px rgba(41,207,222,${Math.min(hover, 5) * 0.15})`,
                  borderColor: hover === 6 ? 'transparent' : `rgba(41,207,222,${0.3 + (Math.min(hover, 5) * 0.14)})` 
                } : {}}
                onMouseLeave={() => setHover(0)}
              >
                {ratings.map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingSelect(star)}
                    onMouseEnter={() => setHover(star)}
                    className="relative group transition-transform active:scale-95"
                  >
                    <Star 
                      size={32}
                      className={`transition-all duration-300 ${
                        star <= (hover || rating) 
                          ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]' 
                          : 'text-white/20'
                      }`}
                    />
                    {star === 6 && (
                      <span className={`absolute -top-1 -right-1 text-[10px] font-bold px-1 rounded-sm bg-amber-500 text-black pointer-events-none transition-opacity ${star <= (hover || rating) ? 'opacity-100' : 'opacity-40'}`}>
                        +
                      </span>
                    )}
                    {star === 6 && (
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-tighter">
                              <FirstLetterLarger text="5+ overall" />
                            </span>
                        </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex justify-between px-2 text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                <span><FirstLetterLarger text="Poor" /></span>
                <span><FirstLetterLarger text="Exceptional" /></span>
              </div>
            </div>
          </motion.div>

          {/* Feedback Form Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Feedback Form Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[40px] flex flex-col shadow-lg flex-grow h-full"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-neon-violet/20 p-3 rounded-2xl">
                  <MessageSquare className="text-neon-violet" size={24} />
                </div>
                <h3 className="text-2xl font-bold gradient-text-blue-purple">{t('rating-feedback-title')}</h3>
              </div>

              <div className="relative flex-grow flex flex-col gap-6">
                <div className="relative flex-grow min-h-[220px] sm:min-h-[260px]">
                  {!feedback && renderPlaceholder()}
                  <textarea
                    id="rating-feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full h-full min-h-[220px] sm:min-h-[260px] bg-black/40 border border-white/5 rounded-3xl p-8 text-white focus:outline-none focus:border-neon-violet/50 transition-colors resize-none text-lg relative z-0"
                  />
                </div>
                
                <div className="flex items-center justify-between pb-2">
                  <div 
                    className="flex items-center gap-3 transition-all duration-300 group cursor-pointer select-none"
                    onClick={() => {
                      const newVal = !addContacts;
                      setAddContacts(newVal);
                      if (newVal) handleFeedbackTransfer();
                    }}
                  >
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-300 ${
                      addContacts 
                      ? 'border-neon-blue bg-neon-blue/20 shadow-[0_0_15px_rgba(41,207,222,0.4)]' 
                      : 'border-white/20 group-hover:border-neon-blue/40'
                    }`}>
                      {addContacts && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-neon-blue"
                        />
                      )}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
                      addContacts ? 'text-neon-blue' : 'text-gray-500 group-hover:text-gray-300'
                    }`}>
                      {t('nav-portfolio').includes('По') ? 'додати контакти' : 'add contacts'}
                    </span>
                  </div>
                  
                  {!rating && (
                    <p className="text-xs text-neon-violet/60 font-bold uppercase tracking-widest italic animate-pulse">
                      * <FirstLetterLarger text="Оберіть оцінку" />
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Submit Button - Moved outside of the Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex justify-end w-full"
            >
              <button 
                id="rating-submit"
                onClick={handleRatingSubmit}
                className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-bold hover:scale-[1.03] active:scale-95 transition-all group disabled:opacity-50 ${
                  rating > 0 
                    ? 'bg-neon-blue text-white shadow-[0_0_25px_rgba(41,207,222,0.6)]' 
                    : 'bg-neon-violet text-white shadow-[0_0_15px_rgba(95,75,161,0.2)]'
                }`}
                disabled={!rating}
              >
                <span className={rating > 0 ? 'gradient-text-purple-pink' : ''}>
                  {t('rating-submit-btn')}
                </span>
                <div className={rating > 0 ? 'text-neon-pink' : ''}>
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
