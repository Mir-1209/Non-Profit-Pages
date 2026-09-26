import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { EASE } from './primitives';

type Question = {
  id: string;
  prompt: string;
  a: string;
  b: string;
  /** Which answer most people give. */
  common: 'a' | 'b';
  bias: string;
  explain: string;
  lesson: string;
};

const QUESTIONS: Question[] = [
  {
    id: 'present',
    prompt: 'Someone offers you $100 today — or $110 in one week.',
    a: '$100 today',
    b: '$110 next week',
    common: 'a',
    bias: 'Present bias',
    explain:
      'Waiting seven days earns you 10%. Repeated weekly for a year, that is a return of over 14,000%. Our brains overweight “now” so heavily that most people still take the $100.',
    lesson: 'Automate the patient choice before the impatient you shows up.',
  },
  {
    id: 'loss',
    prompt: 'A coin flip: heads, you win $150. Tails, you lose $100.',
    a: 'Flip the coin',
    b: 'Walk away',
    common: 'b',
    bias: 'Loss aversion',
    explain:
      'On average the bet pays +$25 per flip — yet most people refuse it. Losses feel roughly twice as painful as equal gains feel good (Kahneman & Tversky, 1979).',
    lesson: 'Judge a decision by its expected value, not by how the worst case feels.',
  },
  {
    id: 'sunk',
    prompt: 'You paid $40 for a concert ticket. The day comes; you are exhausted and it is pouring with rain.',
    a: 'Go anyway — I paid',
    b: 'Stay home',
    common: 'a',
    bias: 'Sunk-cost fallacy',
    explain:
      'The $40 is gone whichever you choose. The only real question is which evening you would rather have — but the money already spent pulls most of us out the door.',
    lesson: 'Past spending is not a reason. Decide on what happens next.',
  },
];

/** A three-question interactive: meet the biases that run your wallet. */
export function BiasLab() {
  const [answers, setAnswers] = useState<Record<string, 'a' | 'b'>>({});
  const [idx, setIdx] = useState(0);
  const q = QUESTIONS[idx];
  const answered = answers[q.id];
  const matched = Object.entries(answers).filter(([id, v]) => QUESTIONS.find((x) => x.id === id)?.common === v).length;
  const done = Object.keys(answers).length === QUESTIONS.length;

  return (
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-signal/15 px-3.5 py-1.5 text-[13px] font-[620] tracking-[-0.005em]">
          <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_10px_rgba(58,169,255,0.9)]" />
          <span>Bias lab — try it</span>
        </div>
        <h2 className="display text-[clamp(64px,8.5vw,150px)]">
          Your brain
          <br />
          <span className="serif normal-case italic tracking-[-0.03em] text-signal">on</span> money.
        </h2>
        <p className="mt-6 max-w-[440px] text-[17px] leading-relaxed text-mute">
          This is how every GCL workshop begins: not with a formula, but with a choice. Answer honestly — there is no score, only a mirror.
        </p>
        <div className="mt-10 flex gap-2" role="tablist" aria-label="Questions">
          {QUESTIONS.map((x, i) => (
            <button
              key={x.id}
              role="tab"
              aria-selected={i === idx}
              onClick={() => setIdx(i)}
              className={`mono rounded-full border px-4 py-2 transition-colors ${i === idx ? 'border-ink bg-ink text-paper' : 'rule hover:border-ink'}`}
            >
              {String(i + 1).padStart(2, '0')} {answers[x.id] ? '●' : '○'}
            </button>
          ))}
        </div>
        <AnimatePresence>
          {done && (
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="serif mt-8 max-w-[440px] text-[26px] leading-tight italic">
              You answered like most people on {matched} of {QUESTIONS.length}. {matched > 0 ? 'Welcome to being human — that is exactly what we teach.' : 'Rare. Now imagine teaching it.'}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="relative min-h-[520px] overflow-hidden rounded-[28px] bg-ink p-6 text-paper sm:p-10" role="tabpanel" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id + (answered ?? '')}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="flex h-full flex-col"
          >
            <div className="mono text-paper/50">
              Question {idx + 1} / {QUESTIONS.length}
            </div>
            <p className="serif mt-5 text-[clamp(30px,3vw,46px)] leading-[1.05]">{q.prompt}</p>

            {!answered ? (
              <div className="mt-auto grid gap-3 pt-10 sm:grid-cols-2">
                {(['a', 'b'] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setAnswers((s) => ({ ...s, [q.id]: k }))}
                    className="group relative overflow-hidden rounded-[24px] border border-paper/20 p-6 text-left transition-colors hover:text-ink"
                  >
                    <span className="absolute inset-0 translate-y-full bg-signal transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
                    <span className="mono relative block opacity-60">Option {k.toUpperCase()}</span>
                    <span className="display relative mt-2 block text-[40px]">{k === 'a' ? q.a : q.b}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-8 flex flex-1 flex-col">
                <div className="mono text-signal">
                  You chose “{answered === 'a' ? q.a : q.b}” · {answered === q.common ? 'so do most people' : 'most people choose the other'}
                </div>
                <div className="display mt-3 text-[clamp(56px,6vw,96px)] text-signal">{q.bias}</div>
                <p className="mt-4 max-w-[560px] text-[16px] leading-relaxed text-paper/75">{q.explain}</p>
                <p className="serif mt-6 text-[24px] italic">→ {q.lesson}</p>
                <div className="mt-auto flex gap-3 pt-8">
                  {idx < QUESTIONS.length - 1 ? (
                    <button type="button" onClick={() => setIdx(idx + 1)} className="rounded-full bg-paper px-6 py-3 text-[13px] font-[650] uppercase tracking-[0.06em] text-ink transition-colors hover:bg-signal">
                      Next question →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setAnswers({});
                        setIdx(0);
                      }}
                      className="rounded-full border border-paper/30 px-6 py-3 text-[13px] font-[650] uppercase tracking-[0.06em] transition-colors hover:border-signal hover:text-signal"
                    >
                      Start again
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
