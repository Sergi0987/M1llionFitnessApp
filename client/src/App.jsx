import { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import ThemeToggle from './components/ThemeToggle.jsx';
import { clearSession, getSession } from './services/api.js';
import AdminClients from './pages/AdminClients.jsx';
import AdminClientDetails from './pages/AdminClientDetails.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminPrograms from './pages/AdminPrograms.jsx';
import ClientPortal from './pages/ClientPortal.jsx';
import ClientWorkouts from './pages/ClientWorkouts.jsx';
import Login from './pages/Login.jsx';
import PublicHome from './pages/PublicHome.jsx';

function Shell({ children, role, theme, setTheme }) {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  function logout() {
    clearSession();
    navigate('/');
  }

  return (
    <main className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-950'}`}>
      <header className={`border-b ${isDark ? 'border-slate-800 bg-slate-950/95' : 'border-slate-200 bg-white/95 backdrop-blur'}`}>
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <Link to={role === 'admin' ? '/admin' : '/app'} className="text-left">
            <img src="/logoCropped.png" alt="M1llion Fitness" className="h-10 w-auto" />
            <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {role === 'admin' ? 'Coach dashboard' : 'Client portal'}
            </p>
          </Link>
          <nav className="flex flex-wrap gap-3">
            {role === 'admin' ? (
              <>
                <Link className={`rounded-md border px-4 py-2 text-sm font-semibold ${isDark ? 'border-slate-700' : 'border-slate-300'}`} to="/admin">
                  Dashboard
                </Link>
                <Link className={`rounded-md border px-4 py-2 text-sm font-semibold ${isDark ? 'border-slate-700' : 'border-slate-300'}`} to="/admin/clients">
                  Clients
                </Link>
                <Link className={`rounded-md border px-4 py-2 text-sm font-semibold ${isDark ? 'border-slate-700' : 'border-slate-300'}`} to="/admin/programs">
                  Programs
                </Link>
              </>
            ) : (
              <>
                <Link className={`rounded-md border px-4 py-2 text-sm font-semibold ${isDark ? 'border-slate-700' : 'border-slate-300'}`} to="/app">
                  Portal
                </Link>
                <Link className={`rounded-md border px-4 py-2 text-sm font-semibold ${isDark ? 'border-slate-700' : 'border-slate-300'}`} to="/app/workouts">
                  Workouts
                </Link>
              </>
            )}
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <button className="rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-white" onClick={logout}>
              Logout
            </button>
          </nav>
        </div>
      </header>
      {children}
    </main>
  );
}

function Protected({ role, children, theme, setTheme }) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (session.user.role !== role) {
    return <Navigate to={session.user.role === 'admin' ? '/admin' : '/app'} replace />;
  }

  return <Shell role={role} theme={theme} setTheme={setTheme}>{children}</Shell>;
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('m1_theme') || 'light');

  useEffect(() => {
    localStorage.setItem('m1_theme', theme);
  }, [theme]);

  return (
    <Routes>
      <Route path="/" element={<PublicHome theme={theme} setTheme={setTheme} />} />
      <Route path="/login" element={<Login theme={theme} setTheme={setTheme} />} />
      <Route path="/admin" element={<Protected role="admin" theme={theme} setTheme={setTheme}><AdminDashboard theme={theme} /></Protected>} />
      <Route path="/admin/clients" element={<Protected role="admin" theme={theme} setTheme={setTheme}><AdminClients theme={theme} /></Protected>} />
      <Route path="/admin/clients/:id" element={<Protected role="admin" theme={theme} setTheme={setTheme}><AdminClientDetails theme={theme} /></Protected>} />
      <Route path="/admin/programs" element={<Protected role="admin" theme={theme} setTheme={setTheme}><AdminPrograms theme={theme} /></Protected>} />
      <Route path="/app" element={<Protected role="client" theme={theme} setTheme={setTheme}><ClientPortal theme={theme} /></Protected>} />
      <Route path="/app/workouts" element={<Protected role="client" theme={theme} setTheme={setTheme}><ClientWorkouts theme={theme} /></Protected>} />
    </Routes>
  );
}
