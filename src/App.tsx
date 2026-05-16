import React, { Suspense, lazy, useEffect, Component, type ErrorInfo, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import { useAppStore } from './store/useAppStore';
import { onAuthChange } from './lib/authService';

// Catches runtime errors that would otherwise produce a blank screen (esp. on iOS Safari)
interface BoundaryState { hasError: boolean; error: Error | null }
class ErrorBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  state: BoundaryState = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error): BoundaryState {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('NextStep crashed:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px', background: '#faf9f6', color: '#1a1a1a',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
        }}>
          <div style={{ maxWidth: 420, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              Bir sorun oluştu
            </h1>
            <p style={{ fontSize: 14, color: '#6b6560', margin: '0 0 24px', lineHeight: 1.6 }}>
              Sayfayı yeniden yüklemeyi deneyin. Sorun devam ederse tarayıcı önbelleğinizi temizleyin.
            </p>
            <button onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(135deg, #f97316, #ec4899)', color: '#fff', border: 'none',
                padding: '12px 28px', borderRadius: 999, fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}>
              Yeniden Yükle
            </button>
            {this.state.error?.message && (
              <pre style={{
                marginTop: 24, padding: 12, background: '#f0ede8', borderRadius: 8,
                fontSize: 11, textAlign: 'left', overflow: 'auto', maxHeight: 140, color: '#6b6560',
              }}>
                {this.state.error.message}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.default })));
const AddApplication = lazy(() => import('./pages/AddApplication').then(m => ({ default: m.default })));
const Applications = lazy(() => import('./pages/Applications').then(m => ({ default: m.default })));
const Analytics = lazy(() => import('./pages/Analytics').then(m => ({ default: m.default })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.default })));
const CVPage = lazy(() => import('./pages/CV'));
const EditApplication = lazy(() => import('./pages/EditApplication').then(m => ({ default: m.default })));
const NotFound = lazy(() => import('./pages/NotFound'));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppStore(state => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

const PageLoader = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f8fa]">
    <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" />
  </div>
);

function App() {
  const login = useAppStore(state => state.login);
  const logout = useAppStore(state => state.logout);
  const fetchApplications = useAppStore(state => state.fetchApplications);
  const notifications = useAppStore(state => state.notifications);
  const applications = useAppStore(state => state.applications);

  // Check follow-up reminders once after applications are loaded
  useEffect(() => {
    if (!notifications.reminderInactive) return;
    // iOS Safari < 16.4 doesn't expose Notification at all — guard the global
    if (typeof Notification === 'undefined') return;
    if (Notification.permission !== 'granted') return;
    const today = new Date().toISOString().split('T')[0];
    const due = applications.filter(a => a.followUpDate && a.followUpDate <= today);
    if (due.length > 0) {
      try {
        new Notification('NextStep — Takip Hatırlatması', {
          body: `${due.length} başvurunun takip tarihi geldi: ${due.map(a => a.companyName).slice(0, 3).join(', ')}`,
          icon: '/vite.svg',
        });
      } catch {
        // Notification constructor can throw on some platforms — silently ignore
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applications.length]);

  useEffect(() => {
    const unsub = onAuthChange(async (user) => {
      if (user) {
        login(user.email ?? '', user.displayName ?? '', user.uid);
        await fetchApplications();
      } else {
        logout();
      }
    });
    return () => unsub();
  }, [login, logout, fetchApplications]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add" element={<AddApplication />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/edit/:id" element={<EditApplication />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/cv" element={<CVPage />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
