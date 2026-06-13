import {
  LayoutDashboard,
  Link2,
  UploadCloud,
  FileText,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Sidebar() {
  const { currentUser, handleLogout } = useApp();

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
              <NavLink
                to="/"
                className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/connect"
                className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
              >
                <Link2 size={18} />
                <span>Koneksi Akun</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/upload"
                className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
              >
                <UploadCloud size={18} />
                <span>Buat Konten</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/posts"
                className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
              >
                <FileText size={18} />
                <span>Daftar Konten</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/analytics"
                className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
              >
                <BarChart3 size={18} />
                <span>Statistik / Analitik</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/settings"
                className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
              >
                <Settings size={18} />
                <span>Pengaturan</span>
              </NavLink>
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
