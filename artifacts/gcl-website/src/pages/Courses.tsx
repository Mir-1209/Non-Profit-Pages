import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { courses } from '../data/courses';

export function Courses() {
  return (
    <main className="pb-24 pt-[120px] bg-[var(--paper-alt)] min-h-screen">
      <div className="max-w-[1240px] mx-auto px-8">
        
        <div className="mb-16 max-w-[800px]">
          <h1 className="font-[800] text-[clamp(40px,6vw,72px)] leading-[1] tracking-[-0.03em] mb-6 uppercase">
            Curriculum
          </h1>
          <p className="text-[18px] text-[var(--ink-soft)] leading-[1.6]">
            Open-access modules built on behavioral economics. Choose a course to dive deep into the psychology of money.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={course.slug}
            >
              <Link href={`/courses/${course.slug}`} className="block h-full rounded-[16px] overflow-hidden bg-white border-[2.5px] border-[var(--ink)] shadow-[7px_7px_0px_var(--ink)] transition-all hover:shadow-[10px_10px_0px_var(--ink)] hover:-translate-y-1 hover:-translate-x-1 flex flex-col">
                <div className={`h-[180px] relative flex items-end p-5 border-b-[2.5px] border-[var(--ink)] shrink-0 ${course.color === 't1' ? 'bg-gradient-to-br from-[#dbe4ff] to-[#c9b8ff]' : course.color === 't2' ? 'bg-gradient-to-br from-[#f1c9f7] to-[#ffd3ea]' : 'bg-gradient-to-br from-[#c7f0ff] to-[#c3e3ff]'}`}>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-5xl opacity-40">
                    {course.tag === 'Mindset' ? '🧠' : course.tag === 'Investments' ? '📈' : '🎬'}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h4 className="font-[800] text-[20px] mb-3 tracking-[-0.01em]">{course.title}</h4>
                  <p className="text-[14px] text-[var(--ink-soft)] leading-[1.6] mb-6 flex-1">
                    {course.modules[0].description} {course.modules.length > 1 && course.modules[1].description}
                  </p>
                  <div className="flex justify-between items-center text-[13px] text-[var(--ink-faint)] font-[700] pt-4 border-t border-[var(--line)]">
                    <span className="text-[var(--violet)] uppercase tracking-wider">{course.level}</span>
                    <span>{course.duration}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </main>
  );
}
