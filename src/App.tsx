import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import OwnerLogin from "./pages/OwnerLogin";
import OwnerDashboard from "./pages/OwnerDashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      {/* Admin routes - no navbar/footer */}
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/*" component={AdminDashboard} />
      
      {/* Owner routes - no navbar/footer */}
      <Route path="/owner" component={OwnerLogin} />
      <Route path="/owner/*" component={OwnerDashboard} />
      
      {/* Public routes - with navbar/footer */}
      <Route>
        {(props) => (
          <div className="min-h-screen flex flex-col bg-brand-dark">
            <Navbar />
            <main className="flex-1">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/services" component={Services} />
                <Route path="/booking" component={Booking} />
                <Route path="/404" component={NotFound} />
                <Route component={NotFound} />
              </Switch>
            </main>
            <Footer />
          </div>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
