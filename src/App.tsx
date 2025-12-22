import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import SidebarComponent from "./components/AppSidebar";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { queryClient } from "./lib/queryClient";
import { Router } from "./router";

export function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <SidebarComponent>
              <Router />
            </SidebarComponent>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
