import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import { useAppStore } from './store/useAppStore';
import { onAuthChange } from './lib/authService';

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
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/cv" element={<CVPage />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
