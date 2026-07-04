import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AnimatePresence } from 'framer-motion';

import { AdminProvider } from './context/AdminContext';
import { AuthProvider } from './context/AuthContext';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { Chapters } from './pages/Chapters';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { CourseLearn } from './pages/CourseLearn';
import { Events } from './pages/Events';
import { EventDetail } from './pages/EventDetail';
import { News } from './pages/News';
import { NewsDetail } from './pages/NewsDetail';
import { SignIn } from './pages/SignIn';
import { AdminDashboard } from './pages/AdminDashboard';
import { MemberDashboard } from './pages/MemberDashboard';
import { TeamPortal } from './pages/TeamPortal';
import { Congratulations } from './pages/Congratulations';
import { Privacy, Terms } from './pages/Legal';
import { ChapterDetail } from './pages/ChapterDetail';
import NotFound from './pages/not-found';

const queryClient = new QueryClient();

function AdminLayout() {
  return <AdminDashboard />;
}

function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/chapters" component={Chapters} />
            <Route path="/chapters/:id" component={ChapterDetail} />
            <Route path="/courses" component={Courses} />
            <Route path="/courses/:slug" component={CourseDetail} />
            <Route path="/events" component={Events} />
            <Route path="/events/:id" component={EventDetail} />
            <Route path="/news" component={News} />
            <Route path="/news/:id" component={NewsDetail} />
            <Route path="/signin" component={SignIn} />
            <Route path="/dashboard" component={MemberDashboard} />
            <Route path="/portal" component={TeamPortal} />
            <Route path="/congratulations" component={Congratulations} />
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

function Router() {
  return (
    <Switch>
      <Route path="/admin" component={AdminLayout} />
      <Route path="/courses/:slug/learn" component={CourseLearn} />
      <Route component={SiteLayout} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <AuthProvider>
          <AdminProvider>
            <Router />
          </AdminProvider>
        </AuthProvider>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
