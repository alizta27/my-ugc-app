import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Link2,
  UploadCloud,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Heart,
  MessageCircle,
  Eye,
  CheckCircle2,
  AlertCircle,
  Search,
  Lock,
  Mail,
  User,
  Plus,
  TrendingUp,
  Check
} from 'lucide-react';
import { initialPages, initialPosts, mockSampleMedia, mockAnalyticsHistory } from './mockData';
import type { ConnectedPage, UploadLog, Platform } from './types';

interface IconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

function Facebook({ size = 18, className = '', style = {} }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function Instagram({ size = 18, className = '', style = {} }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function App() {
  // Authentication & Profile States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('creator@techgear.academy');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [currentUser, setCurrentUser] = useState({
    id: 'user_1',
    name: 'Alizta Pratama',
    email: 'creator@techgear.academy',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });

  // Navigation State
  const [currentView, setCurrentView] = useState<'dashboard' | 'connect' | 'upload' | 'posts' | 'analytics' | 'settings'>('dashboard');

  // Core App States
  const [pages, setPages] = useState<ConnectedPage[]>(initialPages);
  const [posts, setPosts] = useState<UploadLog[]>(initialPosts);

  // Upload Form States
  const [postTitle, setPostTitle] = useState('');
  const [postCaption, setPostCaption] = useState('');
  const [selectedMediaUrl, setSelectedMediaUrl] = useState(mockSampleMedia[0].url);
  const [customMediaUrl, setCustomMediaUrl] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['instagram']);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaSource, setMediaSource] = useState<'sample' | 'custom'>('sample');
  const [uploadSuccessAlert, setUploadSuccessAlert] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<Platform>('instagram');

  // Content Filter States
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'processing' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Settings State
  const [settingsName, setSettingsName] = useState(currentUser.name);
  const [settingsEmail, setSettingsEmail] = useState(currentUser.email);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingsAlert, setSettingsAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  // Simulate OAuth Connection
  const handleToggleConnection = (id: string) => {
    setPages(prevPages =>
      prevPages.map(page => {
        if (page.id === id) {
          const isNowConnected = !page.isConnected;
          return {
            ...page,
            isConnected: isNowConnected,
            connectedAt: isNowConnected ? new Date().toISOString() : undefined
          };
        }
        return page;
      })
    );
  };

  // Simulate Post Creation
  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPlatforms.length === 0) {
      alert('Silakan pilih minimal satu platform target (Facebook / Instagram)!');
      return;
    }

    const mediaUrl = mediaSource === 'sample' ? selectedMediaUrl : (customMediaUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800');

    // Create new post
    const newPost: UploadLog = {
      id: `post_${Date.now()}`,
      title: postTitle || 'Untitled UGC Post',
      caption: postCaption,
      mediaUrl: mediaUrl,
      mediaType: mediaType,
      status: 'processing', // starts as processing
      platforms: [...selectedPlatforms],
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      reach: 0
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
    setUploadSuccessAlert(true);

    // Reset upload form
    setPostTitle('');
    setPostCaption('');
    setCustomMediaUrl('');
    setMediaSource('sample');

    // Scroll to top of the content area
    const area = document.querySelector('.workspace');
    if (area) area.scrollTop = 0;

    // After 4 seconds, automatically mark the "processing" post as "success" to simulate the queue working!
    setTimeout(() => {
      setPosts(currentPosts =>
        currentPosts.map(p => {
          if (p.id === newPost.id) {
            return {
              ...p,
              status: 'success',
              likes: Math.floor(Math.random() * 100) + 15,
              comments: Math.floor(Math.random() * 10) + 2,
              reach: Math.floor(Math.random() * 1500) + 200
            };
          }
          return p;
        })
      );
    }, 4000);
  };

  // Clear success notification
  useEffect(() => {
    if (uploadSuccessAlert) {
      const timer = setTimeout(() => {
        setUploadSuccessAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [uploadSuccessAlert]);

  // Auth Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Email dan password harus diisi!');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (regName && regEmail && regPassword) {
      setCurrentUser({
        id: `user_${Date.now()}`,
        name: regName,
        email: regEmail,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      });
      setSettingsName(regName);
      setSettingsEmail(regEmail);
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Semua field harus diisi!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Settings Save Handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setSettingsAlert({ type: 'danger', message: 'Konfirmasi password baru tidak cocok!' });
      return;
    }

    setCurrentUser(prev => ({
      ...prev,
      name: settingsName,
      email: settingsEmail
    }));

    setSettingsAlert({ type: 'success', message: 'Profil berhasil diperbarui!' });
    setNewPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      setSettingsAlert(null);
    }, 4000);
  };

  // Connect Platform shortcut
  const connectedFB = pages.filter(p => p.platform === 'facebook' && p.isConnected);
  const connectedIG = pages.filter(p => p.platform === 'instagram' && p.isConnected);

  // Total metrics
  const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
  const totalComments = posts.reduce((sum, p) => sum + p.comments, 0);
  const totalReach = posts.reduce((sum, p) => sum + p.reach, 0);
  const engagementRate = posts.length > 0 ? (((totalLikes + totalComments) / (totalReach || 1)) * 100).toFixed(1) : '0.0';

  if (!isAuthenticated) {
    return (
      <div className="splash-container fade-in">
        <div className="splash-left">
          <div className="logo-section">
            <div className="logo-icon">U</div>
            <span className="logo-text">UGC Hub</span>
          </div>

          <div className="splash-hero-details">
            <div className="splash-badge">⚡ MVP Prototype</div>
            <h1 className="splash-title">Publikasikan Konten Anda Sekaligus.</h1>
            <p className="splash-subtitle">
              Platform management konten UGC (User Generated Content) sederhana. Hubungkan akun Instagram & Facebook Page Anda, tulis postingan, dan unggah media dalam satu dashboard terpadu.
            </p>

            <div className="splash-features-mini">
              <div className="splash-feature-item">
                <div className="feature-check"><Check size={12} /></div>
                <span>Satu Form untuk Multiplatform (FB & IG)</span>
              </div>
              <div className="splash-feature-item">
                <div className="feature-check"><Check size={12} /></div>
                <span>Live Feed Preview Real-time</span>
              </div>
              <div className="splash-feature-item">
                <div className="feature-check"><Check size={12} /></div>
                <span>Dashboard Analytics Interaktif & Riwayat Status</span>
              </div>
            </div>
          </div>

          <div className="text-muted" style={{ fontSize: '0.8rem' }}>
            © 2026 UGC Hub. Semua hak dilindungi.
          </div>
        </div>

        <div className="splash-right">
          <div className="glass-card login-card-inner">
            <div className="auth-header">
              <h2 className="auth-title">
                {authTab === 'login' ? 'Selamat Datang Kembali' : 'Daftar Akun Baru'}
              </h2>
              <p className="auth-desc">
                {authTab === 'login' 
                  ? 'Silakan masuk menggunakan akun dummy Anda' 
                  : 'Buat akun dummy untuk mencoba aplikasi'}
              </p>
            </div>

            {authError && (
              <div className="alert danger">
                <AlertCircle size={18} />
                <span>{authError}</span>
              </div>
            )}

            {authTab === 'login' ? (
              <form onSubmit={handleLogin} className="fade-in">
                <div className="form-group">
                  <label className="form-label"><Mail size={16} /> Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="creator@techgear.academy"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label"><Lock size={16} /> Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                  Masuk Sekarang
                </button>

                <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '24px', textAlign: 'center' }}>
                  Belum punya akun?{' '}
                  <span className="auth-switch-link" onClick={() => { setAuthTab('register'); setAuthError(''); }}>
                    Daftar di sini
                  </span>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="fade-in">
                <div className="form-group">
                  <label className="form-label"><User size={16} /> Nama Lengkap</label>
                  <input
                    type="text"
                    className="form-input"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Alizta Pratama"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label"><Mail size={16} /> Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="creator@techgear.academy"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label"><Lock size={16} /> Password Baru</label>
                  <input
                    type="password"
                    className="form-input"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                  Buat Akun & Masuk
                </button>

                <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '24px', textAlign: 'center' }}>
                  Sudah punya akun?{' '}
                  <span className="auth-switch-link" onClick={() => { setAuthTab('login'); setAuthError(''); }}>
                    Masuk di sini
                  </span>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container fade-in">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div>
          <div className="logo-section">
            <div className="logo-icon">U</div>
            <span className="logo-text">UGC Hub</span>
          </div>

          <nav>
            <ul className="nav-list">
              <li className="nav-item">
                <button
                  className={`nav-button ${currentView === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setCurrentView('dashboard')}
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-button ${currentView === 'connect' ? 'active' : ''}`}
                  onClick={() => setCurrentView('connect')}
                >
                  <Link2 size={18} />
                  <span>Koneksi Akun</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-button ${currentView === 'upload' ? 'active' : ''}`}
                  onClick={() => setCurrentView('upload')}
                >
                  <UploadCloud size={18} />
                  <span>Buat Konten</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-button ${currentView === 'posts' ? 'active' : ''}`}
                  onClick={() => setCurrentView('posts')}
                >
                  <FileText size={18} />
                  <span>Daftar Konten</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-button ${currentView === 'analytics' ? 'active' : ''}`}
                  onClick={() => setCurrentView('analytics')}
                >
                  <BarChart3 size={18} />
                  <span>Statistik / Analitik</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-button ${currentView === 'settings' ? 'active' : ''}`}
                  onClick={() => setCurrentView('settings')}
                >
                  <Settings size={18} />
                  <span>Pengaturan</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* User Info & Logout Button */}
        <div className="user-profile-widget">
          <img src={currentUser.avatar} alt={currentUser.name} className="user-avatar" />
          <div className="user-info">
            <span className="user-name">{currentUser.name}</span>
            <span className="user-role">UGC Creator</span>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Keluar">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Workspace Panel */}
      <main className="workspace">
        <header className="top-bar">
          <h2 className="page-title">
            {currentView === 'dashboard' && 'Dashboard Overview'}
            {currentView === 'connect' && 'Koneksi Halaman & Akun'}
            {currentView === 'upload' && 'Buat & Unggah Konten'}
            {currentView === 'posts' && 'Riwayat & Status Publikasi'}
            {currentView === 'analytics' && 'Kinerja Konten'}
            {currentView === 'settings' && 'Pengaturan Akun'}
          </h2>

          <div style={{ display: 'flex', gap: '12px' }}>
            <span
              className="status-badge"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                textTransform: 'none'
              }}
            >
              Mode Demo / Dummy
            </span>
          </div>
        </header>

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

          {/* VIEW 1: DASHBOARD */}
          {currentView === 'dashboard' && (
            <div className="fade-in">
              {/* Key Quick Stats */}
              <div className="stats-grid">
                <div className="glass-card stat-card">
                  <div className="stat-icon"><FileText size={22} /></div>
                  <div className="stat-details">
                    <span className="stat-value">{posts.length}</span>
                    <span className="stat-label">Total Konten</span>
                  </div>
                </div>
                <div className="glass-card stat-card">
                  <div className="stat-icon"><Heart size={22} style={{ color: '#f43f5e' }} /></div>
                  <div className="stat-details">
                    <span className="stat-value">{totalLikes.toLocaleString('id-ID')}</span>
                    <span className="stat-label">Total Suka</span>
                  </div>
                </div>
                <div className="glass-card stat-card">
                  <div className="stat-icon"><Eye size={22} style={{ color: '#0ea5e9' }} /></div>
                  <div className="stat-details">
                    <span className="stat-value">{totalReach.toLocaleString('id-ID')}</span>
                    <span className="stat-label">Total Jangkauan</span>
                  </div>
                </div>
                <div className="glass-card stat-card">
                  <div className="stat-icon"><TrendingUp size={22} style={{ color: '#10b981' }} /></div>
                  <div className="stat-details">
                    <span className="stat-value">{engagementRate}%</span>
                    <span className="stat-label">Interaksi (ER)</span>
                  </div>
                </div>
              </div>

              {/* Main row grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', alignItems: 'start' }}>
                {/* Left card: Accounts connected */}
                <div className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Integrasi Media Sosial</h3>
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setCurrentView('connect')}>
                      Kelola Koneksi
                    </button>
                  </div>

                  <div className="accounts-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <Facebook size={20} style={{ color: 'var(--fb-color)' }} />
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Facebook Page</span>
                      </div>
                      <span className="stat-value" style={{ fontSize: '1.3rem' }}>{connectedFB.length} Terhubung</span>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {connectedFB.length > 0 ? `Aktif: ${connectedFB[0].name}` : 'Hubungkan halaman Facebook untuk mulai posting'}
                      </p>
                    </div>

                    <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <Instagram size={20} style={{ color: '#ec4899' }} />
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Instagram Account</span>
                      </div>
                      <span className="stat-value" style={{ fontSize: '1.3rem' }}>{connectedIG.length} Terhubung</span>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {connectedIG.length > 0 ? `Aktif: ${connectedIG[0].username}` : 'Hubungkan akun Instagram Bisnis Anda'}
                      </p>
                    </div>
                  </div>

                  {/* Call to action */}
                  <div style={{ marginTop: '24px', padding: '16px', background: 'var(--primary-glow)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary-hover)' }}>Siap untuk Mengunggah Konten?</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Publikasikan foto atau ulasan setup Anda sekaligus ke Facebook dan Instagram.</p>
                    </div>
                    <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => setCurrentView('upload')}>
                      Mulai Upload <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Right card: recent status queue */}
                <div className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Aktivitas Terbaru</h3>
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setCurrentView('posts')}>
                      Lihat Semua
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {posts.slice(0, 3).map((post) => (
                      <div key={post.id} style={{ display: 'flex', gap: '12px', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'rgba(255,255,255,0.01)' }}>
                        <img src={post.mediaUrl} className="table-post-thumb" style={{ width: '48px', height: '48px' }} alt="" />
                        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {post.title}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                            {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="platforms-list-badges">
                              {post.platforms.map((p) => (
                                <span key={p} className={`platform-mini-badge ${p}`} style={{ width: '18px', height: '18px', fontSize: '8px' }}>
                                  {p === 'facebook' ? 'F' : 'I'}
                                </span>
                              ))}
                            </div>
                            <span
                              className={`status-badge ${post.status}`}
                              style={{ padding: '2px 8px', fontSize: '0.65rem' }}
                            >
                              {post.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: CONNECT ACCOUNTS */}
          {currentView === 'connect' && (
            <div className="fade-in">
              <div className="glass-card" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '8px' }}>Bagaimana cara menghubungkan akun Facebook & Instagram?</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Sebelum mempublikasikan konten, Anda perlu mengintegrasikan akun Facebook Page dan Instagram Business yang saling terhubung di bawah naungan **Meta Accounts Center** Anda.
                  Dalam demonstrasi ini, Anda bisa menstimulasikan proses sinkronisasi OAuth Facebook dengan menekan tombol Konek/Putuskan akun di bawah.
                </p>
              </div>

              <div className="accounts-grid">
                {pages.map((page) => (
                  <div key={page.id} className="glass-card account-card">
                    <div>
                      <div className="account-card-header">
                        <div className="account-avatar-wrapper">
                          <img src={page.avatar} className="user-avatar" style={{ width: '56px', height: '56px' }} alt="" />
                          <div className={`account-icon-badge ${page.platform}`}>
                            {page.platform === 'facebook' ? <Facebook size={10} /> : <Instagram size={10} />}
                          </div>
                        </div>

                        <div>
                          <h4 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>{page.name}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {page.platform === 'facebook' ? page.username : `@${page.username}`}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Followers</span>
                        <strong style={{ fontSize: '0.95rem' }}>{page.followers.toLocaleString('id-ID')}</strong>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status Koneksi</span>
                        <span className="account-status-tag">
                          <span className={`status-dot ${page.isConnected ? 'connected' : 'disconnected'}`} />
                          <span style={{ color: page.isConnected ? 'var(--success)' : 'var(--text-secondary)' }}>
                            {page.isConnected ? 'Terhubung' : 'Terputus'}
                          </span>
                        </span>
                      </div>
                    </div>

                    <button
                      className={`btn ${page.isConnected ? 'btn-danger' : 'btn-primary'}`}
                      style={{ width: '100%', padding: '10px' }}
                      onClick={() => handleToggleConnection(page.id)}
                    >
                      {page.isConnected ? 'Putuskan Hubungan' : 'Hubungkan Halaman'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: UPLOAD / BUAT KONTEN */}
          {currentView === 'upload' && (
            <div className="fade-in">
              {connectedFB.length === 0 && connectedIG.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
                  <AlertCircle size={48} style={{ color: 'var(--warning)', marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>Belum ada akun sosial media terhubung</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto 24px' }}>
                    Anda perlu mengaktifkan minimal satu halaman Facebook atau akun Instagram di tab **Koneksi Akun** sebelum bisa mempublikasikan konten.
                  </p>
                  <button className="btn btn-primary" onClick={() => setCurrentView('connect')}>
                    Ke Koneksi Akun
                  </button>
                </div>
              ) : (
                <div className="upload-layout">
                  {/* Left Column: Form */}
                  <form onSubmit={handlePublishPost} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '20px' }}>Formulir Publikasi Konten</h3>

                    {/* Platform Selector */}
                    <div className="form-group">
                      <label className="form-label">Pilih Target Publikasi</label>
                      <div className="platform-selector">
                        {/* Facebook Option */}
                        <div
                          className={`platform-card ${selectedPlatforms.includes('facebook') ? 'selected facebook' : ''} ${connectedFB.length === 0 ? 'btn-disabled' : ''}`}
                          onClick={() => {
                            if (connectedFB.length === 0) return;
                            setSelectedPlatforms(prev =>
                              prev.includes('facebook')
                                ? prev.filter(p => p !== 'facebook')
                                : [...prev, 'facebook']
                            );
                          }}
                        >
                          <div className="platform-details">
                            <Facebook className="platform-card-icon facebook" size={20} />
                            <div>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block' }}>Facebook Page</span>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                {connectedFB.length > 0 ? connectedFB[0].name : 'Akun belum terkoneksi'}
                              </span>
                            </div>
                          </div>
                          <div className="checkbox-indicator">
                            {selectedPlatforms.includes('facebook') && <Check size={12} />}
                          </div>
                        </div>

                        {/* Instagram Option */}
                        <div
                          className={`platform-card ${selectedPlatforms.includes('instagram') ? 'selected instagram' : ''} ${connectedIG.length === 0 ? 'btn-disabled' : ''}`}
                          onClick={() => {
                            if (connectedIG.length === 0) return;
                            setSelectedPlatforms(prev =>
                              prev.includes('instagram')
                                ? prev.filter(p => p !== 'instagram')
                                : [...prev, 'instagram']
                            );
                          }}
                        >
                          <div className="platform-details">
                            <Instagram className="platform-card-icon instagram" size={20} />
                            <div>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block' }}>Instagram Business</span>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                {connectedIG.length > 0 ? `@${connectedIG[0].username}` : 'Akun belum terkoneksi'}
                              </span>
                            </div>
                          </div>
                          <div className="checkbox-indicator">
                            {selectedPlatforms.includes('instagram') && <Check size={12} />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Post Title */}
                    <div className="form-group">
                      <label className="form-label">Judul Postingan (Internal/Database)</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Contoh: Showcase Desk Setup Minimalis Juni"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        required
                      />
                    </div>

                    {/* Post Caption */}
                    <div className="form-group">
                      <label className="form-label">Caption / Deskripsi Postingan</label>
                      <textarea
                        className="form-textarea"
                        placeholder="Tulis caption menarik di sini. Gunakan emoji atau hashtag untuk interaksi ekstra... 🚀✨"
                        value={postCaption}
                        onChange={(e) => setPostCaption(e.target.value)}
                        required
                      />
                    </div>

                    {/* Media Type Selection */}
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label">Jenis Media</label>
                      <div className="media-source-toggle" style={{ maxWidth: '200px' }}>
                        <button
                          type="button"
                          className={`media-source-btn ${mediaType === 'image' ? 'active' : ''}`}
                          onClick={() => setMediaType('image')}
                        >
                          Foto / Gambar
                        </button>
                        <button
                          type="button"
                          className={`media-source-btn ${mediaType === 'video' ? 'active' : ''}`}
                          onClick={() => setMediaType('video')}
                        >
                          Reels / Video
                        </button>
                      </div>
                    </div>

                    {/* Media URL selector */}
                    <div className="form-group">
                      <label className="form-label">Unggah / Pilih Media</label>
                      <div className="media-source-toggle">
                        <button
                          type="button"
                          className={`media-source-btn ${mediaSource === 'sample' ? 'active' : ''}`}
                          onClick={() => setMediaSource('sample')}
                        >
                          Pilih Template Media Dummy
                        </button>
                        <button
                          type="button"
                          className={`media-source-btn ${mediaSource === 'custom' ? 'active' : ''}`}
                          onClick={() => setMediaSource('custom')}
                        >
                          Gunakan Custom URL Gambar
                        </button>
                      </div>

                      {mediaSource === 'sample' ? (
                        <div className="media-selector-grid">
                          {mockSampleMedia.map(m => (
                            <div
                              key={m.id}
                              className={`media-thumb ${selectedMediaUrl === m.url ? 'selected' : ''}`}
                              onClick={() => setSelectedMediaUrl(m.url)}
                            >
                              <img src={m.url} alt={m.name} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <input
                          type="url"
                          className="form-input"
                          placeholder="Masukkan URL Gambar (Unsplash/S3) misal: https://images.unsplash.com/photo-..."
                          value={customMediaUrl}
                          onChange={(e) => setCustomMediaUrl(e.target.value)}
                        />
                      )}
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ marginTop: '16px', padding: '14px' }}
                    >
                      Publish Sekarang
                    </button>
                  </form>

                  {/* Right Column: Live Mockup Feed Preview */}
                  <div className="preview-container">
                    <div className="preview-tabs">
                      <button
                        type="button"
                        className={`preview-tab ${activePreviewTab === 'instagram' ? 'active' : ''}`}
                        onClick={() => setActivePreviewTab('instagram')}
                      >
                        <Instagram size={14} /> Instagram Post Feed
                      </button>
                      <button
                        type="button"
                        className={`preview-tab ${activePreviewTab === 'facebook' ? 'active' : ''}`}
                        onClick={() => setActivePreviewTab('facebook')}
                      >
                        <Facebook size={14} /> Facebook Page Post
                      </button>
                    </div>

                    {activePreviewTab === 'instagram' ? (
                      <div className="ig-mockup fade-in">
                        <div className="ig-mockup-header">
                          <img
                            src={connectedIG.length > 0 ? connectedIG[0].avatar : currentUser.avatar}
                            className="ig-avatar"
                            alt=""
                          />
                          <span className="ig-username">
                            {connectedIG.length > 0 ? connectedIG[0].username : 'preview_ugc'}
                          </span>
                        </div>

                        <div className="ig-media-area">
                          {mediaSource === 'sample' ? (
                            <img src={selectedMediaUrl} alt="" />
                          ) : customMediaUrl ? (
                            <img src={customMediaUrl} alt="" />
                          ) : (
                            <div className="ig-placeholder-media">
                              <UploadCloud size={32} />
                              <span style={{ fontSize: '0.8rem' }}>Tinjauan Media</span>
                            </div>
                          )}
                        </div>

                        <div className="ig-mockup-actions">
                          <span style={{ color: '#f43f5e' }}>❤️</span>
                          <span>💬</span>
                          <span>✈️</span>
                        </div>

                        <div className="ig-mockup-likes">99 Likes</div>

                        <div className="ig-mockup-caption">
                          <span className="username-link">
                            {connectedIG.length > 0 ? connectedIG[0].username : 'preview_ugc'}
                          </span>
                          {postCaption || 'Tulis caption di sebelah kiri untuk melihat pembaruan instan...'}
                        </div>
                      </div>
                    ) : (
                      <div className="fb-mockup fade-in">
                        <div className="fb-mockup-header">
                          <img
                            src={connectedFB.length > 0 ? connectedFB[0].avatar : currentUser.avatar}
                            className="fb-avatar"
                            alt=""
                          />
                          <div className="fb-header-info">
                            <span className="fb-page-name">
                              {connectedFB.length > 0 ? connectedFB[0].name : 'UGC Hub Halaman'}
                            </span>
                            <span className="fb-post-time">Baru saja · 🌐</span>
                          </div>
                        </div>

                        <div className="fb-mockup-caption">
                          {postCaption || 'Tulis caption di sebelah kiri untuk melihat pembaruan instan...'}
                        </div>

                        <div className="fb-media-area">
                          {mediaSource === 'sample' ? (
                            <img src={selectedMediaUrl} alt="" />
                          ) : customMediaUrl ? (
                            <img src={customMediaUrl} alt="" />
                          ) : (
                            <div className="fb-placeholder-media">
                              <UploadCloud size={32} />
                              <span style={{ fontSize: '0.8rem' }}>Tinjauan Media</span>
                            </div>
                          )}
                        </div>

                        <div className="fb-mockup-actions">
                          <div className="fb-action-btn">👍 Suka</div>
                          <div className="fb-action-btn">💬 Komentar</div>
                          <div className="fb-action-btn">↩️ Bagikan</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 4: DAFTAR KONTEN */}
          {currentView === 'posts' && (
            <div className="fade-in glass-card">
              <div className="filter-bar">
                {/* Search query */}
                <div className="search-input-wrapper">
                  <Search size={16} className="search-icon-inside" />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Cari konten berdasarkan judul..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Status tabs */}
                <div className="filter-tabs">
                  {(['all', 'success', 'processing', 'failed'] as const).map(status => (
                    <button
                      key={status}
                      className={`filter-tab ${statusFilter === status ? 'active' : ''}`}
                      onClick={() => setStatusFilter(status)}
                    >
                      {status === 'all' && 'Semua'}
                      {status === 'success' && 'Berhasil'}
                      {status === 'processing' && 'Diproses'}
                      {status === 'failed' && 'Gagal'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Konten & Media</th>
                      <th>Platform</th>
                      <th>Tanggal Unggah</th>
                      <th>Status</th>
                      <th>Kinerja Awal</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts
                      .filter(post => {
                        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.caption.toLowerCase().includes(searchQuery.toLowerCase());
                        const matchesStatus = statusFilter === 'all' ? true : post.status === statusFilter;
                        return matchesSearch && matchesStatus;
                      })
                      .map(post => (
                        <tr key={post.id}>
                          <td>
                            <div className="table-post-info">
                              <img src={post.mediaUrl} className="table-post-thumb" alt="" />
                              <div>
                                <div className="post-title-cell">{post.title}</div>
                                <div className="post-caption-preview">{post.caption}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="platforms-list-badges">
                              {post.platforms.map(p => (
                                <span key={p} className={`platform-mini-badge ${p}`} title={p}>
                                  {p === 'facebook' ? 'F' : 'I'}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              {new Date(post.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${post.status}`}>
                              {post.status}
                            </span>
                            {post.errorMessage && (
                              <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '4px', maxWidth: '200px' }}>
                                ⚠️ {post.errorMessage}
                              </p>
                            )}
                          </td>
                          <td>
                            {post.status === 'success' ? (
                              <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Heart size={12} style={{ color: '#f43f5e' }} /> {post.likes}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <MessageCircle size={12} style={{ color: '#8b5cf6' }} /> {post.comments}
                                </span>
                              </div>
                            ) : post.status === 'processing' ? (
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Menghitung...</span>
                            ) : (
                              <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>Error</span>
                            )}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {post.status === 'failed' && (
                                <button
                                  className="btn btn-secondary"
                                  style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                                  onClick={() => {
                                    // Simulated retry
                                    setPosts(current =>
                                      current.map(p => (p.id === post.id ? { ...p, status: 'processing', errorMessage: undefined } : p))
                                    );
                                    setTimeout(() => {
                                      setPosts(current =>
                                        current.map(p => (p.id === post.id ? { ...p, status: 'success', likes: 12, comments: 2, reach: 350 } : p))
                                      );
                                    }, 3000);
                                  }}
                                >
                                  Retry
                                </button>
                              )}
                              <button
                                className="btn btn-danger"
                                style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                                onClick={() => {
                                  if (confirm('Apakah Anda yakin ingin menghapus catatan post ini?')) {
                                    setPosts(prev => prev.filter(p => p.id !== post.id));
                                  }
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {posts.filter(post => {
                      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.caption.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesStatus = statusFilter === 'all' ? true : post.status === statusFilter;
                      return matchesSearch && matchesStatus;
                    }).length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                          Tidak ada konten yang sesuai dengan filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 5: ANALYTICS */}
          {currentView === 'analytics' && (
            <div className="fade-in">
              {/* Top row stats summary */}
              <div className="stats-grid">
                <div className="glass-card stat-card">
                  <div className="stat-icon"><Heart size={22} style={{ color: '#f43f5e' }} /></div>
                  <div className="stat-details">
                    <span className="stat-value">{totalLikes.toLocaleString('id-ID')}</span>
                    <span className="stat-label">Jumlah Like Konten</span>
                  </div>
                </div>
                <div className="glass-card stat-card">
                  <div className="stat-icon"><MessageCircle size={22} style={{ color: '#8b5cf6' }} /></div>
                  <div className="stat-details">
                    <span className="stat-value">{totalComments.toLocaleString('id-ID')}</span>
                    <span className="stat-label">Jumlah Komentar</span>
                  </div>
                </div>
                <div className="glass-card stat-card">
                  <div className="stat-icon"><Eye size={22} style={{ color: '#0ea5e9' }} /></div>
                  <div className="stat-details">
                    <span className="stat-value">{totalReach.toLocaleString('id-ID')}</span>
                    <span className="stat-label">Total Reach Jangkauan</span>
                  </div>
                </div>
                <div className="glass-card stat-card">
                  <div className="stat-icon"><TrendingUp size={22} style={{ color: '#10b981' }} /></div>
                  <div className="stat-details">
                    <span className="stat-value">{engagementRate}%</span>
                    <span className="stat-label">Tingkat Interaksi</span>
                  </div>
                </div>
              </div>

              {/* Chart Grid & Platforms Split */}
              <div className="analytics-grid-two">
                {/* Left: Custom SVG/CSS Bar Chart */}
                <div className="glass-card">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Tren Pertumbuhan Like (Minggu Ini)</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Menampilkan perbandingan jangkauan suka harian Facebook vs Instagram.</p>

                  <div className="custom-chart-container">
                    {/* Y-Axis guide lines */}
                    <div className="chart-axis-line" style={{ bottom: '20%' }} />
                    <div className="chart-axis-line" style={{ bottom: '40%' }} />
                    <div className="chart-axis-line" style={{ bottom: '60%' }} />
                    <div className="chart-axis-line" style={{ bottom: '80%' }} />

                    {mockAnalyticsHistory.map((dp, idx) => {
                      const maxVal = 800; // Cap height scaling
                      const fbPercent = Math.min((dp.facebook / maxVal) * 100, 100);
                      const igPercent = Math.min((dp.instagram / maxVal) * 100, 100);

                      return (
                        <div key={idx} className="chart-bar-group">
                          <div className="chart-bars-wrapper">
                            <div
                              className="chart-bar facebook"
                              style={{ height: `${fbPercent}%` }}
                              data-value={`FB: ${dp.facebook} likes`}
                            />
                            <div
                              className="chart-bar instagram"
                              style={{ height: `${igPercent}%` }}
                              data-value={`IG: ${dp.instagram} likes`}
                            />
                          </div>
                          <span className="chart-label-text">{dp.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="chart-legend">
                    <div className="legend-item">
                      <div className="legend-color facebook" />
                      <span>Facebook Likes</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color instagram" />
                      <span>Instagram Likes</span>
                    </div>
                  </div>
                </div>

                {/* Right: Distribution Analysis */}
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>Rasio Distribusi</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Distribusi penayangan konten UGC berdasarkan platform tujuan.</p>

                    {/* Facebook Circle and Progress bar representation */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Facebook size={14} style={{ color: 'var(--fb-color)' }} /> Facebook Page
                        </span>
                        <span>40%</span>
                      </div>
                      <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: '40%', background: 'var(--fb-color)' }} />
                      </div>
                    </div>

                    {/* Instagram Progress bar representation */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Instagram size={14} style={{ color: '#ec4899' }} /> Instagram
                        </span>
                        <span>60%</span>
                      </div>
                      <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: '60%', background: 'var(--ig-gradient)' }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>💡 Insight Analitik</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      Konten Instagram memperoleh tingkat interaksi 1.5x lebih tinggi dibandingkan Facebook Page. Postingan bergambar di hari Kamis sore mendapatkan respon terbaik.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 6: SETTINGS */}
          {currentView === 'settings' && (
            <div className="fade-in glass-card" style={{ maxWidth: '640px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '8px' }}>Pengaturan Profil & Keamanan</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Perbarui nama publik Anda atau lakukan simulasi pergantian kata sandi untuk akun demonstrasi ini.
              </p>

              {settingsAlert && (
                <div className={`alert ${settingsAlert.type}`}>
                  {settingsAlert.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>{settingsAlert.message}</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
                  <img src={currentUser.avatar} className="user-avatar" style={{ width: '64px', height: '64px' }} alt="" />
                  <div>
                    <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600 }}>Foto Profil Kreator</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avatar default terikat dengan demo</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Nama Lengkap</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settingsName}
                    onChange={(e) => setSettingsName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Alamat Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={settingsEmail}
                    onChange={(e) => setSettingsEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password Baru (Opsional)</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Masukkan password baru jika ingin mengubah"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Ulangi password baru untuk verifikasi"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>
                  Simpan Perubahan
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
