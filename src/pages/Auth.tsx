import { Check, AlertCircle, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Auth() {
  const {
    authTab,
    setAuthTab,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    regName,
    setRegName,
    regEmail,
    setRegEmail,
    regPassword,
    setRegPassword,
    authError,
    setAuthError,
    handleLogin,
    handleRegister
  } = useApp();

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
                <label className="form-label"><UserIcon size={16} /> Nama Lengkap</label>
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
