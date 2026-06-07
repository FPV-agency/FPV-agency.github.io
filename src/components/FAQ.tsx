import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronDown, HelpCircle, Layers, CreditCard, Sparkles } from 'lucide-react';
import { faqCategories } from '../data/faqData';

interface FAQProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

export const FAQ: React.FC<FAQProps> = ({ isOpen, onClose, lang }) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('process');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'process':
        return <Layers className="w-5 h-5 text-neon-blue" />;
      case 'terms-prices':
        return <CreditCard className="w-5 h-5 text-neon-pink" />;
      case 'tech':
        return <Sparkles className="w-5 h-5 text-neon-violet" />;
      default:
        return <HelpCircle className="w-5 h-5 text-neon-blue" />;
    }
  };

  const currentCategory = faqCategories.find((cat) => cat.id === activeCategoryId) || faqCategories[0];

  const handleToggleItem = (itemId: string) => {
    setExpandedItemId((prev) => (prev === itemId ? null : itemId));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="faq-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
        >
          {/* Backdrop blur click to close */}
          <div
            id="faq-backdrop"
            className="absolute inset-0 bg-dark-bg/95 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            id="faq-modal-container"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="relative w-full max-w-4xl max-h-[85vh] bg-dark-card border border-white/10 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl z-10"
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-dark-card/50 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-8 h-8 text-neon-blue animate-pulse" />
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold gradient-text-blue-purple">
                    {lang === 'ua' ? 'Довідковий центр FPV' : 'FPV Help Center'}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    {lang === 'ua' 
                      ? 'Відповіді на часті запитання щодо нашого процесу розробки' 
                      : 'Answers to frequently asked questions about our pipeline'}
                  </p>
                </div>
              </div>
              <button
                id="faq-close-button"
                onClick={onClose}
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:text-white transition-all text-gray-400 focus:outline-none"
                aria-label="Close FAQ dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Layout content split: Tabs & Accordion */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row pb-6">
              {/* Left sidebar: Tabs */}
              <div className="p-4 md:p-6 border-b md:border-b-0 md:border-r border-white/5 flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible no-scrollbar shrink-0 md:w-56">
                {faqCategories.map((cat) => {
                  const isActive = activeCategoryId === cat.id;
                  const title = lang === 'ua' ? cat.titleUa : cat.titleEn;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategoryId(cat.id);
                        setExpandedItemId(null);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm whitespace-nowrap text-left w-full cursor-pointer
                        ${isActive 
                          ? 'bg-white/[0.04] text-white border-l-2 border-neon-blue shadow-[inset_1px_0_10px_rgba(41,207,222,0.05)]' 
                          : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.01]'}`}
                    >
                      {getCategoryIcon(cat.id)}
                      <span>{title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right content: Accordion items */}
              <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
                <div className="space-y-4">
                  {currentCategory.items.map((item) => {
                    const isExpanded = expandedItemId === item.id;
                    const question = lang === 'ua' ? item.questionUa : item.questionEn;
                    const answer = lang === 'ua' ? item.answerUa : item.answerEn;
                    return (
                      <div
                        key={item.id}
                        className={`border border-white/5 rounded-2xl bg-dark-bg/30 transition-all duration-300 overflow-hidden
                          ${isExpanded ? 'border-neon-blue/20 bg-dark-bg/60 shadow-[0_0_15px_rgba(41,207,222,0.02)]' : ''}`}
                      >
                        <button
                          onClick={() => handleToggleItem(item.id)}
                          className="w-full px-5 py-4 flex justify-between items-center text-left hover:bg-white/[0.01] transition-all cursor-pointer font-bold text-gray-200 hover:text-white"
                        >
                          <span className="text-sm md:text-base leading-snug">{question}</span>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-gray-400 shrink-0 ml-3"
                          >
                            <ChevronDown className="w-5 h-5" />
                          </motion.div>
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: 'easeInOut' }}
                            >
                              <div className="px-5 pb-5 pt-1 text-sm text-gray-400 whitespace-pre-line leading-relaxed border-t border-white/[0.02]">
                                {answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
