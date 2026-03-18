import { Toaster } from "@/components/ui/sonner";
import { HashRouter, Navigate, Route, Routes } from "@/lib/router";
import { AuthModal } from "./components/AuthModal";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { AppProvider, useApp } from "./contexts/AppContext";
import { AdminPanel } from "./pages/AdminPanel";
import { ArtisanDashboard } from "./pages/ArtisanDashboard";
import { ArtisanProfilePage } from "./pages/ArtisanProfilePage";
import { CustomerDashboard } from "./pages/CustomerDashboard";
import { FindTradesPage } from "./pages/FindTradesPage";
import { LandingPage } from "./pages/LandingPage";
import { MessagingPage } from "./pages/MessagingPage";

function RequireRole({
  children,
  roles,
}: { children: React.ReactNode; roles: string[] }) {
  const { currentUser, openAuthModal } = useApp();
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-center px-4">
        <h2 className="text-xl font-bold">Sign in required</h2>
        <p className="text-muted-foreground">
          Please sign in to access this page.
        </p>
        <button
          type="button"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-medium"
          onClick={openAuthModal}
        >
          Sign In
        </button>
      </div>
    );
  }
  if (!roles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Header />
            <main>
              <LandingPage />
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/find-trades"
        element={
          <>
            <Header />
            <main>
              <FindTradesPage />
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/artisan/:id"
        element={
          <>
            <Header />
            <main>
              <ArtisanProfilePage />
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/artisan-dashboard"
        element={
          <RequireRole roles={["artisan"]}>
            <ArtisanDashboard />
          </RequireRole>
        }
      />
      <Route
        path="/customer-dashboard"
        element={
          <RequireRole roles={["customer"]}>
            <CustomerDashboard />
          </RequireRole>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireRole roles={["admin"]}>
            <AdminPanel />
          </RequireRole>
        }
      />
      <Route
        path="/messages"
        element={
          <RequireRole roles={["customer", "artisan", "admin"]}>
            <>
              <Header />
              <MessagingPage />
            </>
          </RequireRole>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <AuthModal />
        <AppRoutes />
        <Toaster richColors position="top-right" />
      </AppProvider>
    </HashRouter>
  );
}
