import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import { Footer } from './components/Footer';
import { Nav } from './components/Nav';
import { Preloader } from './components/Preloader';
import { EASE_IN_OUT } from './components/primitives';
import { IntroContext } from './lib/intro';
import { SmoothScroll, useLenis } from './lib/smooth';
import { Home } from './pages/Home';

const About = lazy(() => import('./pages/About'));
const Programs = lazy(() => import('./pages/Programs'));
const Chapters = lazy(() => import('./pages/Chapters'));
const Events = lazy(() => import('./pages/Events'));
const Team = lazy(() => import('./pages/Team'));
const GetInvolved = lazy(() => import('./pages/GetInvolved'));
const Privacy = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Terms })));
const NotFound = lazy(() => import('./pages/NotFound'));

/** Old URLs from the previous site → their new homes. */
const REDIRECTS: Record<string, string> = {
  '/our-team': '/team',
  '/courses': '/programs',
  '/news': '/',
  '/signin': '/',
  '/dashboard': '/',
  '/portal': '/',
  '/admin': '/',
  '/verify': '/',
  '/stories': '/',
  '/blog': '/',
};

function Routes() {
  const [location, setLocation] = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    const target = REDIRECTS[location] ?? (location.startsWith('/apply') ? '/programs' : null);
    if (target) setLocation(target, { replace: true });
  }, [location, setLocation]);

  // Reset scroll between pages, or jump to a #section when one is requested.
  useEffect(() => {
    const hash = window.location.hash;
    const t = window.setTimeout(() => {
      const el = hash ? document.querySelector(hash) : null;
      if (el) {
        if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -90, duration: 1.2 });
        else el.scrollIntoView();
      } else {
        lenis?.scrollTo(0, { immediate: true, force: true });
        window.scrollTo(0, 0);
      }
    }, 650);
    return () => window.clearTimeout(t);
  }, [location, lenis]);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location} initial="initial" animate="enter" exit="exit">
        {/* Curtain that wipes across on every route change */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[80] bg-signal"
          variants={{
            initial: { clipPath: 'inset(0 0 0 0)' },
            enter: { clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.75, ease: EASE_IN_OUT, delay: 0.05 } },
            exit: { clipPath: ['inset(100% 0 0 0)', 'inset(0% 0 0 0)'], transition: { duration: 0.6, ease: EASE_IN_OUT } },
          }}
        />
        <main id="main">
          <Suspense fallback={<div className="min-h-screen bg-paper" />}>
            <Switch location={location}>
              <Route path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/programs" component={Programs} />
              <Route path="/chapters" component={Chapters} />
              <Route path="/events" component={Events} />
              <Route path="/team" component={Team} />
              <Route path="/get-involved" component={GetInvolved} />
              <Route path="/privacy" component={Privacy} />
              <Route path="/terms" component={Terms} />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const done = useCallback(() => setReady(true), []);
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <SmoothScroll>
        <IntroContext.Provider value={ready}>
          <Preloader onDone={done} />
          <Nav />
          <Routes />
        </IntroContext.Provider>
      </SmoothScroll>
    </WouterRouter>
  );
}
