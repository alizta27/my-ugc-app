import { useEffect } from 'react';
import { AppProvider, useApp, getInitialPages } from './context/AppContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Connect from './pages/Connect';
import Upload from './pages/Upload';
import Posts from './pages/Posts';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import AccountDetail from './pages/AccountDetail';
import { CheckCircle2 } from 'lucide-react';
import { saveConnection } from './api/ugc';

function AppContent() {
  const {
    isAuthenticated,
    currentView,
    setCurrentView,
    uploadSuccessAlert,
    setPages,
  } = useApp();

  // Handle Facebook OAuth callback redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fbCallback = params.get('fb_callback');
    if (!fbCallback) return;

    try {
      // URLSearchParams.get() auto URL-decodes, jadi fbCallback sudah berupa base64 murni
      const payload = JSON.parse(atob(fbCallback));
      saveConnection({
        page: payload.page,
        igBusinessId: payload.igBusinessId,
        followers: payload.followers ?? 0,
        connectedAt: payload.connectedAt,
      });

      // Refresh connected pages list in context
      setPages(getInitialPages());
    } catch (e) {
      console.error('Failed to parse fb_callback:', e);
    }

    // Bersihkan URL dan arahkan ke halaman Connect
    window.history.replaceState({}, '', '/');
    setCurrentView('connect');
  }, []);

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <div className="app-container fade-in">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Workspace Panel */}
      <main className="workspace">
        <TopBar />

        <div className="content-area">
          {/* SUCCESS NOTIFICATION FOR NEW POSTS */}
          {uploadSuccessAlert && (
            <div className="alert success fade-in" style={{ marginBottom: '24px' }}>
              <CheckCircle2 size={18} />
              <div>
                <strong>Postingan berhasil dikirim ke antrean!</strong> Konten Anda saat ini sedang diproses. Periksa status di tab <span style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }} onClick={() => setCurrentView('posts')}>Daftar Konten</span>.
              </div>
            </div>
          )}

          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'connect' && <Connect />}
          {currentView === 'upload' && <Upload />}
          {currentView === 'posts' && <Posts />}
          {currentView === 'analytics' && <Analytics />}
          {currentView === 'settings' && <Settings />}
          {currentView === 'account-detail' && <AccountDetail />}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
