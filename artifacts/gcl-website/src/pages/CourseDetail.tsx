import React from 'react';
import { useRoute } from 'wouter';
import { motion } from 'framer-motion';
import { courses } from '../data/courses';
import { PhotoSlider } from '../components/PhotoSlider';

export function CourseDetail() {
  const [, params] = useRoute('/courses/:slug');
  const course = courses.find(c => c.slug === params?.slug);

  if (!course) {
    return <div className="min-h-screen flex items-center justify-center font-[800] text-2xl">Course not found.</div>;
  }

  const slides = [
    {
      id: "c1",
      gradient: course.color === 't1' ? 'linear-gradient(135deg, #dbe4ff, #c9b8ff)' : course.color === 't2' ? 'linear-gradient(135deg, #f1c9f7, #ffd3ea)' : 'linear-gradient(135deg, #c7f0ff, #c3e3ff)',
      icon: "🧠",
      title: "Master the Concepts",
      description: "Understand the core psychological principles driving financial behavior."
    },
    {
      id: "c2",
      gradient: "linear-gradient(135deg, var(--blue), var(--violet))",
      icon: "🛠️",
      title: "Apply Frameworks",
      description: "Translate theory into immediate, practical actions in your daily life."
    },
    {
      id: "c3",
      gradient: "linear-gradient(135deg, var(--violet), var(--magenta))",
      icon: "📈",
      title: "Build Systems",
      description: "Create resilient financial systems that don't rely on willpower alone."
    }
  ];

  return (
    <main className="pb-24 pt-[100px]">
      {/* Hero */}
      <div className="max-w-[1000px] mx-auto px-8 mb-16 text-center">
        <span className="inline-block text-[12px] font-[800] uppercase px-4 py-2 rounded-full bg-[var(--pill-bg)] text-[var(--pill-ink)] mb-6 tracking-wider">
          {course.tag} • {course.level}
        </span>
        <h1 className="font-[800] text-[clamp(36px,5vw,64px)] leading-[1.05] tracking-[-0.02em] mb-6">
          {course.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-[var(--ink-soft)] font-[500]">
          <span>⏱️ {course.duration}</span>
          <span>•</span>
          <span>Open Enrollment</span>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-8">
        <PhotoSlider slides={slides} layout="split" className="mb-20" />

        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-16">
          {/* Main Content */}
          <div>
            <h3 className="font-[800] text-2xl mb-6">Course Modules</h3>
            <div className="space-y-4 mb-16">
              {course.modules.map((mod, i) => (
                <div key={i} className="bg-white border-[2px] border-[var(--line)] rounded-[16px] p-6">
                  <h4 className="font-[800] text-[16px] mb-2">{mod.title}</h4>
                  <p className="text-[var(--ink-soft)] text-[14.5px]">{mod.description}</p>
                </div>
              ))}
            </div>

            <h3 className="font-[800] text-2xl mb-6">Instructors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {course.instructors.map((inst, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-[2px] border-[var(--line)] rounded-[16px]">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--blue)] to-[var(--violet)] flex items-center justify-center text-white font-bold text-lg">
                    {inst.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-[800] text-[15px]">{inst.name}</div>
                    <div className="text-[13px] text-[var(--ink-faint)] font-[500]">{inst.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 relative">
            <div className="sticky top-[100px] bg-[var(--paper-alt)] rounded-[20px] p-8 brutal-card">
              <div className="text-3xl font-[800] mb-2">Free</div>
              <p className="text-[14px] text-[var(--ink-soft)] mb-6 border-b border-[var(--line)] pb-6">
                All GCL digital courses are completely free and open access.
              </p>
              
              <ul className="space-y-4 text-[14px] font-[500] mb-8">
                <li className="flex gap-3"><span>✅</span> Self-paced learning</li>
                <li className="flex gap-3"><span>✅</span> Video lectures & transcripts</li>
                <li className="flex gap-3"><span>✅</span> Community forum access</li>
                <li className="flex gap-3"><span>✅</span> Digital certificate</li>
              </ul>
              
              <button className="btn btn-dark w-full">Enroll Now</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
