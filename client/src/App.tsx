import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Services from "@/pages/services";
import ServiceDetail from "@/pages/service-detail";
import Applications from "@/pages/applications";
import Profile from "@/pages/profile";
import Help from "@/pages/help";
import Login from "@/pages/login";
import MainLayout from "@/layouts/main-layout";
import { AppProvider } from "@/contexts/app-context";
import { useEffect } from "react";
import { apiRequest } from "./lib/queryClient";

function Router() {
  const [location, setLocation] = useLocation();
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok && location !== "/login") {
          setLocation("/login");
        }
      } catch (error) {
        if (location !== "/login") {
          setLocation("/login");
        }
      }
    };
    
    checkAuth();
  }, [location, setLocation]);

  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      <Route path="/">
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </Route>
      
      <Route path="/services">
        <MainLayout>
          <Services />
        </MainLayout>
      </Route>
      
      <Route path="/services/:id">
        {params => (
          <MainLayout>
            <ServiceDetail id={params.id} />
          </MainLayout>
        )}
      </Route>
      
      <Route path="/applications">
        <MainLayout>
          <Applications />
        </MainLayout>
      </Route>
      
      <Route path="/profile">
        <MainLayout>
          <Profile />
        </MainLayout>
      </Route>
      
      <Route path="/help">
        <MainLayout>
          <Help />
        </MainLayout>
      </Route>
      
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router />
        <Toaster />
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
