import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { useUserProfile } from './hooks/useUserProfile';
import { rescheduleAll, getPermission } from './services/notificationService';

import Login from './components/Login';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import HabitTracker from './components/HabitTracker';
import Supplements from './components/Supplements';
import SleepLogger from './components/SleepLogger';
import Stats from './components/Stats';
import Settings from './components/Settings';

function Protected({ children }) {
  const { user, loading } = useAuth();
  const { profile, loading: pLoading } = useUserProfile(user?.uid);

  if (loading || pLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (!profile?.onboardingComplete) return <Navigate to="/onboarding" replace />;
  return children;
}

function OnboardingRoute() {
  const { user, loading } = useAuth();
  const { profile, loading: pLoading } = useUserProfile(user?.uid);

  if (loading || pLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  // Si el perfil ya está marcado como completo, redirige al dashboard.
  // En cuanto Firestore confirme el cambio, esto se dispara solo.
  if (profile?.onboardingComplete) return <Navigate to="/" replace />;

  return <Onboarding />;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen grid place-items-center
                    bg-gradient-to-br from-night-950 via-indigo-950 to-purple-950">
      <p className="text-white/40 text-sm tracking-[0.3em] uppercase">Lilo despertando…</p>
    </div>
  );
}

function NotificationBootstrap() {
  useEffect(() => {
    if (getPermission() === 'granted') {
      rescheduleAll();
    }
  }, []);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationBootstrap />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<OnboardingRoute />} />
          <Route path="/"              element={<Protected><Dashboard /></Protected>} />
          <Route path="/habitos"       element={<Protected><HabitTracker /></Protected>} />
          <Route path="/suplementos"   element={<Protected><Supplements /></Protected>} />
          <Route path="/registro"      element={<Protected><SleepLogger /></Protected>} />
          <Route path="/estadisticas"  element={<Protected><Stats /></Protected>} />
          <Route path="/ajustes"       element={<Protected><Settings /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
