import {
  LayoutDashboard,
  Link2,
  UploadCloud,
  FileText,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Sidebar() {
  const { currentView, setCurrentView, currentUser, handleLogout } = useApp();

  return (
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
  );
}
