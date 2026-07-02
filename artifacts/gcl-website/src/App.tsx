import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AnimatePresence } from 'framer-motion';

import { Nav } from './components/Nav';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { Programs } from './pages/Programs';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { Events } from './pages/Events';
import { About } from './pages/About';
import { Stories } from './pages/Stories';
import { Blog } from './pages/Blog';
import { Privacy, Terms } from './pages/Legal';
import NotFound from './pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/programs" component={Programs} />
            <Route path="/courses" component={Courses} />
            <Route path="/courses/:slug" component={CourseDetail} />
            <Route path="/events" component={Events} />
            <Route path="/about" component={About} />
            <Route path="/stories" component={Stories} />
            <Route path="/blog" component={Blog} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/terms" component={Terms} />
            <Route component={NotFound} />
          </Switch>
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
