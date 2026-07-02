import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Slide {
  id: string;
  gradient: string;
  icon: string;
  title: string;
  description: string;
}

interface PhotoSliderProps {
  slides: Slide[];
  layout?: 'overlay' | 'split';
  interval?: number;
  className?: string;
}

export function PhotoSlider({ slides, layout = 'overlay', interval = 4000, className = '' }: PhotoSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const next = () => setCurrent((c) => (c + 1) % slides.length);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (!isHovered) {
      timerRef.current = setInterval(next, interval);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current, isHovered, interval, slides.length]);

  if (layout === 'split') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-0 rounded-[var(--radius-xl)] overflow-hidden brutal-card ${className}`} 
           onMouseEnter={() => setIsHovered(true)} 
           onMouseLeave={() => setIsHovered(false)}>
        
        {/* Left: Image/Graphic Side */}
        <div className="relative aspect-square md:aspect-auto">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex items-center justify-center text-6xl"
              style={{ background: slides[current].gradient }}
            >
              {slides[current].icon}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Content Side */}
        <div className="bg-white p-8 md:p-12 flex flex-col justify-center relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-2xl font-[800] mb-4 tracking-[-0.015em]">{slides[current].title}</h3>
              <p className="text-[var(--ink-soft)] leading-relaxed text-[15.5px]">{slides[current].description}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-2 mt-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${current === i ? 'w-8 bg-[var(--ink)]' : 'w-2 bg-[var(--line)]'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Overlay layout
  return (
    <div 
      className={`relative rounded-[var(--radius-xl)] overflow-hidden brutal-card ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ minHeight: '400px' }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex flex-col items-center justify-center pb-24 text-8xl"
          style={{ background: slides[current].gradient }}
        >
          {slides[current].icon}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-0 p-8 pt-32 bg-gradient-to-t from-[var(--ink)] to-transparent text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-2xl font-[800] mb-2">{slides[current].title}</h3>
            <p className="text-white/80 text-[15px] max-w-[600px]">{slides[current].description}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-2 mt-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${current === i ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <>
            <motion.button
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 text-white backdrop-blur flex items-center justify-center hover:bg-black/40 transition-colors"
              onClick={prev}
            >
              ←
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 text-white backdrop-blur flex items-center justify-center hover:bg-black/40 transition-colors"
              onClick={next}
            >
              →
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
