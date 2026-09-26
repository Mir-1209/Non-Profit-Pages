import { KineticText } from '../components/KineticText';
import { Pill } from '../components/primitives';
import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFound() {
  usePageMeta('Page not found', 'This page does not exist.');
  return (
    <section className="gutter flex min-h-[100svh] flex-col justify-center bg-paper pb-16 pt-[120px]">
      <div className="mono mb-6 flex items-center gap-3">
        <span className="text-signal">§ 404</span>
        <span className="h-px w-8 bg-current opacity-40" />
        <span>Asset delisted</span>
      </div>
      <h1 className="display text-[clamp(160px,38vw,640px)] leading-[0.78]">
        <KineticText text="404" maxStretch={125} />
      </h1>
      <div className="mt-10 flex flex-wrap items-end justify-between gap-8">
        <p className="serif max-w-[640px] text-[clamp(28px,3vw,44px)] leading-[1.05] italic">
          This page has been delisted. Sunk cost says keep looking — behavioral economics says go home.
        </p>
        <Pill href="/" variant="ink">Back to the index</Pill>
      </div>
    </section>
  );
}
