import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
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
    uploadSuccessAlert,
    setPages,
  } = useApp();
  const navigate = useNavigate();

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
    navigate('/connect');
  }, [navigate, setPages]);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
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
                <strong>Postingan berhasil dikirim ke antrean!</strong> Konten Anda saat ini sedang diproses. Periksa status di tab <span style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/posts')}>Daftar Konten</span>.
              </div>
            </div>
          )}

          <Routes>
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/account/:id" element={<AccountDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}
