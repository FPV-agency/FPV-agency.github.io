import { useState, useEffect } from 'react';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let isTicking = false;

    const updateScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      
      setProgress(scrollProgress);
      isTicking = false;
    };

    const onScroll = () => {
      if (!isTicking) {
        window.requestAnimationFrame(updateScroll);
        isTicking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial calculation
    updateScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return progress;
}
