import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Layout } from '@/components/layout';

// Pages
import Home from '@/pages/home';
import About from '@/pages/about';
import Services from '@/pages/services';
import BusinessTech from '@/pages/business-tech';
import TechRescue from '@/pages/tech-rescue';
import HomeTechCare from '@/pages/home-tech-care';
import Cybersecurity from '@/pages/cybersecurity';
import AISetup from '@/pages/ai-setup';
import Pricing from '@/pages/pricing';
import Contact from '@/pages/contact';
import Terms from '@/pages/terms';
import Privacy from '@/pages/privacy';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/services/business-tech-management" component={BusinessTech} />
      <Route path="/services/tech-rescue" component={TechRescue} />
      <Route path="/services/home-tech-care" component={HomeTechCare} />
      <Route path="/services/cybersecurity" component={Cybersecurity} />
      <Route path="/services/ai-setup" component={AISetup} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/contact" component={Contact} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Layout>
            <Router />
          </Layout>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
