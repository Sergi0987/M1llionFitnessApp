import { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import ThemeToggle from './components/ThemeToggle.jsx';
import { clearSession, getSession } from './services/api.js';
import AccountSettings from './pages/AccountSettings.jsx';
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

  const logo = isDark ? '/logoWhite.png' : '/logoBlack.png';


  function logout() {
    clearSession();
    navigate('/');
  }

  const navLink = `border px-4 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.06em] transition-colors ${
    isDark ? 'border-bone/20 text-bone hover:border-bone/50' : 'border-charcoal/20 text-charcoal hover:border-charcoal/50'
  }`;

  return (
    <main
      className={`m1 min-h-screen px-4 sm:px-6 ${
        isDark
          ? 'bg-charcoal text-bone'
          : 'bg-bone text-charcoal'
      }`}
    >
      <header className={`border-b ${isDark ? 'border-bone/20 bg-charcoal/95' : 'border-charcoal/15 bg-bone/95 backdrop-blur'}`}>
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <Link to={role === 'admin' ? '/admin' : '/app'} className="text-left">
            <img src={logo} alt="M1llion Fitness" className="h-10 w-auto" />
            <p className={`mt-1 text-[0.7rem] uppercase tracking-[0.14em] ${isDark ? 'text-sage' : 'text-olive'}`}>
              {role === 'admin' ? 'Coach dashboard' : 'Client portal'}
            </p>
          </Link>
          <nav className="flex flex-wrap items-center gap-3">
            {role === 'admin' ? (
              <>
                <Link className={navLink} to="/admin">
                  Dashboard
                </Link>
                <Link className={navLink} to="/admin/clients">
                  Clients
                </Link>
                <Link className={navLink} to="/admin/programs">
                  Programs
                </Link>
                <Link className={navLink} to="/admin/account">
                  Account
                </Link>
              </>
            ) : (
              <>
                <Link className={navLink} to="/app">
                  Portal
                </Link>
                <Link className={navLink} to="/app/workouts">
                  Workouts
                </Link>
                <Link className={navLink} to="/app/account">
                  Account
                </Link>
              </>
            )}
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <button
              className={`border px-4 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.06em] transition-colors ${
                isDark
                  ? 'border-bone/20 bg-bone text-charcoal hover:bg-butter'
                  : 'border-charcoal/20 bg-charcoal text-bone hover:bg-olive'
              }`}
              onClick={logout}
            >
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
  const [theme, setTheme] = useState(() => localStorage.getItem('m1_theme') || 'dark');

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
      <Route path="/admin/account" element={<Protected role="admin" theme={theme} setTheme={setTheme}><AccountSettings theme={theme} /></Protected>} />
      <Route path="/app" element={<Protected role="client" theme={theme} setTheme={setTheme}><ClientPortal theme={theme} /></Protected>} />
      <Route path="/app/workouts" element={<Protected role="client" theme={theme} setTheme={setTheme}><ClientWorkouts theme={theme} /></Protected>} />
      <Route path="/app/account" element={<Protected role="client" theme={theme} setTheme={setTheme}><AccountSettings theme={theme} /></Protected>} />
    </Routes>
  );
}
