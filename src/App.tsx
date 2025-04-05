
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import PropertyListings from "./pages/PropertyListings";
import PropertyDetails from "./pages/PropertyDetails";
import VideoListings from "./pages/VideoListings";
import Settings from "./pages/Settings";
import Contact from "./pages/Contact";
import Team from "./pages/Team";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import { initConfigFromUrl } from "./services/configService";

const queryClient = new QueryClient();

// Wrapper component for Settings that handles tab query params
const SettingsWithTabSupport = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  return (
    <Settings initialTab={tabParam || undefined} />
  );
};

// Initialize configuration from URL parameters on app start
const AppWithConfig = () => {
  useEffect(() => {
    // Initialize configuration from URL parameters
    initConfigFromUrl();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/listings" element={<PropertyListings />} />
      <Route path="/property/:id" element={<PropertyDetails />} />
      <Route path="/videos" element={<VideoListings />} />
      <Route path="/login" element={<Login />} />
      <Route path="/settings" element={
        <PrivateRoute>
          <SettingsWithTabSupport />
        </PrivateRoute>
      } />
      <Route path="/contact" element={<Contact />} />
      <Route path="/team" element={<Team />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppWithConfig />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
