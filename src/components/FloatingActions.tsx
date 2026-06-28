import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, MessageCircle } from 'lucide-react';

interface FloatingActionsProps {
  lang: 'ua' | 'en';
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ lang }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activePulse, setActivePulse] = useState<'call' | 'chat' | null>(null);
  const [isHoveredCall, setIsHoveredCall] = useState(false);
  const [isHoveredChat, setIsHoveredChat] = useState(false);

  // 1. Show after 30 seconds of user presence on the page
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  // 2. Pulse cycle: 1 pulse of call button, 5 sec pause, 1 pulse of chat button, 5 sec pause, repeat
  useEffect(() => {
    if (!isVisible) return;

    const runWave = () => {
      // Step A: Trigger Call button pulse immediately
      setActivePulse('call');

      // Clear call pulse after 1.5 seconds (allowing anim to complete)
      const stopCall = setTimeout(() => {
        setActivePulse(null);
      }, 1500);

      // Step B: Wait 5 seconds after Call pulse ends -> 1.5s + 5s = 6.5s limit
      const startChat = setTimeout(() => {
        setActivePulse('chat');
      }, 6500);

      // Clear chat pulse after 1.5s -> 6.5s + 1.5s = 8s limit
      const stopChat = setTimeout(() => {
        setActivePulse(null);
      }, 8000);

      return { stopCall, startChat, stopChat };
    };

    // Run first cycle
    let activeTimers = runWave();

    // Total period pattern: 1.5s call pulse + 5s pause + 1.5s chat pulse + 5s pause = 13 seconds
    const interval = setInterval(() => {
      activeTimers = runWave();
    }, 13000);

    return () => {
      clearInterval(interval);
      clearTimeout(activeTimers.stopCall);
      clearTimeout(activeTimers.startChat);
      clearTimeout(activeTimers.stopChat);
    };
  }, [isVisible]);

  // Handle click on chat button to open Telegram chat by ID
  const handleChatClick = () => {
    window.location.href = 'tg://user?id=7404302311';
  };

  if (!isVisible) return null;

  return (
    <div 
      id="floating-actions-container"
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[250] flex flex-col gap-4 items-end select-none pointer-events-none"
    >
      <AnimatePresence>
        {/* CALL ACTION (Violet / Purple) */}
        <motion.div
          key="floating-phone-action"
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.8 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative flex items-center group pointer-events-auto"
          onMouseEnter={() => setIsHoveredCall(true)}
          onMouseLeave={() => setIsHoveredCall(false)}
        >
          {/* Sliding Window */}
          <motion.div
            initial={{ x: 15, opacity: 0, scale: 0.95 }}
            animate={{ 
              x: isHoveredCall ? 0 : 15, 
              opacity: isHoveredCall ? 1 : 0, 
              scale: isHoveredCall ? 1 : 0.95 
            }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute right-16 mr-2 bg-dark-card border border-white/10 px-4 py-2 bg-opacity-95 backdrop-blur-md rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] text-white font-bold tracking-tight text-sm whitespace-nowrap cursor-pointer hover:border-neon-violet/40 transition-colors"
            style={{ pointerEvents: isHoveredCall ? 'auto' : 'none' }}
            onClick={() => window.open('tel:+380668542676', '_self')}
          >
            +38 066 854 26 76
          </motion.div>

          {/* Glowing Animated Outer Pulse Rings */}
          {activePulse === 'call' && (
            <>
              <motion.div
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full bg-neon-violet/40 -z-10"
              />
              <motion.div
                initial={{ scale: 1, opacity: 0.9 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 1.1, ease: 'easeOut', delay: 0.25 }}
                className="absolute inset-0 rounded-full bg-neon-violet/20 -z-10"
              />
            </>
          )}

          {/* Button Element */}
          <motion.a
            href="tel:+380668542676"
            className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-neon-violet text-white shadow-[0_0_20px_rgba(95,75,161,0.5)] border border-white/10 cursor-pointer"
            animate={activePulse === 'call' ? { scale: [1, 1.15, 1.02, 1.1, 1] } : { scale: 1 }}
            whileHover={{ scale: 1.08, shadow: '0_0_28px_rgba(95,75,161,0.7)' }}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          >
            <Phone className="w-6 h-6 md:w-7 md:h-7 animate-none" />
          </motion.a>
        </motion.div>

        {/* CHAT ACTION (Neon Blue / Cyan) */}
        <motion.div
          key="floating-message-action"
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.8 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
          className="relative flex items-center group pointer-events-auto"
          onMouseEnter={() => setIsHoveredChat(true)}
          onMouseLeave={() => setIsHoveredChat(false)}
        >
          {/* Sliding Window */}
          <motion.div
            initial={{ x: 15, opacity: 0, scale: 0.95 }}
            animate={{ 
              x: isHoveredChat ? 0 : 15, 
              opacity: isHoveredChat ? 1 : 0, 
              scale: isHoveredChat ? 1 : 0.95 
            }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute right-16 mr-2 bg-dark-card border border-white/10 px-4 py-2 bg-opacity-95 backdrop-blur-md rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] text-white font-bold tracking-tight text-sm whitespace-nowrap cursor-pointer hover:border-neon-blue/40 transition-colors"
            style={{ pointerEvents: isHoveredChat ? 'auto' : 'none' }}
            onClick={handleChatClick}
          >
            {lang === 'ua' ? 'Написати в Telegram' : 'Message on Telegram'}
          </motion.div>

          {/* Glowing Animated Outer Pulse Rings */}
          {activePulse === 'chat' && (
            <>
              <motion.div
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full bg-neon-blue/40 -z-10"
              />
              <motion.div
                initial={{ scale: 1, opacity: 0.9 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 1.1, ease: 'easeOut', delay: 0.25 }}
                className="absolute inset-0 rounded-full bg-neon-blue/20 -z-10"
              />
            </>
          )}

          {/* Button Element */}
          <motion.button
            onClick={handleChatClick}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-neon-blue text-[#0D1520] shadow-[0_0_20px_rgba(41,207,222,0.4)] border border-white/10 cursor-pointer focus:outline-none"
            animate={activePulse === 'chat' ? { scale: [1, 1.15, 1.02, 1.1, 1] } : { scale: 1 }}
            whileHover={{ scale: 1.08, shadow: '0_0_28px_rgba(41,207,222,0.6)' }}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          >
            <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
