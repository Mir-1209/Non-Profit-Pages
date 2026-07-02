import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Story } from '../data/stories';

export function StoriesCarousel({ stories }: { stories: Story[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const next = () => setCurrentIndex((c) => (c + 1) % stories.length);
  
  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stories.length]);

  return (
    <div className="relative overflow-hidden py-10">
      <div 
        ref={containerRef}
        className="flex gap-6 px-4 md:px-8 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{ transform: `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 24}px))` }}
      >
        {stories.map((story, i) => (
          <motion.div
            key={i}
            className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 group perspective-[1000px]"
          >
            <motion.div 
              className="h-full brutal-card bg-white p-8 flex flex-col justify-between"
              style={{ borderLeftWidth: '8px', borderLeftColor: story.color }}
              whileHover={{ rotateX: 2, rotateY: -2, z: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <p className="text-[16px] leading-[1.7] text-[var(--ink)] mb-8 font-[500]">
                "{story.quote}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div 
                  className="w-[46px] h-[46px] rounded-full flex items-center justify-center text-white font-[700] text-[18px]"
                  style={{ background: `linear-gradient(135deg, ${story.color}, var(--ink))` }}
                >
                  {story.name.charAt(0)}
                </div>
                <div>
                  <div className="font-[700] text-[15px]">{story.name}</div>
                  <div className="text-[13px] text-[var(--ink-faint)] font-[500]">{story.role} • {story.location}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-3 mt-10">
        {stories.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 rounded-full transition-all ${currentIndex === i ? 'w-10 bg-[var(--ink)]' : 'w-2 bg-[var(--line)]'}`}
            aria-label={`Go to story ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
